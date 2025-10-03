import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Table } from "react-bootstrap";

const DoctorEarnings = () => {
  const currentUser = AuthService.getCurrentUser();
  const [doctorList, setDoctorList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [paymentData, setPaymentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null);

  useEffect(() => {
    fetchDoctorList();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchPaymentData(selectedDoctor);
      const doctor = doctorList.find(
        (doc) => doc.id.toString() === selectedDoctor
      );
      setSelectedDoctorDetails(doctor);
    }
  }, [selectedDoctor, doctorList]);

  useEffect(() => {
    filterDataByDate();
  }, [paymentData, dateRange]);

  const fetchDoctorList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDoctors`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setDoctorList(response.data);
    } catch (error) {
      console.log("Error fetching doctor list:", error);
    }
  };

  const fetchPaymentData = async (doctorId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/doctorPayments/payment-status/${doctorId}`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
            userDatabase: currentUser?.database,
          },
        }
      );
      // Set the payment data directly from API response
      setPaymentData(response.data || []);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setPaymentData([]);
    } finally {
      setLoading(false);
    }
  };

  const filterDataByDate = () => {
    if (!dateRange.from && !dateRange.to) {
      setFilteredData(paymentData);
      return;
    }

    const filtered = paymentData.filter((item) => {
      const paymentDate = new Date(item.paymentDateTime);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to + "T23:59:59") : null;

      if (fromDate && paymentDate < fromDate) return false;
      if (toDate && paymentDate > toDate) return false;
      return true;
    });

    setFilteredData(filtered);
  };

  const getEarningsByCategory = () => {
    const categories = {
      consultation: 0,
      referral: 0,
      pathology: 0,
      diagnosis: 0,
    };

    filteredData.forEach((item) => {
      const amount = parseFloat(item.paidAmount) || 0;
      if (item.consultationId && item.consultationId !== null) {
        categories.consultation += amount;
      } else if (item.referralId && item.referralId !== null) {
        categories.referral += amount;
      } else if (item.pathologyId && item.pathologyId !== null) {
        categories.pathology += amount;
      } else if (item.diagnosisId && item.diagnosisId !== null) {
        categories.diagnosis += amount;
      }
    });

    return [
      {
        name: "Consultation",
        value: categories.consultation,
        color: "#8884d8",
      },
      { name: "Referral", value: categories.referral, color: "#82ca9d" },
      { name: "Pathology", value: categories.pathology, color: "#ffc658" },
      { name: "Diagnosis", value: categories.diagnosis, color: "#ff8042" },
    ].filter((item) => item.value > 0);
  };

  const getMonthlyEarnings = () => {
    const monthlyData = {};

    filteredData.forEach((item) => {
      const date = new Date(item.paymentDateTime);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const amount = parseFloat(item.paidAmount) || 0;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += amount;
    });

    return Object.entries(monthlyData)
      .map(([month, amount]) => ({
        month,
        earnings: amount,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const getTotalEarnings = () => {
    return filteredData.reduce(
      (total, item) => total + (parseFloat(item.paidAmount) || 0),
      0
    );
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const resetFilters = () => {
    setDateRange({ from: "", to: "" });
  };

  const chartData = getEarningsByCategory();
  const monthlyData = getMonthlyEarnings();
  const totalEarnings = getTotalEarnings();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-gray-600">
            Amount: ₹{payload[0].value.toFixed(2)}
          </p>
          <p className="text-gray-600">
            Percentage: {((payload[0].value / totalEarnings) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const getDoctorDisplayName = (doctor) => {
    return `${doctor.Dr} ${doctor.FirstName} ${doctor.LastName}`.trim();
  };

  return (
    <div className="container">
      <header className="header mb-4 text-center">
        <h2 style={{ fontSize: "16px" }}>Doctor Earning</h2>
      </header>

      {/* Filters Section */}
      <div className="mb-4 row g-2">
        <div className="col-md-3">
          <label>Select Doctor</label>
          <select
            value={selectedDoctor}
            onChange={handleDoctorChange}
            className="form-control"
          >
            <option value="">Choose a doctor</option>
            {doctorList.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {getDoctorDisplayName(doctor)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label>From Date</label>
          <input
            type="date"
            name="from"
            value={dateRange.from}
            onChange={handleDateChange}
            className="form-control"
          />
        </div>

        <div className="col-md-3">
          <label>To Date</label>
          <input
            type="date"
            name="to"
            value={dateRange.to}
            onChange={handleDateChange}
            className="form-control"
          />
        </div>

        <div className="col-md-3 d-flex align-items-end">
          <button onClick={resetFilters} className="btn btn-secondary w-100">
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
        </div>
      ) : selectedDoctor ? (
        <div className="space-y-6">
          {/* ✅ Summary Table */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h5 className="mb-3">Earnings Summary</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Total Earnings</th>
                  <th>Total Transactions</th>
                  <th>Unique Patients</th>
                  <th>Average per Transaction</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>₹{totalEarnings.toFixed(2)}</td>
                  <td>{filteredData.length}</td>
                  <td>
                    {new Set(filteredData.map((item) => item.patientId)).size}
                  </td>
                  <td>
                    ₹{(totalEarnings / filteredData.length || 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* ✅ Category Breakdown Table */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h5 className="mb-3">Category-wise Breakdown</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount (₹)</th>
                    <th>Percentage of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((category, index) => (
                    <tr key={index}>
                      <td>{category.name}</td>
                      <td>₹{category.value.toFixed(2)}</td>
                      <td>
                        {((category.value / totalEarnings) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* ✅ Pie Chart (AFTER tables) */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-3">
            <h5 className="mb-3">
              Earnings Distribution by Category
            </h5>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No payment data available for the selected criteria
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-500 text-lg">
            Please select a doctor to view earnings data
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorEarnings;

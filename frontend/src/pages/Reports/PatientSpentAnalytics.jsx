import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Table, Card, Form, Button } from 'react-bootstrap';
import AuthService from "../../services/auth.service";
import { CurrencyContext } from "../../context/CurrencyProvider";
import { HospitalContext } from "../../context/HospitalDataProvider";
import { currencySymbols } from "../../utils.js";

const PatientSpentAnalytics = () => {
  const currentUser = AuthService.getCurrentUser();
  const { selectedGlobalCurrency, convertCurrency } = useContext(CurrencyContext);
  const { hospitalData } = useContext(HospitalContext);

  const [bookings, setBookings] = useState([]);
  const [diagnosticsBookings, setDiagnosticsBookings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRange, setSelectedRange] = useState('last1month');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);

  // Safe currency conversion
  const safeConvertCurrency = (amount, fromCurrency, toCurrency) => {
    const converted = convertCurrency(amount, fromCurrency, toCurrency);
    if (typeof converted === 'string') {
      return parseFloat(converted.replace(/[^\d.-]/g, '')) || 0;
    }
    return parseFloat(converted) || 0;
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    handlePredefinedRange(selectedRange);
  }, [selectedRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchBookings(),
        fetchDiagnosticsBookings(),
        fetchAppointments(),
        fetchDoctors()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllBookingsTest`,
        {
          headers: { Authorization: `${currentUser?.Token}` },
        }
      );
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchDiagnosticsBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDiagnosticsBooking`,
        {
          headers: { Authorization: `${currentUser?.Token}` },
        }
      );
      setDiagnosticsBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching diagnostics bookings:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllDoctorsAppointments`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDoctors`,
        {
          headers: { Authorization: `${currentUser?.Token}` },
        }
      );
      setDoctors(response.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handlePredefinedRange = (range) => {
    const today = new Date();
    let start, end;

    switch (range) {
      case "last1month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "last3months":
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "last6months":
        start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "currentYear":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case "fy25":
        start = new Date(2024, 3, 1);
        end = new Date(2025, 2, 31);
        break;
      default:
        return;
    }

    setDateRange({
      from: start.toISOString().split('T')[0],
      to: end.toISOString().split('T')[0]
    });
  };

  const filterDataByDate = (data, dateField = 'createdAt') => {
    if (!dateRange.from || !dateRange.to) return data;

    return data.filter(item => {
      const itemDate = new Date(item[dateField] || item.createdAt);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to + "T23:59:59");

      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  // Get filtered data based on selections
  const getFilteredData = () => {
    let filteredAppointments = filterDataByDate(appointments, 'paymentDateTime');
    let filteredBookings = filterDataByDate(bookings);
    let filteredDiagnostics = filterDataByDate(diagnosticsBookings);

    // Filter by doctor
    if (selectedDoctor) {
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.doctorId?.toString() === selectedDoctor
      );
      filteredBookings = filteredBookings.filter(booking => 
        booking.doctorId?.toString() === selectedDoctor
      );
      filteredDiagnostics = filteredDiagnostics.filter(diag => 
        diag.doctorId?.toString() === selectedDoctor
      );
    }

    // Filter by department
    if (selectedDepartment !== 'all') {
      switch (selectedDepartment) {
        case 'consultation':
          filteredBookings = [];
          filteredDiagnostics = [];
          break;
        case 'pathology':
          filteredAppointments = [];
          filteredDiagnostics = [];
          break;
        case 'diagnostic':
          filteredAppointments = [];
          filteredBookings = [];
          break;
      }
    }

    return {
      appointments: filteredAppointments,
      bookings: filteredBookings,
      diagnostics: filteredDiagnostics
    };
  };

  const getPatientSpendingData = () => {
    const { appointments, bookings, diagnostics } = getFilteredData();
    const patientMap = new Map();

    // Process appointments
    appointments.forEach(apt => {
      const patientId = apt.patientId;
      const amount = safeConvertCurrency(apt.amount, 'INR', selectedGlobalCurrency);
      
      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          patientId,
          patientName: apt.PatientName,
          totalSpent: 0,
          consultation: 0,
          pathology: 0,
          diagnostic: 0,
          visitCount: 0,
          departments: new Set()
        });
      }
      
      const patient = patientMap.get(patientId);
      patient.totalSpent += amount;
      patient.consultation += amount;
      patient.visitCount++;
      patient.departments.add('consultation');
    });

    // Process pathology bookings
    bookings.forEach(booking => {
      const patientId = booking.PatientID;
      const amount = safeConvertCurrency(
        booking.PaidAmount || booking.testFees, 
        booking.Currency || 'INR', 
        selectedGlobalCurrency
      );
      
      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          patientId,
          patientName: booking.PatientName,
          totalSpent: 0,
          consultation: 0,
          pathology: 0,
          diagnostic: 0,
          visitCount: 0,
          departments: new Set()
        });
      }
      
      const patient = patientMap.get(patientId);
      patient.totalSpent += amount;
      patient.pathology += amount;
      patient.visitCount++;
      patient.departments.add('pathology');
    });

    // Process diagnostic bookings
    diagnostics.forEach(diag => {
      const patientId = diag.PatientID;
      const amount = safeConvertCurrency(
        diag.PaidAmount || diag.testFees, 
        diag.Currency || 'INR', 
        selectedGlobalCurrency
      );
      
      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          patientId,
          patientName: diag.PatientName,
          totalSpent: 0,
          consultation: 0,
          pathology: 0,
          diagnostic: 0,
          visitCount: 0,
          departments: new Set()
        });
      }
      
      const patient = patientMap.get(patientId);
      patient.totalSpent += amount;
      patient.diagnostic += amount;
      patient.visitCount++;
      patient.departments.add('diagnostic');
    });

    return Array.from(patientMap.values())
      .map(patient => ({
        ...patient,
        departments: Array.from(patient.departments).join(', ')
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);
  };

  const getDepartmentWiseData = () => {
    const { appointments, bookings, diagnostics } = getFilteredData();
    
    const consultationTotal = appointments.reduce((sum, apt) => 
      sum + safeConvertCurrency(apt.amount, 'INR', selectedGlobalCurrency), 0
    );
    
    const pathologyTotal = bookings.reduce((sum, booking) => 
      sum + safeConvertCurrency(
        booking.PaidAmount || booking.testFees, 
        booking.Currency || 'INR', 
        selectedGlobalCurrency
      ), 0
    );
    
    const diagnosticTotal = diagnostics.reduce((sum, diag) => 
      sum + safeConvertCurrency(
        diag.PaidAmount || diag.testFees, 
        diag.Currency || 'INR', 
        selectedGlobalCurrency
      ), 0
    );

    return [
      { name: 'Consultation', value: consultationTotal, color: '#8884d8' },
      { name: 'Pathology', value: pathologyTotal, color: '#82ca9d' },
      { name: 'Diagnostic', value: diagnosticTotal, color: '#ffc658' }
    ].filter(item => item.value > 0);
  };

  const getMonthlyTrendData = () => {
    const { appointments, bookings, diagnostics } = getFilteredData();
    const monthlyData = {};

    const processData = (data, type) => {
      data.forEach(item => {
        const date = new Date(item.createdAt || item.paymentDateTime);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const amount = safeConvertCurrency(
          item.amount || item.PaidAmount || item.testFees,
          item.Currency || 'INR',
          selectedGlobalCurrency
        );

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            month: monthYear,
            consultation: 0,
            pathology: 0,
            diagnostic: 0,
            total: 0
          };
        }

        monthlyData[monthYear][type] += amount;
        monthlyData[monthYear].total += amount;
      });
    };

    processData(appointments, 'consultation');
    processData(bookings, 'pathology');
    processData(diagnostics, 'diagnostic');

    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  };

  const getDoctorWiseData = () => {
    const { appointments, bookings, diagnostics } = getFilteredData();
    const doctorMap = new Map();

    const processDoctorData = (data, type) => {
      data.forEach(item => {
        const doctorId = item.doctorId;
        const doctorName = item.DoctorName || 'Unknown Doctor';
        const amount = safeConvertCurrency(
          item.amount || item.PaidAmount || item.testFees,
          item.Currency || 'INR',
          selectedGlobalCurrency
        );

        if (!doctorMap.has(doctorId)) {
          doctorMap.set(doctorId, {
            doctorId,
            doctorName,
            consultation: 0,
            pathology: 0,
            diagnostic: 0,
            total: 0,
            patientCount: new Set()
          });
        }

        const doctor = doctorMap.get(doctorId);
        doctor[type] += amount;
        doctor.total += amount;
        doctor.patientCount.add(item.patientId || item.PatientID);
      });
    };

    processDoctorData(appointments, 'consultation');
    processDoctorData(bookings, 'pathology');
    processDoctorData(diagnostics, 'diagnostic');

    return Array.from(doctorMap.values())
      .map(doctor => ({
        ...doctor,
        patientCount: doctor.patientCount.size
      }))
      .sort((a, b) => b.total - a.total);
  };

  const patientData = getPatientSpendingData();
  const departmentData = getDepartmentWiseData();
  const monthlyData = getMonthlyTrendData();
  const doctorData = getDoctorWiseData();

  const getRangeDisplayName = (range) => {
    switch (range) {
      case "last1month": return "Last 1 Month";
      case "last3months": return "Last 3 Months";
      case "last6months": return "Last 6 Months";
      case "currentYear": return "Current Year";
      case "fy25": return "FY25";
      default: return "Custom Range";
    }
  };

  const getSelectedDoctorName = () => {
    if (!selectedDoctor) return 'All Doctors';
    const doctor = doctors.find(doc => doc.id.toString() === selectedDoctor);
    return doctor ? `${doctor.Dr} ${doctor.FirstName} ${doctor.LastName}` : 'Selected Doctor';
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading patient analytics data...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ fontSize: '14px' }}>
      <header className="header mb-4 text-center">
        <h2 style={{ fontSize: "18px" }}>Patient Spending Analytics</h2>
      </header>

      {/* Filters Section */}
      <Card className="mb-4">
        <Card.Body>
          <div className="row g-3">
  <div className="col-md-2">  {/* Reduced from 3 */}
    <Form.Label>Select Doctor</Form.Label>
    <Form.Select
      value={selectedDoctor}
      onChange={(e) => setSelectedDoctor(e.target.value)}
      size="sm"
    >
      <option value="">All Doctors</option>
      {doctors.map(doctor => (
        <option key={doctor.id} value={doctor.id}>
          {`${doctor.Dr} ${doctor.FirstName} ${doctor.LastName}`}
        </option>
      ))}
    </Form.Select>
  </div>

  <div className="col-md-4">  {/* Reduced from 3 */}
    <Form.Label>Department</Form.Label>
    <Form.Select
      value={selectedDepartment}
      onChange={(e) => setSelectedDepartment(e.target.value)}
      size="sm"
    >
      <option value="all">All Departments</option>
      <option value="consultation">Consultation</option>
      <option value="pathology">Pathology</option>
      <option value="diagnostic">Diagnostic</option>
    </Form.Select>
  </div>

  <div className="col-md-3">  {/* Reduced from 3 */}
    <Form.Label>Time Range</Form.Label>
    <Form.Select
      value={selectedRange}
      onChange={(e) => setSelectedRange(e.target.value)}
      size="sm"
    >
      <option value="last1month">Last 1 Month</option>
      <option value="last3months">Last 3 Months</option>
      <option value="last6months">Last 6 Months</option>
      <option value="currentYear">Current Year</option>
      <option value="fy25">FY25</option>
    </Form.Select>
  </div>

  <div className="col-md-3">  {/* Keep 3 for custom range */}
    <Form.Label>Custom Date Range</Form.Label>
    <div className="d-flex  gap-1">
      <Form.Control
        type="date"
        value={dateRange.from}
        onChange={(e) => {
          setDateRange(prev => ({ ...prev, from: e.target.value }));
          setSelectedRange('custom');
        }}
        size="sm"
      />
      <Form.Control
        type="date"
        value={dateRange.to}
        onChange={(e) => {
          setDateRange(prev => ({ ...prev, to: e.target.value }));
          setSelectedRange('custom');
        }}
        size="sm"
      />
    </div>
  </div>
</div>
        </Card.Body>
      </Card>

      {/* Current Selection Info */}
      <Card className="mb-4 bg-light">
        <Card.Body className="py-2">
          <div className="row">
            <div className="col-md-6">
              <strong>Current View:</strong> {getSelectedDoctorName()} | {getRangeDisplayName(selectedRange)}
              {dateRange.from && dateRange.to && (
                <span> ({new Date(dateRange.from).toLocaleDateString()} to {new Date(dateRange.to).toLocaleDateString()})</span>
              )}
            </div>
            <div className="col-md-6 text-end">
              <strong>Total Patients:</strong> {patientData.length} | 
              <strong> Total Revenue:</strong> {currencySymbols[selectedGlobalCurrency]}
              {patientData.reduce((sum, patient) => sum + patient.totalSpent, 0).toFixed(2)}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Patients</Card.Title>
              <Card.Text>
                <h3>{patientData.length}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <Card.Text>
                <h3>{currencySymbols[selectedGlobalCurrency]}{patientData.reduce((sum, patient) => sum + patient.totalSpent, 0).toFixed(2)}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Avg. Spend/Patient</Card.Title>
              <Card.Text>
                <h3>{currencySymbols[selectedGlobalCurrency]}{(patientData.reduce((sum, patient) => sum + patient.totalSpent, 0) / (patientData.length || 1)).toFixed(2)}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Visits</Card.Title>
              <Card.Text>
                <h3>{patientData.reduce((sum, patient) => sum + patient.visitCount, 0)}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        {/* Department-wise Revenue */}
        <div className="col-md-6">
          <Card>
            <Card.Header>
              <h5>Revenue by Department</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${currencySymbols[selectedGlobalCurrency]}${value.toFixed(2)}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>

        {/* Monthly Trend */}
        <div className="col-md-6">
          <Card>
            <Card.Header>
              <h5>Monthly Revenue Trend</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year.slice(2)}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${currencySymbols[selectedGlobalCurrency]}${value.toFixed(2)}`, 'Amount']} />
                  <Legend />
                  <Line type="monotone" dataKey="consultation" stroke="#8884d8" name="Consultation" />
                  <Line type="monotone" dataKey="pathology" stroke="#82ca9d" name="Pathology" />
                  <Line type="monotone" dataKey="diagnostic" stroke="#ffc658" name="Diagnostic" />
                  <Line type="monotone" dataKey="total" stroke="#ff8042" name="Total" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Doctor-wise Performance */}
      {!selectedDoctor && (
        <Card className="mb-4">
          <Card.Header>
            <h5>Doctor-wise Performance</h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Total Revenue</th>
                    <th>Patient Count</th>
                    <th>Consultation</th>
                    <th>Pathology</th>
                    <th>Diagnostic</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorData.map((doctor, index) => (
                    <tr key={index}>
                      <td>{doctor.doctorName}</td>
                      <td>{currencySymbols[selectedGlobalCurrency]}{doctor.total.toFixed(2)}</td>
                      <td>{doctor.patientCount}</td>
                      <td>{currencySymbols[selectedGlobalCurrency]}{doctor.consultation.toFixed(2)}</td>
                      <td>{currencySymbols[selectedGlobalCurrency]}{doctor.pathology.toFixed(2)}</td>
                      <td>{currencySymbols[selectedGlobalCurrency]}{doctor.diagnostic.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Patient Spending Details */}
      <Card>
        <Card.Header>
          <h5>Patient Spending Details</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Total Spent</th>
                  <th>Visit Count</th>
                  <th>Departments</th>
                  <th>Consultation</th>
                  <th>Pathology</th>
                  <th>Diagnostic</th>
                </tr>
              </thead>
              <tbody>
                {patientData.map((patient, index) => (
                  <tr key={index}>
                    <td>{patient.patientName}</td>
                    <td>{currencySymbols[selectedGlobalCurrency]}{patient.totalSpent.toFixed(2)}</td>
                    <td>{patient.visitCount}</td>
                    <td>{patient.departments}</td>
                    <td>{currencySymbols[selectedGlobalCurrency]}{patient.consultation.toFixed(2)}</td>
                    <td>{currencySymbols[selectedGlobalCurrency]}{patient.pathology.toFixed(2)}</td>
                    <td>{currencySymbols[selectedGlobalCurrency]}{patient.diagnostic.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {patientData.length === 0 && (
            <div className="text-center py-4 text-muted">
              No patient data found for the selected criteria
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PatientSpentAnalytics;
import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";
import {
  Table,
  Card,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import {
  FaRegEye,
  FaPencilAlt,
  FaTimes,
  FaDownload,
  FaMoneyBillAlt,
} from "react-icons/fa";
import DownloadDoctorEarningsReport from "./DownloadDoctorEarningsReport";
import DownloadDoctorReferalEarningsReport from "./DownloadDoctorReferalEarningsReport";
import { toast } from "react-toastify";

const ShowDoctorList = () => {
  const currentUser = AuthService.getCurrentUser();
  const [doctorList, setDoctorList] = useState([]);
  const [doctorFees, setDoctorFees] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [diagnosticsBookings, setDiagnosticsBookings] = useState([]);
  const [pathologyBookings, setPathologyBookings] = useState([]);
  const [enterCodes, setEnterCodes] = useState([]);

  // Consultation modal state
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState("");
  const [doctorConsultations, setDoctorConsultations] = useState([]);
  const [totalConsultationFees, setTotalConsultationFees] = useState(0);
  const [doctorEarnings, setDoctorEarnings] = useState(0);

  // Referral modal state
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [doctorReferrals, setDoctorReferrals] = useState([]);
  const [totalReferralFees, setTotalReferralFees] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [selectedDoctorFee, setSelectedDoctorFee] = useState(0);
  const [selectedDoctorCurrency, setSelectedDoctorCurrency] = useState("INR");

  // Date range state for both modals
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);

  // Edit form state
  const [editConsultationFee, setEditConsultationFee] = useState("");
  const [editReferralFee, setEditReferralFee] = useState("");
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState({});

  useEffect(() => {
    fetchDoctorList();
    fetchDoctorFees();
    fetchAllDoctorsAppointments();
    fetchDiagnosticsBookings();
    fetchBookings();
    getEnterCodeList();
  }, []);

  const fetchPaymentStatus = async (doctorId) => {
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

      setPaymentStatus((prev) => ({
        ...prev,
        [doctorId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching payment status:", error);
      // Set default status if error occurs
      setPaymentStatus((prev) => ({
        ...prev,
        [doctorId]: {
          status: "Unknown",
          lastPaymentDate: null,
          totalPaid: 0,
          consultationPayments: 0,
          pathologyPayments: 0,
          diagnosisPayments: 0,
        },
      }));
    }
  };

  console.log(paymentStatus, "paymentStatus");

  const fetchDoctorFees = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDoctorsWithFees`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setDoctorFees(response.data);
    } catch (error) {
      console.log("Error fetching doctor fees:", error);
    }
  };

  const fetchAllDoctorsAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllDoctorsAppointments`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setPatients(response.data.appointments);
    } catch (error) {
      console.log("Error fetching appointments:", error);
    }
  };

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

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getAllBookingsTest`,
        {
          headers: { Authorization: `${currentUser?.Token}` },
        }
      );
      setPathologyBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const getEnterCodeList = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/GetEnterCodeList`,
        {
          headers: { Authorization: `${currentUser?.Token}` },
        }
      );
      setEnterCodes(res.data); // store data in state
    } catch (error) {
      console.error("Error fetching enter code list:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to get the applicable fee for a patient based on consultation date
  const getApplicableFee = (
    doctorId,
    consultationDate,
    feeType = "consultation"
  ) => {
    const doctorFeeHistory = doctorFees.filter(
      (fee) => fee.doctorId === doctorId
    );

    if (doctorFeeHistory.length === 0) return 0;

    // Sort fees by feeUpdatedAt date (newest first)
    const sortedFees = doctorFeeHistory.sort(
      (a, b) => new Date(b.feeUpdatedAt) - new Date(a.feeUpdatedAt)
    );

    // Find the fee that was applicable at the time of consultation
    const consultationDateTime = new Date(consultationDate);

    for (const fee of sortedFees) {
      const feeUpdatedAt = new Date(fee.feeUpdatedAt);
      if (consultationDateTime >= feeUpdatedAt) {
        return feeType === "consultation"
          ? parseFloat(fee.consultationFee)
          : parseFloat(fee.referralFee);
      }
    }

    // If no fee found that was updated before consultation, use the oldest fee
    const oldestFee = sortedFees[sortedFees.length - 1];
    return feeType === "consultation"
      ? parseFloat(oldestFee.consultationFee)
      : parseFloat(oldestFee.referralFee);
  };

  const handleViewConsultations = (doctor) => {
    fetchPaymentStatus(doctor.id);
    setSelectedDoctor(doctor);
    setSelectedDoctorId(doctor.id);
    setSelectedDoctorName(
      `${doctor.Dr} ${doctor.FirstName} ${doctor.MiddleName} ${doctor.LastName}`
    );
    setDateRange({ startDate: "", endDate: "" });

    // Filter patients by doctorId
    const filteredPatients = patients.filter(
      (patient) => patient.doctorId === doctor.id // Use doctor.id instead of doctorId
    );
    setDoctorConsultations(filteredPatients);
    setFilteredConsultations(filteredPatients);

    // Calculate earnings based on applicable fees at the time of consultation
    let totalPatientFees = 0;
    let totalDoctorEarnings = 0;

    filteredPatients.forEach((patient) => {
      const applicableFee = getApplicableFee(
        doctor.id, // Use doctor.id instead of doctorId
        patient.bookingStartDate,
        "consultation"
      );
      totalPatientFees += parseFloat(patient.amount) || 0;
      totalDoctorEarnings += applicableFee;
    });

    setTotalConsultationFees(totalPatientFees);
    setDoctorEarnings(totalDoctorEarnings);
    setShowConsultationModal(true);
  };

  const handleViewReferrals = (doctor) => {
    fetchPaymentStatus(doctor.id);
    const latestFee = getLatestDoctorFee(doctor.id);

    setSelectedDoctor(doctor);
    setSelectedDoctorId(doctor.id);
    setSelectedDoctorName(
      `${doctor.Dr} ${doctor.FirstName} ${doctor.MiddleName} ${doctor.LastName}`
    );
    setSelectedDoctorFee(parseFloat(latestFee?.referralFee) || 0);
    setSelectedDoctorCurrency(latestFee?.consultationCurrency || "INR");
    setDateRange({ startDate: "", endDate: "" });

    // Filter patients by referralDoctorId (consultations)
    const filteredPatients = patients.filter(
      (patient) => patient.referralDoctorId === doctor.id
    );

    // Filter diagnostics bookings by doctorId (not referralDoctorId)
    const filteredDiagnostics = diagnosticsBookings.filter(
      (booking) => booking.doctorId === doctor.id
    );

    // Filter pathology bookings by doctorId (not referralDoctorId)
    const filteredPathology = pathologyBookings.filter(
      (booking) => booking.doctorId === doctor.id
    );

    // ✅ Attach consultationId / diagnosisId / pathologyId so they match doctorPayments
    const allReferrals = [
      ...filteredPatients.map((item) => ({
        ...item,
        type: "Consultation",
        consultationId: item.id, // match doctorPayments.consultationId
      })),
      ...filteredDiagnostics.map((item) => ({
        ...item,
        type: "Diagnostics",
        diagnosisId: item.id, // match doctorPayments.diagnosisId
      })),
      ...filteredPathology.map((item) => ({
        ...item,
        type: "Pathology",
        pathologyId: item.id, // match doctorPayments.pathologyId
      })),
    ];

    setDoctorReferrals(allReferrals);
    setFilteredReferrals(allReferrals);

    // Calculate total amount from referrals
    const totalPatientFees = allReferrals.reduce((sum, referral) => {
      return (
        sum +
        (parseFloat(referral.amount) ||
          parseFloat(referral.PaidAmount) ||
          parseFloat(referral.TotalFees) ||
          0)
      );
    }, 0);
    setTotalReferralFees(totalPatientFees);

    // Calculate doctor's referral earnings based on applicable fees and enter codes
    let doctorTotalEarnings = 0;

    allReferrals.forEach((referral) => {
      if (referral.type === "Consultation") {
        // Consultation referral → fixed fee
        const applicableFee = getApplicableFee(
          doctor.id,
          referral.bookingStartDate,
          "referral"
        );
        doctorTotalEarnings += applicableFee;
      } else if (referral.commissionValue) {
        // Diagnostics or Pathology referral → commission %
        const enterCode = enterCodes.find(
          (code) => code.codeType === referral.commissionValue
        );
        if (enterCode) {
          const percentage = parseFloat(enterCode.value);
          const amount =
            parseFloat(referral.PaidAmount) ||
            parseFloat(referral.TotalFees) ||
            0;
          doctorTotalEarnings += (amount * percentage) / 100;
        }
      }
    });

    setReferralEarnings(doctorTotalEarnings);
    setShowReferralModal(true);
  };

  const handleCloseConsultationModal = () => {
    setShowConsultationModal(false);
    setDoctorConsultations([]);
    setFilteredConsultations([]);
    setTotalConsultationFees(0);
    setDoctorEarnings(0);
  };

  const handleCloseReferralModal = () => {
    setShowReferralModal(false);
    setDoctorReferrals([]);
    setFilteredReferrals([]);
    setTotalReferralFees(0);
    setReferralEarnings(0);
  };

  const handleEditDoctor = (doctor) => {
    console.log(doctor, "doctor");

    setEditingDoctor(doctor);

    // Get the latest fee for this doctor
    const latestFee = doctorFees
      .filter((fee) => fee.doctorId === doctor.id)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

    setEditConsultationFee(latestFee?.consultationFee || "0");
    setEditReferralFee(latestFee?.referralFee || "0");
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingDoctor(null);
    setEditConsultationFee("");
    setEditReferralFee("");
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/updateDoctorFees/${
          editingDoctor.id
        }`,
        {
          consultationFee: editConsultationFee,
          referralFee: editReferralFee,
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );

      if (response.status === 200) {
        // Refresh the doctor fees list
        await fetchDoctorFees();
        handleCloseEditModal();
        toast.success("Doctor fees updated successfully!");
      }
    } catch (error) {
      console.error("Error updating doctor fees:", error);
      toast.error("Error updating doctor fees. Please try again.");
    }
  };

  // Get the latest fee for each doctor
  const getLatestDoctorFee = (doctorId) => {
    const doctorFeeHistory = doctorFees.filter(
      (fee) => fee.doctorId === doctorId
    );
    if (doctorFeeHistory.length === 0) return null;

    return doctorFeeHistory.sort(
      (a, b) => new Date(b.feeUpdatedAt) - new Date(a.feeUpdatedAt)
    )[0];
  };

  // Filter data by date range
  const filterByDateRange = (data, startDate, endDate) => {
    if (!startDate && !endDate) return data;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return data.filter((item) => {
      const itemDate = new Date(item.bookingStartDate || item.paymentDateTime);

      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      return true;
    });
  };

  // Handle date range change for consultation modal
  const handleConsultationDateRangeChange = () => {
    const filtered = filterByDateRange(
      doctorConsultations,
      dateRange.startDate,
      dateRange.endDate
    );
    setFilteredConsultations(filtered);

    // Recalculate totals for filtered data
    let totalPatientFees = 0;
    let totalDoctorEarnings = 0;

    filtered.forEach((patient) => {
      const applicableFee = getApplicableFee(
        selectedDoctorId,
        patient.bookingStartDate,
        "consultation"
      );
      totalPatientFees += parseFloat(patient.amount) || 0;
      totalDoctorEarnings += applicableFee;
    });

    setTotalConsultationFees(totalPatientFees);
    setDoctorEarnings(totalDoctorEarnings);
  };

  // Handle date range change for referral modal
  const handleReferralDateRangeChange = () => {
    const filtered = filterByDateRange(
      doctorReferrals,
      dateRange.startDate,
      dateRange.endDate
    );
    setFilteredReferrals(filtered);

    // Recalculate totals for filtered data
    const totalPatientFees = filtered.reduce((sum, referral) => {
      return (
        sum +
        (parseFloat(referral.amount) ||
          parseFloat(referral.PaidAmount) ||
          parseFloat(referral.TotalFees) ||
          0)
      );
    }, 0);
    setTotalReferralFees(totalPatientFees);

    // Recalculate referral earnings based on applicable fees and enter codes
    let doctorTotalEarnings = 0;

    filtered.forEach((referral) => {
      // For consultation referrals
      if (referral.type === "Consultation") {
        const applicableFee = getApplicableFee(
          selectedDoctorId,
          referral.bookingStartDate,
          "referral"
        );
        doctorTotalEarnings += applicableFee;
      }
      // For diagnostics and pathology referrals
      else if (referral.commissionValue) {
        // Find the enter code
        const enterCode = enterCodes.find(
          (code) => code.codeType === referral.commissionValue
        );
        if (enterCode) {
          // Extract percentage value (e.g., "10%" -> 10)
          const percentage = parseFloat(enterCode.value);
          const amount =
            parseFloat(referral.PaidAmount) ||
            parseFloat(referral.TotalFees) ||
            0;
          doctorTotalEarnings += (amount * percentage) / 100;
        }
      }
    });

    setReferralEarnings(doctorTotalEarnings);
  };

  // Clear date range filter
  const clearDateRange = (modalType) => {
    setDateRange({ startDate: "", endDate: "" });

    if (modalType === "consultation") {
      setFilteredConsultations(doctorConsultations);

      // Recalculate ONLY doctor's consultation earnings
      let totalDoctorEarnings = 0;

      doctorConsultations.forEach((patient) => {
        const applicableFee = getApplicableFee(
          selectedDoctorId,
          patient.bookingStartDate,
          "consultation"
        );
        totalDoctorEarnings += applicableFee;
      });

      setTotalConsultationFees(0); // hide patient fees, only consultation fee counts
      setDoctorEarnings(totalDoctorEarnings);
    } else {
      setFilteredReferrals(doctorReferrals);

      // Recalculate ONLY referral earnings (ignore patient totals)
      let doctorTotalEarnings = 0;
      doctorReferrals.forEach((referral) => {
        if (referral.type === "Consultation") {
          const applicableFee = getApplicableFee(
            selectedDoctorId,
            referral.bookingStartDate,
            "referral"
          );
          doctorTotalEarnings += applicableFee;
        } else if (referral.commissionValue) {
          const enterCode = enterCodes.find(
            (code) => code.codeType === referral.commissionValue
          );
          if (enterCode) {
            const percentage = parseFloat(enterCode.value);
            const amount =
              parseFloat(referral.PaidAmount) ||
              parseFloat(referral.TotalFees) ||
              0;
            doctorTotalEarnings += (amount * percentage) / 100;
          }
        }
      });

      setTotalReferralFees(0); // hide patient total fees
      setReferralEarnings(doctorTotalEarnings);
    }
  };

  // Fetch pending payments for a doctor
  const handleViewPayments = async (doctor) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/doctorPayments/pending/${
          doctor.id
        }`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
            userDatabase: currentUser?.database,
          },
        }
      );

      setPendingPayments(response.data || []);
      setSelectedPayments(response.data.map((p) => p.id));
      setSelectedDoctor(doctor);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      toast.error("Failed to load payments");
    }
  };

  // Toggle one payment
  const togglePayment = (paymentId) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  // Toggle all payments
  const toggleAllPayments = () => {
    if (selectedPayments.length === pendingPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(pendingPayments.map((p) => p.id));
    }
  };

  // Make payments (bulk)
  const handleMakePayments = async (doctorId) => {
    console.log(doctorId, "doctorId");

    try {
      const selectedData = pendingPayments.filter((p) =>
        selectedPayments.includes(p.id)
      );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/doctorPayments/pay`,
        {
          doctorId,
          payments: selectedData.map((p) => ({
            id: p.id,
            type: p.type,
            amount: p.amount,
            date: p.date,
          })),
        },
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
            userDatabase: currentUser?.database,
          },
        }
      );

      toast.success("Payments saved successfully!");
      setShowPaymentModal(false);
      setPendingPayments([]);
      setSelectedPayments([]);
    } catch (error) {
      console.error("Error processing payments:", error);
      toast.error("Failed to process payments");
    }
  };

  // Get the payment array for selected doctor
  const doctorPayments = Array.isArray(paymentStatus[selectedDoctorId])
    ? paymentStatus[selectedDoctorId]
    : []; // if it's not an array (like doctor 2), return empty array

  // Then in your table, you can match each row like this:
  filteredConsultations.map((patient) => {
    const paymentRecord = doctorPayments.find(
      (p) =>
        p.consultationId === patient.id ||
        p.pathologyId === patient.pathologyId ||
        p.diagnosisId === patient.diagnosisId
    );
  });

  return (
    <div style={{ padding: "2rem" }}>
      <header
        className="header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px" }}> Doctors List</h2>
      </header>
      <Container fluid className="mt-4">
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <Table
                  style={{ textAlign: "center" }}
                  striped
                  bordered
                  hover
                  responsive
                >
                  <thead>
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>Sr. No</th>
                      <th style={{ whiteSpace: "nowrap" }}>Name</th>
                      <th style={{ whiteSpace: "nowrap" }}>Email</th>
                      <th style={{ whiteSpace: "nowrap" }}>Phone No</th>
                      <th style={{ whiteSpace: "nowrap" }}>Registration No</th>
                      <th style={{ whiteSpace: "nowrap" }}>Address</th>
                      <th style={{ whiteSpace: "nowrap" }}>Consultation Fee</th>
                      <th style={{ whiteSpace: "nowrap" }}>Referal Fee</th>
                      <th style={{ whiteSpace: "nowrap" }}>
                        Diagnostics/Pathology Commission
                      </th>
                      {/* <th style={{ whiteSpace: "nowrap" }}>Last Fee Update</th> */}
                      <th style={{ whiteSpace: "nowrap" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorList.map((doctor, index) => {
                      const latestFee = getLatestDoctorFee(doctor.id);
                      return (
                        <tr key={doctor.id}>
                          <td style={{ textAlign: "center" }}>{index + 1}</td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {doctor.Dr} {doctor.FirstName} {doctor.MiddleName}{" "}
                            {doctor.LastName}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {doctor.email}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {doctor.countryCode} {doctor.phoneNo}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {doctor.registrationNo}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {doctor.address}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {latestFee
                              ? `${latestFee.consultationFee} ${latestFee.consultationCurrency}`
                              : "N/A"}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {latestFee
                              ? `${latestFee.referralFee} ${latestFee.consultationCurrency}`
                              : "N/A"}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {enterCodes.length > 0 ? (
                              <div>
                                {enterCodes.map((code, idx) => (
                                  <div key={code.id}>
                                    {code.codeType}: {code.value}
                                    {idx < enterCodes.length - 1 && <br />}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          {/* <td style={{ whiteSpace: "nowrap" }}>
                            {latestFee
                              ? formatDate(latestFee.feeUpdatedAt)
                              : "N/A"}
                          </td> */}
                          <td style={{ whiteSpace: "nowrap" }}>
                            <div className="d-flex justify-content-start">
                              <button
                                title="View Patient Consultations"
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 5px",
                                  marginTop: "0px",
                                  backgroundColor: "#1111",
                                  color: "black",
                                }}
                                className="btn btn-secondary mr-1"
                                onClick={() => handleViewConsultations(doctor)}
                              >
                                <FaRegEye /> Consultations
                              </button>

                              <button
                                title="View Referral Patients"
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 5px",
                                  marginTop: "0px",
                                  backgroundColor: "#1111",
                                  color: "black",
                                }}
                                className="btn btn-secondary mr-1"
                                onClick={() => handleViewReferrals(doctor)}
                              >
                                <FaRegEye /> Referrals
                              </button>

                              <button
                                title="Payment"
                                className="btn btn-secondary mr-1"
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 5px",
                                  marginTop: "0px",
                                  backgroundColor: "#1111",
                                  color: "black",
                                }}
                                onClick={() => handleViewPayments(doctor)}
                              >
                                <FaMoneyBillAlt /> Payments
                              </button>

                              <button
                                title="Edit Doctor Fees"
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 5px",
                                  marginTop: "0px",
                                  backgroundColor: "#1111",
                                  color: "black",
                                }}
                                className="btn btn-secondary mr-1"
                                onClick={() => handleEditDoctor(doctor)}
                              >
                                <FaPencilAlt />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Payment Modal */}

      <Modal
        backdrop="static"
        dialogClassName="modal-lg"
        style={{ marginTop: "20px" }}
        centered
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            justifyContent: "space-between", // pushes title left & button right
            alignItems: "center",
            color: "black",
          }}
        >
          <Modal.Title>Pending Payments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingPayments.length > 0 ? (
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>
                    <Form.Check
                      type="checkbox"
                      checked={
                        selectedPayments.length === pendingPayments.length
                      }
                      onChange={toggleAllPayments}
                    />
                  </th>
                  <th>Patient Name</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Consultation Date</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedPayments.includes(p.id)}
                        onChange={() => togglePayment(p.id)}
                      />
                    </td>
                    <td>{p.patientName}</td>
                    <td>{p.type}</td>
                    <td>{p.amount.toFixed(2)}</td>
                    <td>{formatDate(p.date)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted">No pending payments found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPaymentModal(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleMakePayments(selectedDoctor.id)}
            disabled={selectedPayments.length === 0}
          >
            Pay Selected
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Consultation Modal */}
      <Modal
        backdrop="static"
        size="xl"
        style={{ marginTop: "20px" }}
        centered
        show={showConsultationModal}
        onHide={handleCloseConsultationModal}
        dialogClassName="modal-90w"
      >
        <Modal.Header
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            justifyContent: "space-between", // pushes title left & button right
            alignItems: "center",
          }}
        >
          <Modal.Title
            style={{ fontSize: "18px", fontWeight: "500", color: "black" }}
          >
            Patient Consultations for {selectedDoctorName}
          </Modal.Title>

          <Button
            variant="light"
            onClick={handleCloseConsultationModal}
            style={{
              padding: "0.25rem 0.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {/* Date Range Filter */}
          <div className="mb-3 p-3 border rounded">
            <h6>Filter by Date Range</h6>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Form.Group className="mb-2">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                />
              </Form.Group>
              <Button
                variant="primary"
                style={{ marginTop: "1.5rem" }}
                onClick={handleConsultationDateRangeChange}
              >
                Apply Filter
              </Button>
              <Button
                variant="secondary"
                style={{ marginTop: "21px" }}
                onClick={() => clearDateRange("consultation")}
              >
                Clear Filter
              </Button>

              <DownloadDoctorEarningsReport
                doctor={selectedDoctor}
                patients={filteredConsultations}
                doctorFees={doctorFees}
                dateRange={dateRange}
              />
            </div>
          </div>

          {filteredConsultations.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  zIndex: 1,
                }}
              >
                <tr>
                  <th>Sr. No</th>
                  <th>Patient Name</th>
                  <th>Phone</th>
                  <th>Visit Type</th>
                  <th>Reason</th>
                  <th>Amount Paid</th>
                  <th>Applicable Doctor Fee</th>
                  <th>Doctor Payment Status</th>
                  <th>Payment Date</th>
                  {/* <th>Consultation Date</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredConsultations.map((patient, index) => {
                  const applicableFee = getApplicableFee(
                    selectedDoctorId,
                    patient.bookingStartDate,
                    "consultation"
                  );

                  // Get the payment array for the selected doctor
                  const doctorPayments = Array.isArray(
                    paymentStatus[selectedDoctorId]
                  )
                    ? paymentStatus[selectedDoctorId]
                    : [];

                  // Match payment history for this patient/consultation
                  const paymentRecord = doctorPayments.find(
                    (payment) =>
                      payment.consultationId === patient.id || // match consultation
                      payment.pathologyId === patient.pathologyId || // match pathology
                      payment.diagnosisId === patient.diagnosisId // match diagnosis
                  );

                  return (
                    <tr key={patient.id}>
                      <td>{index + 1}</td>
                      <td>{patient.PatientName}</td>
                      <td>{patient.PatientPhone}</td>
                      <td>{patient.visitType}</td>
                      <td>{patient.reason}</td>
                      <td>
                        {patient.amount} {patient.Currency}
                      </td>
                      <td>
                        {applicableFee}{" "}
                        {doctorFees.find(
                          (fee) => fee.doctorId === selectedDoctorId
                        )?.consultationCurrency || "INR"}
                      </td>
                      <td>
                        {paymentRecord ? (
                          <span
                            className={`badge ${
                              paymentRecord.status === "Paid"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {paymentRecord.status}
                          </span>
                        ) : (
                          <span className="badge bg-warning">Unpaid</span>
                        )}
                      </td>
                      <td>
                        {paymentRecord
                          ? formatDate(paymentRecord.paymentDateTime)
                          : "-"}
                      </td>
                      {/* <td>{formatDate(patient.bookingStartDate)}</td> */}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">
                No consultations found for this doctor.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #dee2e6" }}
        >
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div>
              <strong>Total Consultations:</strong>{" "}
              {filteredConsultations.length}
              <br />
              <strong>Doctor's Total Earnings:</strong>{" "}
              {doctorEarnings.toFixed(2)} {selectedDoctorCurrency}
            </div>
            <div>
              <Button
                variant="secondary"
                onClick={handleCloseConsultationModal}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Referral Modal */}
      <Modal
        backdrop="static"
        size="xl"
        style={{ marginTop: "20px" }}
        centered
        show={showReferralModal}
        onHide={handleCloseReferralModal}
        dialogClassName="modal-90w"
      >
        <Modal.Header
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Modal.Title
            style={{ fontSize: "18px", fontWeight: "500", color: "black" }}
          >
            Patient Referrals for {selectedDoctorName}
          </Modal.Title>
          <Button
            variant="light"
            onClick={handleCloseReferralModal}
            style={{
              padding: "0.25rem 0.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {/* Date Range Filter */}
          <div className="mb-3 p-3 border rounded">
            <h6>Filter by Date Range</h6>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Form.Group className="mb-2">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                />
              </Form.Group>
              <Button
                variant="primary"
                style={{ marginTop: "1.5rem" }}
                onClick={handleReferralDateRangeChange}
              >
                Apply Filter
              </Button>
              <Button
                variant="secondary"
                style={{ marginTop: "21px" }}
                onClick={() => clearDateRange("referral")}
              >
                Clear Filter
              </Button>
              <DownloadDoctorReferalEarningsReport
                doctor={{
                  ...selectedDoctor,
                  referralFee: selectedDoctorFee,
                  consultationCurrency: selectedDoctorCurrency,
                }}
                patients={filteredReferrals}
                dateRange={dateRange}
                enterCodes={enterCodes}
              />
            </div>
          </div>

          {filteredReferrals.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  zIndex: 1,
                }}
              >
                <tr>
                  <th>Sr. No</th>
                  <th>Type</th>
                  <th>Patient Name</th>
                  <th>Phone</th>
                  <th>Procedure/Visit Type</th>
                  <th>Amount Paid</th>
                  <th>Referral Fee</th>
                  <th>Doctor Payment Status</th>
                  <th>Payment Date</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map((referral, index) => {
                  let referralFee = 0;
                  let procedureVisitType = "";
                  let patientName = "";
                  let phone = "";
                  let amountPaid = 0;
                  let currency = "INR";
                  let date = "";

                  // Consultation referral
                  if (referral.type === "Consultation") {
                    procedureVisitType = referral.visitType;
                    patientName = referral.PatientName;
                    phone = referral.PatientPhone;
                    amountPaid = parseFloat(referral.amount) || 0;
                    date = formatDate(referral.bookingStartDate);
                    currency = referral.Currency || "INR";

                    referralFee = getApplicableFee(
                      selectedDoctorId,
                      referral.bookingStartDate,
                      "referral"
                    );
                  }
                  // Diagnostics or Pathology referral
                  else {
                    procedureVisitType =
                      referral.selectedTests || referral.PackageName || "N/A";
                    patientName = referral.PatientName;
                    phone = referral.PatientPhoneNo;
                    amountPaid =
                      parseFloat(referral.PaidAmount) ||
                      parseFloat(referral.TotalFees) ||
                      0;
                    date = formatDate(
                      referral.PaymentDate || referral.createdAt
                    );
                    currency = referral.Currency || "INR";

                    const enterCode = enterCodes.find(
                      (code) => code.codeType === referral.commissionValue
                    );
                    if (enterCode) {
                      const percentage = parseFloat(enterCode.value);
                      referralFee = (amountPaid * percentage) / 100;
                    }
                  }

                  // ✅ Get payment history same as consultation
                  const doctorPayments = Array.isArray(
                    paymentStatus[selectedDoctorId]
                  )
                    ? paymentStatus[selectedDoctorId]
                    : [];

                  const paymentRecord = doctorPayments.find(
                    (payment) =>
                      payment.consultationId === referral.consultationId ||
                      payment.pathologyId === referral.pathologyId ||
                      payment.diagnosisId === referral.diagnosisId
                  );

                  return (
                    <tr key={`${referral.type}-${referral.id}`}>
                      <td>{index + 1}</td>
                      <td>{referral.type}</td>
                      <td>{patientName}</td>
                      <td>{phone}</td>
                      <td>{procedureVisitType}</td>
                      <td>
                        {amountPaid.toFixed(2)} {currency}
                      </td>
                      <td>
                        {referralFee.toFixed(2)} {selectedDoctorCurrency}
                      </td>
                      <td>
                        {paymentRecord ? (
                          <span
                            className={`badge ${
                              paymentRecord.status === "Paid"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {paymentRecord.status}
                          </span>
                        ) : (
                          <span className="badge bg-warning">Unpaid</span>
                        )}
                      </td>
                      <td>
                        {paymentRecord
                          ? formatDate(paymentRecord.paymentDateTime)
                          : "-"}
                      </td>
                      <td>{date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No referrals found for this doctor.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #dee2e6" }}
        >
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div>
              <strong>Total Referrals:</strong> {filteredReferrals.length}
              <br />
              <strong>Doctor's Total Referral Earnings:</strong>{" "}
              {referralEarnings.toFixed(2)} {selectedDoctorCurrency}
            </div>
            <div>
              <Button variant="secondary" onClick={handleCloseReferralModal}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Edit Doctor Fees Modal */}
      <Modal
        backdrop="static"
        style={{ marginTop: "20px" }}
        centered
        show={showEditModal}
        onHide={handleCloseEditModal}
      >
        <Modal.Header
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            justifyContent: "space-between", // pushes title left & button right
            alignItems: "center",
          }}
        >
          <Modal.Title
            style={{ fontSize: "18px", fontWeight: "500", color: "black" }}
          >
            Edit Doctor Fees
          </Modal.Title>
          <Button
            variant="light"
            onClick={handleCloseEditModal}
            style={{ padding: "0.25rem 0.5rem" }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Consultation Fee</Form.Label>
              <Form.Control
                type="number"
                value={editConsultationFee}
                onChange={(e) => setEditConsultationFee(e.target.value)}
                placeholder="Enter consultation fee"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Referral Fee</Form.Label>
              <Form.Control
                type="number"
                value={editReferralFee}
                onChange={(e) => setEditReferralFee(e.target.value)}
                placeholder="Enter referral fee"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #dee2e6" }}
        >
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .modal-90w {
          width: 60%;
          max-width: none!important;
        }
        @media (max-width: 768px) {
          .modal-90w {
            width: 60%;
          }
        }
      `}</style>
    </div>
  );
};

export default ShowDoctorList;

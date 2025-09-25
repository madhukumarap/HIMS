import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthService from "../../services/auth.service";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";

const DoctorVacations = () => {
  const currentUser = AuthService.getCurrentUser();
  const [vacations, setVacations] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Admin filters
  const [filterDoctorId, setFilterDoctorId] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");

  // ✅ Fetch all vacations

  const fetchVacations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/vacations/get`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      });
      setVacations(res.data.vacations || []);
    } catch (err) {
      console.error("Error fetching vacations:", err);
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

  const currentDoctor = doctorList.find(
    (ele) => ele.email === currentUser.email
  );

  useEffect(() => {
    fetchVacations();
    fetchDoctorList();
  }, []);

  // ✅ Handle form submit (only doctors)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingId) {
        res = await axios.put(
          `${API_URL}/api/vacations/${editingId}`,
          { ...formData },
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        toast.success(res.data.message || "Vacation updated successfully");
      } else {
        res = await axios.post(
          `${API_URL}/api/vacations`,
          {
            doctorId: currentDoctor?.id,
            doctorEmail: currentUser.email,
            ...formData,
          },
          {
            headers: {
              Authorization: `${currentUser?.Token}`,
            },
          }
        );
        toast.success(res.data.message || "Vacation saved successfully");
      }
      setFormData({ startDate: "", endDate: "", reason: "" });
      setEditingId(null);
      fetchVacations();
    } catch (err) {
      console.error("Error saving vacation:", err);
    }
  };

  const handleEdit = (vac) => {
    setFormData({
      startDate: vac.startDate.split("T")[0],
      endDate: vac.endDate.split("T")[0],
      reason: vac.reason,
    });
    setEditingId(vac.id);
  };

  const handleDelete = async (id) => {
    try {
      let res;
      res = await axios.delete(`${API_URL}/api/vacations/${id}`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      });
      fetchVacations();
      toast.success(res.data.message || "Vacation deleted successfully");
    } catch (err) {
      console.error("Error deleting vacation:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  function fetchName(id) {
    const doctor = doctorList.find((ele) => ele.id === id);
    return doctor ? `${doctor.FirstName} ${doctor.LastName}` : "";
  }

  // ✅ Filter vacations
  let filteredVacations = isAdmin
    ? vacations
    : vacations.filter((ele) => ele.doctorId === currentDoctor?.id);

  if (isAdmin) {
    if (filterDoctorId) {
      filteredVacations = filteredVacations.filter(
        (v) => v.doctorId === parseInt(filterDoctorId)
      );
    }
    if (filterStartDate) {
      filteredVacations = filteredVacations.filter(
        (v) => new Date(v.startDate) >= new Date(filterStartDate)
      );
    }
    if (filterEndDate) {
      filteredVacations = filteredVacations.filter(
        (v) => new Date(v.endDate) <= new Date(filterEndDate)
      );
    }
  }

  return (
    <div className="container">
      <header className="header mb-4 text-center">
        <h2 style={{ fontSize: "16px" }}>Doctor's Availability Management</h2>
      </header>

      {/* ✅ Admin Filters */}
      {isAdmin && (
        <div className="mb-4 row g-2">
          <div className="col-md-3">
            <label>Doctor</label>
            <select
              className="form-control"
              value={filterDoctorId}
              onChange={(e) => setFilterDoctorId(e.target.value)}
            >
              <option value="">All Doctors</option>
              {doctorList.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.FirstName} {doc.LastName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setFilterDoctorId("");
                setFilterStartDate("");
                setFilterEndDate("");
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* ✅ Vacation Form (only for doctors) */}
      {!isAdmin && (
        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-3">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-4">
              <label>Reason</label>
              <input
                type="text"
                className="form-control"
                placeholder="Leave reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Vacation Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Doctor Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            {!isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredVacations.length > 0 ? (
            filteredVacations.map((vac, index) => (
              <tr key={vac.id}>
                <td>{index + 1}</td>
                <td>{fetchName(vac.doctorId)}</td>
                <td>{formatDate(vac.startDate)}</td>
                <td>{formatDate(vac.endDate)}</td>
                <td>{vac.reason}</td>
                {!isAdmin && (
                  <td>
                    <div className="d-flex justify-content-start">
                      <button
                        title="Edit Vacation"
                        className="btn btn-secondary btn-sm me-2"
                        onClick={() => handleEdit(vac)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        title="Delete Vacation"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(vac.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? "5" : "6"} className="text-center">
                No vacations found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default DoctorVacations;

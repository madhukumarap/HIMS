import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";
import { Table, Card, Container, Row, Col } from "react-bootstrap";
import { FaRegEye, FaPencilAlt, FaTrashAlt } from "react-icons/fa";

const ShowDoctorList = () => {
  const currentUser = AuthService.getCurrentUser();
  const [doctorList, setDoctorList] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchDoctorList();
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/getallPaitents`, {
        headers: {
          Authorization: `${currentUser?.Token}`,
        },
      })
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  console.log(doctorList);

  return (
    <div>
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
                      <th style={{ whiteSpace: "nowrap" }}>
                        Registration Date
                      </th>
                      <th style={{ whiteSpace: "nowrap" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorList.map((doctor, index) => (
                      <tr key={doctor.id}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {doctor.Dr} {doctor.FirstName} {doctor.MiddleName}{" "}
                          {doctor.LastName}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>{doctor.email}</td>
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
                          {doctor.consultationFee} {doctor.consultationCurrency}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {formatDate(doctor.createdAt)}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              title="View Image"
                              style={{
                                fontSize: "12px",
                                padding: "4px 5px",
                                marginTop: "0px",
                                backgroundColor: "#1111",
                                color: "black",
                              }}
                              // disabled={!(appointment?.image.length > 2000)}
                              className="btn btn-secondary"
                              // onClick={() => handleViewImage(appointment.id)}
                            >
                              <FaRegEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShowDoctorList;

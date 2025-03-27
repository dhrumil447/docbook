import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Col, Container,  Row, Modal, Form, InputGroup } from "react-bootstrap";
import {  MdVerified } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { BiSearchAlt2 } from "react-icons/bi";

const Finddoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showSlotModal, setShowSlotModal] = useState(false);

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:1000/doctors");
      const doctorList = Array.isArray(res.data) ? res.data : res.data.doctors || [];
      setDoctors(doctorList);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDoctors([]);
    }
  };

  const getSlots = async () => {
    try {
      const res = await axios.get("http://localhost:1000/slots");
      setSlots(res.data || []);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setSlots([]);
    }
  };

  useEffect(() => {
    getData();
    getSlots();
  }, []);

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleBookAppointment = (doctor) => {

    const patientId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    console.log(patientId)

    if (!patientId) {
      navigate("/login");
      return;
    }

    setSelectedDoctor(doctor);
    const doctorSlots = slots.find(slot => slot.doctor_id === doctor.id);
    setSelectedSlots(doctorSlots ? doctorSlots.availableSlots : []);
    setShowSlotModal(true);
  };



  return (
    <div>
      <Container fluid>
      <div
        style={{
          backgroundImage: "url('./src/assets/finddr.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height:"400px",
          display: "flex",
          color: "black",
          position: "relative",
          width:"100%"

        }}
      >
        <Container  className="ms-5" style={{marginTop:"100px"}}>
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h2 className="fw-bold text-dark">Find the Right Doctor for Your Needs</h2>
            <p className="text-secondary">Quickly connect with expert healthcare professionals.</p>

            <Row className="justify-content-center mt-4">
              <Col xs={12} md={8} lg={6}>
                <InputGroup>
                  <Form.Select>
                    <option value="">City</option>
                    <option value="Prahlad Nagar">Prahlad Nagar</option>
                    <option value="Gota">Gota</option>
                    <option value="Naroda">Naroda</option>
                  </Form.Select>
                  <Form.Select>
                    <option value="" disabled>Doctor / Specialization</option>
                    <option>General Physician</option>
                        <option>Cardiologist</option>
                        <option>Dermatologist</option>
                        <option>Neurologist</option>
                        <option>Orthopedic Surgeon</option>
                        <option>Pediatrician</option>
                        <option>Psychiatrist</option>
                        <option>ENT Specialist</option>
                        <option>Gynecologist</option>
                        <option>Dentist</option>
                        <option>Urologist</option>
                        <option>Radiologist</option>
                        <option>Oncologist</option>
                        <option>Ophthalmologist</option>
                  </Form.Select>
                  <Button className="btn-warning text-dark">
                    <BiSearchAlt2 /> Search
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </div>
        <p className="mt-5 fs-5 fw-bold">
          Book appointments with minimum wait-time & verified doctor details
        </p>
        <Row className="m-5">
          {doctors.length > 0 && doctors.filter(doctor => doctor.status === "Accept").map((doctor, index) => (
            <Col md={8} sm={12} key={index} className="mb-4">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                <Card className="d-flex flex-row align-items-center p-3 shadow-sm rounded-4 mb-2" style={{height:"250px"}}>
                  <Card.Img variant="left" src={doctor.profileimg} className="me-3" style={{width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px"}} />
                  <Card.Body>
                    <Card.Title className="fw-bold mb-1">Dr. {doctor.username}</Card.Title>
                    <MdVerified className="mb-1" /> Medical Registration Verified
                    <Card.Text className="text-muted mb-1">{doctor.specialization}</Card.Text>
                    <Card.Text className="text-secondary">Consultation Fees {doctor.fees} </Card.Text>
                    <Card.Text className="text-secondary">Clinic Address:-{doctor.clinicAddress}</Card.Text>
                  </Card.Body>
                  <Col md={3}>
                    <Button variant="info" size="sm" className="me-2 mt-3" onClick={() => handleViewProfile(doctor)}>
                      <FaEye /> View Profile
                    </Button>
                    <Button  size="sm" className="mt-3" style={{backgroundColor:" rgb(255, 240, 75)",border:"0px", color:"black"}} onClick={() => handleBookAppointment(doctor)}>
                      Book Appointment
                    </Button>
                  </Col>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Doctor Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedDoctor && (
              <Card className="shadow p-3 rounded">
                <Row>
                  <Col md={4} className="text-center">
                    <img
                      src={selectedDoctor.profileimg}
                      alt="Profile"
                      className="rounded mb-3"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                    <h5 className="fw-bold">Dr. {selectedDoctor.username}</h5>
                    <MdVerified className="mb-1" /> Medical Registration Verified
                    <p className="text-muted">{selectedDoctor.specialization}</p>
                    </Col>
                    <Col md={8}>
                    <Row className="mb-2">
                      <Col>
                        <strong>Email:</strong> {selectedDoctor.email}
                      </Col>
                      <Col>
                        <strong>Phone:</strong> {selectedDoctor.phone}
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col>
                        <strong>Gender:</strong> {selectedDoctor.gender}
                      </Col>
                      <Col>
                        <strong>Age:</strong> {selectedDoctor.age}
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col>
                        <strong>Qualification:</strong> {selectedDoctor.qualification}
                      </Col>
                      <Col>
                        <strong>Experience:</strong> {selectedDoctor.experience} yrs
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col>
                        <strong>Clinic Name:</strong> {selectedDoctor.clinicName}
                      </Col>
                      <Col>
                        <strong>Fees:</strong> ₹{selectedDoctor.fees}
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col>
                        <strong>Clinic Address:</strong> {selectedDoctor.clinicAddress}
                      </Col>
                    </Row>


                  </Col>
                </Row>
              </Card>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>


        {/* Slot Selection Modal */}
        <Modal show={showSlotModal} onHide={() => setShowSlotModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Select an Appointment Slot</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSlots && Object.keys(selectedSlots).length > 0 ? (
              Object.keys(selectedSlots).map((day, index) => (
                <div key={index} className="mb-2">
                  <h5>{day}</h5>
                  {selectedSlots[day].map((slot, i) => (
                    <Button key={i} variant="outline-warning" className="m-1">
                      {slot}
                    </Button>
                  ))}
                </div>
              ))
            ) : (
              <p>No slots available for this doctor.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button style={{backgroundColor:" rgb(255, 240, 75)",border:"0px",color:"black"}}>Book Appointment</Button>
            <Button variant="secondary" onClick={() => setShowSlotModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Finddoctor;

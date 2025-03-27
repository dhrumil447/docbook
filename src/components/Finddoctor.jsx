import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Col, Container,  Row, Modal, Form, InputGroup, ListGroup } from "react-bootstrap";
import {  MdVerified } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { BiSearchAlt2 } from "react-icons/bi";
import SlotSelectionModal from "./SlotSelectionModal";
import DoctorProfileModal from "./DrProfile";

const Finddoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  
  
  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:1000/doctors");
      const doctorList = Array.isArray(res.data) ? res.data : res.data.doctors || [];
      setDoctors(doctorList);
      setFilteredDoctors(doctorList);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDoctors([]);
      setFilteredDoctors([]);
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

  const filterDoctors = () => {
    let updatedList = doctors;
    if (selectedCity) {
      updatedList = updatedList.filter((doctor) => doctor.city === selectedCity);
    }
    if (selectedSpecialization) {
      updatedList = updatedList.filter((doctor) => doctor.specialization === selectedSpecialization);
    }
    setFilteredDoctors(updatedList);
  };

  useEffect(() => {
    filterDoctors();
  }, [selectedCity, selectedSpecialization]);


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

  const specializations = [...new Set(doctors.map(doc => doc.specialization))];



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
                  <Form.Select onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="">City</option>
                    <option value="Prahlad Nagar">Prahlad Nagar</option>
                    <option value="Gota">Gota</option>
                    <option value="Naroda">Naroda</option>
                  </Form.Select>
                  <Form.Select onChange={(e) => setSelectedSpecialization(e.target.value)}>
                    <option value="">Doctor / Specialization</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </Form.Select>
                  <Button className="btn-warning text-dark" onClick={filterDoctors}>
                    <BiSearchAlt2 /> Search
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </div>
      <Container fluid>
        <p className="mt-5 fs-5 fw-bold">Book appointments with minimum wait-time & verified doctor details</p>
        <Row className="m-5">
          <Col md={9}>
            {doctors.length > 0 && doctors.filter(doctor => doctor.status === "Accept" && (!selectedSpecialization || doctor.specialization === selectedSpecialization)).map((doctor, index) => (
              <Col md={11} sm={12} key={index} className="mb-4">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                  <Card className="d-flex flex-row align-items-center p-2 shadow-sm rounded-4 mb-2" style={{height:"250px"}}>
                    <Card.Img variant="left" src={doctor.profileimg} className="me-3" style={{width: "150px", height: "200px", objectFit: "cover", borderRadius: "8px"}} />
                    <Card.Body>
                      <Card.Title className="fw-bold mb-1">Dr. {doctor.username}</Card.Title>
                      <MdVerified className="mb-1" /> Medical Registration Verified
                      <Card.Text className="text-muted mb-1">{doctor.specialization}</Card.Text>
                      <Card.Text className="text-secondary">Consultation Fees {doctor.fees} </Card.Text>
                      <Card.Text className="text-secondary">Clinic Address:- {doctor.clinicAddress}</Card.Text>
                    </Card.Body>
                    <Col md={3}>
                      <Button variant="info" size="sm" className="me-2 mt-3" onClick={() => handleViewProfile(doctor)}>
                        <FaEye /> View Profile
                      </Button>
                      <Button  size="sm" className="mt-3" style={{backgroundColor:"rgb(255, 240, 75)",border:"0px", color:"black"}} onClick={() => handleBookAppointment(doctor)}>
                        Book Appointment
                      </Button>
                    </Col>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Col>
          <Col md={3} style={{border:"1px solid gray" , borderRadius:"8px" , padding:"30px"}} className="shadow-lg">
            <h5 className="fw-bold">Filter by Specialization</h5>
            <ListGroup>
              <ListGroup.Item action onClick={() => setSelectedSpecialization("")} active={!selectedSpecialization}>All Specializations</ListGroup.Item>
              {specializations.map((spec, index) => (
                <ListGroup.Item key={index} action onClick={() => setSelectedSpecialization(spec)} active={selectedSpecialization === spec}>
                  {spec}
                </ListGroup.Item>
              ))}
                <h5 className="fw-bold mt-5">Filter by City</h5>
                <ListGroup>
                    <ListGroup.Item action onClick={() => setSelectedCity("")} active={!selectedCity}>
                      All Cities
                    </ListGroup.Item>
                  {[...new Set(doctors.map((doc) => doc.city))].map((city, index) => (
                    <ListGroup.Item
                      key={index}
                      action
                      onClick={() => setSelectedCity(city)}
                      active={selectedCity === city}
                    >
                      {city}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
            </ListGroup>
          </Col>
        </Row>
      </Container>
{/* 
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
        </Modal> */}

<DoctorProfileModal
  show={showModal}
  handleClose={() => setShowModal(false)}
  doctor={selectedDoctor}
/>


        {/* Slot Selection Modal */}
        <SlotSelectionModal
  show={showSlotModal}
  handleClose={() => setShowSlotModal(false)}
  slots={selectedSlots}
/>

        
      </Container>
    </div>
  );
};

export default Finddoctor;

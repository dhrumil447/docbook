import React from "react";
import { Modal, Button, Card, Row, Col } from "react-bootstrap";
import { MdVerified } from "react-icons/md";

const DoctorProfileModal = ({ show, handleClose, doctor }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Doctor Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {doctor && (
          <Card className="shadow p-3 rounded">
            <Row>
              <Col md={4} className="text-center">
                <img
                  src={doctor.profileimg}
                  alt="Profile"
                  className="rounded mb-3"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <h5 className="fw-bold">Dr. {doctor.username}</h5>
                <MdVerified className="mb-1" /> Medical Registration Verified
                <p className="text-muted">{doctor.specialization}</p>
              </Col>
              <Col md={8}>
                <Row className="mb-2">
                  <Col><strong>Email:</strong> {doctor.email}</Col>
                  <Col><strong>Phone:</strong> {doctor.phone}</Col>
                </Row>
                <Row className="mb-2">
                  <Col><strong>Gender:</strong> {doctor.gender}</Col>
                  <Col><strong>Age:</strong> {doctor.age}</Col>
                </Row>
                <Row className="mb-2">
                  <Col><strong>Qualification:</strong> {doctor.qualification}</Col>
                  <Col><strong>Experience:</strong> {doctor.experience} yrs</Col>
                </Row>
                <Row className="mb-2">
                  <Col><strong>Clinic Name:</strong> {doctor.clinicName}</Col>
                  <Col><strong>Fees:</strong> ₹{doctor.fees}</Col>
                </Row>
                <Row className="mb-2">
                  <Col><strong>Clinic Address:</strong> {doctor.clinicAddress}</Col>
                </Row>
              </Col>
            </Row>
          </Card>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DoctorProfileModal;

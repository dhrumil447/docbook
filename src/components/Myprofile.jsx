import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Button, Nav } from 'react-bootstrap';
import { FaUserEdit, FaHistory, FaTrash, FaSignOutAlt, FaCalendarCheck, FaNotesMedical } from 'react-icons/fa';

const PatientProfile = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const patientId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (!patientId) {
      navigate('/login');
      return;
    }

    const fetchPatient = async () => {
      try {
        const res = await axios.get(`http://localhost:1000/patients/${patientId}`);
        setPatient(res.data);
      } catch (err) {
        console.error("Error fetching patient details:", err);
      }
    };
    fetchPatient();
  }, [navigate]);

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:1000/patients/${patient.id}`);
        sessionStorage.removeItem("DocBook");
        navigate('/register');
      } catch (err) {
        console.error("Error deleting account:", err);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("DocBook");
    navigate('/login');
  };

  if (!patient) {
    return <p className="text-center mt-5">Loading patient details...</p>;
  }

  return (
    <div className="">
      <Card className="p-4" style={{ background: '#fdfaee', border: "0px", borderRadius: "10px" }}>
        <Card.Body>
          <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
            <Nav.Item>
              <Nav.Link eventKey="profile"><FaUserEdit /> Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="appointments"><FaCalendarCheck /> Appointments</Nav.Link>
            </Nav.Item>
          </Nav>

          <div className="p-3">
            {activeTab === "profile" && (
              <div>
                <h4 className="fw-bold text-primary">{patient.username}</h4>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Phone:</strong> {patient.phone}</p>
                <p><strong>Email:</strong> {patient.email}</p>

                {/* Edit Button */}
                <Button variant="primary" className="mt-3" onClick={() => navigate(`/edit-profile/${patient.id}`)}>
                  <FaUserEdit /> Edit Profile
                </Button>
              </div>
            )}

            {activeTab === "appointments" && (
              <div>
                <h5 className="fw-bold">Appointments</h5>
                <p>No appointments found.</p>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="danger" onClick={handleDeleteAccount}><FaTrash /> Delete Account</Button>
            <Button variant="secondary" onClick={handleLogout}><FaSignOutAlt /> Logout</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PatientProfile;

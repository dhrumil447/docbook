import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";

const DrProfile = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [daySlots, setDaySlots] = useState({});
  const [activeDay, setActiveDay] = useState(null);
  const [existingSlotsId, setExistingSlotsId] = useState(null);

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];

  const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;

  useEffect(() => {
    if (!doctorId) {
      toast.error("Doctor ID not found. Please log in.");
      return;
    }

    const fetchSlots = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/slots?doctor_id=${doctorId}`);
        if (response.data.length > 0) {
          setExistingSlotsId(response.data[0].id);
          setDaySlots(response.data[0].availableSlots || {});
          setSelectedDays(Object.keys(response.data[0].availableSlots || {}));
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, [doctorId]);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  const toggleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
      const newSlots = { ...daySlots };
      delete newSlots[day];
      setDaySlots(newSlots);
      setActiveDay(null);
    } else {
      setSelectedDays([...selectedDays, day]);
      setDaySlots({
        ...daySlots,
        [day]: { date: getCurrentDate(), slots: [] },
      });
      setActiveDay(day);
    }
  };

  const toggleSlotSelection = (day, slot) => {
    if (!daySlots[day]) return;
    const slots = daySlots[day].slots || [];
    const updatedSlots = slots.includes(slot)
      ? slots.filter((s) => s !== slot)
      : [...slots, slot];

    setDaySlots({
      ...daySlots,
      [day]: { ...daySlots[day], slots: updatedSlots },
    });
  };

  const saveSlots = async () => {
    if (!doctorId) {
      toast.error("Doctor ID not found. Please log in.");
      return;
    }

    const data = {
      doctor_id: doctorId,
      availableSlots: daySlots,
    };

    try {
      if (existingSlotsId) {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/slots/${existingSlotsId}`, data);
        toast.success("Slots updated successfully!");
      } else {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/slots`, data);
        if (response.status === 201 || response.status === 200) {
          setExistingSlotsId(response.data.id);
          toast.success("Slots saved successfully!");
        }
      }
    } catch (err) {
      console.error("Error saving slots:", err);
      toast.error(err.response?.data?.message || "Error saving slots.");
    }
  };

  return (
    <Container className="mt-3 text-center">
      <h4 className="fw-bold mb-3">Set Your Available Days & Time Slots</h4>
      <Card className="p-3 mb-3 shadow-sm">
        <Row className="g-2">
          {/* Available Days Selection */}
          <Col xs={12} md={4}>
            <h6 className="fw-bold mb-3 text-center">Available Days</h6>
            <Row className="g-2 flex-column align-items-center">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <Col xs={10} key={day} className="mb-1">
                  <Button
                    variant={selectedDays.includes(day) ? "success" : "outline-primary"}
                    className="w-100"
                    onClick={() => toggleDaySelection(day)}
                  >
                    {day}
                  </Button>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Time Slot Selection */}
          <Col xs={12} md={4}>
            {activeDay && (
              <>
                <h6 className="fw-bold mb-3 text-center">Time Slots for {activeDay}</h6>
                <Row className="g-2 flex-column align-items-center">
                  {timeSlots.map((slot) => (
                    <Col xs={10} key={slot} className="mb-2">
                      <Button
                        variant={daySlots[activeDay]?.slots?.includes(slot) ? "success" : "outline-primary"}
                        className="w-100"
                        onClick={() => toggleSlotSelection(activeDay, slot)}
                      >
                        {slot}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </Col>

          {/* Selected Schedule Display */}
          <Col xs={12} md={4}>
            <h6 className="fw-bold mb-3 text-center">Selected Schedule</h6>
            <Card className="p-3 shadow-sm">
              {selectedDays.length > 0 ? (
                selectedDays.map((day) => (
                  <div key={day} className="mb-3">
                    <strong>{day} ({daySlots[day]?.date || "Unknown Date"}):</strong>
                    {daySlots[day]?.slots?.length > 0 ? daySlots[day].slots.join(", ") : "No slots selected"}
                  </div>
                ))
              ) : (
                <p>No days selected</p>
              )}
            </Card>
          </Col>
        </Row>

        {/* Save/Update Button */}
        <div className="text-center mt-4">
          <Button variant="primary" size="lg" className="px-4" onClick={saveSlots}>
            {existingSlotsId ? "Update Slots" : "Save Slots"}
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default DrProfile;

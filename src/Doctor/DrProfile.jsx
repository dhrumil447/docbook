import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const DrProfile = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateSlots, setDateSlots] = useState({});
  const [activeDate, setActiveDate] = useState(null);
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
          setDateSlots(response.data[0].availableSlots || {});
          setSelectedDates(Object.keys(response.data[0].availableSlots || {}));
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, [doctorId]);

  const getDayFromDate = (date) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = new Date(date).getDay();
    return daysOfWeek[dayIndex];
  };

  const addDate = (event) => {
    const date = event.target.value;
    if (!date) return;

    if (selectedDates.includes(date)) {
      toast.warn("Date already selected!");
      return;
    }

    const day = getDayFromDate(date);
    setSelectedDates([...selectedDates, date]);
    setDateSlots({
      ...dateSlots,
      [date]: { day, slots: [] },
    });
    setActiveDate(date);
  };

  const toggleSlotSelection = (date, slot) => {
    if (!dateSlots[date]) return;
    const slots = dateSlots[date].slots || [];
    const updatedSlots = slots.includes(slot)
      ? slots.filter((s) => s !== slot)
      : [...slots, slot];

    setDateSlots({
      ...dateSlots,
      [date]: { ...dateSlots[date], slots: updatedSlots },
    });
  };

  const saveSlots = async () => {
    if (!doctorId) {
      toast.error("Doctor ID not found. Please log in.");
      return;
    }

    const data = {
      doctor_id: doctorId,
      availableSlots: dateSlots,
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
      <h4 className="fw-bold mb-3">Set Your Available Dates & Time Slots</h4>
      <Card className="p-3 mb-3 shadow-sm">
        <Row className="g-2">
          {/* Select Date */}
          <Col xs={12} md={4}>
            <h6 className="fw-bold mb-3 text-center">Select a Date</h6>
            <Form.Group className="text-center">
              <Form.Control type="date" onChange={addDate} />
            </Form.Group>

            <h6 className="fw-bold mt-3 text-center">Selected Dates</h6>
            <Row className="g-2 flex-column align-items-center">
              {selectedDates.map((date) => (
                <Col xs={10} key={date} className="mb-1">
                  <Button
                    variant={activeDate === date ? "success" : "outline-primary"}
                    className="w-100"
                    onClick={() => setActiveDate(date)}
                  >
                    {date} ({dateSlots[date]?.day})
                  </Button>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Time Slot Selection */}
          <Col xs={12} md={4}>
            {activeDate && (
              <>
                <h6 className="fw-bold mb-3 text-center">Time Slots for {activeDate} ({dateSlots[activeDate]?.day})</h6>
                <Row className="g-2 flex-column align-items-center">
                  {timeSlots.map((slot) => (
                    <Col xs={10} key={slot} className="mb-2">
                      <Button
                        variant={dateSlots[activeDate]?.slots?.includes(slot) ? "success" : "outline-primary"}
                        className="w-100"
                        onClick={() => toggleSlotSelection(activeDate, slot)}
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
              {selectedDates.length > 0 ? (
                selectedDates.map((date) => (
                  <div key={date} className="mb-3">
                    <strong>{date} ({dateSlots[date]?.day}):</strong>
                    {dateSlots[date]?.slots?.length > 0 ? dateSlots[date].slots.join(", ") : "No slots selected"}
                  </div>
                ))
              ) : (
                <p>No dates selected</p>
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

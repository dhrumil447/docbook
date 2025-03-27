import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const SlotSelectionModal = ({ show, handleClose, slots, doctorId, patientId }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Handle slot selection (Only one slot per day)
  const handleSlotSelect = (date, slot) => {
    setSelectedSlot(slot);
    setSelectedDate(date);
  };

  // Show payment options when "Book Appointment" is clicked
  const handleBookAppointment = () => {
    if (selectedSlot) {
      setShowPaymentOptions(true);
    } else {
      alert("Please select a slot first.");
    }
  };

  // Store appointment details in data.json
  const storeAppointment = async (paymentMethod) => {
    const appointmentData = {
      doctorId,
      patientId,
      date: selectedDate,
      slot: selectedSlot,
      paymentMethod,
    };

    try {
      const response = await fetch("http://localhost:1000/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        toast.success("Appointment booked successfully!");
        handleClose();
      } else {
        toast.error("Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error booking appointment.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Select an Appointment Slot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showPaymentOptions ? (
          <>
            {slots && Object.keys(slots).length > 0 ? (
              Object.keys(slots).map((date, index) => (
                <div key={index} className="mb-2">
                  <h5>{slots[date].day} ({date})</h5>
                  {slots[date].slots.map((slot, i) => (
                    <Button
                      key={i}
                      variant={selectedSlot === slot && selectedDate === date ? "warning" : "outline-warning"}
                      className="m-1"
                      onClick={() => handleSlotSelect(date, slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              ))
            ) : (
              <p>No slots available for this doctor.</p>
            )}
          </>
        ) : (
          <>
            <h5 className="text-center mb-3">Choose Payment Method</h5>
            <div className="d-flex justify-content-around">
              <Button
                variant="outline-success"
                className="p-3"
                onClick={() => storeAppointment("Pay on Counter")}
              >
                Pay on Counter
              </Button>
              <Button
                variant="outline-primary"
                className="p-3"
                onClick={() => storeAppointment("Pay Online")}
              >
                Pay Online
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!showPaymentOptions ? (
          <Button
            style={{ backgroundColor: "rgb(255, 240, 75)", border: "0px", color: "black" }}
            onClick={handleBookAppointment}
          >
            Book Appointment
          </Button>
        ) : null}
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SlotSelectionModal;

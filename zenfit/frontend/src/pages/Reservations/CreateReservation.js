import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FiClock } from "react-icons/fi";

export default function CreateReservation() {
  const navigate = useNavigate();

  const [trainers, setTrainers] = useState([]);
  const [formData, setFormData] = useState({
    trainerId: "",
    sessionDate: "",
    sessionTime: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8070/trainer/")
      .then((res) => res.json())
      .then((data) => setTrainers(data))
      .catch((err) => console.error("Error fetching trainers:", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to continue.");
      navigate("/signin");
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.trainerId) {
      newErrors.trainerId = "Please select a trainer.";
      isValid = false;
    }

    if (!formData.sessionDate) {
      newErrors.sessionDate = "Please select a date.";
      isValid = false;
    } else if (moment(formData.sessionDate).isBefore(moment().startOf("day"))) {
      newErrors.sessionDate = "Please select a future date.";
      isValid = false;
    }

    if (!formData.sessionTime) {
      newErrors.sessionTime = "Please select a time.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const checkAvailability = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to check trainer availability.");
      return;
    }

    try {
      setLoading(true);
      const query = new URLSearchParams({
        trainerId: formData.trainerId,
        sessionDate: formData.sessionDate,
        sessionTime: formData.sessionTime,
      });

      const response = await fetch(
        `http://localhost:8070/reservations/check-availability?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error("Error checking availability:", error);
      alert("Could not check availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Please log in to continue.");
      return;
    }

    if (!availability?.available) {
      alert("Trainer is not available at the selected time.");
      return;
    }

    const reservationData = {
      ...formData,
      userId,
      status: "Pending",
    };

    try {
      const response = await fetch("http://localhost:8070/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to create reservation.");
        return;
      }

      const reservation = await response.json();

      navigate("/reservation-payment", {
        state: {
          reservation,
        },
      });
    } catch (error) {
      console.error("Reservation error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  /*Expire date*/
  const today = moment().format("YYYY-MM-DD");

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-success text-white text-center p-5 mb-4">
        <h1 className="display-5 fw-bold">Book Your Session</h1>
        <p className="lead">
          Choose your trainer, pick a date and time, and start your fitness
          journey with ZenFit!
        </p>

        <div className="mt-4">
          <h5 className="mb-1">
            <FiClock className="me-2" size={22} /> Session Duration
          </h5>
          <p className="mb-0">
            Each session lasts <strong>2 hours</strong>
          </p>
          <small className="text-light">
            e.g., if you select <strong>10:00 AM</strong>, your session will end
            at <strong>12:00 PM</strong>.
          </small>
        </div>
      </div>

      {/* Form Section */}
      <div className="container col-lg-6 mb-5">
        <form onSubmit={handleSubmit} className="card p-4 shadow text-start">
          <h4 className="mb-3 text-center">Make a Reservation</h4>

          {/* Trainer */}
          <div className="mb-3">
            <label htmlFor="trainerId" className="form-label">
              Select Trainer
            </label>
            <select
              className={`form-select ${errors.trainerId ? "is-invalid" : ""}`}
              name="trainerId"
              value={formData.trainerId}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              {trainers.map((trainer) => (
                <option key={trainer._id} value={trainer._id}>
                  {trainer.firstname} {trainer.lastname} (
                  {trainer.specialization})
                </option>
              ))}
            </select>
            {errors.trainerId && (
              <div className="invalid-feedback">{errors.trainerId}</div>
            )}
          </div>

          <div className="row">
            {/* Date */}
            <div className="mb-3 col-12 col-md-6">
              <label htmlFor="sessionDate" className="form-label">
                Date
              </label>
              <input
                type="date"
                name="sessionDate"
                min={today}
                className={`form-control ${
                  errors.sessionDate ? "is-invalid" : ""
                }`}
                value={formData.sessionDate}
                onChange={handleChange}
              />
              {errors.sessionDate && (
                <div className="invalid-feedback">{errors.sessionDate}</div>
              )}
            </div>

            {/* Time */}
            <div className="mb-3 col-12 col-md-6">
              <label htmlFor="sessionTime" className="form-label">
                Time
              </label>
              <input
                type="time"
                name="sessionTime"
                className={`form-control ${
                  errors.sessionTime ? "is-invalid" : ""
                }`}
                value={formData.sessionTime}
                onChange={handleChange}
              />
              {errors.sessionTime && (
                <div className="invalid-feedback">{errors.sessionTime}</div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label htmlFor="notes" className="form-label">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              rows="2"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Availability */}
          {availability && (
            <div
              className={`alert ${
                availability.available ? "alert-success" : "alert-danger"
              }`}
            >
              {availability.message}
            </div>
          )}

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={checkAvailability}
              disabled={loading}
            >
              {loading ? "Checking..." : "Check Availability"}
            </button>
            {availability?.available && (
              <button type="submit" className="btn btn-success">
                Reserve Now
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

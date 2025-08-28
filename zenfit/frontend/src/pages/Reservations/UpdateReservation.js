import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { FiClock } from "react-icons/fi";

export default function UpdateReservation() {
  const navigate = useNavigate();
  const { id } = useParams();

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
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to continue.");
      navigate("/signin");
      return;
    }

    fetch("http://localhost:8070/trainer/")
      .then((res) => res.json())
      .then((data) => setTrainers(data))
      .catch((err) => console.error("Error fetching trainers:", err));

    fetch(`http://localhost:8070/reservations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const formattedDate = moment(data.sessionDate).format("YYYY-MM-DD");
        const formattedTime = data.sessionTime.slice(0, 5); // trims seconds
        setFormData({
          trainerId: data.trainerId?._id || data.trainerId || "",
          sessionDate: formattedDate,
          sessionTime: formattedTime,
          notes: data.notes || "",
        });
      })
      .catch((err) => console.error("Error fetching reservation:", err));
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const today = moment().startOf("day");
    const selectedDate = moment(formData.sessionDate);

    if (!formData.trainerId) {
      newErrors.trainerId = "Please select a trainer.";
      isValid = false;
    }

    if (!formData.sessionDate) {
      newErrors.sessionDate = "Please select a date.";
      isValid = false;
    } else if (selectedDate.isBefore(today)) {
      newErrors.sessionDate = "Cannot select a past date.";
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
    if (!token) return;

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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error("Error checking availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token || !availability?.available) {
      alert("Trainer is not available or you are not authenticated.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8070/reservations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Reservation updated successfully!");
        navigate("/all-reservations");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update reservation.");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const todayDate = moment().format("YYYY-MM-DD");

  return (
    <div>
      <div className="container col-lg-6 mb-5 mt-5">
        <form onSubmit={handleSubmit} className="card p-4 shadow text-start">
          <h4 className="mb-3 text-center">Edit Reservation</h4>

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
            <div className="mb-3 col-md-6">
              <label htmlFor="sessionDate" className="form-label">
                Date
              </label>
              <input
                type="date"
                name="sessionDate"
                min={todayDate}
                className={`form-control ${errors.sessionDate ? "is-invalid" : ""}`}
                value={formData.sessionDate}
                onChange={handleChange}
              />
              {errors.sessionDate && (
                <div className="invalid-feedback">{errors.sessionDate}</div>
              )}
            </div>

            <div className="mb-3 col-md-6">
              <label htmlFor="sessionTime" className="form-label">
                Time
              </label>
              <input
                type="time"
                name="sessionTime"
                className={`form-control ${errors.sessionTime ? "is-invalid" : ""}`}
                value={formData.sessionTime}
                onChange={handleChange}
              />
              {errors.sessionTime && (
                <div className="invalid-feedback">{errors.sessionTime}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              name="notes"
              rows="2"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

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
                Update Reservation
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

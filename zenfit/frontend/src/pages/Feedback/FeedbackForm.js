import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "Suggestion",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.message.trim())
      newErrors.message = "Message cannot be empty.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }

    try {
      const response = await fetch("http://localhost:8070/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Feedback submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          type: "Suggestion",
          message: "",
        });
        setErrors({});
      } else {
        const data = await response.json();
        setSuccess("");
        alert(data.error || "Submission failed.");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="container col-lg-6 my-5">
      <h3 className="mb-4 text-center">Submit Feedback</h3>

      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="card p-4 shadow text-start">
        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="mb-3 col-md-6">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 col-md-6">
            <label className="form-label">Type</label>
            <select
              name="type"
              value={formData.type}
              className="form-select"
              onChange={handleChange}
            >
              <option>Suggestion</option>
              <option>Complaint</option>
              <option>Inquiry</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="">
          <div className="mb-3 col-md-12">
            <label className="form-label">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <div className="mb-3 col-md-12">
            <label className="form-label">Message *</label>
            <textarea
              name="message"
              rows="3"
              value={formData.message}
              className={`form-control ${errors.message ? "is-invalid" : ""}`}
              onChange={handleChange}
            ></textarea>
            {errors.message && (
              <div className="invalid-feedback">{errors.message}</div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary px-4">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

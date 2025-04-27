
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
    feedbackRating: 0,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");

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
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address (e.g., abc123@gmail.com).";
    }
    if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";
    if (formData.feedbackRating < 1 || formData.feedbackRating > 5) {
      newErrors.feedbackRating = "Please select a rating between 1 and 5.";
    }
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
          feedbackRating: 0,
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

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      type: "Suggestion",
      message: "",
      feedbackRating: 0,
    });
    setErrors({});
  };

  const handleChatSend = () => {
    if (!userInput.trim()) return;

    const question = userInput.trim().toLowerCase();
    const newHistory = [...chatHistory, { from: "user", text: userInput }];

    let answer = "I'm not sure about that. Could you please ask in a different way?";

    // Improved smart replies
    if (question.includes("submit") || question.includes("feedback")) {
      answer = "To submit feedback, fill all required fields and click Submit.";
    } else if (question.includes("email")) {
      answer = "Please use a valid email format like: example@gmail.com.";
    } else if (question.includes("phone")) {
      answer = "Phone number must be exactly 10 digits.";
    } else if (question.includes("rating")) {
      answer = "Click on the stars (1 to 5) to give your feedback rating.";
    } else if (question.includes("hello") || question.includes("hi")) {
      answer = "Hello! I'm here to help you with any questions you have. 😊";
    } else if (question.includes("website")) {
      answer = "Our website provides complete information about our courses, trainers, and services.";
    } else if (question.includes("trainer") || question.includes("trainers")) {
      answer = "Our trainers are certified professionals with real-world experience in their fields.";
    } else if (question.includes("class") || question.includes("classes") || question.includes("schedule")) {
      answer = "Our classes are flexible, available on both weekdays and weekends. You can check the schedule on our website.";
    } else if (question.includes("payment") || question.includes("fee") || question.includes("pay")) {
      answer = "We accept payments through bank transfer, credit/debit cards, and online wallets.";
    } else if (question.includes("support") || question.includes("help") || question.includes("contact")) {
      answer = "You can contact our support team anytime via the Contact Us page.";
    } else if (question.includes("course") || question.includes("courses")) {
      answer = "We offer a variety of courses. Please visit our Courses section for detailed information.";
    }

    setChatHistory([...newHistory, { from: "bot", text: answer }]);
    setUserInput("");
  };

  return (
    <>
      <div className="container col-lg-6 my-5">
        <h3 className="mb-4 text-center">Submit Feedback</h3>
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} className="card p-4 shadow text-start bg-light">
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
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
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
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>

          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                onChange={handleChange}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label">Type</label>
              <select
                name="type"
                value={formData.type}
                className="form-select"
                onChange={handleChange}
              >
                <option value="Suggestion">Suggestion</option>
                <option value="Complaint">Complaint</option>
                <option value="Inquiry">Inquiry</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Message *</label>
            <textarea
              name="message"
              rows="3"
              value={formData.message}
              className={`form-control ${errors.message ? "is-invalid" : ""}`}
              onChange={handleChange}
            ></textarea>
            {errors.message && <div className="invalid-feedback">{errors.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Overall Feedback Rating (1-5) *</label>
            <div className="d-flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`btn ${formData.feedbackRating >= star ? "btn-warning" : "btn-outline-warning"}`}
                  onClick={() => setFormData({ ...formData, feedbackRating: star })}
                >
                  ★
                </button>
              ))}
            </div>
            {errors.feedbackRating && (
              <div className="invalid-feedback d-block">{errors.feedbackRating}</div>
            )}
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4 me-2">
              Submit
            </button>
            <button type="button" className="btn btn-secondary px-4" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Floating Chat Assistant with Q&A */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
        <button
          className="btn btn-info rounded-circle"
          style={{ width: "60px", height: "60px" }}
          onClick={() => setShowChat(!showChat)}
        >
          💬
        </button>

        {showChat && (
          <div className="card shadow p-3 mt-2" style={{ width: "300px", maxHeight: "400px", overflowY: "auto" }}>
            <h6 className="mb-2">Chat Assistant</h6>
            <div className="chat-box mb-2" style={{ maxHeight: "250px", overflowY: "auto" }}>
              {chatHistory.map((chat, index) => (
                <div key={index} className={`mb-1 text-${chat.from === "user" ? "end" : "start"}`}>
                  <span className={`badge ${chat.from === "user" ? "bg-primary" : "bg-secondary"}`}>
                    {chat.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Ask a question..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
              />
              <button className="btn btn-sm btn-success" onClick={handleChatSend}>
                Send
              </button>
            </div>

            <div className="text-end mt-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowChat(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

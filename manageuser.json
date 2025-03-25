import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ManageFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:8070/feedback");
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this feedback?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:8070/feedback/${id}`, { method: "DELETE" });
      setFeedbacks(feedbacks.filter((fb) => fb._id !== id));
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Feedback Report", 14, 15);

    const headers = [["Name", "Email", "Phone", "Type", "Subject", "Message"]];
    const body = filteredFeedbacks.map((fb) => [
      fb.name,
      fb.email,
      fb.phone,
      fb.type,
      fb.subject,
      fb.message,
    ]);

    doc.autoTable({ head: headers, body, startY: 20 });
    doc.save("feedback_report.pdf");
  };

  const filteredFeedbacks = feedbacks.filter(
    (fb) =>
      fb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Manage Feedbacks</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-primary" onClick={generatePDF}>
            Generate Report
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map((fb) => (
              <tr key={fb._id}>
                <td>{fb.name}</td>
                <td>{fb.email}</td>
                <td>{fb.phone}</td>
                <td>{fb.type}</td>
                <td>{fb.subject}</td>
                <td>{fb.message}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => navigate(`/update-feedback/${fb._id}`)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(fb._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredFeedbacks.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No feedbacks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

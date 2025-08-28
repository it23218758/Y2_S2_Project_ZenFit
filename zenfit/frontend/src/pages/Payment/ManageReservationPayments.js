import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link, useNavigate } from "react-router-dom";

const ManageReservationPayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:8070/reservation-payment");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching reservation payments:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this reservation payment?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8070/reservation-payment/${id}`);
      fetchPayments();
    } catch (error) {
      console.error("Error deleting reservation payment:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF("portrait");
    doc.text("Reservation Payments Report", 14, 20);
    const headers = [["Cardholder Name", "Card Number", "Amount", "Status", "Paid At"]];
    const data = payments.map((p) => [
      p.cardName,
      p.cardNumberMasked,
      `Rs ${p.amount}`,
      p.status,
      new Date(p.paidAt).toLocaleString(),
    ]);
    doc.autoTable({ head: headers, body: data, startY: 30 });
    doc.save("reservation_payments_report.pdf");
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cardNumberMasked.includes(searchTerm) ||
      p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Manage Reservation Payments</h2>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by card name, masked number, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={generatePDF}>
          Generate PDF
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-success">
          <tr>
            <th>Cardholder Name</th>
            <th>Card Number</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Paid At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((p) => (
            <tr key={p._id}>
              <td>{p.cardName}</td>
              <td>{p.cardNumberMasked}</td>
              <td>Rs {p.amount}</td>
              <td>{p.status}</td>
              <td>{new Date(p.paidAt).toLocaleString()}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredPayments.length === 0 && (
        <p className="text-center text-muted">No reservation payments found.</p>
      )}
    </div>
  );
};

export default ManageReservationPayments;

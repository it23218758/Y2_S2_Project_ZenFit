import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link, useNavigate } from "react-router-dom";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:8070/payment");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this payment?"
    );
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:8070/payment/${id}`);
      fetchPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF("portrait");
    doc.text("Payment Report", 14, 20);
    const headers = [
      ["Card Name", "Card Number", "Item", "Price", "Qty", "Total"],
    ];
    const data = payments.map((p) => [
      p.paymentDetails.cardName,
      p.paymentDetails.cardNumber,
      p.itemDetails.name,
      p.itemDetails.price,
      p.itemDetails.quantity,
      p.itemDetails.total,
    ]);
    doc.autoTable({ head: headers, body: data, startY: 30 });
    doc.save("payment_report.pdf");
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.paymentDetails.cardName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      p.itemDetails.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Manage Payments</h2>
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by card name or item..."
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
            <th>Card Name</th>
            <th>Card Number</th>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Net Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((p) => (
            <tr key={p._id}>
              <td>{p.paymentDetails.cardName}</td>
              <td>{p.paymentDetails.cardNumber}</td>
              <td>{p.itemDetails.name}</td>
              <td>Rs {p.itemDetails.price}</td>
              <td>{p.itemDetails.quantity}</td>
              <td>Rs {p.itemDetails.total}</td>
              <td>Rs {p.itemDetails.netTotal}</td>
              <td>
                <Link
                  to={`/update-payment/${p._id}`}
                  className="btn btn-warning btn-sm me-2"
                >
                  Update
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredPayments.length === 0 && (
        <p className="text-center text-muted">No payments found.</p>
      )}
    </div>
  );
};

export default ManagePayments;

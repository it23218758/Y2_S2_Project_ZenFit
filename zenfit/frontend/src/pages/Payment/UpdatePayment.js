import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCreditCard, FaUser, FaCalendarAlt, FaLock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UpdatePayment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    name: "",
    price: 0,
    quantity: 0,
    total: 0,
    netTotal: 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await fetch(`http://localhost:8070/payment/${id}`);
        const data = await response.json();
        setFormData({
          cardName: data.paymentDetails.cardName,
          cardNumber: data.paymentDetails.cardNumber,
          name: data.itemDetails.name,
          price: data.itemDetails.price,
          quantity: data.itemDetails.quantity,
          total: data.itemDetails.total,
          netTotal: data.itemDetails.netTotal,
        });
      } catch (err) {
        console.error("Error fetching payment:", err);
      }
    };
    fetchPayment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    // Update related fields based on which one changed
    if (name === "price" || name === "quantity") {
      const price = parseFloat(name === "price" ? value : formData.price);
      const quantity = parseInt(name === "quantity" ? value : formData.quantity);
      updatedForm.total = price * quantity;
      updatedForm.netTotal = price * quantity;
    }

    if (name === "total") {
      const quantity = parseInt(formData.quantity);
      const price = quantity !== 0 ? parseFloat(value) / quantity : 0;
      updatedForm.price = price;
      updatedForm.netTotal = parseFloat(value);
    }

    if (name === "netTotal") {
      updatedForm.netTotal = parseFloat(value);
    }

    setFormData(updatedForm);
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Item name is required.";
    if (formData.total <= 0) newErrors.total = "Total must be greater than 0.";
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const updatedData = {
      cardName: formData.cardName,
      cardNumber: formData.cardNumber,
      item: {
        name: formData.name,
        price: formData.price,
        quantity: formData.quantity,
        total: formData.total,
        netTotal: formData.netTotal,
      },
    };

    try {
      const response = await fetch(`http://localhost:8070/payment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("Payment updated successfully!");
        navigate("/manage-payments");
      } else {
        const error = await response.json();
        alert(error?.error || "Update failed. Please try again.");
      }
    } catch (err) {
      console.error("Error updating payment:", err);
      alert("Server error. Please try later.");
    }
  };

  return (
    <div className="container col-12 col-lg-4 my-5">
      <h2 className="text-center mb-4">Update Payment Details</h2>

      <div className="card p-4 shadow text-start">
        <h5 className="mb-3">Item: {formData.name}</h5>
        <p><strong>Cardholder:</strong> {formData.cardName}</p>
        <p><strong>Card Number:</strong> {formData.cardNumber}</p>

        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-3">
            <label className="form-label">Item Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Total</label>
            <input
              type="number"
              className={`form-control ${errors.total ? "is-invalid" : ""}`}
              name="total"
              value={formData.total}
              onChange={handleChange}
            />
            {errors.total && <div className="invalid-feedback">{errors.total}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Net Total</label>
            <input
              type="number"
              className="form-control"
              name="netTotal"
              value={formData.netTotal}
              onChange={handleChange}
            />
          </div>

          <div className="text-center">
            <button className="btn btn-success" type="submit">
              Update Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
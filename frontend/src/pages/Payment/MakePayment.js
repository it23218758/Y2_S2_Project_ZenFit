import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCreditCard, FaUser, FaCalendarAlt, FaLock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MakePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cardName.trim())
      newErrors.cardName = "Cardholder name is required.";
    if (!/^\d{16}$/.test(formData.cardNumber))
      newErrors.cardNumber = "Card number must be 16 digits.";
    if (!/^\d{2}\/\d{2}$/.test(formData.expiry))
      newErrors.expiry = "Expiry must be in MM/YY format.";
    if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = "CVV must be 3 digits.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        paymentDetails: {
          cardName: formData.cardName,
          cardNumber: formData.cardNumber, // Full 16 digits, masking is handled in backend
        },
        itemDetails: {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
          netTotal: item.total, // You can adjust netTotal if discounts/taxes apply
        },
      };

      const response = await fetch("http://localhost:8070/payment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Payment successful!");
        navigate("/");
      } else {
        const error = await response.json();
        alert(error?.error || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting payment:", err);
      alert("Server error. Please try later.");
    }
  };

  if (!item) {
    return <div className="text-center mt-5">No item to purchase.</div>;
  }

  return (
    <div className="container col-12 col-lg-4 my-5">
      <h2 className="text-center mb-4">Complete Your Payment</h2>

      <div className="card p-4 shadow text-start">
        <h5 className="mb-3">Item: {item.name}</h5>
        <p>
          <strong>Price:</strong> Rs {item.price}
        </p>
        <p>
          <strong>Quantity:</strong> {item.quantity}
        </p>
        <p>
          <strong>Total:</strong> Rs {item.total}
        </p>

        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-3">
            <label className="form-label">
              <FaUser className="me-2" /> Cardholder Name
            </label>
            <input
              type="text"
              className={`form-control ${errors.cardName ? "is-invalid" : ""}`}
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
            />
            {errors.cardName && (
              <div className="invalid-feedback">{errors.cardName}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FaCreditCard className="me-2" /> Card Number
            </label>
            <input
              type="text"
              maxLength="16"
              className={`form-control ${
                errors.cardNumber ? "is-invalid" : ""
              }`}
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
            />
            {errors.cardNumber && (
              <div className="invalid-feedback">{errors.cardNumber}</div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <FaCalendarAlt className="me-2" /> Expiry (MM/YY)
              </label>
              <input
                type="text"
                className={`form-control ${errors.expiry ? "is-invalid" : ""}`}
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
              />
              {errors.expiry && (
                <div className="invalid-feedback">{errors.expiry}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                <FaLock className="me-2" /> CVV
              </label>
              <input
                type="password"
                maxLength="3"
                className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
              />
              {errors.cvv && (
                <div className="invalid-feedback">{errors.cvv}</div>
              )}
            </div>
          </div>

          <div className="text-center">
            <button className="btn btn-success" type="submit">
              Pay Rs {item.total}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

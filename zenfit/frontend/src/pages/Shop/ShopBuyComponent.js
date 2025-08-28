import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ShopBuyComponent() {
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8070/shop")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error("Invalid data format");
        }
      })
      .catch((err) => console.error("Error fetching shop items:", err));
  }, []);

  const handleQuantityChange = (itemId, value) => {
    let numericValue = parseInt(value);
    let isValid = true;

    if (isNaN(numericValue) || numericValue < 1) {
      numericValue = 1;
      isValid = false;
    }

    setQuantities((prev) => ({
      ...prev,
      [itemId]: numericValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [itemId]: !isValid,
    }));
  };

  const handleBuyNow = (item) => {
    const quantity = quantities[item._id] || 1;

    // Check if item is in stock
    if (item.quantityInStock === 0) {
      alert(`"${item.name}" is currently out of stock.`);
      return;
    }

    // Check for quantity validity
    if (isNaN(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
      alert("Please enter a valid quantity (positive whole number).");
      return;
    }

    if (quantity > item.quantityInStock) {
      alert(
        `Only ${item.quantityInStock} item(s) of "${item.name}" are available in stock.`
      );
      return;
    }

    // Proceed to payment
    navigate("/make-payment", {
      state: {
        item: {
          name: item.name,
          price: item.price,
          quantity,
          total: item.price * quantity,
        },
      },
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Shop Our Gym Accessories</h2>
      <div className="row">
        {items.map((item) => (
          <div className="col-md-4 mb-4" key={item._id}>
            <div className="card h-100 text-start">
              {item.imageUrl ? (
                <img
                  src={`http://localhost:8070${item.imageUrl}`}
                  className="card-img-top"
                  alt={item.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              ) : (
                <div className="text-center p-5">No Image</div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
                <p className="card-text fw-bold">Rs {item.price}</p>
                <div className="mt-auto d-flex justify-content-center align-items-center">
                  <input
                    type="number"
                    min="1"
                    value={quantities[item._id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(item._id, e.target.value)
                    }
                    className={`form-control me-2 ${
                      errors[item._id] ? "is-invalid" : ""
                    }`}
                    style={{ width: "80px" }}
                  />
                  <button
                    className="btn btn-success"
                    onClick={() => handleBuyNow(item)}
                    disabled={item.quantityInStock === 0}
                  >
                    Buy Now
                  </button>
                </div>
                {errors[item._id] && (
                  <div className="text-danger small mt-1">
                    Quantity must be a positive whole number.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

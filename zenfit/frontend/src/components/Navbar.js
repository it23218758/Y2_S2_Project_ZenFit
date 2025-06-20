import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/zenfit_logo.png";
import { decodeJWT } from "../utils/decodeJWT";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found");
      return;
    }

    const decoded = decodeJWT(token);

    if (decoded) {
      const { userId, role, firstname, lastname } = decoded;
      setUser({ userId, role, firstname, lastname });
    } else {
      localStorage.clear();
    }
  }, []);

  return (
    // Inside the return
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand">
          <img
            src={logo}
            alt="ZenFit Logo"
            className="img-fluid"
            style={{ maxWidth: "150px" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center text-center"
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link
                className="nav-link text-dark fw-medium text-uppercase"
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-dark fw-medium text-uppercase"
                to="/make-reservation"
              >
                Make a Reservation
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-dark fw-medium text-uppercase"
                to="/contact-us"
              >
                Contact Us
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-dark fw-medium text-uppercase"
                to="/shop"
              >
                Shop
              </Link>
            </li>
          </ul>

          <div className="d-flex justify-content-center align-items-center mt-3 mt-md-0">
            {user ? (
              <Link to="/userprofile">
                <button className="btn btn-success">Profile</button>
              </Link>
            ) : (
              <Link to="/signin">
                <button className="btn btn-success">Sign In</button>
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin-dashboard">
                <button className="btn btn-success mx-2">Dashboard</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

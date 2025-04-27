import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SideBar() {
  return (
    <div
      className="bg-success text-light py-5 px-3 h-100"
      style={{ minHeight: "80vh" }}
    >
      <b>
        <div className="col-12 py-1 d-flex justify-content-center">
          <div className="col-12 py-1 bg-light rounded">
            <Link to="/admin-dashboard" className="btn text-success">
              Manage Trainers
            </Link>
          </div>
        </div>
        <div className="col-12 py-1 d-flex justify-content-center">
          <div className="col-12 py-1 bg-light rounded">
            <Link to="/manage-users" className="btn text-success">
              Manage Users
            </Link>
          </div>
        </div>
        <div className="col-12 py-1 d-flex justify-content-center">
          <div className="col-12 py-1 bg-light rounded">
            <Link to="/all-reservations" className="btn text-success">
             Manage Reservations
            </Link>
          </div>
        </div>
        <div className="col-12 py-1 d-flex justify-content-center">
          <div className="col-12 py-1 bg-light rounded">
            <Link to="/manage-reservation-payments" className="btn text-success">
             Manage Reservation Payments
            </Link>
          </div>
        </div>
        <div className="col-12 py-1 d-flex justify-content-center">
          <div className="col-12 py-1 bg-light rounded">
            <Link to="/manage-shop" className="btn text-success">
              Manage Shop
            </Link>
          </div>
        </div>
        <div className="col-12 py-1 d-flex justify-content-center">
          <div className="col-12 py-1 bg-light rounded">
            <Link to="/manage-payments" className="btn text-success">
              Manage Payments
            </Link>
          </div>
        </div>
        <div className="col-12 py-1 d-flex justify-content-center">
          <div className="col-12 py-1 bg-light rounded">
            <Link to="/manage-feedbacks" className="btn text-success">
              Manage Feedbacks
            </Link>
          </div>
        </div>
      </b>
    </div>
  );
}

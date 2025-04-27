import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import c2 from "../../images/hero1.jpg";

export default function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!token || !storedUserId) {
      alert("Please login to view your reservations.");
      navigate("/signin");
      return;
    }

    setUserId(storedUserId);

    fetch(`http://localhost:8070/reservations/user/${storedUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch((error) => {
        console.error("Error fetching reservations:", error);
        alert("Could not fetch your reservations.");
      });
  }, [navigate]);

  return (
    <div
      className="py-5"
      style={{
        backgroundImage: `url(${c2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <div className="container">
        <h2 className="text-center mb-4 fw-bold ">My Reservations</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {reservations.length === 0 ? (
            <p className="text-white text-center">No reservations found.</p>
          ) : (
            reservations.map((res) => (
              <div className="col" key={res._id}>
                <div className="card shadow-lg border-0">
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-success">
                      {res.trainerId?.firstname} {res.trainerId?.lastname}
                    </h5>
                    <p className="card-text mb-1">
                      <strong>Date:</strong> {new Date(res.sessionDate).toLocaleDateString()}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Time:</strong> {res.sessionTime}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Status:</strong> <span className="badge bg-info text-dark">{res.status}</span>
                    </p>
                    {res.notes && (
                      <p className="card-text">
                        <strong>Notes:</strong> {res.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

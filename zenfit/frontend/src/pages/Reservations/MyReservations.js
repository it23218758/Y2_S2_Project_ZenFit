import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import c2 from "../../images/hero1.jpg";

export default function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        alert("Please login to view your reservations.");
        navigate("/signin");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8070/reservations/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            alert("Session expired. Please login again.");
            navigate("/signin");
          } else {
            throw new Error("Failed to fetch reservations.");
          }
          return;
        }

        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        alert(error.message || "Could not fetch your reservations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
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
        <h2 className="text-center mb-4 fw-bold">My Reservations</h2>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {reservations.length === 0 ? (
              <div className="col-12">
                <p className="text-center fs-5">No reservations found.</p>
              </div>
            ) : (
              reservations.map((res) => (
                <div className="col" key={res._id}>
                  <div
                    className="card shadow-lg border-0 h-100"
                    style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                  >
                    <div className="card-body text-dark">
                      <h5 className="card-title fw-bold text-success">
                        {res.trainerId?.firstname || "Trainer"}{" "}
                        {res.trainerId?.lastname || ""}
                      </h5>
                      <p className="card-text mb-1">
                        <strong>Date:</strong>{" "}
                        {res.sessionDate
                          ? new Date(res.sessionDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Time:</strong> {res.sessionTime || "N/A"}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Status:</strong>{" "}
                        <span className="badge bg-info text-dark">
                          {res.status || "Pending"}
                        </span>
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
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import c4 from "../../images/hero3.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const styles = {
  container: {
    display: "grid",
    placeItems: "center",
    height: "100vh",
    background: `url(${c4})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "bottom",
  },
  formContainer: {
    backgroundColor: "#ffffffa1",
    backdropFilter: "blur(10px)",
    border: "2px solid #ffffff6d",
    borderRadius: "10px",
    boxShadow: "3px 3px 11px 1.5px #0000002b",
    padding: "10px",
    height: "max-content",
  },
  heading: {
    padding: "20px",
    color: "black",
    fontSize: "2.1rem",
    fontWeight: 800,
    gridColumn: "1/span 2",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },
};

export default function UserProfile() {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    if (!token) {
      console.error("JWT token not found in localStorage");
      navigate("/signin");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8070/user/get/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else if (response.status === 401) {
        alert("Session expired. Please log in again.");
        handleLogout();
      } else {
        console.error("Failed to fetch user profile data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/signin");
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.imgContainer}></div>
          <div style={styles.form} className="text-start">
            <div className="col-12 d-flex justify-content-end">
              <Link to="/my-reservations" className="btn btn-success">
                My Reservations
              </Link>
              <Link to="/edit-profile" className="btn btn-primary mx-2">
                Edit Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-danger mx-2">
                <FaSignOutAlt className="font-weight-bold" /> Logout
              </button>
            </div>
            <h1 style={styles.heading}>User Profile</h1>
            <div style={styles.name}>
              <p>
                <strong>First Name:</strong> {userData.firstname}
              </p>
              <p>
                <strong>Last Name:</strong> {userData.lastname}
              </p>
            </div>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Phone No:</strong> {userData.contact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

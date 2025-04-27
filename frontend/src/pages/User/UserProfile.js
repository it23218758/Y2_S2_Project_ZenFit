import React, { useState, useEffect } from "react";
import c4 from "../../images/hero3.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaCalculator } from "react-icons/fa";

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
    width: "400px",
  },
  heading: {
    padding: "20px",
    color: "black",
    fontSize: "2.1rem",
    fontWeight: 800,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
};

export default function UserProfile() {
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState("");
  const [showBmiModal, setShowBmiModal] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }
    setUserId(userId);
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

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (!weightNum || !heightNum || heightNum <= 0) {
      alert("Please enter valid weight and height!");
      return;
    }

    const bmiValue = (weightNum / (heightNum * heightNum)).toFixed(2);
    setBmi(bmiValue);

    if (bmiValue < 18.5) setBmiCategory("Underweight");
    else if (bmiValue >= 18.5 && bmiValue < 24.9) setBmiCategory("Normal Weight");
    else if (bmiValue >= 25 && bmiValue < 29.9) setBmiCategory("Overweight");
    else setBmiCategory("Obese");
  };

  const resetBMI = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setBmiCategory("");
  };

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.form} className="text-start">
            <div className="d-flex justify-content-end">
              <Link to="/my-reservations" className="btn btn-success">
                My Reservations
              </Link>
              <Link to={`/edit-profile/${userId}`} className="btn btn-primary mx-2">
                Edit Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-danger mx-2">
                <FaSignOutAlt className="font-weight-bold" /> Logout
              </button>
            </div>
            <h1 style={styles.heading}>User Profile</h1>
            <p><strong>First Name:</strong> {userData.firstname}</p>
            <p><strong>Last Name:</strong> {userData.lastname}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone No:</strong> {userData.contact}</p>

            {/* BMI Button */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button 
                className="btn btn-warning" 
                onClick={() => {
                  setShowBmiModal(true);
                  resetBMI();
                }}
              >
                <FaCalculator /> Calculate BMI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BMI Modal */}
      {showBmiModal && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            setShowBmiModal(false);
            resetBMI();
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              width: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>BMI Calculator</h3>
            <input
              type="number"
              placeholder="Enter weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="form-control mb-2"
            />
            <input
              type="number"
              placeholder="Enter height (m)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="form-control mb-2"
            />
            <button className="btn btn-success" onClick={calculateBMI}>
              Calculate
            </button>
            {bmi && (
              <div style={{ marginTop: "10px" }}>
                <p><strong>BMI:</strong> {bmi}</p>
                <p><strong>Category:</strong> {bmiCategory}</p>
              </div>
            )}
            <button 
              className="btn btn-danger mt-2" 
              onClick={() => {
                setShowBmiModal(false);
                resetBMI();
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
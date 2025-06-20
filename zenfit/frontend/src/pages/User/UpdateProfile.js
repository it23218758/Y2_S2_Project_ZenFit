import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "bootstrap/js/dist/modal";
import c4 from "../../images/hero3.jpg";
import c2 from "../../images/hero1.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

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
    display: "grid",
    gridTemplateColumns: "50% 50%",
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
  name: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 50%)",
  },
  listItem: {
    listStyleType: "none",
    display: "flex",
    flexDirection: "column",
    padding: "0px 5px",
    textAlign: "left",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: 600,
    padding: "5px 15px",
    color: "black",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ffffff6d",
    width: "100%",
    outline: "none",
    color: "black",
    marginBottom: "10px",
  },
};

export default function UpdateProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
  });
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setModalMessage("Unauthorized. Please log in again.");
        setIsError(true);
        const modal = new Modal(document.getElementById("feedbackModal"));
        modal.show();
        return;
      }

      try {
        const response = await fetch(`http://localhost:8070/user/get/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstname: data.firstname || "",
            lastname: data.lastname || "",
            email: data.email || "",
            contact: data.contact || "",
          });
        } else {
          setModalMessage("Failed to fetch user data.");
          setIsError(true);
          const modal = new Modal(document.getElementById("feedbackModal"));
          modal.show();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const validateForm = () => {
    const { firstname, lastname, email, contact } = formData;

    if (!firstname || !lastname || !email || !contact) {
      setModalMessage("All fields are required.");
      setIsError(true);
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setModalMessage("Invalid email format.");
      setIsError(true);
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contact)) {
      setModalMessage("Phone number must be 10 digits.");
      setIsError(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const modal = new Modal(document.getElementById("feedbackModal"));
      modal.show();
      return;
    }

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8070/user/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setModalMessage("Profile updated successfully!");
        setIsError(false);
        const modal = new Modal(document.getElementById("feedbackModal"));
        modal.show();
      } else {
        setModalMessage("Failed to update profile.");
        setIsError(true);
        const modal = new Modal(document.getElementById("feedbackModal"));
        modal.show();
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div style={styles.container}>
        <div
          style={styles.formContainer}
          className="content-center d-flex justify-content-center align-items-center"
        >
          <form style={styles.form} onSubmit={handleSubmit}>
            <h1 style={styles.heading}>Update Profile</h1>
            <div style={styles.name}>
              <li style={styles.listItem}>
                <label style={styles.label}>First Name:</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  placeholder="First"
                  style={styles.input}
                  onChange={handleInputChange}
                />
              </li>
              <li style={styles.listItem}>
                <label style={styles.label}>Last Name:</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  placeholder="Last"
                  style={styles.input}
                  onChange={handleInputChange}
                />
              </li>
            </div>
            <li style={styles.listItem}>
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                style={styles.input}
                onChange={handleInputChange}
              />
            </li>
            <li style={styles.listItem}>
              <label style={styles.label}>Phone No:</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                placeholder="Phone Number"
                style={styles.input}
                onChange={handleInputChange}
              />
            </li>
            <button type="submit" className="btn btn-primary mt-2">
              Update
            </button>
          </form>
        </div>
      </div>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="feedbackModal"
        tabIndex="-1"
        aria-labelledby="feedbackModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content ${isError ? "border-danger" : "border-success"}`}>
            <div className={`modal-header ${isError ? "bg-danger" : "bg-success"}`}>
              <h5 className="modal-title text-white" id="feedbackModalLabel">
                {isError ? "Error" : "Success"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{modalMessage}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  if (!isError) navigate("/userprofile");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

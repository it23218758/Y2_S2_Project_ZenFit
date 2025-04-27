import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { decodeJWT } from "../utils/decodeJWT";
import c4 from "../images/hero3.jpg";
import c2 from "../images/hero1.jpg";

const styles = {
    container: {
        display: 'grid',
        placeItems: 'center',
        height: '100vh',
        background: `url(${c4})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
    },
    formContainer: {
        backgroundColor: '#ffffffa1',
        backdropFilter: 'blur(10px)',
        border: '2px solid #ffffff6d',
        borderRadius: '10px',
        boxShadow: '3px 3px 11px 1.5px #0000002b',
        padding: '10px',
        height: 'max-content',
        display: 'grid',
        gridTemplateColumns: '50% 50%',
    },
    heading: {
        padding: '20px',
        color: 'black',
        fontSize: '2.1rem',
        fontWeight: 800,
        gridColumn: '1/span 2',
    },
    imgContainer: {
        overflow: 'hidden',
        borderRadius: '10px',
        background: `url(${c2})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
    },
    listItem: {
        listStyleType: 'none',
        display: 'flex',
        flexDirection: 'column',
        padding: '0px 5px',
        textAlign: 'left',
    },
    label: {
        fontSize: '0.8rem',
        fontWeight: 600,
        width: '100%',
        padding: '5px 15px',
        color: 'black',
    },
    input: {
        padding: '10px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#ffffff6d',
        width: '100%',
        outline: 'none',
        color: 'black',
        marginBottom: '10px',
    },
    errorMessage: {
        color: 'red',
        fontSize: '0.9rem',
        textAlign: 'center',
        marginBottom: '10px',
    },
};

export default function SignIn() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [loginError, setLoginError] = useState(""); // 🔴 New state for login error

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setLoginError(""); // Clear login error when typing
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: "", password: "" };

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
            isValid = false;
        }

        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch("http://localhost:8070/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                const { token } = data;
                localStorage.setItem("token", token);

                const decoded = decodeJWT(token);
                if (decoded) {
                    localStorage.setItem("userId", decoded.userId);
                    localStorage.setItem("role", decoded.role);
                    localStorage.setItem("firstname", decoded.firstname);
                    localStorage.setItem("lastname", decoded.lastname);

                    switch (decoded.role) {
                        case "admin":
                            window.location.href = "/admin-dashboard";
                            break;
                        case "trainer":
                            window.location.href = "/trainer-dashboard";
                            break;
                        case "user":
                        default:
                            window.location.href = "/";
                            break;
                    }
                }
            } else {
                setLoginError(data.error || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setLoginError("Something went wrong. Please try again later.");
        }
    };

    return (
        <div>
            <div style={styles.container}>
                <div style={styles.formContainer} className="content-center d-flex justify-content-center align-items-center">
                    <form id="Form" style={styles.form} onSubmit={handleSubmit}>
                        <h1 style={styles.heading}>Sign In</h1>
                        <li style={styles.listItem}>
                            <label style={styles.label}>Email:</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                style={styles.input}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                        </li>
                        <li style={styles.listItem}>
                            <label style={styles.label}>Password:</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                style={styles.input}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
                        </li>

                        {/* 🔴 Show login error if present */}
                        {loginError && <div style={styles.errorMessage}>{loginError}</div>}

                        <button type="submit" className="btn btn-success">
                            Sign In
                        </button>

                        <div className="mt-1 mb-2">
                            <span className="mr-2">Don't have an account?</span>
                            <Link to="/signup">Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

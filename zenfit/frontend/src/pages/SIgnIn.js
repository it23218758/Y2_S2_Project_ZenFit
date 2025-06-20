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
    name: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 50%)',
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
    inputFocused: {
        border: '1px solidrgb(0, 0, 0)',
    },
    select: {
        width: '100%',
    },
    phone: {
        display: 'grid',
        gridTemplateColumns: '35% 65%',
    },
    phoneInput: {
        flex: 1,
        width: '100%',
    },
    subscribe: {
        display: 'flex',
        flexDirection: 'row',
        padding: '10px',
        alignItems: 'center',
    },
    checkBoxCont: {
        width: '25px',
        borderRadius: '5px',
        height: '25px',
        position: 'relative',
        border: '1px solid #25007c',
        transitionDuration: '0.2s',
    },
    checkBoxContHover: {
        backgroundColor: '#00000',
    },
    tickLine: {
        backgroundColor: '#00000', // Updated color
        borderRadius: '20px',
        height: '3px',
        position: 'absolute',
        width: '20px',
        transitionDuration: '0.3s',
        border: 'none',
    },
    tickLine1: {
        transform: 'rotate(-45deg)',
        top: '10px',
        left: '5px',
        opacity: 0,
        width: '18px',
        animation: '1s car linear infinite',
    },
    tickLine2: {
        transform: 'rotate(50deg)',
        top: '12px',
        width: '8px',
        opacity: 0,
        left: '2px',
    },
    subscribeLabel: {
        padding: '10px',
        width: 'fit-content',
    },
    button: {
        width: 'fit-content',
        borderRadius: '5px',
        padding: '10px 20px',
        fontSize: '1.1rem',
        color: 'white',
        backgroundColor: 'black',
        border: 'none',
        cursor: 'pointer',
        margin: 'auto',
    },
};

export default function SignIn() {
    const navigate = useNavigate();
    const userId = getCookie('userId');
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
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
                console.log("Login successful:", data);
    
                const { token } = data;
    
                // Store JWT token once
                localStorage.setItem("token", token);
    
                // Decode JWT to extract user details
                const decoded = decodeJWT(token);
                if (decoded) {
                    localStorage.setItem("userId", decoded.userId);
                    localStorage.setItem("role", decoded.role);
                    localStorage.setItem("firstname", decoded.firstname);
                    localStorage.setItem("lastname", decoded.lastname);
    
                    // 🔹 Redirect based on user role
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
                console.error("Login failed:", data.error);
                alert(data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
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
                        </li>
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
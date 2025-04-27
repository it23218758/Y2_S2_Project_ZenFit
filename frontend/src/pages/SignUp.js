import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    errorMessage: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: '-5px',
        paddingLeft: '15px',
    },
};

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        contact: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        let errors = {};
        if (!formData.firstname.trim()) errors.firstname = "First name is required";
        if (!formData.lastname.trim()) errors.lastname = "Last name is required";

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            errors.email = "Invalid email format";
        }

        if (!formData.contact.trim()) {
            errors.contact = "Phone number is required";
        } else if (!/^\d{10,}$/.test(formData.contact)) {
            errors.contact = "Phone number must contain at least 10 digits";
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!formData.password) {
            errors.password = "Password is required";
        } else if (!passwordRegex.test(formData.password)) {
            errors.password = "Password must have at least 1 uppercase letter, 1 number, and 8+ characters";
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Confirm Password is required";
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await fetch("http://localhost:8070/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                navigate("/signin");
            } else {
                alert("This email is already registered");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer} className="content-center d-flex justify-content-center align-items-center">
                <form id="Form" style={styles.form} onSubmit={handleSubmit}>
                    <h1 style={styles.heading}>Sign Up</h1>
                    <div style={styles.name}>
                        <li style={styles.listItem}>
                            <label style={styles.label}>First Name:</label>
                            <input
                                type="text"
                                name="firstname"
                                placeholder="First"
                                style={styles.input}
                                onChange={handleInputChange}
                            />
                            {errors.firstname && <p style={styles.errorMessage}>{errors.firstname}</p>}
                        </li>
                        <li style={styles.listItem}>
                            <label style={styles.label}>Last Name:</label>
                            <input
                                type="text"
                                name="lastname"
                                placeholder="Last"
                                style={styles.input}
                                onChange={handleInputChange}
                            />
                            {errors.lastname && <p style={styles.errorMessage}>{errors.lastname}</p>}
                        </li>
                    </div>
                    <li style={styles.listItem}>
                        <label style={styles.label}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            style={styles.input}
                            onChange={handleInputChange}
                        />
                        {errors.email && <p style={styles.errorMessage}>{errors.email}</p>}
                    </li>
                    <li style={styles.listItem}>
                        <label style={styles.label}>Phone No:</label>
                        <input
                            type="number"
                            name="contact"
                            placeholder="Phone Number"
                            style={styles.input}
                            onChange={handleInputChange}
                        />
                        {errors.contact && <p style={styles.errorMessage}>{errors.contact}</p>}
                    </li>
                    <li style={styles.listItem}>
                        <label style={styles.label}>Password:</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            style={styles.input}
                            onChange={handleInputChange}
                        />
                        {errors.password && <p style={styles.errorMessage}>{errors.password}</p>}
                    </li>
                    <li style={styles.listItem}>
                        <label style={styles.label}>Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            style={styles.input}
                            onChange={handleInputChange}
                        />
                        {errors.confirmPassword && <p style={styles.errorMessage}>{errors.confirmPassword}</p>}
                    </li>
                    <Link to='/signin'>Already have an account?</Link>
                    <button type="submit" className="btn btn-success">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
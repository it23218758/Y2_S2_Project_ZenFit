import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeJWT } from '../../utils/decodeJWT';

export default function AddTrainer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    specialization: '',
    experience: '',
  });

  const [errors, setErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  // Specialization options
  const specializationOptions = [
    'Strength Training',
    'Cardio Fitness',
    'Yoga',
    'CrossFit',
    'Zumba',
    'Bodybuilding',
    'Weight Loss',
    'Functional Training',
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = decodeJWT(token);

    if (decoded?.role === 'admin') {
      setIsAdmin(true);
    } else {
      alert("Access denied. Only admins can add trainers.");
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
      isValid = false;
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
      isValid = false;
    }

    if (!formData.specialization) {
      newErrors.specialization = 'Please select a specialization';
      isValid = false;
    }

    if (!formData.experience || isNaN(formData.experience) || formData.experience < 0) {
      newErrors.experience = 'Valid experience (in years) is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) return;

    if (validateForm()) {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:8070/trainer/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          navigate('/admin-dashboard');
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Error occurred while adding trainer');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Server error. Please try again.');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow col-lg-7">
        <h3 className="mb-4 text-center">Add Trainer</h3>
        <form noValidate onSubmit={handleSubmit}>
          <div className="row text-start">
            <div className="mb-3 col-md-6">
              <label htmlFor="firstname" className="form-label">First Name</label>
              <input
                type="text"
                className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
              />
              {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
            </div>
            <div className="mb-3 col-md-6">
              <label htmlFor="lastname" className="form-label">Last Name</label>
              <input
                type="text"
                className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
              />
              {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
            </div>
          </div>

          <div className="row text-start">
            <div className="mb-3 col-md-6">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3 col-md-6">
              <label htmlFor="contact" className="form-label">Contact Number</label>
              <input
                type="text"
                className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />
              {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
            </div>
          </div>

          <div className="row text-start">
            <div className="mb-3 col-md-6">
              <label htmlFor="specialization" className="form-label">Specialization</label>
              <select
                className={`form-select ${errors.specialization ? 'is-invalid' : ''}`}
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
              >
                <option value="">Select specialization</option>
                {specializationOptions.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
              {errors.specialization && <div className="invalid-feedback">{errors.specialization}</div>}
            </div>

            <div className="mb-3 col-md-6">
              <label htmlFor="experience" className="form-label">Experience (Years)</label>
              <input
                type="number"
                className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
              />
              {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
            </div>
          </div>

          <div className="text-center">
            <button className="btn btn-success mt-2" type="submit">Add Trainer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

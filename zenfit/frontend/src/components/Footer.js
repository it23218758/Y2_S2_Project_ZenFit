import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faComments, faEnvelope, faDumbbell, faStar, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
    return (
        <footer className="bg-light text-dark py-4">
            <div className="container">
                <div className="row">
                    {/* Membership Section */}
                    <div className="col-md-4 footer-column">
                        <h5 className="text-uppercase fw-bold">ZenFit</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="#">Membership</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="#">Training Programs</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="#">FAQs</a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Section */}
                    <div className="col-md-4 footer-column">
                        <h5 className="text-uppercase fw-bold">Company</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="#">About Us</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="#">Careers</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="#">Blog & News</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Support */}
                    <div className="col-md-4 footer-column">
                        <h5 className="text-uppercase fw-bold">Contact & Support</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <span className="nav-link text-dark">
                                    <FontAwesomeIcon icon={faPhone} className="me-2" /> +1 555 987 6543
                                </span>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="#"><FontAwesomeIcon icon={faComments} className="me-2" /> Live Chat</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="#"><FontAwesomeIcon icon={faEnvelope} className="me-2" /> Contact Us</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="#"><FontAwesomeIcon icon={faStar} className="me-2" /> Give Feedback</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="text-center my-3">
                    <FontAwesomeIcon icon={faEllipsisH} size="lg" />
                </div>

                {/* Copyright and Links */}
                <div className="row text-center">
                    <div className="col-md-6">
                        <span className="fw-light">Copyright &copy; Zenfit {new Date().getFullYear()}</span>
                    </div>
                    <div className="col-md-6">
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <a className="text-dark" href="#">Privacy Policy</a>
                            </li>
                            <li className="list-inline-item">
                                <a className="text-dark" href="#">Terms of Use</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

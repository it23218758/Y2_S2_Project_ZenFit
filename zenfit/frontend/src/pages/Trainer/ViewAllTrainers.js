import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ViewAllTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const cardStyles = {
    boxShadow: "3px 3px 11px 1.5px #0000002b",
    borderRadius: "10px",
    border: "2px solid #ffffff6d",
    backgroundColor: "#ffffffa1",
    padding: "10px",
    height: "max-content",
  };

  const fetchTrainers = async () => {
    try {
      const response = await fetch("http://localhost:8070/trainer/");
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleDelete = async (trainerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8070/trainer/${trainerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setTrainers(trainers.filter((t) => t._id !== trainerId));
        setDeleteConfirmation(null);
      } else {
        console.error("Failed to delete trainer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Trainers Report", 14, 15); // (text, x, y)

    // Table headers and rows
    const headers = [
      [
        "First Name",
        "Last Name",
        "Email",
        "Contact",
        "Specialization",
        "Experience",
      ],
    ];
    const rows = filteredTrainers.map((trainer) => [
      trainer.firstname,
      trainer.lastname,
      trainer.email,
      trainer.contact,
      trainer.specialization,
      trainer.experience + " yrs",
    ]);

    // Table
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 20, // Start after the title
      margin: { horizontal: 10 },
    });

    doc.save("trainers_report.pdf");
  };

  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h3>All Trainers</h3>
      <div className="d-flex justify-content-start col-12">
        <form className="form-inline">
          <div className="row">
            <input
              className="form-control mr-sm-2 col-8"
              type="search"
              placeholder="Search for a Trainer"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-success my-3"
              onClick={generateReport}
            >
              Generate Report
            </button>
          </div>
        </form>
        <div className="row d-flex justify-content-start">
          <Link to="/addTrainer">
            <button className="mx-5 btn btn-success">Add Trainer</button>
          </Link>
        </div>
      </div>

      {filteredTrainers.length === 0 ? (
        <p>No trainers found.</p>
      ) : (
        <div className="row">
          <div className="container-lg py-5">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 cross-card mb-5">
              {filteredTrainers.map((trainer) => (
                <div className="col" key={trainer._id}>
                  <div className="card shadow-sm h-100" style={cardStyles}>
                    <div className="card-body">
                      <h5 className="card-title text-start">
                        {trainer.firstname} {trainer.lastname}
                      </h5>
                      <table className="table table-sm table-borderless mb-0">
                        <tbody>
                          <tr>
                            <th
                              scope="row"
                              className="w-50 text-start align-top"
                            >
                              Email
                            </th>
                            <td
                              className="text-start"
                              style={{
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                maxWidth: "160px",
                              }}
                            >
                              {trainer.email}
                            </td>
                          </tr>
                          <tr>
                            <th scope="row" className="text-start align-top">
                              Contact
                            </th>
                            <td
                              className="text-start"
                              style={{
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {trainer.contact}
                            </td>
                          </tr>
                          <tr>
                            <th scope="row" className="text-start align-top">
                              Specialization
                            </th>
                            <td
                              className="text-start"
                              style={{
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {trainer.specialization}
                            </td>
                          </tr>
                          <tr>
                            <th scope="row" className="text-start align-top">
                              Experience
                            </th>
                            <td className="text-start">
                              {trainer.experience} years
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="card-footer d-flex justify-content-center">
                      <Link
                        to={`/updateTrainer/${trainer._id}`}
                        className="btn btn-success mx-2"
                      >
                        Update
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => setDeleteConfirmation(trainer._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delete confirmation modal */}
          {deleteConfirmation && (
            <div
              className="modal"
              tabIndex="-1"
              role="dialog"
              style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-body">
                    <p>Are you sure you want to delete this trainer?</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setDeleteConfirmation(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(deleteConfirmation)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

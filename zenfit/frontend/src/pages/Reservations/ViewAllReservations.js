import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileDownload,
  faTrash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link, useNavigate } from "react-router-dom";

export default function ViewAllReservations() {
  const [columns, setColumns] = useState([]);
  const [reservationData, setReservationData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to view reservations.");
      navigate("/signin");
      return;
    }

    axios
      .get("http://localhost:8070/reservations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.length > 0) {
          setColumns(Object.keys(res.data[0]));
        }
        setReservationData(res.data);
      })
      .catch((err) => {
        alert(err.response?.data?.error || err.message);
      });
  }, [navigate]);

  const filteredData = reservationData.filter((data) => {
    const fullName = `${data.userId?.firstname || ""} ${
      data.userId?.lastname || ""
    }`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  function generateReport() {
    const doc = new jsPDF({ orientation: "landscape" });

    const headers = [
      "Reservation ID",
      "User Name",
      "Trainer Name",
      "Specialization",
      "Session Date",
      "Session Time",
      "Status",
      "Notes",
      "Created At",
    ];

    const rows = filteredData.map((data) => [
      data._id,
      `${data.userId?.firstname || ""} ${data.userId?.lastname || ""}`,
      `${data.trainerId?.firstname || ""} ${data.trainerId?.lastname || ""}`,
      data.trainerId?.specialization || "",
      data.sessionDate,
      data.sessionTime,
      data.status,
      data.notes || "-",
      new Date(data.createdAt).toLocaleString(),
    ]);

    doc.text("Reservations Report", 14, 15);

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [0, 128, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { cellWidth: 45 },
        8: { cellWidth: 40 },
      },
    });

    doc.save("reservations_report.pdf");
  }

  const handleDeleteClick = (data) => {
    setSelectedReservation(data);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    const token = localStorage.getItem("token");
    if (!selectedReservation || !token) return;

    axios
      .delete(`http://localhost:8070/reservations/${selectedReservation._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setReservationData(
          reservationData.filter((data) => data._id !== selectedReservation._id)
        );
        setDeleteModalVisible(false);
        setSelectedReservation(null);
      })
      .catch((error) => {
        console.error(error);
        alert("Error deleting reservation record.");
      });
  };

  return (
    <>
      <div className="container justify-content-start mt-5">
        <h1 className="text-center">All Reservations</h1>
        {/* <div className="input-group mb-4 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by User's name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="btn btn-success" type="button">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div> */}
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>User</th>
              <th>Trainer</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((data, index) => (
              <tr key={index}>
                <td>
                  {data.userId?.firstname} {data.userId?.lastname}
                </td>
                <td>
                  {data.trainerId?.firstname} {data.trainerId?.lastname}
                </td>
                <td>{data.trainerId?.specialization}</td>
                <td>{new Date(data.sessionDate).toLocaleDateString()}</td>

                <td>{data.sessionTime}</td>
                <td>{data.status}</td>
                <td>{data.notes || "-"}</td>
                <td>{new Date(data.createdAt).toLocaleString()}</td>
                <td>
                  <Link
                    to={`/update-reservation/${data._id}`}
                    className="btn btn-success me-2 mt-1"
                  >
                    Update
                  </Link>
                  <button
                    className="btn btn-danger mt-1"
                    onClick={() => handleDeleteClick(data)}
                  >
                    Delete
                  </button>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-success" onClick={generateReport}>
          Download Report <FontAwesomeIcon icon={faFileDownload} />
        </button>
      </div>

      {deleteModalVisible && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setDeleteModalVisible(false);
                    setSelectedReservation(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this reservation?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setDeleteModalVisible(false);
                    setSelectedReservation(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

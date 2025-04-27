import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8070/user", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8070/user/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8070/user/update/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          firstname: selectedUser.firstname,
          lastname: selectedUser.lastname,
          email: selectedUser.email,
          contact: selectedUser.contact,
          role: selectedUser.role}),
      });
      if (res.ok) {
        fetchUsers();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("User Report", 14, 15);
    doc.autoTable({
      head: [["First Name", "Last Name", "Email", "Contact", "Role"]],
      body: users.map((u) => [u.firstname, u.lastname, u.email, u.contact, u.role]),
      startY: 20,
    });
    doc.save("user_report.pdf");
  };

  const filteredUsers = users.filter((u) =>
    [u.firstname, u.lastname, u.email, u.role]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Manage Users</h2>
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-primary" onClick={generatePDF}>Generate Report</button>
        </div>
      </div>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.contact}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleUpdateClick(user)}>Update</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update User</h5>
                <button className="btn-close" onClick={() => setSelectedUser(null)}></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  value={selectedUser.firstname}
                  onChange={(e) => setSelectedUser({ ...selectedUser, firstname: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  value={selectedUser.lastname}
                  onChange={(e) => setSelectedUser({ ...selectedUser, lastname: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  value={selectedUser.contact}
                  onChange={(e) => setSelectedUser({ ...selectedUser, contact: e.target.value })}
                />
                <div>
                  <button
                    className={`btn btn-sm me-2 ${selectedUser.role === 'user' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedUser({ ...selectedUser, role: 'user' })}
                  >
                    User
                  </button>
                
                  <button
                    className={`btn btn-sm ${selectedUser.role === 'admin' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedUser({ ...selectedUser, role: 'admin' })}
                  >
                    Admin
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleUpdate}>Save Changes</button>
                <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
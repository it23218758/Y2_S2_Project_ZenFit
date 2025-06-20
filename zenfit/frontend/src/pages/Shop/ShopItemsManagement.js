// ShopItemsManagement.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Table, Spinner } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ShopItemsManagement = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantityInStock: 0,
    price: 0,
    description: "",
    image: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editItemId, setEditItemId] = useState(null);

  const categoryOptions = [
    "Dumbbells",
    "Yoga Mats",
    "Resistance Bands",
    "Treadmills",
    "Supplements",
    "Gloves",
    "Fitness Apparel",
    "Others",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8070/shop/");
      const data = await response.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error("Data fetched is not an array:", data);
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      name: "",
      category: "",
      quantityInStock: 0,
      price: 0,
      description: "",
      image: null,
    });
    setEditItemId(null);
  };

  const handleShow = () => setShowModal(true);

  const handleSubmit = async () => {
    const { name, category, quantityInStock, price, description, image } =
      formData;
    const errors = {};

    // Name Validation
    if (!name || name.trim().length < 3) {
      errors.name = "Name is required and must be at least 3 characters.";
    }

    // Category Validation
    if (!category) {
      errors.category = "Please select a category.";
    }

    // Quantity Validation
    const quantity = parseInt(quantityInStock);
    if (isNaN(quantity) || quantity < 0) {
      errors.quantityInStock = "Quantity must be a whole number ≥ 0.";
    }

    // Price Validation
    const priceVal = parseFloat(price);
    if (isNaN(priceVal) || priceVal <= 0) {
      errors.price = "Price must be greater than 0.";
    }

    // Description (Optional - can be trimmed or validated if needed)

    // Image Validation
    if (!editItemId && !image) {
      errors.image = "Image is required for new items.";
    } else if (image) {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(image.type)) {
        errors.image = "Only JPG, JPEG, or PNG images are allowed.";
      }
      if (image.size > 5 * 1024 * 1024) {
        errors.image = "Image size must be less than 5MB.";
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Proceed with submit
    const data = new FormData();
    data.append("name", name.trim());
    data.append("category", category);
    data.append("price", priceVal);
    data.append("quantityInStock", quantity);
    data.append("description", description.trim());
    if (image) data.append("image", image);

    const url = editItemId
      ? `http://localhost:8070/shop/${editItemId}`
      : "http://localhost:8070/shop/add";

    const method = editItemId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: data,
    });

    if (res.ok) {
      fetchData();
      handleClose();
    } else {
      alert("Error saving item.");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      quantityInStock: item.quantityInStock,
      price: item.price,
      description: item.description,
      image: null,
    });
    setEditItemId(item._id);
    handleShow();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8070/shop/${id}`, { method: "DELETE" });
    fetchData();
  };

  const generatePDF = () => {
    const doc = new jsPDF("portrait"); // ✅ Use portrait orientation
    doc.setFontSize(16);
    doc.text("Shop Items Report", 105, 20, { align: "center" }); // ✅ Centered title

    const headers = [["Name", "Category", "Qty", "Price", "Description"]];
    const data = items.map((i) => [
      i.name,
      i.category,
      i.quantityInStock,
      `Rs ${i.price}`,
      i.description,
    ]);

    doc.autoTable({
      startY: 30, // ✅ Start after title
      head: headers,
      body: data,
      headStyles: { fillColor: [25, 135, 84] },
    });

    doc.save("shop_items_report.pdf");
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <Button onClick={handleShow}>Add Item</Button>
        <Button variant="success" onClick={generatePDF}>
          Download Report
        </Button>
        <input
          type="text"
          placeholder="Search"
          className="form-control w-25"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item._id}>
              <td>
                <img
                  src={`http://localhost:8070${item.imageUrl}`}
                  alt="thumbnail"
                  width="60"
                  height="60"
                  className="rounded"
                />
              </td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantityInStock}</td>
              <td>Rs {item.price}</td>
              <td>{item.description}</td>
              <td>
                <Button
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editItemId ? "Edit" : "Add"} Shop Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                isInvalid={!!formErrors.category}
              >
                <option value="">Select Category</option>
                {categoryOptions.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.category}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity in Stock</Form.Label>
              <Form.Control
                type="number"
                value={formData.quantityInStock}
                onChange={(e) =>
                  setFormData({ ...formData, quantityInStock: e.target.value })
                }
                isInvalid={!!formErrors.quantityInStock}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.quantityInStock}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (Rs)</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                isInvalid={!!formErrors.price}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.price}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                isInvalid={!!formErrors.image}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.image}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editItemId ? "Update" : "Add"} Item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShopItemsManagement;

import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import { Modal, Button, Form } from "react-bootstrap";
import { createProduct, updateProduct } from "../../service/api";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const AddProduct = ({ onAddProduct }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [status, setStatuss] = useState("");

  const handleAction = async () => {
    const productData = {
      name,
      description,
      price,
      imageUrls: selectedImages,
      status,
    };

    try {
        onAddProduct(productData);
        toast.success("Product added successfully", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      setProductName("");
      setDescription("");
      setPrice("");
      setSelectedImages([]);
      setStatuss("");
      setShowModal(false);
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to perform action, Some Fields are Empty", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((base64Images) => {
      setSelectedImages(base64Images);
    });
  };
  return (
    <div>

        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Product
        </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="productName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(Math.max(0, parseFloat(e.target.value)))
                }
                isInvalid={price < 0}
              />
              {price <= 0 && (
                <Form.Control.Feedback type="invalid">
                  Price must be greater than zero.
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="images">
              <Form.Label>Product Images</Form.Label>
              <Form.Control type="file" multiple onChange={handleImageChange} />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatuss(e.target.value)}
              >
                <option value="" disabled>
                  Please select status
                </option>
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAction}>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProduct;

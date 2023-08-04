import React, { useState, useEffect } from "react";
import "./ProductCard.css";
import { toast } from "react-toastify"; 
import { Card, Carousel, Button, Modal, Form } from "react-bootstrap";
import { updateProduct, deleteProduct } from "../../service/api";

const ProductCard = ({ product, filter, onEdit, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrls: [...product.imageUrls],
    status: product.status,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (
      !editedProduct.name ||
      !editedProduct.description ||
      !editedProduct.price ||
      !editedProduct.status
    ) {
      toast.error("Product form fields are required.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    try {
      await onEdit(editedProduct);
      setShowEditModal(false);
  
      toast.success("Product edited successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Failed to save edited product", error);
      toast.error("Failed to edit product", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleImageChange = async (e) => {
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

    try {
      const base64Images = await Promise.all(imagePromises);
      setEditedProduct({
        ...editedProduct,
        imageUrls: base64Images,
      });
    } catch (error) {
      console.error("Error converting images to base64:", error);
    }
  };

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const getStatusColor = () => {
    return product.status === "Available" ? "green" : "red";
  };

  return (
    <div>
      {(filter === "all" || filter === product.status) && (
        <Card className="mt-4 product-card card-hover">
          <Card.Header className="product-card-header">
            {product.name}
          </Card.Header>
          <Card.Body>
            <Carousel
              className="product-carousel"
              activeIndex={activeIndex}
              onSelect={handleSelect}
            >
              {product?.imageUrls?.map((image, imgIndex) => (
                <Carousel.Item key={imgIndex}>
                  <img
                    className="d-block w-100"
                    src={image}
                    alt={`Image ${imgIndex}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            <Card.Text>{product.description}</Card.Text>
            <Card.Text>Price: ${product.price}</Card.Text>
            <Card.Text style={{ color: getStatusColor() }}>
              Status:{" "}
              {product.status === "Available"
                ? "Available"
                : "Out of Stock"}
            </Card.Text>
          </Card.Body>
          <Card.Footer className="product-card-footer">
            <Button variant="warning" onClick={handleEditClick}>
              Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(product)}>
              Delete
            </Button>
          </Card.Footer>
        </Card>
      )}

 
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={editedProduct.name}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="editDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedProduct.description}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="editPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={editedProduct.price}
                onChange={(e) => {
                  const newPrice = Math.max(0, parseFloat(e.target.value));
                  setEditedProduct({ ...editedProduct, price: newPrice });
                }}
                isInvalid={editedProduct.price < 0}
              />
              {editedProduct.price < 0 && (
                <Form.Control.Feedback type="invalid">
                  Price must be greater than zero.
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group controlId="editImages">
              <Form.Label>Product Images</Form.Label>
              <Form.Control type="file" multiple onChange={handleImageChange} />
            </Form.Group>
            <Form.Group controlId="editStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={editedProduct.status}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, status: e.target.value })
                }
              >
                <option value="" disabled>
                  Please select status
                </option>
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of stock</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductCard;

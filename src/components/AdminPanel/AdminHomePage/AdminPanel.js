import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddProduct from '../AddProductComponent/AddedProduct';
import ProductCard from '../AdminProductDisplay/ProductCard';
import LoadingSpinner from '../../SharedComponent/Loader';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setTokens,
} from '../../service/api';
import { getCookie } from 'react-use-cookie';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = getCookie('token');
    let user = getCookie('user');
    if (user) {
      user = JSON.parse(user);
    }
    setTokens(token, user);
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    setIsLoading(true);

    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (newProduct) => {
    setIsLoading(true);

    try {
      const addedProduct = await createProduct(newProduct);
      setProducts([...products, addedProduct]);
      toast.success('Product added successfully', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('Failed to add product', error);
      toast.error('Failed to add product', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (originalProduct, editedProduct) => {
    setIsLoading(true);

    try {
      const updatedProduct = await updateProduct(originalProduct._id, editedProduct);
      const updatedProducts = products.map((product) =>
        product._id === originalProduct._id ? updatedProduct : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
      toast.success('Product updated successfully', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('Failed to update product', error.message);
      toast.error('Failed to update product', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productToDelete) => {
    setIsLoading(true);

    try {
      const updatedProducts = products.filter((product) => product._id !== productToDelete._id);
      setProducts(updatedProducts);
      await deleteProduct(productToDelete._id);
      toast.success('Product deleted successfully', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('Failed to delete product', error);
      toast.error('Failed to delete product', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand ms-4" href="/">
          E-Commerce
        </a>
        <div className='Add-button'>
          {isLoading ? (
            <div className="modal-overlay">
              <LoadingSpinner />
            </div>
          ) : (
            <AddProduct
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleEditProduct}
              editProduct={editingProduct}
            />
          )}
        </div>
      </nav>
      <div className='d-flex justify-content-evenly mt-4'>
        <Row className='adminpanel mt-3'>
          <Col className='text-center'>
            <h1>Admin Panel</h1>
          </Col>
        </Row>
        <div className="filter-dropdown mt-3">
          <label className="filter-label">Filter by Status:</label>
          <select
            className="dropdown-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>
      <div className='container-fluid '>
        <hr />
        <Row>
          {products.map((product, index) => (
            <Col key={index} md={6} lg={4} xl={3}>
              <ProductCard
                product={product}
                filter={filter}
                onEdit={(editedProduct) => handleEditProduct(product, editedProduct)}
                onDelete={(productToDelete) => handleDeleteProduct(productToDelete)}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AdminPanel;

import React, { useState, useEffect } from 'react';
import './ProductList.css';
import { Carousel } from 'react-bootstrap';
import { fetchProducts } from '../../service/api';
import LoadingSpinner from '../../SharedComponent/Loader';

const ProductList = ({ addToCart }) => {
  const [filter, setFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(product => product.status === filter);


  const [activeIndexes, setActiveIndexes] = useState({});

  const handleSelect = (productId, selectedIndex) => {
    setActiveIndexes(prevState => ({
      ...prevState,
      [productId]: selectedIndex,
    }));
  };

  return (
    <div className="product-list container">
      <div className='d-flex justify-content-between'>
        <h2>Product List</h2>
        <div className="filter-dropdown">
          <label className="filter-label">Filter by Status:</label>
          <select className="dropdown-select" value={filter} onChange={e => handleFilterChange(e.target.value)}>
            <option value="all">All</option>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>
      <hr />

      {isLoading ? (
        <div className="modal-overlay">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="row mt-4">
          {filteredProducts?.map(product => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card p-2">
                {product.imageUrls.length === 1 ? (
                  <img src={product.imageUrls[0]} className="card-img-top" alt={`${product.name} Image`} />
                ) : (
                  <Carousel
                    className="product-carousel"
                    activeIndex={activeIndexes[product._id] || 0}
                    onSelect={(selectedIndex) => handleSelect(product._id, selectedIndex)}
                  >
                    {product.imageUrls.map((imageUrl, index) => (
                      <Carousel.Item key={index}>
                        <img src={imageUrl} className="card-img-top" alt={`${product.name} Image ${index}`} />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}

                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="price-text">Price: Rs {product.price}</p>
                  <p className={`status-text ${product.status === "Available" ? 'text-success' : 'text-danger'}`}>
                    Status: {product.status === "Available" ? "Available" : "Out of stock"}
                  </p>
                  <button
                    className="btn btn-primary add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={product.status === 'Out of Stock'}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;

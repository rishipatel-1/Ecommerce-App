import React from 'react';
import './CartSidebar.css'; 
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const CartSidebar = ({ cart, removeFromCart, increaseQuantity, decreaseQuantity, onClose }) => {
  const totalPrice = cart?.reduce((total, item) => total + (item?.product?.price * item?.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warn('Cart is empty. Add products to cart before checking out.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } else {
      toast.success('Checkout successful. Thank you for your purchase!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      onClose()
    }
  };
  

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className='text-dark'>Cart</h2>
        <button className="close-btn " onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="text-center mt-4">No products added to cart.</p>
      ) : (
        <ul className="list-group">
          {cart.map(item => (
            <li key={item?.product?._id} className="list-group-item">
              <div className="product-card-itemss">
                <div className="d-flex align-items-center">
                  <img src={item?.product?.imageUrls[0]} className="cart-item-image" alt={item?.product?.name} />
                  <div className="product-details">
                    <div className="product-name">{item?.product?.name}</div>
                    <div className="btn-group mt-2 ms-4">
                    <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item?.product?._id)}>
                        Remove
                      </button>
                      <button className="btn btn-sm btn-secondary ms-2" onClick={() => decreaseQuantity(item?.product?._id)}>
                        -
                      </button>
                      <span className="quantity">{item?.quantity}</span>
                      <button className="btn btn-sm btn-secondary" onClick={() => increaseQuantity(item?.product?._id)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cart.length >= 0 && (
        <div className="total-checkout">
          <p className="total-price">Total: Rs {totalPrice?.toFixed(2)}</p>
          <button className="btn btn-primary btn-block btn-checkout" onClick={handleCheckout} disabled={cart.length === 0}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;

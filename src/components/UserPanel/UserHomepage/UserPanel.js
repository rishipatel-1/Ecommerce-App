import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductList from "../UserAllProducts/ProductList";
import CartSidebar from "../UserCartSection/CartSidebar";
import LoadingSpinner from "../../SharedComponent/Loader";
import "./UserPanel.css";
import {
  addToCart,
  fetchCart,
  removeFromCart,
  setTokens,
} from "../../service/api";
import { getCookie } from "react-use-cookie";

const UserPanel = ({ products }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const token = getCookie("token");
    let user = getCookie("user");
    if (user) {
      user = JSON.parse(user);
    }
    setTokens(token, user);
    fetchCartsData();
  }, []);

  const fetchCartsData = async () => {
    setIsLoading(true);

    try {
      const response = await fetchCart();
      setCart(response?.items);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const existingItem = cart.find((item) => item?.product?._id === product._id);
      if (existingItem) {
        setCart(
          cart.map((item) =>
            item?.product?._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCart([...cart, { product: { ...product }, quantity: 1 }]);
      }
      await addToCart(product._id, 1);
      toast.success("Product added to cart", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    setCart(cart.filter((item) => item?.product._id !== productId));
    await removeFromCart(productId);
    toast.info("Product removed from cart", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  const increaseQuantity = async (productId) => {
    try {
      setCart(
        cart.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      await addToCart(productId, 1);
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      setCart(
        cart.map((item) =>
          item?.product?._id === productId && item?.quantity > 1
            ? { ...item, quantity: item?.quantity - 1 }
            : item
        )
      );
      await addToCart(productId, -1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };
  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  };
  const cartItemCount =
    cart.length > 0 ? Math.pow(2, Math.ceil(Math.log2(cart.length))) : 0;

  return (
    <div className="user-panel">
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand ms-4" href="/">
          <span className="logo-text">E-Commerce</span>
        </a>
        <button
          className="navbar-toggler bg-transparent border-0"
          type="button"
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          <FaShoppingCart className="cart-icon" />
          <span className="badge badge-danger text-dark">{cartItemCount}</span>
        </button>
      </nav>
      <div className={`cart-sidebar ${isCartOpen ? "active" : ""}`}>
        <CartSidebar
          cart={cart}
          removeFromCart={handleRemoveFromCart}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          onClose={handleCloseCart}
        />
      </div>
      <div className="container-fluid">
      <button className="btn ms-auto w-100" onClick={handleLogout}>
        <u className="float-end">Logout</u>
      </button>
      </div>
      {isLoading ? (
        <div className="loader-overlay">
          <LoadingSpinner />
        </div>
      ) : (
        <ProductList products={products} addToCart={handleAddToCart} />
      )}
    </div>
  );
};

export default UserPanel;

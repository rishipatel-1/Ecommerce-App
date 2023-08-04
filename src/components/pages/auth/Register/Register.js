import React, { useState } from "react";
import { registerUser } from "../../../service/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    validateEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    validatePassword(event.target.value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{}':'\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must conatin a capital letter and atleast 8 be character long"
      );
    } else {
      setPasswordError("");
    }
  };
  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{}':'\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password should be at least 8 characters long, contain at least one capital letter, and one special symbol"
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid(password)) {
      return;
    }
    if (email && password && !emailError && !passwordError) {
      try {
        const payload = {
          email,
          username: name,
          password,
        };
        setName("");
        setEmail("");
        setPassword("");
        await registerUser(payload);
        toast.success("Registered Successfully,Please login", {
          position: "top-center", 
          autoClose: 3000,
          hideProgressBar: true,
        });
        navigate("/login");
      } catch (error) {
        if (error.statusCode === 409) {
          toast.error(`Email already exists. Please use a different email.`, {
            position: "top-center", 
            autoClose: 3000,
            hideProgressBar: true,
          });
        } else {
          toast.error(`Registration Failed`, {
            position: "top-center", 
            autoClose: 3000,
            hideProgressBar: true,
          });
        }
      }
    }
  };

  

  return (
    <div className="signup-form">
      <div className="title">Register</div>
      <form onSubmit={handleSubmit}>
        <div className="input-boxes">
          <div className="input-box ">
            <i className="fas fa-user" />
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              required
            />
          </div>
          <div className="d-flex flex-column  position-relative">
            <div className="input-box mb-3">
            <i className='fas fa-envelope' />
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="position-absolute errorDivemail">
              {emailError && <span className="input-error">{emailError}</span>}
            </div>
          </div>
          <div className="d-flex flex-column  position-relative">
            <div className="input-box mb-5">
            <i className='fas fa-lock' />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="position-absolute errorDiv">
              {passwordError && (
                <span className="input-error">{passwordError}</span>
              )}
            </div>
          </div>
          <div className="button input-box">
            <input type="submit" value="Submit" />
          </div>
          <div className="text sign-up-text">
            Already have an account? <label htmlFor="flip">Login now</label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
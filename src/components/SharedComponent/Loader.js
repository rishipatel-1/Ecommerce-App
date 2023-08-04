import React from 'react'
import { Spinner } from 'react-bootstrap'
import './Loader.css'


const LoadingSpinner = () => (
    <div className="spinner-overlay">
      <div className="spinner-square">
        <div className="square-1 square"></div>
        <div className="square-2 square"></div>
        <div className="square-3 square"></div>
      </div>
    </div>
  );
  
  export default LoadingSpinner;
  
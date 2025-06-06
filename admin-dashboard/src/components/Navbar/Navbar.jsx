import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-title">Quản lý giao hàng</div>
      <div className="navbar-admin">
        <button className="admin-button">Admin</button>
      
      </div>
    </div>
  );
};

export default Navbar;

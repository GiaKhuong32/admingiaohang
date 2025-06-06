import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div>
      <div className="sidebar">
        <div className="sidebar-options">
           <NavLink to= '/Adminmain' className="sidebar-option">
              <p>Trang chủ</p>
            </NavLink>
            <NavLink to= '/User_Management' className="sidebar-option">
              <p>Quản lý người dùng</p>
            </NavLink>
              <NavLink to ='/Order_Management'className="sidebar-option">
              <p>Quản lý đơn hàng</p>
            </NavLink>
              <NavLink to ='/Bus_Info' className="sidebar-option"> 
              <p>Quản lý thông tin nhà xe</p> 
            </NavLink>
              <NavLink to ='/Payment_Management' className="sidebar-option">
              <p>Quản lý thanh toán</p>
            </NavLink>
              <NavLink to ='/System_Reports'className="sidebar-option">
              <p>Xem báo cáo hệ thống</p>
            </NavLink>
             <NavLink to ='/Warehouse_Setup'className="sidebar-option">
              <p>Thiết lập tuyến và kho</p>
            </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

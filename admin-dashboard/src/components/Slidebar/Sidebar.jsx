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
             <NavLink to= '/Service' className="sidebar-option">
              <p>Quản lý dịch vụ vận chuyển</p>
            </NavLink>
            <NavLink to= '/Package' className="sidebar-option">
              <p>Quản lý kiện hàng</p>
            </NavLink>
            <NavLink to= '/Tracking' className="sidebar-option">
              <p>Kiểm tra trạng thái đơn hàng</p>
            </NavLink>
              <NavLink to ='/Vehicle' className="sidebar-option"> 
              <p>Quản lý phương tiện</p> 
            </NavLink>
              <NavLink to ='/Payment_Management' className="sidebar-option">
              <p>Quản lý thanh toán</p>
            </NavLink>
              <NavLink to ='Transactions'className="sidebar-option">
              <p>Lịch sử giao dịch</p>
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

import React from 'react'
import Sidebar from './components/Slidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import User_Management from './pages/User-Management/User_Management'
import Order_Management from './pages/Order-Management/Order_Management'
import Payment_Management from './pages/Payment-Management/Payment_Management'
import Warehouse_Setup from './pages/Warehouse-Setup/Warehouse_Setup'
import Adminmain from './pages/Admin-main/Adminmain'
import Navbar from './components/Navbar/Navbar'
import Service from './pages/Service/Service'
import Transactions from './pages/Transactions/Transactions'
import Vehicle from './pages/Vehicle/Vehicle'
import Tracking from './pages/Tracking/Tracking'
import Package from './pages/Package/Package'

const App = () => {
  return (
    <div>
      <Navbar/>
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path="/Adminmain" element={<Adminmain />} />
          <Route path="/User_Management" element={<User_Management/>}/>
          <Route path="/Order_Management" element={<Order_Management/>}/>
          <Route path="/Service" element={<Service/>}/>
          <Route path="/Payment_Management" element={<Payment_Management/>}/>
          <Route path="/Warehouse_Setup" element={<Warehouse_Setup/>}/>
          <Route path="/Vehicle" element={<Vehicle/>}/>
          <Route path="/Tracking" element={<Tracking/>}/>
          <Route path="/Package" element={<Package/>}/>
          <Route path="/Transactions" element={<Transactions/>}/>
        </Routes>
      </div>
      </div>
  )
}

export default App


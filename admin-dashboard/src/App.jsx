import React from 'react'
import Sidebar from './components/Slidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import User_Management from './pages/User-Management/User_Management'
import Order_Management from './pages/Order-Management/Order_Management'
import Bus_Info from './pages/Bus-Info/Bus_Info'
import Payment_Management from './pages/Payment-Management/Payment_Management'
import System_Reports from './pages/System-Reports/System_Reports'
import Warehouse_Setup from './pages/Warehouse-Setup/Warehouse_Setup'
import Adminmain from './pages/Admin-main/Adminmain'
import Navbar from './components/Navbar/Navbar'

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
          <Route path="/Bus_Info" element={<Bus_Info/>}/>
          <Route path="/Payment_Management" element={<Payment_Management/>}/>
          <Route path="/Warehouse_Setup" element={<Warehouse_Setup/>}/>
          <Route path="/System_Reports" element={<System_Reports/>}/>
        </Routes>
      </div>
      </div>
  )
}

export default App


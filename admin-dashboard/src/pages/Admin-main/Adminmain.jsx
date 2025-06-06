import React, { useEffect, useState } from 'react';
import './Adminmain.css';

const Adminmain = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_orders: 0,
    total_vehicles: 0
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/dashboard-stats')
      .then(response => response.json())
      .then(data => {
        const updatedStats = { total_users: 0, total_orders: 0, total_vehicles: 0 };
        data.forEach(item => {
          if (item.stat_name === 'total_users') updatedStats.total_users = item.stat_value;
          if (item.stat_name === 'total_orders') updatedStats.total_orders = item.stat_value;
          if (item.stat_name === 'total_vehicles') updatedStats.total_vehicles = item.stat_value;
        });
        setStats(updatedStats);
      })
      .catch(error => console.error('Lỗi khi tải dữ liệu thống kê:', error));
  }, []);

  return (
    <main className="admin-main">
      <header className="admin-header">
        <h1 className="admin-title">Trang chủ</h1>
      </header>

      <section className="admin-dashboard">
        <div className="welcome-card">
          <h3 className="welcome-text">Chào mừng trở lại, Admin!</h3>
          <p className="dashboard-description">
            Đây là trang quản trị dịch vụ giao hàng. Chọn một mục từ thanh bên để bắt đầu.
          </p>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h4 className="stat-title">Tổng số người dùng</h4>
            <p id="totalUsersStat" className="stat-value">{stats.total_users}</p>
          </div>
          <div className="stat-card">
            <h4 className="stat-title">Tổng số đơn hàng</h4>
            <p id="totalOrdersStat" className="stat-value">{stats.total_orders}</p>
          </div>
          <div className="stat-card">
            <h4 className="stat-title">Tổng số nhà xe</h4>
            <p id="totalVehiclesStat" className="stat-value">{stats.total_vehicles}</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Adminmain;

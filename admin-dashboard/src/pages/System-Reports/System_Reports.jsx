import React, { useEffect, useState } from 'react';
import './System_Reports.css';

const System_Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/system-report/today')
      .then(res => {
        if (!res.ok) throw new Error('Không có dữ liệu');
        return res.json();
      })
      .then(data => {
        setReport(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải báo cáo hệ thống:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải báo cáo hệ thống...</div>;
  if (!report) return <div>Không có dữ liệu báo cáo hôm nay.</div>;

  return (
    <div className="rp-card">
      <div className="rp-card-header">
        <h3>Báo cáo Hệ thống</h3>
      </div>
      <div id="rp-reportsDashboard">
        <div className="rp-report-item">
          <h4>Doanh thu Hôm nay</h4>
          <p id="rp-dailyRevenue">{Number(report.daily_revenue).toLocaleString('vi-VN')} VNĐ</p>
        </div>
        <div className="rp-report-item">
          <h4>Số đơn hàng Mới</h4>
          <p id="rp-newOrdersCount">{report.new_orders_count}</p>
        </div>
        <div className="rp-report-item">
          <h4>Tỷ lệ Giao thành công</h4>
          <p id="rp-deliverySuccessRate">{report.delivery_success_rate}%</p>
        </div>
      </div>
    </div>
  );
};

export default System_Reports;

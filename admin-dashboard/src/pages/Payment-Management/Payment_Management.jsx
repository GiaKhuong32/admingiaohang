import React, { useState, useEffect } from 'react';
import './Payment_Management.css';

const Payment_Management = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3000/api/payments') 
      .then(res => res.json())
      .then(data => setPayments(data))
      .catch(err => console.error('Lỗi khi tải danh sách thanh toán:', err));
  }, []);

  const handleConfirm = (id) => {
    fetch(`http://localhost:3000/api/payments/${id}/confirm`, {
      method: 'PUT'
    })
      .then(res => res.json())
      .then(() => {
        
        setPayments(prev =>
          prev.map(p =>
            p.id === id ? { ...p, status: 'Paid' } : p
          )
        );
      })
      .catch(err => console.error('Lỗi xác nhận thanh toán:', err));
  };


  const filteredPayments = payments.filter(payment =>
    (`${payment.id}${payment.order_id}${payment.customer_name}`)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <section id="paymentManagement" className="pm-content-section">
      <div className="pm-card">
        <div className="pm-card-header">
          <h3>Quản lý thanh toán</h3>
        </div>
        <input
          type="text"
          className="form-group"
          placeholder="Tìm kiếm thanh toán (ID đơn, ID thanh toán)..."
          style={{ width: 'auto', padding: '8px 12px', marginBottom: 15 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table className="pm-table">
          <thead>
            <tr>
              <th>ID Thanh toán</th>
              <th>ID Đơn hàng</th>
              <th>Khách hàng</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Ngày GD</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id}>
                <td>#{payment.id}</td>
                <td>#{payment.order_id}</td>
                <td>{payment.customer_name}</td>
                <td>{Number(payment.amount).toLocaleString('vi-VN')} VNĐ</td>
                <td>{payment.method}</td>
                <td>
                  <span
                    className={`badge ${payment.status === 'Paid'
                      ? 'badge-success'
                      : payment.status === 'Unpaid'
                        ? 'badge-warning'
                        : 'badge-secondary'
                      }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td>{new Date(payment.transaction_date).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button
                    className="pm-btn pm-btn-info pm-btn-sm"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    Xem CT
                  </button>
                  {payment.status === 'Unpaid' && (
                    <button
                      className="pm-btn pm-btn-secondary pm-btn-sm"
                      onClick={() => handleConfirm(payment.id)}
                    >
                      Xác nhận TT
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      {selectedPayment && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Chi tiết thanh toán</h4>
              <span className="close-btn" onClick={() => setSelectedPayment(null)}>&times;</span>
            </div>
            <div className="form-group"><strong>ID Thanh toán:</strong> #{selectedPayment.id}</div>
            <div className="form-group"><strong>ID Đơn hàng:</strong> #{selectedPayment.order_id}</div>
            <div className="form-group"><strong>Khách hàng:</strong> {selectedPayment.customer_name}</div>
            <div className="form-group"><strong>Số tiền:</strong> {Number(selectedPayment.amount).toLocaleString('vi-VN')} VNĐ</div>
            <div className="form-group"><strong>Phương thức:</strong> {selectedPayment.method}</div>
            <div className="form-group"><strong>Trạng thái:</strong> {selectedPayment.status}</div>
            <div className="form-group"><strong>Ngày GD:</strong> {new Date(selectedPayment.transaction_date).toLocaleDateString('vi-VN')}</div>
            <div style={{ textAlign: 'right' }}>
              <button className="pm-btn pm-btn-secondary" onClick={() => setSelectedPayment(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Payment_Management;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Order_Management.css';

const Order_Management = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    pickupAddress: '',
    deliveryAddress: '',
    shipperId: '',
    status: 'Pending',
    orderDate: ''
  });

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderModal = (id) => {
    if (id !== null) {
      const order = orders.find(o => o.id === id);
      setEditOrder(order.id);
      setFormData({
        customerName: order.customer_name,
        pickupAddress: order.pickup_address,
        deliveryAddress: order.delivery_address,
        shipperId: order.shipper_id || '',
        status: order.status,
        orderDate: order.order_date ? new Date(order.order_date).toISOString().split('T')[0] : ''
      });
    } else {
      setEditOrder(null);
      setFormData({
        customerName: '',
        pickupAddress: '',
        deliveryAddress: '',
        shipperId: '',
        status: 'Pending',
        orderDate: ''
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditOrder(null);
    setFormData({
      customerName: '',
      pickupAddress: '',
      deliveryAddress: '',
      shipperId: '',
      status: 'Pending',
      orderDate: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.pickupAddress || !formData.deliveryAddress || !formData.orderDate) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const payload = {
        customer_name: formData.customerName,
        pickup_address: formData.pickupAddress,
        delivery_address: formData.deliveryAddress,
        shipper_id: formData.shipperId || null,
        status: formData.status,
        order_date: new Date(formData.orderDate).toISOString().split('T')[0]
      };

      if (editOrder !== null) {
        await axios.put(`http://localhost:3000/api/orders/${editOrder}`, payload);
      } else {
        await axios.post('http://localhost:3000/api/orders', payload);
      }

      fetchOrders();
      closeModal();
    } catch (err) {
      console.error('Lỗi khi lưu đơn hàng:', err);
      alert('Đã xảy ra lỗi khi lưu đơn hàng. Kiểm tra lại dữ liệu.');
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm(`Bạn có chắc muốn xóa đơn hàng ID: ${id}?`)) {
      try {
        await axios.delete(`http://localhost:3000/api/orders/${id}`);
        fetchOrders();
      } catch (err) {
        console.error('Lỗi khi xóa đơn hàng:', err);
      }
    }
  };

  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(order.id).includes(searchTerm)
  );

  return (
    <section className="om-section">
      <div className="om-card">
        <div className="om-card-header">
          <h3>Quản lý Đơn hàng</h3>
          <button className="om-btn om-btn-primary" onClick={() => openOrderModal(null)}>
            <i className="fas fa-plus"></i> Thêm Đơn hàng
          </button>
        </div>
        <input
          type="text"
          className="om-form-group"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm đơn hàng (ID, Tên KH)..."
          style={{ width: 'auto', padding: '8px 12px', marginBottom: '15px' }}
        />
        <table className="om-table">
          <thead>
            <tr>
              <th>ID Đơn</th>
              <th>Khách hàng</th>
              <th>Địa chỉ nhận</th>
              <th>Địa chỉ giao</th>
              <th>Shipper</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer_name}</td>
                <td>{order.pickup_address}</td>
                <td>{order.delivery_address}</td>
                <td>{order.shipper_id || 'Chưa gán'}</td>
                <td>{order.status}</td>
                <td>{new Date(order.order_date).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button className="om-btn om-btn-warning om-btn-sm" onClick={() => openOrderModal(order.id)}><i className="fas fa-edit"></i> Sửa</button>
                  <button className="om-btn om-btn-danger om-btn-sm" onClick={() => deleteOrder(order.id)}><i className="fas fa-trash"></i> Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <div className="om-modal" style={{ display: 'block' }}>
          <div className="om-modal-content">
            <div className="om-modal-header">
              <h4>{editOrder !== null ? 'Sửa Đơn hàng' : 'Thêm Đơn hàng'}</h4>
              <span className="om-close-btn" onClick={closeModal}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="om-form-group">
                <label htmlFor="customerName">Tên Khách hàng:</label>
                <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required />
              </div>
              <div className="om-form-group">
                <label htmlFor="pickupAddress">Địa chỉ nhận:</label>
                <input type="text" id="pickupAddress" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} required />
              </div>
              <div className="om-form-group">
                <label htmlFor="deliveryAddress">Địa chỉ giao:</label>
                <input type="text" id="deliveryAddress" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} required />
              </div>
              <div className="om-form-group">
                <label htmlFor="shipperId">Shipper ID:</label>
                <input type="text" id="shipperId" name="shipperId" value={formData.shipperId} onChange={handleChange} />
              </div>
              <div className="om-form-group">
                <label htmlFor="status">Trạng thái:</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange}>
                  <option value="Pending">Chờ xử lý</option>
                  <option value="Processing">Đang xử lý</option>
                  <option value="Shipping">Đang giao</option>
                  <option value="Delivered">Đã giao</option>
                  <option value="Cancelled">Đã hủy</option>
                  <option value="Returned">Trả hàng</option>
                </select>
              </div>
              <div className="om-form-group">
                <label htmlFor="orderDate">Ngày đặt:</label>
                <input type="date" id="orderDate" name="orderDate" value={formData.orderDate} onChange={handleChange} required />
              </div>
              <button type="submit" className="om-btn om-btn-primary">Lưu</button>
              <button type="button" className="om-btn om-btn-secondary" onClick={closeModal}>Hủy</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Order_Management;

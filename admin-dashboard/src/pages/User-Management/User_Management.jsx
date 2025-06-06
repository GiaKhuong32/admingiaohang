import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './User_Management.css';

const User_Management = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Customer',
    status: 'Active',
    password: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách user:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (id) => {
    if (id !== null) {
      const user = users.find(u => u.id === id);
      setEditUser(user.id);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        status: user.status,
        password: user.password
      });
    } else {
      setEditUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Customer',
        status: 'Active',
        password: ''
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Customer',
      status: 'Active',
      password: ''
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert('Vui lòng nhập đầy đủ tên, email và mật khẩu!');
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      password: formData.password
    };

    try {
      if (editUser !== null) {
        await axios.put(`http://localhost:3000/api/users/${editUser}`, payload);
      } else {
        await axios.post('http://localhost:3000/api/users', payload);
      }
      fetchUsers();
      closeModal();
    } catch (err) {
      console.error('Lỗi khi lưu user:', err);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm(`Bạn có chắc muốn xoá user ID ${id}?`)) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error('Lỗi khi xoá user:', err);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="um-section">
      <div className="um-card">
        <div className="um-card-header">
          <h3>Quản lý Người dùng</h3>
          <button className="um-btn um-btn-primary" onClick={() => openModal(null)}>
            <i className="fas fa-plus"></i> Thêm người dùng
          </button>
        </div>
        <input
          type="text"
          className="um-form-group"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm theo tên hoặc email..."
          style={{ width: 'auto', padding: '8px 12px', marginBottom: '15px' }}
        />
        <table className="um-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button className="um-btn um-btn-warning um-btn-sm" onClick={() => openModal(user.id)}>
                    <i className="fas fa-edit"></i> Sửa
                  </button>
                  <button className="um-btn um-btn-danger um-btn-sm" onClick={() => deleteUser(user.id)}>
                    <i className="fas fa-trash"></i> Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <div className="um-modal" style={{ display: 'block' }}>
          <div className="um-modal-content">
            <div className="um-modal-header">
              <h4>{editUser !== null ? 'Sửa Người dùng' : 'Thêm Người dùng'}</h4>
              <span className="um-close-btn" onClick={closeModal}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="um-form-group">
                <label htmlFor="name">Tên:</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="um-form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="um-form-group">
                <label htmlFor="phone">Điện thoại:</label>
                <input type="text" id="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="um-form-group">
                <label htmlFor="role">Vai trò:</label>
                <select id="role" value={formData.role} onChange={handleChange}>
                  <option value="Admin">Admin</option>
                  <option value="Shipper">Shipper</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
              <div className="um-form-group">
                <label htmlFor="status">Trạng thái:</label>
                <select id="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Ngưng hoạt động</option>
                </select>
              </div>
              <div className="um-form-group">
                <label htmlFor="password">Mật khẩu:</label>
                <input type="password" id="password" value={formData.password} onChange={handleChange} required />
              </div>
              <button type="submit" className="um-btn um-btn-primary">Lưu</button>
              <button type="button" className="um-btn um-btn-secondary" onClick={closeModal}>Hủy</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default User_Management;

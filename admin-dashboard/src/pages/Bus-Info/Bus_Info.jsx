import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Bus_Info.css';

const Bus_Info = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    contactPerson: '',
    phone: '',
    address: '',
    vehicleDetails: '',
    status: 'Hoạt động',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchVehicles = () => {
    axios.get('http://localhost:3000/api/vehicles')
      .then((res) => {
        const mapped = res.data.map((v) => ({
          id: v.id,
          name: v.name,
          contactPerson: v.contact_person,
          phone: v.phone,
          address: v.address,
          vehicleDetails: v.vehicle_details,
          status: v.status
        }));
        setVehicles(mapped);
      })
      .catch((err) => console.error('Lỗi khi fetch:', err));
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openEditModal = (vehicle) => {
    setFormData(vehicle);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      id: '',
      name: '',
      contactPerson: '',
      phone: '',
      address: '',
      vehicleDetails: '',
      status: 'Hoạt động',
    });
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      contact_person: formData.contactPerson,
      phone: formData.phone,
      address: formData.address,
      vehicle_details: formData.vehicleDetails,
      status: formData.status
    };

    try {
      if (editMode && formData.id) {
        await axios.put(`http://localhost:3000/api/vehicles/${formData.id}`, payload);
      } else {
        await axios.post('http://localhost:3000/api/vehicles', payload);
      }
      setIsModalOpen(false);
      fetchVehicles(); // refresh list
    } catch (err) {
      console.error('Lỗi khi thêm/sửa:', err);
    }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xoá nhà xe ID ${id}?`)) return;
    try {
      await axios.delete(`http://localhost:3000/api/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      console.error('Lỗi khi xoá:', err);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Hoạt động': 'bi-badge-success',
      'Bảo trì': 'bi-badge-danger',
      'Không hoạt động': 'bi-badge-warning',
    };
    return <span className={`bi-badge ${statusMap[status] || 'bi-badge-secondary'}`}>{status}</span>;
  };

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="bi-vehicleManagement" className="bi-section">
      <div className="bi-card">
        <div className="bi-card-header">
          <h3>Quản lý thông tin nhà xe</h3>
          <button className="bi-btn bi-btn-primary" onClick={openAddModal}>
            <i className="fas fa-plus"></i> Thêm Nhà xe
          </button>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm nhà xe..."
          className="bi-form-group"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 'auto', padding: '8px 12px', marginBottom: '15px' }}
        />
        <table className="bi-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Nhà xe</th>
              <th>Người liên hệ</th>
              <th>Điện thoại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>{vehicle.name}</td>
                <td>{vehicle.contactPerson || 'N/A'}</td>
                <td>{vehicle.phone}</td>
                <td>{getStatusBadge(vehicle.status)}</td>
                <td>
                  <button className="bi-btn bi-btn-warning bi-btn-sm" onClick={() => openEditModal(vehicle)}>
                    <i className="fas fa-edit"></i> Sửa
                  </button>
                  <button className="bi-btn bi-btn-danger bi-btn-sm" onClick={() => deleteVehicle(vehicle.id)}>
                    <i className="fas fa-trash"></i> Xoá
                  </button>
                </td>
              </tr>
            ))}
            {filteredVehicles.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu nhà xe</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="bi-modal" style={{ display: 'block' }}>
          <div className="bi-modal-content">
            <div className="bi-modal-header">
              <h4>{editMode ? 'Sửa thông tin Nhà xe' : 'Thêm Nhà xe'}</h4>
              <span className="bi-close-btn" onClick={() => setIsModalOpen(false)}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="bi-form-group">
                <label>Tên Nhà xe:</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="bi-form-group">
                <label>Người liên hệ:</label>
                <input type="text" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
              </div>
              <div className="bi-form-group">
                <label>Điện thoại:</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
              </div>
              <div className="bi-form-group">
                <label>Địa chỉ:</label>
                <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="bi-form-group">
                <label>Chi tiết Phương tiện:</label>
                <input type="text" value={formData.vehicleDetails} onChange={(e) => setFormData({ ...formData, vehicleDetails: e.target.value })} />
              </div>
              <div className="bi-form-group">
                <label>Trạng thái:</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Không hoạt động">Không hoạt động</option>
                  <option value="Bảo trì">Bảo trì</option>
                </select>
              </div>
              <button type="submit" className="bi-btn bi-btn-primary">Lưu</button>
              <button type="button" className="bi-btn bi-btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Bus_Info;

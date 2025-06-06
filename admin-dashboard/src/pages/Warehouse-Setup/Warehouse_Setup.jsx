import React, { useState, useEffect } from 'react';
import './Warehouse_Setup.css';

const Warehouse_Setup = () => {
  const [routes, setRoutes] = useState([]);
  const [warehouseItems, setWarehouseItems] = useState([]);

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  const [newRoute, setNewRoute] = useState({ start: '', end: '', distance: '', time: '' });
  const [newItem, setNewItem] = useState({ name: '', quantity: '', location: '' });

  const [editRouteId, setEditRouteId] = useState(null);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    fetchRoutes();
    fetchItems();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/routes');
      const data = await res.json();
      setRoutes(data);
    } catch (err) {
      console.error('Lỗi fetch routes:', err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/warehouse-items');
      const data = await res.json();
      setWarehouseItems(data);
    } catch (err) {
      console.error('Lỗi fetch items:', err);
    }
  };

  const handleAddRoute = async () => {
    if (!newRoute.start || !newRoute.end || !newRoute.distance) return;
    try {
      if (editRouteId) {
        await fetch(`http://localhost:3000/api/routes/${editRouteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newRoute,
            distance: parseFloat(newRoute.distance)
          })
        });
      } else {
        await fetch('http://localhost:3000/api/routes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newRoute,
            distance: parseFloat(newRoute.distance)
          })
        });
      }
      setNewRoute({ start: '', end: '', distance: '', time: '' });
      setEditRouteId(null);
      setShowRouteModal(false);
      fetchRoutes();
    } catch (err) {
      console.error('Lỗi thêm/cập nhật tuyến:', err);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.quantity) return;
    try {
      if (editItemId) {
        await fetch(`http://localhost:3000/api/warehouse-items/${editItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newItem,
            quantity: parseInt(newItem.quantity)
          })
        });
      } else {
        await fetch('http://localhost:3000/api/warehouse-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newItem,
            quantity: parseInt(newItem.quantity)
          })
        });
      }
      setNewItem({ name: '', quantity: '', location: '' });
      setEditItemId(null);
      setShowItemModal(false);
      fetchItems();
    } catch (err) {
      console.error('Lỗi thêm/cập nhật mặt hàng:', err);
    }
  };

  const handleDeleteRoute = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tuyến này?')) {
      try {
        await fetch(`http://localhost:3000/api/routes/${id}`, { method: 'DELETE' });
        fetchRoutes();
      } catch (err) {
        console.error('Lỗi xoá tuyến:', err);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa mặt hàng này?')) {
      try {
        await fetch(`http://localhost:3000/api/warehouse-items/${id}`, { method: 'DELETE' });
        fetchItems();
      } catch (err) {
        console.error('Lỗi xoá mặt hàng:', err);
      }
    }
  };

  const handleEditRoute = (route) => {
    setNewRoute({
      start: route.start,
      end: route.end,
      distance: route.distance,
      time: route.time
    });
    setEditRouteId(route.id);
    setShowRouteModal(true);
  };

  const handleEditItem = (item) => {
    setNewItem({
      name: item.name,
      quantity: item.quantity,
      location: item.location
    });
    setEditItemId(item.id);
    setShowItemModal(true);
  };

  return (
    <div className="wh-wrapper" style={{ padding: 30 }}>
      {/* ROUTES */}
      <div className="wh-card">
        <div className="wh-card-header">
          <h3>Thiết lập Tuyến đường</h3>
          <button className="wh-btn wh-btn-primary" onClick={() => {
            setNewRoute({ start: '', end: '', distance: '', time: '' });
            setEditRouteId(null);
            setShowRouteModal(true);
          }}>Thêm Tuyến đường</button>
        </div>
        <table className="wh-table">
          <thead>
            <tr>
              <th>ID Tuyến</th>
              <th>Điểm bắt đầu</th>
              <th>Điểm kết thúc</th>
              <th>Khoảng cách (km)</th>
              <th>Thời gian ước tính</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route.id}>
                <td>{route.id}</td>
                <td>{route.start}</td>
                <td>{route.end}</td>
                <td>{route.distance} km</td>
                <td>{route.time}</td>
                <td>
                  <button className="wh-btn wh-btn-warning wh-btn-sm" onClick={() => handleEditRoute(route)}>Sửa</button>
                  <button className="wh-btn wh-btn-danger wh-btn-sm" onClick={() => handleDeleteRoute(route.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* WAREHOUSE */}
      <div className="wh-card" style={{ marginTop: 30 }}>
        <div className="wh-card-header">
          <h3>Kiểm tra Kho hàng</h3>
          <button className="wh-btn wh-btn-primary" onClick={() => {
            setNewItem({ name: '', quantity: '', location: '' });
            setEditItemId(null);
            setShowItemModal(true);
          }}>Thêm Mặt hàng</button>
        </div>
        <table className="wh-table">
          <thead>
            <tr>
              <th>ID Mặt hàng</th>
              <th>Tên Mặt hàng</th>
              <th>Số lượng tồn</th>
              <th>Vị trí</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {warehouseItems.map(item => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.location}</td>
                <td>
                  <button className="wh-btn wh-btn-warning wh-btn-sm" onClick={() => handleEditItem(item)}>Sửa</button>
                  <button className="wh-btn wh-btn-danger wh-btn-sm" onClick={() => handleDeleteItem(item.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL ROUTE */}
      {showRouteModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{editRouteId ? 'Cập nhật Tuyến đường' : 'Thêm Tuyến đường'}</h4>
              <span className="close-btn" onClick={() => setShowRouteModal(false)}>&times;</span>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAddRoute(); }}>
              <div className="form-group">
                <label>Điểm bắt đầu:</label>
                <input type="text" value={newRoute.start} onChange={e => setNewRoute({ ...newRoute, start: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Điểm kết thúc:</label>
                <input type="text" value={newRoute.end} onChange={e => setNewRoute({ ...newRoute, end: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Khoảng cách (km):</label>
                <input type="number" value={newRoute.distance} onChange={e => setNewRoute({ ...newRoute, distance: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Thời gian ước tính (giờ):</label>
                <input type="text" value={newRoute.time} onChange={e => setNewRoute({ ...newRoute, time: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary">Lưu</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowRouteModal(false)}>Hủy</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ITEM */}
      {showItemModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{editItemId ? 'Cập nhật Mặt hàng' : 'Thêm Mặt hàng vào Kho'}</h4>
              <span className="close-btn" onClick={() => setShowItemModal(false)}>&times;</span>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAddItem(); }}>
              <div className="form-group">
                <label>Tên Mặt hàng:</label>
                <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Số lượng:</label>
                <input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Vị trí trong kho:</label>
                <input type="text" value={newItem.location} onChange={e => setNewItem({ ...newItem, location: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary">Lưu</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowItemModal(false)}>Hủy</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouse_Setup;

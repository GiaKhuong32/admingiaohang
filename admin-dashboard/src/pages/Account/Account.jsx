import React, { useState, useEffect } from 'react';
import './Account.css';

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAccountId, setEditAccountId] = useState(null);
  const [newAccount, setNewAccount] = useState({
    Username: '',
    Password: '',
    Role: '',
    Customer_id: '',
    Staff_id: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/accounts');
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách tài khoản:', err);
    }
  };

  const handleAddOrUpdateAccount = async () => {
    const method = editAccountId ? 'PUT' : 'POST';
    const url = `http://localhost:3000/api/accounts${editAccountId ? `/${editAccountId}` : ''}`;
    const payload = {
      Username: newAccount.Username,
      Password: newAccount.Password,
      Role: newAccount.Role,
      Customer_id: newAccount.Customer_id || null,
      Staff_id: newAccount.Staff_id || null
    };

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      resetForm();
      fetchAccounts();
    } catch (err) {
      console.error('Lỗi khi lưu tài khoản:', err);
    }
  };

  const handleEditAccount = (account) => {
    setNewAccount({
      Username: account.Username || '',
      Password: account.Password || '',
      Role: account.Role || '',
      Customer_id: account.Customer_id || '',
      Staff_id: account.Staff_id || ''
    });
    setEditAccountId(account.AccountID);
    setShowModal(true);
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá tài khoản này?')) {
      try {
        await fetch(`http://localhost:3000/api/accounts/${id}`, { method: 'DELETE' });
        fetchAccounts();
      } catch (err) {
        console.error('Lỗi khi xoá tài khoản:', err);
      }
    }
  };

  const resetForm = () => {
    setNewAccount({
      Username: '',
      Password: '',
      Role: '',
      Customer_id: '',
      Staff_id: ''
    });
    setEditAccountId(null);
    setShowModal(false);
  };

  return (
    <div className="ac-section" style={{ padding: 30 }}>
      <div className="ac-card">
        <div className="ac-card-header">
          <h3>Quản lý Tài khoản</h3>
          <button className="ac-btn ac-btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Thêm Tài khoản
          </button>
        </div>

        <table className="ac-table">
          <thead>
            <tr>
              <th>Tên đăng nhập</th>
              <th>Vai trò</th>
              <th>Khách hàng</th>
              <th>Nhân viên</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <tr key={account.AccountID}>
                <td>{account.Username}</td>
                <td>{account.Role}</td>
                <td>{account.CustomerName || 'N/A'}</td>
                <td>{account.StaffName || 'N/A'}</td>
                <td>
                  <button className="ac-btn ac-btn-warning ac-btn-sm" onClick={() => handleEditAccount(account)}>Sửa</button>
                  <button className="ac-btn ac-btn-danger ac-btn-sm" onClick={() => handleDeleteAccount(account.AccountID)}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="ac-modal">
          <div className="ac-modal-content">
            <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateAccount(); }}>
              <h4>{editAccountId ? 'Cập nhật Tài khoản' : 'Thêm Tài khoản'}</h4>

              <div className="ac-form-group">
                <label>Tên đăng nhập</label>
                <input type="text" value={newAccount.Username} onChange={(e) => setNewAccount({ ...newAccount, Username: e.target.value })} required />
              </div>

              <div className="ac-form-group">
                <label>Mật khẩu</label>
                <input type="password" value={newAccount.Password} onChange={(e) => setNewAccount({ ...newAccount, Password: e.target.value })} required />
              </div>

              <div className="ac-form-group">
                <label>Vai trò</label>
                <input type="text" value={newAccount.Role} onChange={(e) => setNewAccount({ ...newAccount, Role: e.target.value })} required />
              </div>

              <div className="ac-form-group">
                <label>Khách hàng ID</label>
                <input type="text" value={newAccount.Customer_id} onChange={(e) => setNewAccount({ ...newAccount, Customer_id: e.target.value })} />
              </div>

              <div className="ac-form-group">
                <label>Nhân viên ID</label>
                <input type="text" value={newAccount.Staff_id} onChange={(e) => setNewAccount({ ...newAccount, Staff_id: e.target.value })} />
              </div>

              <button className="ac-btn ac-btn-primary" type="submit">Lưu</button>
              <button className="ac-btn ac-btn-secondary" type="button" onClick={resetForm}>Hủy</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;

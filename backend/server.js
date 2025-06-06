const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',     
  database: 'ADMIN' 
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối database:', err);
    return;
  }
  console.log(' Kết nối thành công đến MySQL');
});


app.get('/api/vehicles', (req, res) => {
  const query = 'SELECT * FROM vehicles';
  db.query(query, (err, results) => {
    if (err) {
      console.error(' Lỗi truy vấn:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.json(results);
  });
});

app.post('/api/vehicles', (req, res) => {
  const { name, contact_person, phone, address, vehicle_details, status } = req.body;
  const query = `
    INSERT INTO vehicles (name, contact_person, phone, address, vehicle_details, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [name, contact_person, phone, address, vehicle_details, status], (err, result) => {
    if (err) {
      console.error('Lỗi khi thêm:', err);
      return res.status(500).json({ error: 'Lỗi server khi thêm' });
    }
    res.json({ message: 'Thêm thành công', insertId: result.insertId });
  });
});


app.put('/api/vehicles/:id', (req, res) => {
  const { name, contact_person, phone, address, vehicle_details, status } = req.body;
  const id = req.params.id;
  const query = `
    UPDATE vehicles SET
    name = ?, contact_person = ?, phone = ?, address = ?, vehicle_details = ?, status = ?
    WHERE id = ?
  `;
  db.query(query, [name, contact_person, phone, address, vehicle_details, status, id], (err) => {
    if (err) {
      console.error('Lỗi khi cập nhật:', err);
      return res.status(500).json({ error: 'Lỗi server khi cập nhật' });
    }
    res.json({ message: 'Cập nhật thành công' });
  });
});


app.delete('/api/vehicles/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM vehicles WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Lỗi khi xoá:', err);
      return res.status(500).json({ error: 'Lỗi server khi xoá' });
    }
    res.json({ message: 'Xoá thành công' });
  });
});


// Lấy đơn hàng Api 

app.get('/api/orders', (req, res) => {
  const query = 'SELECT * FROM orders';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy orders:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.json(results);
  });
});

app.post('/api/orders', (req, res) => {
  const { customer_name, pickup_address, delivery_address, shipper_id, status, order_date } = req.body;
  const query = `
    INSERT INTO orders (customer_name, pickup_address, delivery_address, shipper_id, status, order_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [customer_name, pickup_address, delivery_address, shipper_id, status, order_date], (err, result) => {
    if (err) {
      console.error('Lỗi khi thêm order:', err);
      return res.status(500).json({ error: 'Lỗi khi thêm đơn hàng' });
    }
    res.json({ message: 'Thêm đơn hàng thành công', insertId: result.insertId });
  });
});


app.put('/api/orders/:id', (req, res) => {
  const id = req.params.id;
  const { customer_name, pickup_address, delivery_address, shipper_id, status, order_date } = req.body;
  const query = `
    UPDATE orders
    SET customer_name = ?, pickup_address = ?, delivery_address = ?, shipper_id = ?, status = ?, order_date = ?
    WHERE id = ?
  `;
  db.query(query, [customer_name, pickup_address, delivery_address, shipper_id, status, order_date, id], (err) => {
    if (err) {
      console.error('Lỗi khi cập nhật order:', err);
      return res.status(500).json({ error: 'Lỗi khi cập nhật đơn hàng' });
    }
    res.json({ message: 'Cập nhật đơn hàng thành công' });
  });
});


app.delete('/api/orders/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM orders WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Lỗi khi xoá order:', err);
      return res.status(500).json({ error: 'Lỗi khi xoá đơn hàng' });
    }
    res.json({ message: 'Xoá đơn hàng thành công' });
  });
});

//user người dùng 

app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy users:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.json(results);
  });
});


app.post('/api/users', (req, res) => {
  const { name, email, phone, role, status, password } = req.body;
  const query = `
    INSERT INTO users (name, email, phone, role, status, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [name, email, phone, role, status, password], (err, result) => {
    if (err) {
      console.error('Lỗi khi thêm user:', err);
      return res.status(500).json({ error: 'Lỗi thêm người dùng' });
    }
    res.json({ message: 'Thêm user thành công', insertId: result.insertId });
  });
});


app.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, phone, role, status, password } = req.body;
  const query = `
    UPDATE users
    SET name = ?, email = ?, phone = ?, role = ?, status = ?, password = ?
    WHERE id = ?
  `;
  db.query(query, [name, email, phone, role, status, password, id], (err) => {
    if (err) {
      console.error('Lỗi khi cập nhật user:', err);
      return res.status(500).json({ error: 'Lỗi cập nhật người dùng' });
    }
    res.json({ message: 'Cập nhật user thành công' });
  });
});


app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Lỗi khi xoá user:', err);
      return res.status(500).json({ error: 'Lỗi xoá người dùng' });
    }
    res.json({ message: 'Xoá user thành công' });
  });
});


// Lấy danh sách tuyến
app.get('/api/routes', (req, res) => {
  db.query('SELECT * FROM routes', (err, results) => {
    if (err) {
      console.error('Lỗi lấy routes:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.json(results);
  });
});


app.post('/api/routes', (req, res) => {
  const { start, end, distance, time } = req.body;
  const query = 'INSERT INTO routes (start, end, distance, time) VALUES (?, ?, ?, ?)';
  db.query(query, [start, end, distance, time], (err, result) => {
    if (err) {
      console.error('Lỗi thêm route:', err);
      return res.status(500).json({ error: 'Lỗi thêm tuyến đường' });
    }
    res.json({ message: 'Thêm tuyến thành công', insertId: result.insertId });
  });
});


app.put('/api/routes/:id', (req, res) => {
  const id = req.params.id;
  const { start, end, distance, time } = req.body;
  const query = 'UPDATE routes SET start = ?, end = ?, distance = ?, time = ? WHERE id = ?';
  db.query(query, [start, end, distance, time, id], (err) => {
    if (err) {
      console.error('Lỗi cập nhật route:', err);
      return res.status(500).json({ error: 'Lỗi cập nhật tuyến đường' });
    }
    res.json({ message: 'Cập nhật tuyến thành công' });
  });
});


app.delete('/api/routes/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM routes WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Lỗi xoá route:', err);
      return res.status(500).json({ error: 'Lỗi xoá tuyến đường' });
    }
    res.json({ message: 'Xoá tuyến thành công' });
  });
});

// lấy danh sách hàng hóa
app.get('/api/warehouse-items', (req, res) => {
  db.query('SELECT * FROM warehouse_items', (err, results) => {
    if (err) {
      console.error('Lỗi lấy warehouse items:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.json(results);
  });
});


app.post('/api/warehouse-items', (req, res) => {
  const { name, quantity, location } = req.body;
  const query = 'INSERT INTO warehouse_items (name, quantity, location) VALUES (?, ?, ?)';
  db.query(query, [name, quantity, location], (err, result) => {
    if (err) {
      console.error('Lỗi thêm warehouse item:', err);
      return res.status(500).json({ error: 'Lỗi thêm mặt hàng' });
    }
    res.json({ message: 'Thêm mặt hàng thành công', insertId: result.insertId });
  });
});


app.put('/api/warehouse-items/:id', (req, res) => {
  const id = req.params.id;
  const { name, quantity, location } = req.body;
  const query = 'UPDATE warehouse_items SET name = ?, quantity = ?, location = ? WHERE id = ?';
  db.query(query, [name, quantity, location, id], (err) => {
    if (err) {
      console.error('Lỗi cập nhật warehouse item:', err);
      return res.status(500).json({ error: 'Lỗi cập nhật mặt hàng' });
    }
    res.json({ message: 'Cập nhật mặt hàng thành công' });
  });
});


app.delete('/api/warehouse-items/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM warehouse_items WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Lỗi xoá warehouse item:', err);
      return res.status(500).json({ error: 'Lỗi xoá mặt hàng' });
    }
    res.json({ message: 'Xoá mặt hàng thành công' });
  });
});

// Lấy thống kê tổng quan admin dashboard
app.get('/api/dashboard-stats', (req, res) => {
  const query = 'SELECT stat_name, stat_value FROM admin_dashboard_stats';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy dashboard stats:', err);
      return res.status(500).json({ error: 'Lỗi server khi lấy thống kê' });
    }
    res.json(results);
  });
});

// Lấy toàn bộ danh sách thanh toán
app.get('/api/payments', (req, res) => {
  db.query('SELECT * FROM payments', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


app.put('/api/payments/:id/confirm', (req, res) => {
  const paymentId = req.params.id;
  db.query('UPDATE payments SET status = "Paid" WHERE id = ?', [paymentId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Thanh toán đã được xác nhận.' });
  });
});

// Lấy báo cáo hệ thống hôm nay
app.get('/api/system-report/today', (req, res) => {
  const query = 'SELECT * FROM system_reports WHERE report_date = CURDATE() LIMIT 1';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy báo cáo hệ thống:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Không có dữ liệu hôm nay' });
    }
    res.json(results[0]);
  });
});


app.listen(port, () => {
  console.log(` Server đang chạy tại http://localhost:${port}`);
});

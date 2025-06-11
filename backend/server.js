
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
  database: 'logistic_system'
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối database:', err);
    return;
  }
  console.log('Kết nối thành công đến MySQL');
});


app.get('/api/customers', (req, res) => {
  db.query('SELECT * FROM Customer', (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy danh sách khách hàng' });
    res.json(results);
  });
});


app.put('/api/customers/:id', (req, res) => {
  const id = req.params.id;
  const { Customer_type, Name, Phone, Street, Ward, District, City } = req.body;
  const query = 'UPDATE Customer SET Customer_type = ?, Name = ?, Phone = ?, Street = ?, Ward = ?, District = ?, City = ? WHERE CustomerID = ?';
  db.query(query, [Customer_type, Name, Phone, Street, Ward, District, City, id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật khách hàng' });
    res.json({ message: 'Cập nhật khách hàng thành công' });
  });
});



app.get('/api/staff', (req, res) => {
  db.query('SELECT * FROM Staff', (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy danh sách nhân viên' });
    res.json(results);
  });
});

app.post('/api/staff', (req, res) => {
  const { Name, Position, Phone, Email, Employment_date, Is_active } = req.body;
  const query = 'INSERT INTO Staff (Name, Position, Phone, Email, Employment_date, Is_active) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [Name, Position, Phone, Email, Employment_date, Is_active], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi thêm nhân viên' });
    res.json({ message: 'Thêm nhân viên thành công', insertId: result.insertId });
  });
});

app.put('/api/staff/:id', (req, res) => {
  const id = req.params.id;
  const { Name, Position, Phone, Email, Employment_date, Is_active } = req.body;
  const query = 'UPDATE Staff SET Name = ?, Position = ?, Phone = ?, Email = ?, Employment_date = ?, Is_active = ? WHERE StaffID = ?';
  db.query(query, [Name, Position, Phone, Email, Employment_date, Is_active, id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật nhân viên' });
    res.json({ message: 'Cập nhật nhân viên thành công' });
  });
});

app.delete('/api/staff/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Staff WHERE StaffID = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi xoá nhân viên' });
    res.json({ message: 'Xoá nhân viên thành công' });
  });
});


app.get('/api/warehouses', (req, res) => {
  const query = `
    SELECT w.*, s.Name AS ManagerName
    FROM Warehouse w
    LEFT JOIN Staff s ON w.Manager_id = s.StaffID
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy danh sách kho' });
    res.json(results);
  });
});


app.post('/api/warehouses', (req, res) => {
  const { Name, Street, Ward, District, City, Manager_id } = req.body;
  const query = `
    INSERT INTO Warehouse (Name, Street, Ward, District, City, Manager_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [Name, Street, Ward, District, City, Manager_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi thêm kho' });
    res.json({ message: 'Thêm kho thành công', insertId: result.insertId });
  });
});


app.put('/api/warehouses/:id', (req, res) => {
  const id = req.params.id;
  const { Name, Street, Ward, District, City, Manager_id } = req.body;
  const query = `
    UPDATE Warehouse
    SET Name = ?, Street = ?, Ward = ?, District = ?, City = ?, Manager_id = ?
    WHERE WarehouseID = ?
  `;
  db.query(query, [Name, Street, Ward, District, City, Manager_id, id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật kho' });
    res.json({ message: 'Cập nhật kho thành công' });
  });
});


app.delete('/api/warehouses/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Warehouse WHERE WarehouseID = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi xoá kho' });
    res.json({ message: 'Xoá kho thành công' });
  });
});


app.get('/api/services', (req, res) => {
  const query = 'SELECT * FROM Service';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy danh sách dịch vụ' });
    res.json(results);
  });
});


app.post('/api/services', (req, res) => {
  const { Service_name, Description, Price, Delivery_time_min, Delivery_time_max, Is_active } = req.body;
  const query = `
    INSERT INTO Service (Service_name, Description, Price, Delivery_time_min, Delivery_time_max, Is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [Service_name, Description, Price, Delivery_time_min, Delivery_time_max, Is_active], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi thêm dịch vụ' });
    res.json({ message: 'Thêm dịch vụ thành công', insertId: result.insertId });
  });
});


app.put('/api/services/:id', (req, res) => {
  const id = req.params.id;
  const { Service_name, Description, Price, Delivery_time_min, Delivery_time_max, Is_active } = req.body;
  const query = `
    UPDATE Service
    SET Service_name = ?, Description = ?, Price = ?, Delivery_time_min = ?, Delivery_time_max = ?, Is_active = ?
    WHERE Service_id = ?
  `;
  db.query(query, [Service_name, Description, Price, Delivery_time_min, Delivery_time_max, Is_active, id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật dịch vụ' });
    res.json({ message: 'Cập nhật dịch vụ thành công' });
  });
});

app.delete('/api/services/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM Service WHERE Service_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi xoá dịch vụ' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy dịch vụ' });
    }
    res.json({ message: 'Xoá dịch vụ thành công' });
  });
});


app.get('/api/orders', (req, res) => {
  const query = `
    SELECT o.*, c.Name AS SenderName, s.Service_name
    FROM \`Order\` o
    LEFT JOIN Customer c ON o.Sender_id = c.CustomerID
    LEFT JOIN Service s ON o.Service_id = s.Service_id
    ORDER BY o.Created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy danh sách đơn hàng' });
    res.json(results);
  });
});

// Thêm đơn hàng mới
app.post('/api/orders', (req, res) => {
  const { Order_code, Sender_id, Service_id, Total_package, Total_weight, Ship_cost, Payment_status, Order_status } = req.body;
  const query = `
    INSERT INTO \`Order\` (Order_code, Sender_id, Service_id, Total_package, Total_weight, Ship_cost, Payment_status, Order_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [Order_code, Sender_id, Service_id, Total_package, Total_weight, Ship_cost, Payment_status, Order_status], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi tạo đơn hàng' });
    res.json({ message: 'Thêm đơn hàng thành công', insertId: result.insertId });
  });
});

// Cập nhật đơn hàng
app.put('/api/orders/:id', (req, res) => {
  const id = req.params.id;
  const { Order_code, Sender_id, Service_id, Total_package, Total_weight, Ship_cost, Payment_status, Order_status } = req.body;
  const query = `
    UPDATE \`Order\` 
    SET Order_code = ?, Sender_id = ?, Service_id = ?, Total_package = ?, Total_weight = ?, Ship_cost = ?, Payment_status = ?, Order_status = ?
    WHERE OrderID = ?
  `;
  db.query(query, [Order_code, Sender_id, Service_id, Total_package, Total_weight, Ship_cost, Payment_status, Order_status, id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật đơn hàng' });
    res.json({ message: 'Cập nhật đơn hàng thành công' });
  });
});

// Xoá đơn hàng
app.delete('/api/orders/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM `Order` WHERE OrderID = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi xoá đơn hàng' });
    res.json({ message: 'Xoá đơn hàng thành công' });
  });
});

// Lấy danh sách thanh toán kèm mã đơn hàng
app.get('/api/payments', (req, res) => {
  const query = `
    SELECT p.*, o.Order_code
    FROM Payment p
    LEFT JOIN \`Order\` o ON p.Order_id = o.OrderID
    ORDER BY p.Created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy danh sách thanh toán' });
    res.json(results);
  });
});

// Thêm thanh toán mới
app.post('/api/payments', (req, res) => {
  const { Order_id, Payment_method, Amount, Payment_date, Transaction_id, Notes } = req.body;
  const query = `
    INSERT INTO Payment (Order_id, Payment_method, Amount, Payment_date, Transaction_id, Notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [Order_id, Payment_method, Amount, Payment_date, Transaction_id, Notes], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi thêm thanh toán' });
    res.json({ message: 'Thêm thanh toán thành công', insertId: result.insertId });
  });
});

// Cập nhật thanh toán
app.put('/api/payments/:id', (req, res) => {
  const id = req.params.id;
  const { Order_id, Payment_method, Amount, Payment_date, Transaction_id, Notes } = req.body;
  const query = `
    UPDATE Payment
    SET Order_id = ?, Payment_method = ?, Amount = ?, Payment_date = ?, Transaction_id = ?, Notes = ?
    WHERE PaymentID = ?
  `;
  db.query(query, [Order_id, Payment_method, Amount, Payment_date, Transaction_id, Notes, id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật thanh toán' });
    res.json({ message: 'Cập nhật thanh toán thành công' });
  });
});

// Xoá thanh toán
app.delete('/api/payments/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Payment WHERE PaymentID = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi xoá thanh toán' });
    res.json({ message: 'Xoá thanh toán thành công' });
  });
});

// Lấy danh sách kiện hàng (có JOIN đơn, sender, receiver, dịch vụ, kho hiện tại)
app.get('/api/packages', (req, res) => {
  const query = `
    SELECT p.*, 
           o.Order_code, 
           s.Name AS SenderName, 
           r.Name AS ReceiverName, 
           sv.Service_name, 
           w.Name AS CurrentWarehouse
    FROM Package p
    LEFT JOIN \`Order\` o ON p.Order_id = o.OrderID
    LEFT JOIN Customer s ON p.Sender_id = s.CustomerID
    LEFT JOIN Customer r ON p.Receiver_id = r.CustomerID
    LEFT JOIN Service sv ON p.Service_id = sv.Service_id
    LEFT JOIN Warehouse w ON p.Current_Warehouse_id = w.WarehouseID
    ORDER BY p.Created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy danh sách kiện hàng' });
    res.json(results);
  });
});

// Thêm kiện hàng mới
app.post('/api/packages', (req, res) => {
  const {
    Order_id, Sender_id, Receiver_id, Service_id,
    Weight, Dimensions, Description, Value,
    Current_Warehouse_id, Status, Estimated_delivery, Is_fragile
  } = req.body;

  const query = `
    INSERT INTO Package (
      Order_id, Sender_id, Receiver_id, Service_id,
      Weight, Dimensions, Description, Value,
      Current_Warehouse_id, Status, Estimated_delivery, Is_fragile
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    Order_id, Sender_id, Receiver_id, Service_id,
    Weight, Dimensions, Description, Value,
    Current_Warehouse_id, Status, Estimated_delivery, Is_fragile
  ], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi thêm kiện hàng' });
    res.json({ message: 'Thêm kiện hàng thành công', insertId: result.insertId });
  });
});

// Cập nhật kiện hàng
app.put('/api/packages/:id', (req, res) => {
  const id = req.params.id;
  const {
    Order_id, Sender_id, Receiver_id, Service_id,
    Weight, Dimensions, Description, Value,
    Current_Warehouse_id, Status, Estimated_delivery, Is_fragile
  } = req.body;

  const query = `
    UPDATE Package
    SET Order_id = ?, Sender_id = ?, Receiver_id = ?, Service_id = ?,
        Weight = ?, Dimensions = ?, Description = ?, Value = ?,
        Current_Warehouse_id = ?, Status = ?, Estimated_delivery = ?, Is_fragile = ?
    WHERE PackageID = ?
  `;

  db.query(query, [
    Order_id, Sender_id, Receiver_id, Service_id,
    Weight, Dimensions, Description, Value,
    Current_Warehouse_id, Status, Estimated_delivery, Is_fragile,
    id
  ], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật kiện hàng' });
    res.json({ message: 'Cập nhật kiện hàng thành công' });
  });
});

// Xoá kiện hàng
app.delete('/api/packages/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Package WHERE PackageID = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi xoá kiện hàng' });
    res.json({ message: 'Xoá kiện hàng thành công' });
  });
});
// Lấy danh sách phương tiện
app.get('/api/vehicles', (req, res) => {
  const query = `
    SELECT v.*, w.Name AS CurrentWarehouse
    FROM Vehicle v
    LEFT JOIN Warehouse w ON v.Current_wh_id = w.WarehouseID
    ORDER BY v.Created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy danh sách phương tiện' });
    res.json(results);
  });
});

// Thêm phương tiện mới
app.post('/api/vehicles', (req, res) => {
  const { Vehicle_type, License_plate, capacity_weight, Current_wh_id, Status, Last_maintenance } = req.body;
  const query = `
    INSERT INTO Vehicle (Vehicle_type, License_plate, capacity_weight, Current_wh_id, Status, Last_maintenance)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [Vehicle_type, License_plate, capacity_weight, Current_wh_id, Status, Last_maintenance], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi thêm phương tiện' });
    res.json({ message: 'Thêm phương tiện thành công', insertId: result.insertId });
  });
});

// Cập nhật phương tiện
app.put('/api/vehicles/:id', (req, res) => {
  const id = req.params.id;
  const { Vehicle_type, License_plate, capacity_weight, Current_wh_id, Status, Last_maintenance } = req.body;
  const query = `
    UPDATE Vehicle
    SET Vehicle_type = ?, License_plate = ?, capacity_weight = ?, Current_wh_id = ?, Status = ?, Last_maintenance = ?
    WHERE VehicleID = ?
  `;
  db.query(query, [Vehicle_type, License_plate, capacity_weight, Current_wh_id, Status, Last_maintenance, id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật phương tiện' });
    res.json({ message: 'Cập nhật phương tiện thành công' });
  });
});

// Xoá phương tiện
app.delete('/api/vehicles/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Vehicle WHERE VehicleID = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi xoá phương tiện' });
    res.json({ message: 'Xoá phương tiện thành công' });
  });
});

// Lấy tất cả tracking

app.get('/api/tracking', (req, res) => {
  const query = `
    SELECT t.*, s.Name AS StaffName
    FROM Tracking t
    LEFT JOIN Staff s ON t.Staff_id = s.StaffID
    ORDER BY t.Timestamp ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy toàn bộ tracking' });
    res.json(results);
  });
});

app.put('/api/tracking/:id', (req, res) => {
  const id = req.params.id;
  const { Status } = req.body;

  const query = `UPDATE Tracking SET Status = ? WHERE TrackingID = ?`;
  db.query(query, [Status, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái' });
    res.json({ message: 'Cập nhật trạng thái thành công' });
  });
});


// Lấy danh sách lộ trình
app.get('/api/routes', (req, res) => {
  const query = `
    SELECT r.*, v.Vehicle_type, v.License_plate, 
           s.Name AS DriverName,
           w1.Name AS StartWarehouse,
           w2.Name AS EndWarehouse
    FROM Route r
    LEFT JOIN Vehicle v ON r.Vehicle_id = v.VehicleID
    LEFT JOIN Staff s ON r.Driver_id = s.StaffID
    LEFT JOIN Warehouse w1 ON r.Start_wh_id = w1.WarehouseID
    LEFT JOIN Warehouse w2 ON r.End_wh_id = w2.WarehouseID
    ORDER BY r.Created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy lộ trình' });
    res.json(results);
  });
});

// Tạo lộ trình mới
app.post('/api/routes', (req, res) => {
  const {
    Route_code, Vehicle_id, Driver_id, Start_wh_id, End_wh_id,
    Departure_time, Estimated_time, Actual_time, Status
  } = req.body;

  const query = `
    INSERT INTO Route (Route_code, Vehicle_id, Driver_id, Start_wh_id, End_wh_id,
      Departure_time, Estimated_time, Actual_time, Status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [Route_code, Vehicle_id, Driver_id, Start_wh_id, End_wh_id,
    Departure_time, Estimated_time, Actual_time, Status], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi tạo lộ trình' });
    res.json({ message: 'Tạo lộ trình thành công', insertId: result.insertId });
  });
});

// Cập nhật lộ trình
app.put('/api/routes/:id', (req, res) => {
  const id = req.params.id;
  const {
    Route_code, Vehicle_id, Driver_id, Start_wh_id, End_wh_id,
    Departure_time, Estimated_time, Actual_time, Status
  } = req.body;

  const query = `
    UPDATE Route
    SET Route_code = ?, Vehicle_id = ?, Driver_id = ?, Start_wh_id = ?, End_wh_id = ?,
        Departure_time = ?, Estimated_time = ?, Actual_time = ?, Status = ?
    WHERE RouteID = ?
  `;

  db.query(query, [Route_code, Vehicle_id, Driver_id, Start_wh_id, End_wh_id,
    Departure_time, Estimated_time, Actual_time, Status, id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật lộ trình' });
    res.json({ message: 'Cập nhật lộ trình thành công' });
  });
});

// Xoá lộ trình
app.delete('/api/routes/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Route WHERE RouteID = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi xoá lộ trình' });
    res.json({ message: 'Xoá lộ trình thành công' });
  });
});

// Lấy các điểm dừng của một tuyến
app.get('/api/routes/:routeId/points', (req, res) => {
  const routeId = req.params.routeId;
  const query = `
    SELECT rp.*, w.Name AS WarehouseName
    FROM Route_point rp
    LEFT JOIN Warehouse w ON rp.Warehouse_id = w.WarehouseID
    WHERE rp.Route_id = ?
    ORDER BY rp.Sequence_number ASC
  `;
  db.query(query, [routeId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy điểm dừng' });
    res.json(results);
  });
});

// Thêm điểm dừng mới
app.post('/api/routes/:routeId/points', (req, res) => {
  const routeId = req.params.routeId;
  const { Warehouse_id, Sequence_number, Estimated_arrival, Actual_arrival, Status } = req.body;

  const query = `
    INSERT INTO Route_point (Route_id, Warehouse_id, Sequence_number, Estimated_arrival, Actual_arrival, Status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [routeId, Warehouse_id, Sequence_number, Estimated_arrival, Actual_arrival, Status], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi thêm điểm dừng' });
    res.json({ message: 'Thêm điểm dừng thành công', insertId: result.insertId });
  });
});

// Cập nhật điểm dừng
app.put('/api/route-points/:id', (req, res) => {
  const id = req.params.id;
  const { Sequence_number, Estimated_arrival, Actual_arrival, Status } = req.body;

  const query = `
    UPDATE Route_point
    SET Sequence_number = ?, Estimated_arrival = ?, Actual_arrival = ?, Status = ?
    WHERE Route_pointID = ?
  `;

  db.query(query, [Sequence_number, Estimated_arrival, Actual_arrival, Status, id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật điểm dừng' });
    res.json({ message: 'Cập nhật điểm dừng thành công' });
  });
});

// Xoá điểm dừng
app.delete('/api/route-points/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Route_point WHERE Route_pointID = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi xoá điểm dừng' });
    res.json({ message: 'Xoá điểm dừng thành công' });
  });
});

// Lấy danh sách giao dịch
app.get('/api/transactions', (req, res) => {
  const query = `
    SELECT t.*, c.Name AS CustomerName, o.Order_code
    FROM Transactions t
    LEFT JOIN Customer c ON t.Customer_id = c.CustomerID
    LEFT JOIN \`Order\` o ON t.Order_id = o.OrderID
    ORDER BY t.Created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy giao dịch' });
    res.json(results);
  });
});

// Thêm giao dịch mới
app.post('/api/transactions', (req, res) => {
  const { Customer_id, Order_id, Amount, Transansaction_type, Status, Description } = req.body;
  const query = `
    INSERT INTO Transactions (Customer_id, Order_id, Amount, Transansaction_type, Status, Description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [Customer_id, Order_id, Amount, Transansaction_type, Status, Description], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi thêm giao dịch' });
    res.json({ message: 'Thêm giao dịch thành công', insertId: result.insertId });
  });
});

// Cập nhật giao dịch
app.put('/api/transactions/:id', (req, res) => {
  const id = req.params.id;
  const { Amount, Transansaction_type, Status, Description } = req.body;
  const query = `
    UPDATE Transactions
    SET Amount = ?, Transansaction_type = ?, Status = ?, Description = ?
    WHERE Transaction_id = ?
  `;
  db.query(query, [Amount, Transansaction_type, Status, Description, id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật giao dịch' });
    res.json({ message: 'Cập nhật giao dịch thành công' });
  });
});

// Lấy danh sách tài khoản
app.get('/api/accounts', (req, res) => {
  const query = `
    SELECT a.*, c.Name AS CustomerName, s.Name AS StaffName
    FROM Account a
    LEFT JOIN Customer c ON a.Customer_id = c.CustomerID
    LEFT JOIN Staff s ON a.Staff_id = s.StaffID
    ORDER BY a.AccountID DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi lấy danh sách tài khoản' });
    res.json(results);
  });
});

// Tạo tài khoản mới
app.post('/api/accounts', (req, res) => {
  const { Username, Password, Role, Balance, Customer_id, Staff_id } = req.body;
  const query = `
    INSERT INTO Account (Username, Password, Role, Balance, Customer_id, Staff_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [Username, Password, Role, Balance, Customer_id, Staff_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi tạo tài khoản' });
    res.json({ message: 'Tạo tài khoản thành công', insertId: result.insertId });
  });
});

// Cập nhật tài khoản
app.put('/api/accounts/:id', (req, res) => {
  const id = req.params.id;
  const { Password, Role, Balance } = req.body;
  const query = `
    UPDATE Account
    SET Password = ?, Role = ?, Balance = ?
    WHERE AccountID = ?
  `;
  db.query(query, [Password, Role, Balance, id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi cập nhật tài khoản' });
    res.json({ message: 'Cập nhật tài khoản thành công' });
  });
});

// Xoá tài khoản
app.delete('/api/accounts/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Account WHERE AccountID = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi xoá tài khoản' });
    res.json({ message: 'Xoá tài khoản thành công' });
  });
});



app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});

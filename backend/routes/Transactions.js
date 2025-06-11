const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

module.exports = router;

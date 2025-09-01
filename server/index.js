const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

const PORT = 5000;

// =================================================================
// CUSTOMER ROUTES
// =================================================================

// POST: Create a new customer
app.post("/api/customers", (req, res) => {
    const { first_name, last_name, phone_number, addresses } = req.body;

    // Server-side validation
    if (!first_name || !last_name || !phone_number || !addresses || !Array.isArray(addresses) || addresses.length === 0) {
        return res.status(400).json({ "error": "Missing required fields." });
    }

    if (!numberRegex.test(phone_number)) {
        return res.status(400).json({ "error": "Phone number must contain only numbers." });
    }

    for (const addr of addresses) {
        if (!numberRegex.test(addr.pin_code)) {
            return res.status(400).json({ "error": `Pin code "${addr.pin_code}" must contain only numbers.` });
        }
    }

    const customerSql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?,?,?)`;
    const customerParams = [first_name, last_name, phone_number];

    db.run(customerSql, customerParams, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ "error": "Phone number already exists." });
            }
            return res.status(400).json({ "error": err.message });
        }

        const customerId = this.lastID;
        const addressSql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?,?,?,?,?)`;
        
        addresses.forEach(addr => {
            db.run(addressSql, [customerId, addr.address_details, addr.city, addr.state, addr.pin_code]);
        });
        
        res.status(201).json({
            "message": "success",
            "data": { id: customerId, ...req.body }
        });
    });
});

// GET: Get all customers (with search, sort, and pagination)
app.get("/api/customers", (req, res) => {
    const { search, city, state, pincode, page = 1, limit = 10, sortBy = 'id', order = 'ASC' } = req.query;
    
    let sql = `
        SELECT DISTINCT c.id, c.first_name, c.last_name, c.phone_number,
        (SELECT COUNT(*) FROM addresses a2 WHERE a2.customer_id = c.id) as address_count
        FROM customers c
        LEFT JOIN addresses a ON c.id = a.customer_id
    `;
    const params = [];
    const whereClauses = [];

    if (search) {
        whereClauses.push(`(c.first_name LIKE ? OR c.last_name LIKE ? OR c.phone_number LIKE ?)`);
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }
    if (city) {
        whereClauses.push(`a.city LIKE ?`);
        params.push(`%${city}%`);
    }
    if (state) {
        whereClauses.push(`a.state LIKE ?`);
        params.push(`%${state}%`);
    }
    if (pincode) {
        whereClauses.push(`a.pin_code LIKE ?`);
        params.push(`%${pincode}%`);
    }

    if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // Sorting
    const validSortColumns = ['id', 'first_name', 'last_name'];
    if (validSortColumns.includes(sortBy)) {
        sql += ` ORDER BY c.${sortBy} ${order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
    }
    
    // Pagination
    const offset = (page - 1) * limit;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        // A second query to get the total count for pagination
        const countSql = `SELECT COUNT(DISTINCT c.id) as count FROM customers c LEFT JOIN addresses a ON c.id = a.customer_id ${whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : ''}`;
        const countParams = params.slice(0, params.length - 2); // Remove limit and offset
        db.get(countSql, countParams, (err, countRow) => {
            if (err) {
                return res.status(400).json({ "error": err.message });
            }
             res.json({
                message: "success",
                data: rows,
                totalPages: Math.ceil(countRow.count / limit),
                currentPage: parseInt(page)
            });
        });
    });
});


// GET: Get a single customer by ID with their addresses
app.get("/api/customers/:id", (req, res) => {
    const customerSql = `SELECT * FROM customers WHERE id = ?`;
    const addressSql = `SELECT * FROM addresses WHERE customer_id = ?`;

    db.get(customerSql, [req.params.id], (err, customer) => {
        if (err) return res.status(400).json({ "error": err.message });
        if (!customer) return res.status(404).json({ "error": "Customer not found." });

        db.all(addressSql, [req.params.id], (err, addresses) => {
            if (err) return res.status(400).json({ "error": err.message });
            res.json({
                "message": "success",
                "data": { ...customer, addresses }
            });
        });
    });
});


// PUT: Update customer details
app.put("/api/customers/:id", (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    const sql = `UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?`;
    const params = [first_name, last_name, phone_number, req.params.id];
    
    db.run(sql, params, function(err) {
        if (err) return res.status(400).json({ "error": res.message });
        res.json({
            message: "success",
            changes: this.changes
        });
    });
});


// DELETE: Delete a customer
app.delete("/api/customers/:id", (req, res) => {
    // Note: Because we used ON DELETE CASCADE, deleting a customer will also delete their addresses.
    db.run(`DELETE FROM customers WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(400).json({ "error": res.message });
        if (this.changes === 0) return res.status(404).json({ "error": "Customer not found." });
        res.json({ "message": "deleted", changes: this.changes });
    });
});

// =================================================================
// ADDRESS ROUTES (Follow the pattern above)
// =================================================================

// POST: Add a new address to a customer
app.post("/api/customers/:id/addresses", (req, res) => {
    const { address_details, city, state, pin_code } = req.body;
    const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?,?,?,?,?)`;
    db.run(sql, [req.params.id, address_details, city, state, pin_code], function (err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.status(201).json({ message: "success", id: this.lastID });
    });
});

// PUT: Update a specific address
app.put("/api/addresses/:addressId", (req, res) => {
    const { address_details, city, state, pin_code } = req.body;
    const sql = `UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?`;
    db.run(sql, [address_details, city, state, pin_code, req.params.addressId], function(err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ message: "success", changes: this.changes });
    });
});

// DELETE: Delete a specific address
app.delete("/api/addresses/:addressId", (req, res) => {
    db.run(`DELETE FROM addresses WHERE id = ?`, req.params.addressId, function(err) {
        if (err) return res.status(400).json({ "error": res.message });
        res.json({ "message": "deleted", changes: this.changes });
    });
});


// START SERVER
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
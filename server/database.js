const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE = "database.db";

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        // SQL statements to create the tables
        const createCustomerTableSql = `
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                phone_number TEXT NOT NULL UNIQUE CHECK (phone_number NOT GLOB '*[0-9]*' AND length(phone_number) BETWEEN 10 AND 15)
            )`;

        const createAddressTableSql = `
            CREATE TABLE IF NOT EXISTS addresses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id INTEGER,
                address_details TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                pin_code TEXT NOT NULL CHECK (pin_code NOT GLOB '*[0-9]*' AND length(pin_code) = 6),
                FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
            )`;

        db.run(createCustomerTableSql, (err) => {
            if (err) {
                console.error("Error creating customers table:", err.message);
            }
        });
        
        db.run(createAddressTableSql, (err) => {
            if (err) {
                console.error("Error creating addresses table:", err.message);
            }
        });
    }
});

module.exports = db;
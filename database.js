const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("cyberscan.db", (err) => {

    if (err) {

        console.log(err.message);

    } else {

        console.log("Database connected ✅");

    }

});


// =========================
// جدول المستخدمين
// =========================

db.run(`

CREATE TABLE IF NOT EXISTS users (

id INTEGER PRIMARY KEY AUTOINCREMENT,

name TEXT NOT NULL,

email TEXT UNIQUE NOT NULL,

password TEXT NOT NULL

)

`);


// =========================
// جدول الفحوصات
// =========================

db.run(`

CREATE TABLE IF NOT EXISTS scans (

id INTEGER PRIMARY KEY AUTOINCREMENT,

target TEXT,

score INTEGER,

risk TEXT,

scan_date DATETIME DEFAULT CURRENT_TIMESTAMP

)

`);

module.exports = db;
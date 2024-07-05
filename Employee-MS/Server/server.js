const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./connection");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up ejs as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error("Database connection failed: " + error.stack);
    return;
  }
  console.log("Connected to database.");
});

// Add a new employee
app.post("/add-employee", (req, res) => {
  const { name, joining_date, agreementTill, email, salary, phone_number } =
    req.body;
  const sql =
    "INSERT INTO employee (name, joining_date, agreementTill, email, salary, phone_number) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [name, joining_date, agreementTill, email, salary, phone_number],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Server error");
        return;
      }
      res.redirect("/employee");
    }
  );
});

// Delete an employee
app.post("/delete-employee", (req, res) => {
  const id = req.body.employeeId;
  const sql = "DELETE FROM employee WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
      return;
    }
    res.redirect("/employee");
  });
});

// Fetch all employees
app.get("/employee", (req, res) => {
  connection.query("SELECT * FROM employee", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
      return;
    }
    res.json(result);
  });
});

// Start the server
app.listen(3001);

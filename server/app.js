const mysql = require("mysql2");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD
  })
  .promise();

/**
 * @description Get All note
 * @route GET /utilisateurs
 */
const getAllUsers = (
  async function (req, res, next) {
    let sql = "SELECT * from utilisateur";
    const [rows] = await pool.query(sql);
    if (!rows.length) return res.status(200).json({ utilisateurs: [] });

    return res.status(200).json({ utilisateurs: rows });
  }
)


const router = express.Router();

router.route("/").get(getAllUsers);

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// api routes
app.use("/users", router);

module.exports = app;
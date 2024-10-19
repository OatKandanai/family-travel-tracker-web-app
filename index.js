import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

env.config();

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId;
let errorMessage;

async function checkVisisted(id) {
  const result = await db.query(
    "SELECT country_code FROM visited_countries WHERE user_id = $1",
    [id]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}

async function getUserById(id) {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

async function getFirstUserId() {
  const result = await db.query("SELECT * FROM users");
  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].id;
}

// Render index.ejs page
app.get("/", async (req, res) => {
  if (!currentUserId) {
    currentUserId = await getFirstUserId();

    if (!currentUserId) {
      return res.render("new.ejs");
    }
  }

  const users = await getUsers();
  const user = await getUserById(currentUserId);
  const countries = await checkVisisted(currentUserId);

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: user.color,
    error: errorMessage,
  });
});

// Add a new country
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      errorMessage = "Country already added.";
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    errorMessage = "Country not found.";
    res.redirect("/");
  }
});

// Render a specific user or new.ejs page
app.post("/user", async (req, res) => {
  const { user, add } = req.body;
  if (user) {
    currentUserId = user;
    errorMessage = "Enter country name";
    res.redirect("/");
  } else if (add) {
    res.render("new.ejs");
  }
});

// Create a new user
app.post("/new", async (req, res) => {
  const { name, color } = req.body;
  await db.query("INSERT INTO users (name, color) VALUES ($1, $2)", [
    name,
    color,
  ]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

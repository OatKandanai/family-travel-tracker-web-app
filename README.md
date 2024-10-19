# Family Travel Tracker

A web app that tracks the countries visited by family members. Each family member can add their name, choose a color, and track the countries they have visited on an interactive map.

## Features

- Add family members with a unique color.
- Track visited countries for each family member.
- Visualize visited countries on a world map.
- Display the total number of visited countries.

## Tech Stack

- **Frontend**: HTML, CSS, EJS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Environment Variables**: dotenv
- **SVG for World Map**: A custom SVG is used to represent the world map with interactive country highlighting.

## Dependencies
- **Express: For handling server requests.**
- **EJS: As a template engine for rendering HTML.**
- **Body-Parser: For handling form submissions.**
- **PostgreSQL (pg): For database queries.**
- **dotenv: For managing environment variables.**

## Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js (v14 or above)**
- **PostgreSQL**

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/family-travel-tracker.git
   cd family-travel-tracker
2. **Set up the back-end**:
- Install dependencies:

   ```bash
   npm install

- Create a .env file in the root of your project and add your PostgreSQL credentials:

  ```bash
   PORT=3000
   PG_USER="your_postgres_username"
   PG_HOST="localhost"
   PG_DATABASE="familytraveltracker"
   PG_PASSWORD="your_postgres_password"
   PG_PORT=5432
3. **Set up the database**:
- Log into PostgreSQL and create the necessary database and tables:
  ```bash
   CREATE DATABASE familytraveltracker;

   CREATE TABLE users (
   	id SERIAL PRIMARY KEY,
   	name TEXT NOT NULL,
   	color TEXT NOT NULL
   );

   CREATE TABLE countries (
   	id SERIAL PRIMARY KEY,
   	country_code CHAR(2) UNIQUE,
   	country_name TEXT
   );
  ## Importing Countries Data
  You need to import the list of countries into the `countries` table from a CSV file inside folder (`database/countries.csv`).

   
   CREATE TABLE visited_countries (
   	id SERIAL PRIMARY KEY,
   	country_code CHAR(2) NOT NULL,
   	user_id INT REFERENCES users(id),
   	UNIQUE (country_code, user_id)
   );
4. **Run the app**:
   ```bash
   node index.js

The app will be available at http://localhost:3000.

CREATE DATABASE familytraveltracker;

CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	color TEXT NOT NULL
);

CREATE TABLE countries (
	id SERIAL PRIMARY KEY,
	country_code CHAR(2) UNIQUE,
	country_name TEXT
);

CREATE TABLE visited_countries (
	id SERIAL PRIMARY KEY,
	country_code CHAR(2) NOT NULL,
	user_id INT REFERENCES users(id),
	UNIQUE (country_code, user_id)
);

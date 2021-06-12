CREATE DATABASE contactkeeperapp;
CREATE TABLE contact(
    contact_id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    phone_no VARCHAR(12),
    user_id VARCHAR(255)
);

CREATE TABLE client(
    client_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    username VARCHAR(255),
    email VARCHAR(255),
    phone_no VARCHAR(12),
    password VARCHAR(255),
    profileimage VARCHAR(255)
);
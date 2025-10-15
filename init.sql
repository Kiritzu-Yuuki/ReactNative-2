CREATE DATABASE IF NOT EXISTS loginexpoapp;
USE loginexpoapp;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  provider ENUM('local','google','facebook','apple') DEFAULT 'local',
  photo_url VARCHAR(255),
  document_url VARCHAR(255),
  address VARCHAR(255),
  phone VARCHAR(50)
);

INSERT INTO users (name, email, password) VALUES ('Julian Alvarez','julian@example.com','123456') ON DUPLICATE KEY UPDATE email=email;

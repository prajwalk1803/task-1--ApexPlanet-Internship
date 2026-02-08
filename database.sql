CREATE DATABASE IF NOT EXISTS apexportfolio_task1;
USE apexportfolio_task1;

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  category VARCHAR(50),
  contact_method VARCHAR(50),
  services VARCHAR(200),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

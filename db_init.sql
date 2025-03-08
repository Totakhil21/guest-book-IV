
CREATE DATABASE IF NOT EXISTS guestbook;
USE guestbook;

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    job_title VARCHAR(50),
    company VARCHAR(100),
    linkedin VARCHAR(255),
    meet VARCHAR(50),
    other VARCHAR(100),
    message TEXT,
    mailing_list BOOLEAN,
    email_format ENUM('html', 'text'),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO contacts (first_name, last_name, email, job_title, company, linkedin, meet, other, message, mailing_list, email_format)
VALUES 
('John', 'Doe', 'john@example.com', 'Software Engineer', 'Tech Corp', 'https://linkedin.com/in/johndoe', 'meetup', NULL, 'Great to connect!', TRUE, 'html'),
('Jane', 'Smith', 'jane@example.com', 'Marketing Manager', 'Business Inc.', 'https://linkedin.com/in/janesmith', 'job-fair', NULL, 'Looking forward to working together!', FALSE, 'text');


SELECT * FROM contacts;

DROP DATABASE IF EXISTS questionsandanswers;
CREATE DATABASE questionsandanswers;
USE questionsandanswers;

-- ---
-- Table questions
--
-- ---

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  body VARCHAR(1000) NOT NULL UNIQUE,
  date DATETIME NOT NULL DEFAULT GETDATE(),
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  helpfulness INT NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT false,
  product_id INT REFERENCES products ON DELETE CASCADE
);

-- ---
-- Table answers
--
-- ---

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  answer_id SERIAL PRIMARY KEY,
  body VARCHAR(1000) NOT NULL UNIQUE,
  date DATETIME NOT NULL DEFAULT GETDATE(),
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  helpfulness INT NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT false,
  question_id INT REFERENCES questions ON DELETE CASCADE
);

-- ---
-- Table photos
--
-- ---

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  photo_id SERIAL PRIMARY KEY,
  url VARCHAR(500) NOT NULL UNIQUE,
  answer_id INT REFERENCES answers ON DELETE CASCADE
);

-- -- ---
-- -- Table product
-- --
-- -- ---

-- DROP TABLE IF EXISTS product;

-- CREATE TABLE product (
--   id INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,

-- );


-- ---
-- Test Data
-- ---

-- INSERT INTO questions (product_id,id,body,date,name,email,helpfulness,reported) VALUES
-- (5,,,,,,,);

-- INSERT INTO answers (question_id,id,body,date,name,email,helpfulness,reported) VALUES
-- (,,,,,,,);

-- INSERT INTO photos (answer_id,id,url) VALUES
-- (,,);

-- INSERT INTO product (id) VALUES
-- (1, 2, 3, 4, 5);
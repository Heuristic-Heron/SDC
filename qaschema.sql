DROP DATABASE IF EXISTS questionsandanswers;
CREATE DATABASE questionsandanswers;
\c questionsandanswers;

-- -- ---
-- -- Table product
-- --
-- -- ---

-- DROP TABLE IF EXISTS product;

CREATE TABLE products (
  id SERIAL PRIMARY KEY
);

-- ---
-- Table questions
--
-- ---

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  body VARCHAR(1000) NOT NULL UNIQUE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  helpfulness INT NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT false,
  product_id INT NOT NULL REFERENCES products ON DELETE CASCADE
);

-- ---
-- Table answers
--
-- ---

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  answer_id SERIAL PRIMARY KEY,
  body VARCHAR(1000) NOT NULL UNIQUE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  helpfulness INT NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT false,
  question_id INT NOT NULL REFERENCES questions ON DELETE CASCADE
);

-- ---
-- Table photos
--
-- ---

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  photo_id SERIAL PRIMARY KEY,
  url VARCHAR(500) NOT NULL UNIQUE,
  answer_id INT NOT NULL REFERENCES answers ON DELETE CASCADE
);




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
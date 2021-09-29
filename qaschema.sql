DROP DATABASE IF EXISTS questionsandanswers;
CREATE DATABASE questionsandanswers;
\c questionsandanswers;

-- ---
-- Table questions
--
-- ---

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  question_id serial PRIMARY KEY,
  body text CONSTRAINT CHECK (char_length(body <= 1000) NOT NULL UNIQUE,
  date timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name text CONSTRAINT CHECK (char_length(name) <= 60) NOT NULL,
  email text CONSTRAINT CHECK (char_length(email) <= 60) NOT NULL,
  helpfulness int NOT NULL DEFAULT 0,
  reported boolean NOT NULL DEFAULT false,
  product_id int NOT NULL,
);

-- ---
-- Table answers
--
-- ---

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  answer_id serial PRIMARY KEY,
  body text CONSTRAINT CHECK (char_length(body) <= 1000) NOT NULL UNIQUE,
  date timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name text CONSTRAINT CHECK (char_length(name) <= 60) NOT NULL,
  email text CONSTRAINT CHECK (char_length(email) <= 60) NOT NULL,
  helpfulness int NOT NULL DEFAULT 0,
  reported boolean NOT NULL DEFAULT false,
  question_id int NOT NULL REFERENCES questions ON DELETE CASCADE
);

-- ---
-- Table photos
--
-- ---

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  photo_id serial PRIMARY KEY,
  url text CONSTRAINT CHECK (char_length(url) <= 2083) NOT NULL UNIQUE,
  answer_id int NOT NULL REFERENCES answers ON DELETE CASCADE
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
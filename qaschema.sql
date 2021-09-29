DROP DATABASE IF EXISTS questionsandanswers;
CREATE DATABASE questionsandanswers;
\c questionsandanswers;

-- ---
-- Table questions
--
-- ---

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  id serial PRIMARY KEY,
  product_id int NOT NULL
  body text CHECK (char_length(body) <= 1000) NOT NULL UNIQUE,
  date_written timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  asker_name text CHECK (char_length(name) <= 60) NOT NULL,
  asker_email text CHECK (char_length(email) <= 60) NOT NULL,
  reported boolean NOT NULL DEFAULT false,
  helpful int NOT NULL DEFAULT 0,
);

-- ---
-- Table answers
--
-- ---

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  id serial PRIMARY KEY,
  question_id int NOT NULL REFERENCES questions ON DELETE CASCADE
  body text CHECK (char_length(body) <= 1000) NOT NULL UNIQUE,
  date_written timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  answerer_name text CHECK (char_length(name) <= 60) NOT NULL,
  answerer_email text CHECK (char_length(email) <= 60) NOT NULL,
  reported boolean NOT NULL DEFAULT false,
  helpful int NOT NULL DEFAULT 0,
);

-- ---
-- Table photos
--
-- ---

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  id serial PRIMARY KEY,
  answer_id int NOT NULL REFERENCES answers ON DELETE CASCADE
  url text CHECK (char_length(url) <= 2083) NOT NULL UNIQUE,
);


-- ---
-- IMPORT DATA
-- ---

COPY questions(id,product_id,body,date_written,asker_name,asker_email,reported,helpful)
FROM './data/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers(id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful)
FROM './data/answers.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id,answer_id,url)
FROM './data/answers_photos.csv'
DELIMITER ','
CSV HEADER;


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
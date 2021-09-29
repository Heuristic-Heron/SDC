DROP DATABASE IF EXISTS questionsandanswers;
CREATE DATABASE questionsandanswers;
\c questionsandanswers;

-- ---
-- CREATE TABLES
-- ---

CREATE TABLE questions (
  id serial PRIMARY KEY,
  product_id int NOT NULL,
  body text CHECK (char_length(body) <= 1000) NOT NULL UNIQUE,
  date_written date NOT NULL DEFAULT CURRENT_TIMESTAMP,
  asker_name text CHECK (char_length(asker_name) <= 60) NOT NULL,
  asker_email text CHECK (char_length(asker_email) <= 60) NOT NULL,
  reported boolean NOT NULL DEFAULT false,
  helpful int NOT NULL DEFAULT 0
);

CREATE TABLE answers (
  id serial PRIMARY KEY,
  question_id int NOT NULL REFERENCES questions ON DELETE CASCADE,
  body text CHECK (char_length(body) <= 1000) NOT NULL UNIQUE,
  date_written date NOT NULL DEFAULT CURRENT_TIMESTAMP,
  answerer_name text CHECK (char_length(answerer_name) <= 60) NOT NULL,
  answerer_email text CHECK (char_length(answerer_email) <= 60) NOT NULL,
  reported boolean NOT NULL DEFAULT false,
  helpful int NOT NULL DEFAULT 0
);

CREATE TABLE photos (
  id serial PRIMARY KEY,
  answer_id int NOT NULL REFERENCES answers ON DELETE CASCADE,
  url text CHECK (char_length(url) <= 2083) NOT NULL UNIQUE
);


-- ---
-- IMPORT DATA
-- ---

-- Create TEMP TABLE to handle date conversion from 13 digits (in csv file) to 10 digits (sql table)
BEGIN;
CREATE TEMP TABLE temp_questions(id int, product_id int,body text, date_written bigint,asker_name text,asker_email text,reported boolean,helpful int);
COPY temp_questions FROM '/Users/katherineyu/bootcamp/SDC/data/questions.csv' DELIMITER ',' CSV HEADER;
UPDATE temp_questions SET date_written = date_written / 1000;

COPY questions FROM temp_questions;

COMMIT;
-- drops the temp table


COPY questions(id,product_id,body,date_written,asker_name,asker_email,reported,helpful)
FROM '/Users/katherineyu/bootcamp/SDC/data/questions.csv'
DELIMITER ','
CSV HEADER;

-- COPY answers(id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful)
-- FROM '/Users/katherineyu/bootcamp/SDC/data/answers.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY photos(id,answer_id,url)
-- FROM '/Users/katherineyu/bootcamp/SDC/data/answers_photos.csv'
-- DELIMITER ','
-- CSV HEADER;

-- ---
-- Add Foreign Keys
-- ---
-- ALTER TABLE answers ADD FOREIGN KEY question_id int NOT NULL REFERENCES questions ON DELETE CASCADE
-- ALTER TABLE photos ADD FOREIGN KEY answer_id int NOT NULL REFERENCES answers ON DELETE CASCADE




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
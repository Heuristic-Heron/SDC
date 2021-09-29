DROP DATABASE IF EXISTS questionsandanswers;
CREATE DATABASE questionsandanswers;
\c questionsandanswers;

-- ---
-- CREATE TABLES
-- ---
CREATE TABLE questions (
  id serial PRIMARY KEY,
  product_id int NOT NULL,
  body text CHECK (char_length(body) <= 1000) NOT NULL,
  date_written timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  asker_name text CHECK (char_length(asker_name) <= 60) NOT NULL,
  asker_email text CHECK (char_length(asker_email) <= 60) NOT NULL,
  reported boolean NOT NULL DEFAULT false,
  helpful int NOT NULL DEFAULT 0
);

CREATE TABLE answers (
  id serial PRIMARY KEY,
  question_id int NOT NULL REFERENCES questions ON DELETE CASCADE,
  body text CHECK (char_length(body) <= 1000) NOT NULL,
  date_written timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  answerer_name text CHECK (char_length(answerer_name) <= 60) NOT NULL,
  answerer_email text CHECK (char_length(answerer_email) <= 60) NOT NULL,
  reported boolean NOT NULL DEFAULT false,
  helpful int NOT NULL DEFAULT 0
);

CREATE TABLE photos (
  id serial PRIMARY KEY,
  answer_id int NOT NULL REFERENCES answers ON DELETE CASCADE,
  url text CHECK (char_length(url) <= 2083) NOT NULL
);


-- ---
-- Add Foreign Keys
-- ---
-- ALTER TABLE answers ADD FOREIGN KEY (question_id) int NOT NULL REFERENCES questions (question_id) ON DELETE CASCADE
-- ALTER TABLE photos ADD FOREIGN KEY (answer_id) int NOT NULL REFERENCES answers (answer_id) ON DELETE CASCADE
--ETL Process to upload data from csv files questions, answers, answers_photos
\c questionsandanswers;

-- ---
-- IMPORT QUESTIONS
-- ---

-- Create TEMP TABLE to handle date conversion from 13 digits (in csv file) to 10 digits (sql table)
CREATE TEMP TABLE temp_questions(id int, product_id int, body text, date_written BIGINT, asker_name text, asker_email text, reported boolean, helpful int);
COPY temp_questions FROM '/Users/katherineyu/bootcamp/SDC/data/questions.csv' DELIMITER ',' CSV HEADER;

INSERT INTO questions
SELECT
  id,
  product_id,
  body,
  to_timestamp(date_written/1000)::timestamptz,
  asker_name,
  asker_email,
  reported,
  helpful
FROM temp_questions

COMMIT;

-- check if data has imported
SELECT * FROM questions LIMIT 10;


-- ---
-- IMPORT ANSWERS
-- ---

-- Create TEMP TABLE to handle date conversion from 13 digits (in csv file) to 10 digits (sql table)
CREATE TEMP TABLE temp_answers(id int, question_id int, body text, date_written BIGINT, answerer_name text, answerer_email text, reported boolean, helpful int);
COPY temp_answers FROM '/Users/katherineyu/bootcamp/SDC/data/answers.csv' DELIMITER ',' CSV HEADER;

INSERT INTO answers
SELECT
  id,
  question_id,
  body,
  to_timestamp(date_written/1000)::timestamptz,
  answerer_name,
  answerer_email,
  reported,
  helpful
FROM temp_answers

COMMIT;

-- check if data has imported
SELECT * FROM answers LIMIT 10;


-- ---
-- IMPORT PHOTOS
-- ---
COPY photos(id,answer_id,url)
FROM '/Users/katherineyu/bootcamp/SDC/data/answers_photos.csv'
DELIMITER ','
CSV HEADER;

-- check if data has imported
SELECT * FROM photos LIMIT 10;


-- ---
-- ALTERNATIVE IMPORT STATEMENTS ATTEMPTED:
-- ---
-- COPY questions(id,product_id,body,date_written,asker_name,asker_email,reported,helpful)
-- FROM '/Users/katherineyu/bootcamp/SDC/data/questions.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY answers(id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful)
-- FROM '/Users/katherineyu/bootcamp/SDC/data/answers.csv'
-- DELIMITER ','
-- CSV HEADER;
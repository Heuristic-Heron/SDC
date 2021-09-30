\c questionsandanswers;

-- General Queries
EXPLAIN ANALYZE
SELECT * FROM questions;

EXPLAIN ANALYZE
SELECT * FROM answers;

EXPLAIN ANALYZE
SELECT * FROM photos;

-- CREATE Results Table joining questions, answers and photos
-- Should appear in order of helpfulness (and maybe date?)
EXPLAIN ANALYZE
SELECT *
  FROM questions q
  INNER JOIN answers a ON q.id = a.question_id
  INNER JOIN photos p ON a.id = p.answer_id
  WHERE q.reported = false AND a.reported = false
  ORDER BY q.product_id ASC, q.helpful DESC, a.helpful DESC;
  -- LIMIT 20

-- Results table for just answers (would be faster than the question query above)
EXPLAIN ANALYZE
SELECT *
  FROM answers a
  INNER JOIN photos p ON a.id = p.answer_id
  WHERE a.reported = false
  ORDER BY a.question_id ASC, a.helpful DESC;
  -- LIMIT 20

-- USE product 50 to test
SELECT *
  FROM questions q
  INNER JOIN answers a ON q.id = a.question_id
  INNER JOIN photos p ON a.id = p.answer_id
  WHERE product_id = 50
  LIMIT 5

-- Questions List
-- GET /qa/questions
-- Retrieves a list of questions for a particular product. This list does not include any reported questions.
-- Parameters:
-- product_id: Specifies the product for which to retrieve questions.
-- page: Selects the page of results to return. Default 1.
----- Offset 0 = page 1. Offest 5 = page 2. If page = 1, offset = 0.
----- If page > 1, offset is equal to {page} * 5
-- count: Specifies how many results per page to return. Default 5. (LIMIT)
-- EXPLAIN ANALYZE
SELECT * FROM questions
  WHERE product_id = 1 AND reported = false
  ORDER BY date_written DESC
  LIMIT 5 OFFSET 0;


-- Answers List
-- GET /qa/questions/:question_id/answers
-- Retrieves a list of questions for a particular product. This list does not include any reported questions.
-- Parameters: question_id, page, count
-- EXPLAIN ANALYZE
SELECT * FROM answers
  WHERE question_id = 1 AND reported = false
  ORDER BY date_written DESC
  LIMIT 5 OFFSET 0;

-- Query for last 10% of records
EXPLAIN ANALYZE
SELECT * FROM answers
  WHERE question_id = 1 AND reported = false
  ORDER BY date_written DESC
  LIMIT (SELECT MAX(id) from questons) * 0.1;



-- Add a Question
-- POST /qa/questions
-- Adds a question for the given product
-- Parameters:  body, name, email, product_id

-- need to reset id prior to entering new records
SELECT setval('questions_id_seq', (SELECT MAX (id) FROM questions)+1);

EXPLAIN ANALYZE
INSERT INTO questions (body, asker_name, asker_email, product_id)
  VALUES ('Why can I ask this questionag again?', 'testing123', 'test@gmail.com', 2);

-- Add an Answer
-- POST /qa/questions/:question_id/answers
-- Adds an answer for the given question
-- Parameters: question_id, body, name, email, photos

SELECT setval('answers_id_seq', (SELECT MAX (id) FROM answers)+1);

-- need to reset id prior to entering new records
EXPLAIN ANALYZE
INSERT INTO answers (body, answerer_name, answerer_email, question_id)
  VALUES ('This is the only answer', 'testing123', 'test@gmail.com', 2);


SELECT setval('photos_id_seq', (SELECT MAX (id) FROM photos)+1);

EXPLAIN ANALYZE
INSERT INTO photos (url, answer_id)
  VALUES ('testurl.com', 2);

-- Mark Question as Helpful
-- PUT /qa/questions/:question_id/helpful
-- Updates a question to show it was found helpful.
-- Parameter: question_id
EXPLAIN ANALYZE
UPDATE questions
  SET helpful = helpful + 1
  WHERE id = 3518965;


-- Report Question
-- PUT /qa/questions/:question_id/report
-- Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.
-- Parameter: question_id
EXPLAIN ANALYZE
UPDATE questions
  SET reported = true
  WHERE id = 3518965;


-- Mark Answer as Helpful
-- PUT /qa/answers/:answer_id/helpful
-- Updates an answer to show it was found helpful.
-- Parameter: answer_id
EXPLAIN ANALYZE
UPDATE answers
  SET helpful = helpful + 1
  WHERE id = 6879308;

-- Report Answer
-- PUT /qa/answers/:answer_id/report
-- Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request.
-- Parameter: answer_id
EXPLAIN ANALYZE
UPDATE answers
  SET reported = true
  WHERE id = 6879308;
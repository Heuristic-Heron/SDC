\c questionsandanswers;

-- General Queries
EXPLAIN ANALYZE
SELECT * FROM questions;

EXPLAIN ANALYZE
SELECT * FROM answers;

EXPLAIN ANALYZE
SELECT * FROM photos;

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



-- Add a Question
-- POST /qa/questions
-- Adds a question for the given product
-- Parameters:  body, name, email, product_id

-- need to reset id prior to entering new records
SELECT setval('questions_id_seq', (SELECT MAX (id) FROM questions)+1);

-- EXPLAIN ANALYZE
INSERT INTO questions (body, asker_name, asker_email, product_id)
  VALUES ('Why can I ask this question?', 'testing123', 'test@gmail.com', 1);

-- Add an Answer
-- POST /qa/questions/:question_id/answers
-- Adds an answer for the given question
-- Parameters: question_id, body, name, email, photos

SELECT setval('answers_id_seq', (SELECT MAX (id) FROM answers)+1);

-- need to reset id prior to entering new records
INSERT INTO answers (body, answerer_name, answerer_email, question_id)
  VALUES ('This is the only answer', 'testing123', 'test@gmail.com', 3518965);


SELECT setval('photos_id_seq', (SELECT MAX (id) FROM photos)+1);

INSERT INTO photos (url, answer_id)
  VALUES ('testurl.com', 6879308);

-- Mark Question as Helpful
-- PUT /qa/questions/:question_id/helpful
-- Updates a question to show it was found helpful.
-- Parameter: question_id


-- Report Question
-- PUT /qa/questions/:question_id/report
-- Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.
-- Parameter: question_id


-- Mark Answer as Helpful
-- PUT /qa/answers/:answer_id/helpful
-- Updates an answer to show it was found helpful.
-- Parameter: answer_id


-- Report Answer
-- PUT /qa/answers/:answer_id/report
-- Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request.
-- Parameter: answer_id

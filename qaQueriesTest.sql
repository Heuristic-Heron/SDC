\c questionsandanswers;

-- General Queries
EXPLAIN ANALYZE
SELECT * FROM questions;

EXPLAIN ANALYZE
SELECT * FROM answers;

EXPLAIN ANALYZE
SELECT * FROM photos;

-- PRIMARY QUERY: QUESTIONS LIST --------------------------------
-- CREATE Results Table joining questions, answers and photos
-- Should appear in order of helpfulness (and maybe date?)
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
  FROM questions q
  INNER JOIN answers a ON q.id = a.question_id
  INNER JOIN photos p ON a.id = p.answer_id
  WHERE q.reported = false AND a.reported = false AND product_id = 50000
  ORDER BY q.helpful DESC, a.helpful DESC;

-- ALTERNATE IN JSON FORMAT
EXPLAIN (ANALYZE, BUFFERS)
WITH
photo AS (
    SELECT answer_id, json_agg(
      json_build_object(
        'id', p.id,
        'url', p.url
    )) AS photos
    FROM photos p
    GROUP BY answer_id
  ),
  filtered_answers AS (
    SELECT id, question_id, json_object_agg(
      a.id, json_build_object(
        'id', a.id,
        'body', a.body,
        'date', a.date_written,
        'answerer_name', a.answerer_name,
        'helpfulness', a.helpful,
        'photos', p.photos
      ))
    AS answers
    FROM answers a
    INNER JOIN photo p ON a.id = p.answer_id
    WHERE a.reported = false
    GROUP BY a.id
    -- ORDER BY a.helpful DESC
  ),
  filtered_questions AS (
    SELECT product_id,
      json_build_object(
        'question_id', q.id,
        'question_body', q.body,
        'question_date', q.date_written,
        'asker_name', q.asker_name,
        'question_helpfulness', q.helpful,
        'reported', q.reported,
        'answers', fa.answers
      )
      AS results
      FROM questions q
      INNER JOIN filtered_answers fa ON q.id = fa.question_id
      WHERE q.reported = false
      -- ORDER BY q.helpful DESC
  )
  SELECT product_id,
    '1'::int as page,
    '5'::int as count,
    json_agg(fq.results) as results
  FROM filtered_questions fq
  WHERE product_id = 50
  GROUP BY product_id;


-- Version 2: DO NOT USE. MUCH SLOWER THAN ABOVE. AND DOES NOT RETURN JSON FORMAT
EXPLAIN (ANALYZE, BUFFERS)
WITH filtered_answers AS (
  SELECT *
  FROM answers a
  WHERE a.reported = false
  ORDER BY a.helpful DESC),
  filtered_questions AS (
    SELECT *
    FROM questions q
    WHERE q.reported = false
    ORDER BY q.helpful DESC
  )
SELECT *
  FROM filtered_questions fq
  INNER JOIN filtered_answers fa ON fq.id = fa.question_id
  INNER JOIN photos p ON fa.id = p.answer_id
  WHERE product_id = 50000;
  -- ORDER BY q.product_id ASC, q.helpful DESC, a.helpful DESC;

------------------------------------------------------------------
-- ANSWER LIST
-- Results table for just answers (should be faster than the question query above)
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
  FROM answers a
  INNER JOIN photos p ON a.id = p.answer_id
  WHERE a.reported = false AND a.question_id = 5
  ORDER BY a.helpful DESC;
  -- LIMIT 20

-- ALTERNATE IN JSON FORMAT
EXPLAIN (ANALYZE, BUFFERS)
WITH
photo AS (
    SELECT answer_id, json_agg(
      json_build_object(
        'id', p.id,
        'url', p.url
    )) AS photos
    FROM photos p
    GROUP BY answer_id
  ),
  filtered_answers AS (
    SELECT a.question_id,
      json_build_object(
        'answer_id', a.id,
        'body', a.body,
        'date', a.date_written,
        'answerer_name', a.answerer_name,
        'helpfulness', a.helpful,
        'photos', p.photos
      )
    AS results
    FROM answers a
    INNER JOIN photo p ON a.id = p.answer_id
    WHERE a.reported = false
    -- ORDER BY a.helpful DESC
  )
  SELECT question_id,
    '1'::int as page,
    '5'::int as count,
    json_agg(fa.results) as results
  FROM filtered_answers fa
  WHERE question_id = 1
  GROUP BY question_id;


  ----------------------------------------------------------------------------------

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
EXPLAIN (ANALYZE, BUFFERS)
INSERT INTO answers (body, answerer_name, answerer_email, question_id)
  VALUES ('This is the only answer', 'testing123', 'test@gmail.com', 2);


SELECT setval('photos_id_seq', (SELECT MAX (id) FROM photos)+1);

EXPLAIN (ANALYZE, BUFFERS)
INSERT INTO photos (url, answer_id)
  VALUES ('testurl.com', 2);

-- Mark Question as Helpful
-- PUT /qa/questions/:question_id/helpful
-- Updates a question to show it was found helpful.
-- Parameter: question_id
EXPLAIN (ANALYZE, BUFFERS)
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
EXPLAIN (ANALYZE, BUFFERS)
UPDATE answers
  SET reported = true
  WHERE id = 6879308;



----
--ADD / DROP INDEXES
----
-- This set did nothing to improve speed
CREATE INDEX ON questions (product_id);
CREATE INDEX ON questions (helpful);

DROP INDEX questions_product_id_idx;
DROP INDEX questions_helpful_idx;

CREATE INDEX ON questions (product_id ASC, helpful DESC);
DROP INDEX questions_product_id_helpful_idx;

CREATE INDEX ON questions (helpful DESC);
DROP INDEX questions_helpful_idx;


-- Try creating index on answers
CREATE INDEX ON answers (question_id);
DROP INDEX answers_question_id_idx;

CREATE INDEX ON photos (answer_id);

CREATE INDEX ON questions (helpful DESC);
CREATE INDEX ON answers (helpful DESC);

CREATE INDEX ON questions (reported);
CREATE INDEX ON answers (reported);

DROP INDEX photos_answer_id_idx;
DROP INDEX questions_helpful_idx;
DROP INDEX answers_helpful_idx;
DROP INDEX questions_reported_idx;
DROP INDEX answers_reported_idx;
DROP INDEX answers_question_id_idx;

CREATE INDEX ON questions (product_id);
DROP INDEX questions_product_id_idx;

------- TRY COMBO INDEXS
--CURRENT:
CREATE INDEX ON questions (product_id);
--ADD:
CREATE INDEX ON questions (product_id ASC, helpful DESC);
CREATE INDEX ON answers (question_id ASC, helpful DESC);
CREATE INDEX ON photos (answer_id ASC);

--RESET INDEXES:
DROP INDEX questions_product_id_helpful_idx;
DROP INDEX answers_question_id_helpful_idx;
DROP INDEX photos_answer_id_idx;



------ TRY PARTIAL INDEXES
CREATE INDEX ON questions (product_id ASC, helpful DESC) WHERE reported=false;
CREATE INDEX ON answers (question_id ASC, helpful DESC) WHERE reported=false;
CREATE INDEX ON photos (answer_id ASC);
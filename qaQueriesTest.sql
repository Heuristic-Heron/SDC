\c questionsandanswers;

-- General Queries
EXPLAIN ANALYZE
SELECT * FROM questions LIMIT 10;

EXPLAIN ANALYZE
SELECT * FROM answers LIMIT 10;

EXPLAIN ANALYZE
SELECT * FROM photos LIMIT 10;

-- PRIMARY QUERY: QUESTIONS LIST --------------------------------
-- Retrieves a list of questions for a particular product. Does not include any reported questions.
-- Parameters: product_id, page, count
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


------------------------------------------------------------------
-- ANSWER LIST
-- Retrieves a list of questions for a particular product. Does not include any reported questions.
-- Parameters: question_id, page, count
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


-- Query for last 10% of records
EXPLAIN ANALYZE
SELECT * FROM answers
  WHERE question_id = 1 AND reported = false
  ORDER BY date_written DESC
  LIMIT (SELECT MAX(id) from questons) * 0.1;

----------------------------------------------------------------------------------

-- POST /qa/questions
-- Adds a question for the given product
-- Parameters:  body, name, email, product_id
EXPLAIN ANALYZE
INSERT INTO questions (body, asker_name, asker_email, product_id)
  VALUES ('Why can I ask this questionag again?', 'testing123', 'test@gmail.com', 2);


-- POST /qa/questions/:question_id/answers
-- Adds an answer for the given question
-- Parameters: question_id, body, name, email, photos
EXPLAIN (ANALYZE, BUFFERS)
INSERT INTO answers (body, answerer_name, answerer_email, question_id)
  VALUES ('This is the only answer', 'testing123', 'test@gmail.com', 2);


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
-- Updates a question to show it was reported.
-- Note, this action does not delete the question, but the question will not be returned in the above GET request.
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
-- ADD / DROP INDEXES
----
-- FINAL: PARTIAL INDEXES ----------------------------------------------------
CREATE INDEX ON questions (product_id ASC, helpful DESC) WHERE reported=false;
CREATE INDEX ON answers (question_id ASC, helpful DESC) WHERE reported=false;
CREATE INDEX ON photos (answer_id ASC);



-- IGNORE BELOW: they did not improve speed  -----------------------------
CREATE INDEX ON questions (product_id);
CREATE INDEX ON questions (helpful);

DROP INDEX questions_product_id_idx;
DROP INDEX questions_helpful_idx;

CREATE INDEX ON questions (product_id ASC, helpful DESC);
DROP INDEX questions_product_id_helpful_idx;

CREATE INDEX ON questions (helpful DESC);
DROP INDEX questions_helpful_idx;


-- Indexes on answers
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

------- COMBO INDEXES TRIED -----------------------------
CREATE INDEX ON questions (product_id ASC, helpful DESC);
CREATE INDEX ON answers (question_id ASC, helpful DESC);
CREATE INDEX ON photos (answer_id ASC);

--RESET INDEXES:
DROP INDEX questions_product_id_helpful_idx;
DROP INDEX answers_question_id_helpful_idx;
DROP INDEX photos_answer_id_idx;

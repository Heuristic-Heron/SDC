const questionsList =
  `WITH
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
    SELECT product_id, json_agg(fq.results) as results
    FROM filtered_questions fq
    WHERE product_id = $1
    GROUP BY product_id
    LIMIT $2 OFFSET $3`

const answersList  =
  `WITH
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
    SELECT question_id, json_agg(fa.results) as results
    FROM filtered_answers fa
    WHERE question_id = $1
    GROUP BY question_id
    LIMIT $2 OFFSET $3`

module.exports = { questionsList, answersList }
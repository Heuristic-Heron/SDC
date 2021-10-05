const questionsList =
  `WITH filtered_questions AS (
    SELECT * FROM questions q
    WHERE q.reported = false AND q.product_id = $1
  ),
  filtered_answers AS (
    SELECT * FROM answers a
    WHERE a.reported = false
  )
  SELECT product_id,
    $4::int as page,
    $2::int as count,
    json_agg(
      json_build_object(
        'question_id', fq.id,
        'question_body', fq.body,
        'question_date', fq.date_written,
        'asker_name', fq.asker_name,
        'question_helpfulness', fq.helpful,
        'reported', fq.reported,
        'answers',
          CASE
            WHEN fa.id IS NULL THEN '{}'::json
            ELSE json_build_object(
              fa.id, json_build_object(
                'id', fa.id,
                'body', fa.body,
                'date', fa.date_written,
                'answerer_name', fa.answerer_name,
                'helpfulness', fa.helpful,
                'photos',
                  CASE
                    WHEN p.id IS NULL THEN '[]'::json
                    ELSE json_build_array(
                      json_build_object(
                        'id', p.id,
                        'url', p.url
                      )
                    )
                  END
              )
            )
          END
      )
    ) as results
  FROM filtered_questions fq
  LEFT JOIN filtered_answers fa ON fq.id = fa.question_id
  LEFT JOIN photos p ON fa.id = p.answer_id
  GROUP BY fq.product_id, fq.id, fa.id
  LIMIT $2 OFFSET $3`

const answersList  =
  `WITH
  filtered_answers AS (
    SELECT * FROM answers a
    WHERE a.reported = false AND question_id = $1
  )
  SELECT fa.question_id,
      $4::int as page,
      $2::int as count,
      json_agg(
        json_build_object(
        'answer_id', fa.id,
        'body', fa.body,
        'date', fa.date_written,
        'answerer_name', fa.answerer_name,
        'helpfulness', fa.helpful,
        'photos',
          CASE
            WHEN p.id IS NULL THEN '[]'::json
            ELSE json_build_array(
              json_build_object(
                'id', p.id,
                'url', p.url
              )
            )
          END
      )) AS results
    FROM filtered_answers fa
    LEFT JOIN photos p ON fa.id = p.answer_id
    GROUP BY question_id
    LIMIT $2 OFFSET $3`

const insertQuestion =
  `INSERT INTO questions(body, asker_name, asker_email, product_id)
  VALUES ($1, $2, $3, $4)`

const insertAnswer =
  `INSERT INTO answers(body, answerer_name, answerer_email, question_id)
  VALUES ($1, $2, $3, $4)`

const helpfulQuestion =
  `UPDATE questions
  SET helpful = helpful + 1
  WHERE id = $1`

const helpfulAnswer =
  `UPDATE answers
  SET helpful = helpful + 1
  WHERE id = $1`

const reportQuestion =
  `UPDATE questions
  SET reported = true
  WHERE id = $1`

const reportAnswer =
  `UPDATE answers
  SET reported = true
  WHERE id = $1`

module.exports = { questionsList, answersList, insertQuestion, insertAnswer, helpfulQuestion, helpfulAnswer, reportQuestion, reportAnswer }
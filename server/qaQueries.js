const questionsList =
  `SELECT product_id,
  $4::int as page,
  $2::int as count,
  json_agg(
    json_build_object(
    'question_id', q.id,
    'question_body', q.body,
    'question_date', q.date_written,
    'asker_name', q.asker_name,
    'question_helpfulness', q.helpful,
    'reported', q.reported,
    'answers', json_build_object(
      a.id, json_build_object(
        'id', a.id,
        'body', a.body,
        'date', a.date_written,
        'answerer_name', a.answerer_name,
        'helpfulness', a.helpful,
        'photos',
          json_build_object(
            'id', p.id,
            'url', p.url
        )
      ))
    )
  ) as results
  FROM questions q
  INNER JOIN answers a ON q.id = a.question_id
  INNER JOIN photos p ON a.id = p.answer_id
  WHERE q.reported = false AND a.reported = false AND product_id = $1
  GROUP BY product_id, q.id, a.id
  ORDER BY q.helpful DESC, a.helpful DESC
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
    SELECT question_id,
      $4::int as page,
      $2::int as count,
      json_agg(fa.results) as results
    FROM filtered_answers fa
    WHERE question_id = $1
    GROUP BY question_id
    LIMIT $2 OFFSET $3`

module.exports = { questionsList, answersList }
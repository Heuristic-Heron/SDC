// GET Question List
const selectQuestions = {
  text: 'SELECT * FROM questions q INNER JOIN answers a ON q.id = a question_id INNER JOIN photos p ON a.id = p.answer_id  WHERE q.reported = false AND a.reported = false AND product_id = ($1) ORDER BY q.helpful DESC, a.helpful DESC',
  values: [product_id],
}

client.query(selectQuestions, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})


// GET Answers List
const selectAnswers = {
  text: 'SELECT * FROM answers a INNER JOIN photos p ON a.id = p.answer_id  WHERE a.reported = false AND a.question_id = ($1) ORDER BY a.helpful DESC',
  values: [question_id],
}

client.query(selectAnswers, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})


// POST Question
const insertQuestion = {
  text: 'INSERT INTO questions (body, asker_name, asker_email, product_id) VALUES ($1, $2, $3, $4)',
  values: [body, asker_name, asker_email, product_id],
}

client.query(insertQuestion, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})


// POST Answer
const insertAnswer = {
  text: 'INSERT INTO questions(body, answerer_name, answerer_email, question_id) VALUES ($1, $2, $3, $4)',
  values: [body, answerer_name, answerer_email, question_id],
}

client.query(insertAnswer, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})


// PUT Question - Helpful
const updateQuestionHelpful = {
  text: 'UPDATE questions SET helpful = helpful + 1 WHERE id = ($1)',
  values: [question_id],
}

client.query(updateQuestionHelpful, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})


// PUT Answer - Helpful
const updateAnswerHelpful = {
  text: 'UPDATE questions SET helpful = helpful + 1 WHERE id = ($1)',
  values: [answer_id],
}

client.query(updateAnswerHelpful, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})


// PUT Question - Report
const updateQuestionReport = {
  text: 'UPDATE questions SET reported = true WHERE id = ($1)',
  values: [question_id],
}

client.query(updateQuestionReport, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})


// PUT Answer - Report
const updateAnswerReport = {
  text: 'UPDATE questions SET reported = true WHERE id = ($1)',
  values: [answer_id],
}

client.query(updateAnswerReport, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})


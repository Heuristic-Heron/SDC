// require('./qaConnection.js');
const { Pool, Client } = require('pg');
const { POSTGRES_USER, POSTGRES_PASSWORD } = require('./server/config.js');
const { questionsList, answersList } = require('./qaQueries.js');

const client = new Client({
  user: POSTGRES_USER,
  host: '127.0.0.1',
  database: 'questionsandanswers',
  password: POSTGRES_PASSWORD,
  port: 5432,
})

client.connect()

module.exports = {

  // GET Question List
  getQuestions: function(product_id, limit, offset, page, callback) {

    const selectQuestions = {
      text: questionsList,
      values: [product_id, limit, offset, page],
    }
    console.log('offset', offset)
    console.log('limit', limit)
    client.query(selectQuestions, (err, res) => {
      if (err) {
        callback(err.stack)
      } else {
        callback(null, res.rows)
      }
    })
  },

  // GET Answers List
  getAnswers: function(question_id, limit, offset, page, callback) {
    const selectAnswers = {
      text: answersList,
      values: [question_id, limit, offset, page],
    }
    console.log('offset', offset)
    console.log('limit', limit)
    client.query(selectAnswers, (err, res) => {
      if (err) {
        callback(err.stack)
      } else {
        callback(null, res.rows)
      }
    })
  },

  // POST Question
  postQuestion: function(body, asker_name, asker_email, product_id, callback) {
    const insertQuestion = {
      text: `INSERT INTO questions (body, asker_name, asker_email, product_id)
        VALUES ($1, $2, $3, $4)`,
      values: [body, asker_name, asker_email, product_id],
    }

    client.query(insertQuestion, (err, res) => {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  },

  // POST Answer
  postAnswer: function(body, answerer_name, answerer_email, question_id, callback) {
    const insertAnswer = {
      text: `INSERT INTO questions(body, answerer_name, answerer_email, question_id)
        VALUES ($1, $2, $3, $4)`,
      values: [body, answerer_name, answerer_email, question_id],
    }

    client.query(insertAnswer, (err, res) => {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  },

  // PUT Question - Helpful
  putQuestionHelpful: function(question_id, callback) {
    console.log('helpful', question_id)
    const updateQuestionHelpful = {
      text: 'UPDATE questions SET helpful = helpful + 1 WHERE id = ($1)',
      values: [question_id],
    }

    client.query(updateQuestionHelpful, (err, res) => {
      if (err) {
        callback(err)
      } else {
        console.log(updateQuestionHelpful)
        callback(null, res)
      }
    })
  },

  // PUT Answer - Helpful
  putAnswerHelpful: function(answer_id, callback) {
    console.log('called PUT request with', answer_id);
    const updateAnswerHelpful = {
      text: 'UPDATE questions SET helpful = helpful + 1 WHERE id = $1',
      values: [answer_id],
    }

    client.query(updateAnswerHelpful, (err, res) => {
      if (err) {
        callback(err)
      } else {
        console.log(res)
        callback(null, res)
      }
    })
  },

  // PUT Question - Report
  putQuestionReport: function(question_id, callback) {
    const updateQuestionReport = {
      text: 'UPDATE questions SET reported = true WHERE id = $1',
      values: [question_id],
    }

    client.query(updateQuestionReport, (err, res) => {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  },

  // PUT Answer - Report
  putAnswerReport: function(answer_id, callback) {
    const updateAnswerReport = {
      text: 'UPDATE questions SET reported = true WHERE id = $1',
      values: [answer_id],
    }

    client.query(updateAnswerReport, (err, res) => {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  }

};
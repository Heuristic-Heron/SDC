// require('./qaConnection.js');
const { Pool, Client } = require('pg');
const { POSTGRES_USER, POSTGRES_PASSWORD } = require('./config.js');
const { questionsList, answersList, insertQuestion, insertAnswer, helpfulQuestion, helpfulAnswer, reportQuestion, reportAnswer } = require('./qaQueries.js');

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

    const questionsListQuery = {
      text: questionsList,
      values: [product_id, limit, offset, page],
    }
    // console.log('offset', offset)
    // console.log('limit', limit)
    client.query(questionsListQuery, (err, res) => {
      if (err) {
        callback(err.stack)
      } else {
        callback(null, res.rows)
      }
    })
  },

  // GET Answers List
  getAnswers: function(question_id, limit, offset, page, callback) {
    const answersListQuery = {
      text: answersList,
      values: [question_id, limit, offset, page],
    }
    // console.log('offset', offset)
    // console.log('limit', limit)
    client.query(answersListQuery, (err, res) => {
      if (err) {
        callback(err.stack)
      } else {
        callback(null, res.rows)
      }
    })
  },

  // POST Question
  postQuestion: function(body, asker_name, asker_email, product_id, callback) {
    const insertQuestionQuery = {
      text: insertQuestion,
      values: [body, asker_name, asker_email, product_id],
    }
    client.query(insertQuestionQuery, (err, res) => {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  },

  // POST Answer
  postAnswer: function(body, answerer_name, answerer_email, question_id, callback) {
    const insertAnswerQuery = {
      text: insertAnswer,
      values: [body, answerer_name, answerer_email, question_id],
    }
    client.query(insertAnswerQuery, (err, res) => {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  },

  // PUT Question - Helpful
  putQuestionHelpful: function(question_id, callback) {
    // console.log('helpful', question_id)
    const helpfulQuestionQuery = {
      text: helpfulQuestion,
      values: [question_id],
    }
    client.query(helpfulQuestionQuery, (err, res) => {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  },

  // PUT Answer - Helpful
  putAnswerHelpful: function(answer_id, callback) {
    // console.log('called PUT request with', answer_id);
    const helpfulAnswerQuery = {
      text: helpfulAnswer,
      values: [answer_id],
    }
    client.query(helpfulAnswerQuery, (err, res) => {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  },

  // PUT Question - Report
  putQuestionReport: function(question_id, callback) {
    const reportQuestionQuery = {
      text: reportQuestion,
      values: [question_id],
    }
    client.query(reportQuestionQuery, (err, res) => {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  },

  // PUT Answer - Report
  putAnswerReport: function(answer_id, callback) {
    const reportAnswerQuery = {
      text: reportAnswer,
      values: [answer_id],
    }
    client.query(reportAnswerQuery, (err, res) => {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  }

};
const path = require("path")
const express = require("express");
const compression = require('compression')
const app = express();
const port = 3000;
const config = require('./server/config.js');
const { getQuestions, getAnswers, postQuestion, postAnswer, putQuestionHelpful, putAnswerHelpful, putQuestionReport, putAnswerReport } = require('./qaRoutes.js');



app.use(express.static(path.join(__dirname, "/client/dist")));

app.use(express.json());
app.use(compression());


app.get('/*', (req, res) => {
  const { url } = req;
  console.log(url)
  console.log('params', req.params);
  console.log('query', req.query);

  const splitURL = url.split('/')
  .filter(char => char !== '');
  const firstRoute = splitURL[0];
  console.log(firstRoute)
  switch (firstRoute) {
    case 'qa':
      // GET /qa/questions
      if (url === '/qa/questions') {
        console.log(req)
        const { page, count } = req.query;
        const { product_id } = req.body;
        let limit;
        let offset;
        count ? limit = count : limit = 5;
        page && page > 1 ? offset = page * limit : offset = 0;
        console.log('productId', product_id, limit, offset);
        // const productId = req.query.product_id;
        getQuestions(product_id, limit, offset, (err, data) => {
          if (err) {
            res.status(404).send(err);
          } else {
            res.status(200).send(data);
          }
        })
      // GET /qa/questions/:question_id/answers
      } else {
        const { question_id, page, count } = req.query;
        // const questionId = req.query.question_id;
        // const questionId = splitURL[2].slice(1)
        let limit;
        let offset;
        count ? limit = count : limit = 5;
        page && page > 1 ? offset = page * limit : offset = 0;
        console.log('questionId', question_id, limit, offset);
        getAnswers(question_id, limit, offset, (err, data) => {
          if (err) {
            res.status(404).send(err);
          } else {
            res.status(200).send(data);
          }
        })
      }
    default:
      console.log('no GET request found')
  }
});


app.post('/*', (req, res) => {
  const { url } = req;
  console.log(url)
  const splitURL = url.split('/')
  .filter(char => char !== '');
  const firstRoute = splitURL[0];
  console.log(firstRoute)
  switch (firstRoute) {
    case 'qa':
      //POST /qa/questions
      if (url === '/qa/questions/') {
        const body = req.body.body;
        const name = req.body.name;
        const email = req.body.email;
        const productId = req.body.productId;

        console.log('productId', productId);
        postQuestion(body, name, email, productId, (err, data) => {
          if (err) {
            res.status(404).send(err);
          } else {
            res.status(201).send(data);
          }
        })
      //POST /qa/questions/:question_id/answers
      } else {
        console.log(req.params);
        const questionId = splitURL[2].slice(1)
        const body = req.body.body;
        const name = req.body.name;
        const email = req.body.email;
        // const photos = req.body.photos;
        console.log('questionId', questionId);
        postAnswer(body, name, email, questionId, (err, data) => {
          if (err) {
            res.status(404).send(err);
          } else {
            res.status(201).send(data);
          }
        })
      }
    default:
      console.log('no POST request found')
  }
});


app.put('/*', (req, res) => {
  const { url } = req;
  console.log(url)
  const splitURL = url.split('/')
  .filter(char => char !== '');
  const firstRoute = splitURL[0];
  console.log(firstRoute)
  console.log(splitURL[1], splitURL[3])
  switch (firstRoute) {
    case 'qa':
      // PUT requests for questions
      if (splitURL[1] === 'questions') {
        const questionId = splitURL[2].slice(1);
        // PUT /qa/questions/:question_id/helpful
        if (splitURL[3] === 'helpful') {
          putQuestionHelpful(questionId, (err, data) => {
            if (err) {
              res.status(404).send(err);
            } else {
              res.status(204).send(data);
            }
          })
        //PUT /qa/questions/:question_id/report
        } else if (splitURL[3] === 'report') {
          putQuestionReport(questionId, (err, data) => {
            if (err) {
              res.status(404).send(err);
            } else {
              res.status(204).send(data);
            }
          })
        }
      // PUT requests for answers
      } else if (splitURL[1] === 'answers') {
        const answerId = splitURL[2].slice(1);
        console.log('answerId', answerId);
        // PUT /qa/answers/:answer_id/helpful
        if (splitURL[3] === 'helpful') {
          putAnswerHelpful(answerId, (err, data) => {
            if (err) {
              res.status(404).send(err);
            } else {
              res.status(204).send(data);
            }
          })
        // PUT /qa/answers/:answer_id/report
        } else if (splitURL[3] === 'report') {
          console.log('report')
          putAnswerReport(answerId, (err, data) => {
            if (err) {
              console.log('err', err);
              res.status(404).send(err);
            } else {
              console.log('data', data);
              res.status(204).send(data);
            }
          })
        }
      }
    default:
      console.log('no PUT request found')
  }
})

//Start Listen
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});



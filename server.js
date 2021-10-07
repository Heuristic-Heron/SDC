require('newrelic');
const path = require("path")
const express = require("express");
const compression = require('compression')
const app = express();
const port = 3000;
const config = require('./server/config.js');
const { getQuestions, getAnswers, postQuestion, postAnswer, putQuestionHelpful, putAnswerHelpful, putQuestionReport, putAnswerReport } = require('./server/qaRoutes.js');


app.use(express.static(path.join(__dirname, "/client/dist")));
app.use(express.static(path.join(__dirname, "loaderio-c8b50793fe2f098f65bf23dfabbc6fa6.txt")));

app.use(express.json());
app.use(compression());


app.get('/*', (req, res) => {
  const { url } = req;
  // console.log('GET url', url)

  const splitURL = url.split('/')
  .filter(char => char !== '');
  const firstRoute = splitURL[0];
  switch (firstRoute) {
    case 'qa':
      // AnswerList: GET /qa/questions/:question_id/answers
      if (splitURL[3] === 'answers') {
        const question_id = splitURL[2].slice(1)
        let { page, count } = req.query;
        let limit = count ? count : 5;
        let offset = 0;
        if (!page || page === '1') {
          page = 1;
        } else {
          offset = page * limit;
        }
        // console.log('question_id:', question_id, 'limit:', limit, 'offset:', offset);
        getAnswers(question_id, limit, offset, page, (err, data) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(data);
          }
        });
     // QuestionList: GET /qa/questions
     // qa/questions?product_id=${product_id}&page=1&count=99`)
     } else {
      let { product_id, page, count } = req.query;
      let limit = count ? count : 5;
      let offset = 0;
      if (!page || page === '1') {
        page = 1;
      } else {
        offset = page * limit;
      }
      // console.log('product_id:', product_id, 'limit:', limit, 'offset:', offset);
      getQuestions(product_id, limit, offset, page, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(data);
        }
      })
    }
  }
});


app.post('/*', (req, res) => {
  const { url } = req;
  // console.log('POST url', url)

  const splitURL = url.split('/')
  .filter(char => char !== '');
  const firstRoute = splitURL[0];
  switch (firstRoute) {
    case 'qa':
      //POST /qa/questions/:question_id/answers
      if (splitURL[3] === 'answers') {
        const question_id = splitURL[2].slice(1);
        const body = req.body.body;
        const name = req.body.name;
        const email = req.body.email;
        // const photos = req.body.photos;
        // console.log('added answer for question', body, name, email, question_id);
        postAnswer(body, name, email, question_id, (err, data) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(201).send(data);
          }
        })
      //POST /qa/questions
      } else {
        const body = req.body.body;
        const name = req.body.name;
        const email = req.body.email;
        const product_id = req.body.product_id;
        // console.log('asked question for product_id', product_id, body, name, email);
        postQuestion(body, name, email, product_id, (err, data) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(201).send(data);
          }
        })
      }
  }
});


app.put('/*', (req, res) => {
  const { url } = req;
  // console.log('PUT url', url)

  const splitURL = url.split('/')
  .filter(char => char !== '');
  const firstRoute = splitURL[0];
  switch (firstRoute) {
    case 'qa':
      // PUT requests for questions
      if (splitURL[1] === 'questions') {
        const question_id = splitURL[2].slice(1);
        // PUT /qa/questions/:question_id/helpful
        if (splitURL[3] === 'helpful') {
          // console.log('helpfulquestion called')
          putQuestionHelpful(question_id, (err, data) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(204).send(data);
            }
          })
        //PUT /qa/questions/:question_id/report
        } else if (splitURL[3] === 'report') {
          // console.log('reportQuestion', question_id)
          putQuestionReport(question_id, (err, data) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(204).send(data);
            }
          })
        }
      // PUT requests for answers
      } else if (splitURL[1] === 'answers') {
        const answer_id = splitURL[2].slice(1);
        // console.log('answer_id called', answer_id);
        // PUT /qa/answers/:answer_id/helpful
        if (splitURL[3] === 'helpful') {
          // console.log('helpful answer', answer_id);
          putAnswerHelpful(answer_id, (err, data) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(204).send(data);
            }
          })
        // PUT /qa/answers/:answer_id/report
        } else if (splitURL[3] === 'report') {
          // console.log('report answer_id called', answer_id);
          putAnswerReport(answer_id, (err, data) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(204).send(data);
            }
          })
        }
      }
    }
})

//Start Listen
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});



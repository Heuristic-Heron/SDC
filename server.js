const path = require("path")
const express = require("express");
const compression = require('compression')
const app = express();
const port = 3000;
const config = require('./server/config.js');
const axios = require('axios');
const { getQuestions, getAnswers, postQuestion, postAnswer, putQuestionHelpful, putAnswerHelpful, putQuestionReport, putAnswerReport } = require('./qaRoutes.js');

const API_URL = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo';

app.use(express.static(path.join(__dirname, "/client/dist")));

app.use(express.json());
app.use(compression());

//Axios Requests, format right side URL within client-side request as req.url
const axiosConfig = {
  headers: {
    'content-type': 'application/json',
    'authorization': config.API_KEY
  }
};



app.get('/*', (req, res) => {
  const { url } = req;
  const splitURL = url.split('/')
  .filter(char => char !== '');
  const firstRoute = splitURL[0];
  console.log(firstRoute)
  switch (firstRoute) {
    case 'qa':
      if (url === '/qa/questions') {
        const productId = req.body.id;
        console.log('productId', productId);
        getQuestions(productId, (err, data) => {
          if (err) {
            res.status(404).send(err);
          } else {
            res.status(200).send(data);
          }
        })
      } else {
        const questionId = splitURL[2].slice(1)
        console.log('questionId', questionId);
        getAnswers(questionId, (err, data) => {
          if (err) {
            res.status(404).send(err);
          } else {
            res.status(200).send(data);
          }
        })
      }
    }
  }
);



//   axios.get(`${API_URL}${req.url}`, axiosConfig)
//   .then((response) => {
//     res.send(response.data);
//   })
//   .catch((error) => {
//     res.sendFile(__dirname + '/client/dist/404page.html');
//   })
// });

app.post('/*', (req, res) => {
  axios.post(`${API_URL}${req.url}`, req.body, axiosConfig)
  .then((response) => {
    res.send(response.status);
  })
  .catch((error) => {
    res.send(`Error making POST request: ${error}`);
  });
});

app.put('/*', (req, res) => {
  axios.put(`${API_URL}${req.url}`, {}, axiosConfig)
  .then((response) => {
    res.send(response.status);
  })
  .catch((error) => {
    res.send(`Error making PUT request: ${error}`);
  });
});

//Start Listen
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});



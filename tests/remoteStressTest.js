import http from 'k6/http';
import { sleep } from 'k6';


// OPTIONS FOR REMOTE SERVER TESTS
export let options = {
  stages: [
    { duration: '5s', target: 5 }, // below normal load (1/s)
    { duration: '5s', target: 50 }, // (10/s)
    { duration: '5s', target: 500 }, // normal load (50/s)
    // { duration: '5s', target: 1000 }, // around the breaking point (200/s)
    // { duration: '5s', target: 500 }, // beyond the breaking point
    { duration: '5s', target: 0 }, // scale down. Recovery stage.
  ],
  thresholds: {
    http_req_failed: [{
      threshold: 'rate<0.01', // errors less than 1%
      // abortOnFail: true
    }],
    http_req_duration: ['p(95)<3000'] // 95% of requests should be under 2000ms
  }
};



export default function () {
  const SLEEP_DURATION = 1;

  const randomizer = (max, min) => {
    if (min) {
      return Math.round((Math.random() * (max-min)) + min);
    }
    let calcMin = Math.floor(max * .9)
    return Math.round((Math.random() * (max-calcMin)) + calcMin);
  }

  const product_id = randomizer(1000000) // total 1,000,011 product ids
  const question_id = randomizer(3500000) // total 3,543,838 question ids
  const answer_id = randomizer(6900000) // total 6,904,118 answer ids
  const count = randomizer(100, 5)
  const page = randomizer(5, 1)

  const questionData = {
    body: 'Oct 7 Remote Testing: Will this work?',
    name: 'Cat Test',
    email: 'ilovetesting@yahoo.com',
    product_id: product_id
  }
  const answerData = {
    body: 'Oct 7 Remote Testing: This is the final answer. You can do it!',
    name: 'Cat Test',
    email: 'ilovetesting@yahoo.com'
  }

  const BASE_URL = 'http://localhost:3000';

  let responses = http.batch([
    // Stats for p(95) ramping up to 1500 looping VUs for 30s over 6 stages (300VUs/s)
    // GET questions requests <2.06s
    [
      'GET',
      `${BASE_URL}/qa/questions?product_id=${product_id}&page=${page}&count=${count}`,
      null,
      { tags: { name: 'QuestionList' } },
    ],
    // GET answers request <2.07s
    [
      'GET',
      `${BASE_URL}/qa/questions/:${question_id}/answers`,
      null,
      { tags: { name: 'AnswerList' } },
    ],
    // Helpful Question <1.77s
    [
      'PUT',
      `${BASE_URL}/qa/questions/:${question_id}/helpful`,
      null,
      { tags: { name: 'Helpful Question' } },
    ],
    // Helpful Answer <1.85s
    [
      'PUT',
      `${BASE_URL}/qa/answers/:${answer_id}/helpful`,
      null,
      { tags: { name: 'Helpful Answer' } },
    ],
    // Report Question <1.85s
    [
      'PUT',
      `${BASE_URL}/qa/questions/:${question_id}/report`,
      null,
      { tags: { name: 'Report Question' } },
    ],
    // Report Answer <1.82s
    [
      'PUT',
      `${BASE_URL}/qa/answers/:${answer_id}/report`,
      null,
      { tags: { name: 'Report Answer' } },
    ],
    // POST Question <2.02s
    [
      'POST',
      `${BASE_URL}/qa/questions`,
      JSON.stringify(questionData),
      { tags: { name: 'Post Question' },
      headers: { 'Content-Type': 'application/json' } },
    ],
    // POST Answer <1.88s
    [
      'POST',
      `${BASE_URL}/qa/questions/:${question_id}/answers`,
      JSON.stringify(answerData),
      { tags: { name: 'Post Answer' },
      headers: { 'Content-Type': 'application/json' } },
    ],
  ]);

  sleep(SLEEP_DURATION);
}

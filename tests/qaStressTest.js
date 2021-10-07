import http from 'k6/http';
import { sleep } from 'k6';

// export let options = {
//   stages: [
//     { duration: '5s', target: 10 }, // below normal load
//     { duration: '10s', target: 200 }, // normal load
//     { duration: '10s', target: 800 }, // around the breaking point
//     // { duration: '10s', target: 1000 }, // beyond the breaking point
//     { duration: '10s', target: 0 }, // scale down. Recovery stage.
//   ],
//   thresholds: {
//     http_req_failed: ['rate<0.01'], // errors less than 1%
//     http_req_duration: ['p(95)<2000'] // 95% of requests should be under 2000ms
//   }
// };

// // OPTIONS FOR SOLO TESTS
// export let options = {
//   stages: [
//     { duration: '5s', target: 5 }, // below normal load (1/s)
//     { duration: '5s', target: 50 }, // (10/s)
//     { duration: '5s', target: 500 }, // normal load (100/s)
//     { duration: '5s', target: 1000 }, // (200/s)
//     { duration: '5s', target: 1500 }, // around the breaking point (300/s)
//     // { duration: '5s', target: 2000 }, // beyond the breaking point
//     // { duration: '5s', target: 5000 }, // beyond the breaking point
//     { duration: '5s', target: 0 }, // scale down. Recovery stage.
//   ],
//   thresholds: {
//     http_req_failed: ['rate<0.05'], // errors less than 1%
//     http_req_duration: ['p(95)<3000'] // 95% of requests should be under 2000ms
//   }
// };

// OPTIONS FOR ALL TESTS
export let options = {
  stages: [
    { duration: '5s', target: 5 }, // below normal load (1/s)
    { duration: '5s', target: 50 }, // (10/s)
    { duration: '5s', target: 250 }, // normal load (50/s)
    { duration: '5s', target: 300 }, // around the breaking point (100/s)
    { duration: '5s', target: 400 }, // beyond the breaking point
    { duration: '5s', target: 0 }, // scale down. Recovery stage.
  ],
  thresholds: {
    http_req_failed: [{threshold: 'rate<0.01', abortOnFail: true}], // errors less than 1%
    http_req_duration: ['p(95)<3000'] // 95% of requests should be under 2000ms
  }
};


export default function () {
  const SLEEP_DURATION = 1;

  // 1,000,011 product ids
  // 3,543,838 question ids
  // 6,904,118 answer ids
  const product_idMax = 1000000; // started with 100000
  const product_idMin = 1;
  const product_id = Math.round((Math.random() * (idMax-idMin)) + idMin);

  const question_idMax = 3500000; // started with 100000
  const question_idMin = 1;
  const question_id = Math.round((Math.random() * (idMax-idMin)) + idMin);

  const answer_idMax = 6900000; // started with 100000
  const answer_idMin = 1;
  const answer_id = Math.round((Math.random() * (idMax-idMin)) + idMin);

  const countMax = 100;
  const countMin = 5;
  const count = Math.round((Math.random() * (countMax-countMin)) + countMin);

  const pageMax = 5;
  const pageMin = 1;
  const page = Math.round((Math.random() * (pageMax-pageMin)) + pageMin);

  const questionData = {
    body: 'Testing: Will this work?',
    name: 'Cat Test',
    email: 'ilovetesting@yahoo.com',
    product_id: id
  }
  const answerData = {
    body: 'Testing: This is the final answer. You can do it!',
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

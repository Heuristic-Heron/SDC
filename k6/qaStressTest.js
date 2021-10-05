import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 10 }, // below normal load
    { duration: '10s', target: 100 }, // normal load
    { duration: '10s', target: 1000 }, // around the breaking point
    { duration: '10s', target: 10000 }, // beyond the breaking point
    { duration: '10s', target: 0 }, // scale down. Recovery stage.
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // errors less than 1%
    http_req_duration: ['p(95)<2000'] // 95% of requests should be under 2000ms
  }
};


export default function () {

  const SLEEP_DURATION = 1;
  const idMax = 100000;
  const idMin = 1;
  const id = Math.round((Math.random() * (idMax-idMin)) + idMin);

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
    body: 'Testing: This is the final answer',
    name: 'Cat Test',
    email: 'ilovetesting@yahoo.com'
  }

  const BASE_URL = 'http://localhost:3000';

  let responses = http.batch([
    // GET questions requests <3.37s (SLOWEST)
    [
      'GET',
      `${BASE_URL}/qa/questions?product_id=${id}&page=${page}&count=${count}`,
      null,
      { tags: { name: 'QuestionList' } },
    ],
    // GET answers request <106ms
    [
      'GET',
      `${BASE_URL}/qa/questions/:${id}/answers`,
      null,
      { tags: { name: 'AnswerList' } },
    ],
    // PUT requests < 14ms
    [
      'PUT',
      `${BASE_URL}/qa/questions/:${id}/helpful`,
      null,
      { tags: { name: 'Helpful Question' } },
    ],
    [
      'PUT',
      `${BASE_URL}/qa/answers/:${id}/helpful`,
      null,
      { tags: { name: 'Helpful Answer' } },
    ],
    [
      'PUT',
      `${BASE_URL}/qa/questions/:${id}/report`,
      null,
      { tags: { name: 'Report Question' } },
    ],
    [
      'PUT',
      `${BASE_URL}/qa/answers/:${id}/report`,
      null,
      { tags: { name: 'Report Answer' } },
    ],
    // POST request < 9ms
    [
      'POST',
      `${BASE_URL}/qa/questions`,
      JSON.stringify(questionData),
      { tags: { name: 'Post Question' },
      headers: { 'Content-Type': 'application/json' } },
    ],
    // POST request <11ms
    [
      'POST',
      `${BASE_URL}/qa/questions/:${id}/answers`,
      JSON.stringify(answerData),
      { tags: { name: 'Post Answer' },
      headers: { 'Content-Type': 'application/json' } },
    ],
  ]);

  sleep(SLEEP_DURATION);
}

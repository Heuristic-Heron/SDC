import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '5s', target: 1 }, // below normal load
    { duration: '10s', target: 50 }, // normal load
    { duration: '10s', target: 100 }, // around the breaking point
    // { duration: '10s', target: 500 },
    // { duration: '10s', target: 1000 }, // beyond the breaking point
    // { duration: '10s', target: 0 }, // scale down. Recovery stage.
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // errors less than 1%
    http_req_duration: ['p(95)<2000'] // 95% of requests should be under 2000ms
  }
};


export default function () {

  const SLEEP_DURATION = 1;
  const max = 100000;
  const min = 1;
  const id = Math.round((Math.random() * (max-min)) + min);

  const BASE_URL = 'http://localhost:3000';

  let responses = http.batch([
    [
      'GET',
      `${BASE_URL}/qa/questions?product_id=${id}&page=1&count=5`,
      null,
      { tags: { name: 'QuestionList' } },
    ],
    [
      'GET',
      `${BASE_URL}/qa/questions/:${id}/answers`,
      null,
      { tags: { name: 'AnswerList' } },
    ],
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
  ]);

  sleep(SLEEP_DURATION);
}

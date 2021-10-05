const request = require('supertest');
const express = require('express');
const { app } = require('../server.js')


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

// GET questions
request(app)
  .get(`${BASE_URL}/qa/questions?product_id=${id}&page=${page}&count=${count}`)
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });

// GET answers
request(app)
  .get(`${BASE_URL}/qa/questions/:${id}/answers`)
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });

// PUT helpful question
request(app)
  .put(`${BASE_URL}/qa/questions/:${id}/helpful`)
  .expect('Content-Type', /json/)
  .expect(204)
  .end(function(err, res) {
    if (err) throw err;
  });

// PUT helpful answer
request(app)
  .put(`${BASE_URL}/qa/answers/:${id}/helpful`)
  .expect('Content-Type', /json/)
  .expect(204)
  .end(function(err, res) {
    if (err) throw err;
  });

// PUT report question
request(app)
  .put(`${BASE_URL}/qa/questions/:${id}/report`)
  .expect('Content-Type', /json/)
  .expect(204)
  .end(function(err, res) {
    if (err) throw err;
  });

// PUT report answer
request(app)
  .put(`${BASE_URL}/qa/answers/:${id}/report`)
  .expect('Content-Type', /json/)
  .expect(204)
  .end(function(err, res) {
    if (err) throw err;
  });


// POST question
  request(app)
  .post(`${BASE_URL}/qa/questions`)
  .send(JSON.stringify(questionData))
  .expect('Content-Type', /json/)
  .expect(201)
  .end(function(err, res) {
    if (err) throw err;
  });

// POST answer
request(app)
  .post(`${BASE_URL}/qa/questions/:${id}/answers`)
  .send(JSON.stringify(answerData))
  .expect('Content-Type', /json/)
  .expect(201)
  .end(function(err, res) {
    if (err) throw err;
  });
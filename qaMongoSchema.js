// const mongoose = require('mongoose');
// mongoose.connect('[PLACEHOLDER]', {useNewUrlParser: true, useUnifiedTopology: true})
//   .then(console.log('Q&A MongoDB connected!'))
//   .catch((err) => console.log(err))

// Products => Questions: one-to-many
// Questions => Answers: one-to-many
// Answers => Photos: one-to-few (limit 5)

let Schema = mongoose.Schema;

let QuestionsSchema = new Schema({
  question_id: { type: Number, index: true, unique: true },
  body: { type: String, required: true, unique: true  maxLength: 1000 },
  date: { type: Date, required: true, default: Date.now },
  name: { type: String, required: true, maxLength: 60 },
  email: { type: String, required: true, maxLength: 60 },
  helpfulness: { type: Number, min: 0, default: 0 },
  reported: { type: Boolean, required: true, default: false },
  product_id: Schema.Types.ObjectId, // reference to Product document
  answers: [Schema.Types.ObjectId], // array of references to Answers document
});

let AnswersSchema = new Schema({
  answer_id: { type: Number, index: true, unique: true },
  body: { type: String, required: true, unique: true  maxLength: 1000 },
  date: { type: Date, required: true, default: Date.now },
  name: { type: String, required: true, maxLength: 60 },
  email: { type: String, required: true, maxLength: 60 },
  helpfulness: { type: Number, min: 0, default: 0 },
  reported: { type: Boolean, required: true, default: false },
  question_id: Schema.Types.ObjectId,
  photos: [{
    url: { type: String, required: true, unique: true } // photos directly embedded in Answers
  }]
});


let QuestionsModel = mongoose.model('QuestionsModel', QuestionsSchema);
let AnswersModel = mongoose.model('AnswersModel', AnswersSchema);


// let QA = mongoose.model('QA', qaSchema);

// module.exports.QA = QA;

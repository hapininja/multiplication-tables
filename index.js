'use strict';

const prompt = require('prompt');
const async = require('async');
const clear = require('clear');

let methods = [];

clear();
prompt.start();

prompt.get([{
  name: 'questions',
  message: 'Must be a number',
  description: 'How many questions would you like?',
  required: true,
}, {
  name: 'highest',
  message: 'Must be a number',
  description: 'Highest number to use',
  required: true,
}, ], (err, result) => {
  if (err) {
    return onErr(err);
  }

  console.log('Time to test your times table:');

  let questions = result.questions;
  while (questions > 0) {

    methods.push(function(callback) {

      const num1 = Math.floor((Math.random() * result.highest) + 1);
      const num2 = Math.floor((Math.random() * result.highest) + 1);

      prompt.get({
        name: 'answer',
        description: num1 + ' * ' + num2 + ' =',
        type: 'number',
        message: 'Must be a number',
        required: true,
      }, (err, res) => {
        if (err) {
          return onErr(err);
        }

        //callback with prompt data
        //for after action metrics
        callback(null, {
          num1: num1,
          num2: num2,
          answer: res.answer,
          correct: num1 * num2,
          right: (num1 * num2 === res.answer),
        });
      });
    });

    questions--;
  }

  /**
   * Perform the async prompt problems in series
   * Then collect the callback data from each
   * and calculate metrics from total
   */
  async.series(methods, (err, questions) => {

    if (err) {
      return onErr(err);
    }

    const wrongAnswers = questions.filter((answer) => !answer.right);

    console.log('Total Questions:' + questions.length);
    console.log('Percentage Correct:' + Math.round(((questions.length - wrongAnswers.length) / questions.length) * 100) + '%');

    if (wrongAnswers.length > 0) {
      console.log('\nYour wrong answers');
      wrongAnswers.forEach((o) => {
        console.log(o.num1 + ' * ' + o.num2 + ' = ' + (o.num1 * o.num2) + ': You answered (' + o.answer + ')');
      });
    } else {
      console.log('\nGreat work.  Keep it up!');
    }

  });

});

function onErr(err) {
  console.log(err);
  return 1;
}

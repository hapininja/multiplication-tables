var prompt = require('prompt');
var async = require('async');
var clear = require('clear');

var methods = [];

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
}, ], function(err, result) {
  if (err) {
    return onErr(err);
  }

  console.log('Time to test your times table:');

  var questions = result.questions;
  while (questions > 0) {

    methods.push(function(callback) {
      var num1 = Math.floor((Math.random() * result.highest) + 1);
      var num2 = Math.floor((Math.random() * result.highest) + 1);
      prompt.get({
        name: 'answer',
        description: num1 + ' * ' + num2 + ' =',
        type: 'number',
        message: 'Must be a number',
        required: true,
      }, function(err, res) {
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
  async.series(methods, function(err, data) {

    var total = data.length;
    var wrong = 0;
    var wrongArray = [];

    data.filter((answer) => !answer.right).forEach(function(o) {
      wrong++;
      wrongArray.push(o.num1 + ' * ' + o.num2 + ' = ' + (o.num1 * o.num2) + ': You answered (' + o.answer + ')');
    });

    console.log('\nTotal Questions:' + total + '\nPercentage Correct:' + Math.round(((total - wrong) / total) * 100) + '%');
    if (wrongArray.length > 0) {
      console.log('\nYour wrong answers');
      wrongArray.forEach((o) => console.log(o));
    }

  });

});

function onErr(err) {
  console.log(err);
  return 1;
}

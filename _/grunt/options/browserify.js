//---------------------------------
//
//  Lib dependencies handled thru browserify:
//  Ex: npm install --save-dev jquery
//  var $ = require('jquery'); in your script file
//
//---------------------------------

var srcs = require('../srcs.js');

module.exports = {
  options: {
    browserifyOptions: {
      debug: true
    }
  },
  dist: {
    files: {
      'js/app.js': [srcs.js.main],
    }
  }
};
var srcs = require('../srcs.js');

module.exports = {
  all: ['gruntfile.js', srcs.js.all],
  options: {
    jshintrc: '.jshintrc'
  }
};
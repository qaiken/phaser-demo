var srcs = require('../srcs.js');

module.exports = {
  my_target: {
    files: {
      'js/app.js': [srcs.js.production]
    }
  }
};
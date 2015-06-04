var srcs = require('../srcs.js');

module.exports = {
  modify: {
    src: ['gruntfile.js', srcs.js.all],
    options: {
      config: '.jsbeautifyrc'
    }
  },
  verify: {
    src: ['gruntfile.js', srcs.js.all],
    options: {
      mode: 'VERIFY_ONLY',
      config: '.jsbeautifyrc'
    }
  }
};
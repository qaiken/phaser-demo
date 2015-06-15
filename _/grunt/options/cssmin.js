var srcs = require('../srcs.js');

module.exports = {
  target: {
    files: [{
      expand: true,
      cwd: srcs.sass.cssDir,
      src: ['*.css', '!*.min.css'],
      dest: srcs.sass.cssDir,
      ext: '.css'
    }]
  }
};
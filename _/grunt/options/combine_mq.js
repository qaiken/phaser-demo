var srcs = require('../srcs.js');

module.exports = {
  default_options: {
    expand: true,
    cwd: srcs.sass.cssDir,
    src: '*.css',
    dest: srcs.sass.cssDir
  }
};
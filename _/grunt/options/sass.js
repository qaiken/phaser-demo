var srcs = require('../srcs.js');

module.exports = {
  dist: {
    options: {
      style: 'expanded',
      require: 'sass-globbing',
      sourcemap: 'auto'
    },
    files: [{
      expand: true,
      cwd: srcs.sass.main,
      src: ['*.scss'],
      dest: 'css',
      ext: '.css'
    }]
  }
};
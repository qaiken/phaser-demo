//---------------------------------
//
//  LiveReload uses chrome extension
//  no need to add script tag
//
//---------------------------------

var srcs = require('../srcs.js');

module.exports = {
  options: {
    livereload: true
  },
  scripts: {
    files: [srcs.js.all],
    tasks: ['browserify', 'uglify']
  },
  sass: {
    files: [srcs.sass.all],
    tasks: ['sass', 'autoprefixer']
  },
  html: {
    files: ['*.html']
  },
  img: {
    files: [srcs.img.all],
    tasks: ['imagemin']
  }
};
module.exports = {
  dynamic: {
    files: [{
      expand: true,
      cwd: '_/img',
      src: ['**/*.*'],
      dest: 'img/'
    }]
  }
};
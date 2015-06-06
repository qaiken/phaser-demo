var PhaserDemo = require('./phaserDemo');

PhaserDemo.Preloader = function(game) {
};

PhaserDemo.Preloader.prototype = {
  preload: function() {
    this.load.image('sky', 'img/sky.png');
    this.load.image('diamond', 'img/diamond.png');
    this.load.image('ground', 'img/platform.png');
    this.load.image('star', 'img/star.png');
    this.load.image('sky', 'img/sky.png');

    this.load.spritesheet('baddie', 'img/baddie.png', 32, 32);
    this.load.spritesheet('dude', 'img/dude.png', 32, 48);

    this.load.audio('pickup_1', 'audio/pickup-1.wav');
    this.load.audio('pickup_2', 'audio/pickup-2.wav');
    this.load.audio('boom', 'audio/boom.wav');
    this.load.audio('win', 'audio/win.wav');
    this.load.audio('jump', 'audio/jump.wav');
  },
  update: function() {
    if ( this.cache.isSoundDecoded('jump') ) {
      this.state.start('Game');
    }
  }
};

module.exports = PhaserDemo.Preloader;

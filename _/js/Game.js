var PhaserDemo = require('./phaserDemo');
var utils = require('./utils');

PhaserDemo.Game = function(game) {
  this.score = 0;
  this.level = 0;
  this.highScore = document.querySelector('.score-value');
  this.currLevel = document.querySelector('.level-value');
};

PhaserDemo.Game.prototype = {
  create: function() {
    this.initScene();
    this.buildWorld();
  },
  initScene: function() {
    // We're going to be using physics, so enable the Arcade Physics system
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // A simple background for our game
    this.add.sprite(0, 0, 'sky');

    // The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.add.group();

    // We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    this.initAudio(['pickup_1','pickup_2','jump','boom','win']);

    // The score
    this.scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000'
    });

    // Our controls
    this.cursors = this.input.keyboard.createCursorKeys();
  },
  drawPlatforms: function() {
    var ledge, xPos, yPos;
    var drawnYPositions = [];
    // Max: 3 Min: 1
    var additionalLedges = Math.floor(Math.random()*(3)+1);
    // Here we create the ground.
    var ground = this.platforms.create(0, this.world.height - 64, 'ground');

    var dontOverLap = function(yPos) {
      drawnYPositions.forEach(function(pos) {
        while( Math.abs(pos - yPos) < 82 ) {
          yPos -= 5;
        }
      });
      return yPos;
    }

    // Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    // This stops it from falling away when you jump on it
    ground.body.immovable = true;

    // Make sure there is one low ledge on the left
    // Max: 100 Min: -200
    xPos = Math.floor(Math.random()*(-101)-200);
    // Max: 400 Min: 350
    yPos = Math.floor(Math.random()*(51)+350);
    ledge = this.platforms.create(xPos, yPos, 'ground');
    ledge.body.immovable = true;
    drawnYPositions.push(yPos);

    // Make sure there is one medium ledge in the middle
    // Max: 250 Min: 150
    xPos = Math.floor(Math.random()*(101)+150);
    // Max: 350 Min: 300
    yPos = Math.floor(Math.random()*(51)+300);
    yPos = dontOverLap(yPos);
    drawnYPositions.push(yPos);
    ledge = this.platforms.create(xPos, yPos, 'ground');
    ledge.body.immovable = true;

    // Draw Additional Ledges
    for(var i = 0; i < additionalLedges; ++i) {
      // Max: 600 Min: -200
      xPos = Math.floor(Math.random()*(801)-200);

      // Max: 400 Min: 250
      yPos = Math.floor(Math.random()*(151)+250);

      yPos = dontOverLap(yPos);
      if( yPos < 82 ) {
        break;
      }
      drawnYPositions.push(yPos);

      ledge = this.platforms.create(xPos, yPos, 'ground');
      ledge.body.immovable = true;
    }
  },
  drawPlayer: function() {
    // The player and its settings
    this.player = this.add.sprite(32, this.world.height - 150, 'dude');

    // We need to enable physics on the player and baddie
    this.physics.arcade.enable(this.player);

    // Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.friction = 0.95;
    this.player.body.collideWorldBounds = true;

    // Two player animations, walking left and right.
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);
  },
  drawBaddies: function() {
    var baddie, pos;

    // The baddie and its settings
    this.baddies = this.add.group();

    this.baddies.enableBody = true;

    for (var i = 0; i < 3 + this.level; i++) {
      // Max: game.world.width-32 Min: 0
      pos = Math.floor(Math.random()*(this.world.width-32+1));
      baddie = this.baddies.create(pos, 0, 'baddie');

      // Baddie physics properties.
      baddie.body.bounce.y = 0.2;
      baddie.body.gravity.y = 300;
      baddie.body.collideWorldBounds = true;

      // Two badie animations, walking left and right.
      baddie.animations.add('left', [0, 1], 10, true);
      baddie.animations.add('right', [2,3], 10, true);

      this.physics.arcade.enable(baddie);
    }
  },
  drawStars: function(numStars) {
    var star;
    var spaces = this.world.width / numStars;

    this.stars = this.add.group();

    // We will enable physics for any star that is created in this group
    this.stars.enableBody = true;

    // Creat stars evenly spaced apart
    for (var i = 0; i < numStars; i++) {
      // Create a star inside of the 'stars' group
      star = this.stars.create((i * spaces)+11, 0, 'star');

      // Let gravity do its thing
      star.body.gravity.y = 300;

      // This just gives each star a slightly random bounce value
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
  },
  drawDiamonds: function() {
    var diamond, pos;
    var numDiamonds = 3;

    // Similar to stars, add diamonds as well
    this.diamonds = this.add.group();

    this.diamonds.enableBody = true;

    for (var i = 0; i < numDiamonds; i++) {
      pos = Math.floor(Math.random()*(this.world.width-32+1));
      diamond = this.diamonds.create(pos, 0, 'diamond');

      diamond.body.gravity.y = 600;

      diamond.body.bounce.y = 0.2 + Math.random() * 0.2;
    }
  },
  movePlayer: function() {
    if (this.cursors.left.isDown) {
      // Move to the left
      this.player.body.velocity.x = -150;

      this.player.animations.play('left');
    } else if (this.cursors.right.isDown) {
      // Move to the right
      this.player.body.velocity.x = 150;

      this.player.animations.play('right');
    } else {
      // Stand still
      this.player.animations.stop();

      this.player.frame = 4;
    }

    if (this.player.body.touching.down) {
      // Allow the player to jump if they are touching the ground.
      if (this.cursors.up.isDown) {
        this.jump.play();
        this.player.body.velocity.y = -350;
      }

      // Apply friction when player is sliding
      if (!this.cursors.left.isDown && !this.cursors.right.isDown && Math.abs(this.player.body.velocity.x) > 0) {
        this.player.body.velocity.x *= this.player.body.friction;

        if (Math.abs(this.player.body.velocity.x) < 0.1) {
          this.player.body.velocity.x = 0;
        }
      }
    }
  },
  moveBaddies: function() {
    var directions = [{
      animation: 'left',
      frame: 1
    },
    {
      animation: 'right',
      frame: 2
    }];

    var moveBaddie = function(baddie) {
      var i = Math.floor(Math.random() * 2);
      var dir_obj = directions[i];
      var velocity = utils.randomNumber(50,100);
      var delay = Math.floor((Math.random() * 5001) + 1000);

      if(dir_obj.animation === 'left') {
        baddie.body.velocity.x = -velocity;
        baddie.animations.play('left');
      } else {
        baddie.body.velocity.x = velocity;
        baddie.animations.play('right');
      }

      setTimeout(function() {
        baddie.body.velocity.x = 0;
        baddie.animations.stop();
        // look left or right
        baddie.frame = Math.floor((Math.random() * 2) + 1);

        setTimeout(function() {
          moveBaddie(baddie);
        },delay);
      },delay);
    };

    this.baddies.forEach(moveBaddie);
  },
  checkBaddieWallCollision: function() {
    this.baddies.forEach(function(baddie) {
      if( baddie.body.x <= 0 ) {

        baddie.animations.stop();
        baddie.body.velocity.x = utils.randomNumber(50,100);
        baddie.animations.play('right');

      } else if( baddie.body.x >= (this.world.width - baddie.width) ) {

        baddie.animations.stop();
        baddie.body.velocity.x = -utils.randomNumber(50,100);
        baddie.animations.play('left');

      }
    }.bind(this));
  },
  checkObjectCollisions: function() {
    this.physics.arcade.collide(this.player, this.platforms);
    this.physics.arcade.collide(this.baddies, this.platforms);

    this.physics.arcade.collide(this.stars, this.platforms);
    this.physics.arcade.collide(this.diamonds, this.platforms);

    this.physics.arcade.overlap(this.player, this.stars, this.collectPoints, null, this);
    this.physics.arcade.overlap(this.player, this.diamonds, this.collectPoints, null, this);

    this.physics.arcade.overlap(this.player, this.baddies, this.gameOver, null, this);
  },
  buildWorld: function() {
    this.drawPlatforms();

    this.drawBaddies();
    this.moveBaddies();

    this.drawStars(48);
    this.drawDiamonds();

    this.drawPlayer();
  },
  checkIfWon: function() {
    if( this.stars.total === 0 && this.diamonds.total === 0) {
      this.win.play();
      
      this.currLevel.textContent = ++this.level + 1;

      this. reset();
    }
  },
  gameOver: function() {
    this.boom.play();

    this.score = 0;
    this.level = 0;
    this.currLevel.textContent = 1;
    this.scoreText.text = 'Score: ' + this.score;

    this.reset();
  },
  initAudio: function(sounds) {
    sounds.forEach(function(sound) {
      this[sound] = this.add.audio(sound);
      this[sound].volume = 0.2;
    }.bind(this));
  },
  reset: function() {
    this.player.kill();

    this.killEm(this.stars);
    this.killEm(this.diamonds);
    this.killEm(this.baddies);
    this.killEm(this.platforms);

    this.buildWorld();
  },
  killEm: function(group) {
    group.children.forEach(function(item) {
      item.kill();
    });
  },
  collectPoints: function(player,object) {
    var points;
    var type = object.key;

    if ( type === 'diamond' ) {
      points = 10;
      this.pickup_2.play();
    } else {
      points = 1;
      this.pickup_1.play();
    }

    // Remove the object from the screen
    object.kill();

    // Add and update the score
    this.score += points;


    if( this.score > +this.highScore.textContent ) {
      this.highScore.textContent = this.score;
    }

    this.scoreText.text = 'Score: ' + this.score;
  },
  update: function() {
    this.checkObjectCollisions();

    this.movePlayer();

    this.checkBaddieWallCollision();

    this.checkIfWon();
  }
};

module.exports = PhaserDemo.Game;

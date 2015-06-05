var Phaser = require('Phaser');

var player, baddies, platforms, cursors, stars, diamonds, scoreText;

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

var randomVelocity = function() {
  return Math.floor((Math.random() * 51) + 50);
};

var score = 0;
var level = 0;

var highScore = document.querySelector('.score-value');
var currLevel = document.querySelector('.level-value');

function preload() {
  game.load.image('sky', 'img/sky.png');
  game.load.image('diamond', 'img/diamond.png');
  game.load.image('ground', 'img/platform.png');
  game.load.image('star', 'img/star.png');
  game.load.image('sky', 'img/sky.png');

  game.load.spritesheet('baddie', 'img/baddie.png', 32, 32);
  game.load.spritesheet('dude', 'img/dude.png', 32, 48);

  game.load.audio('pickup_1', 'audio/pickup-1.wav');
  game.load.audio('pickup_2', 'audio/pickup-2.wav');
  game.load.audio('boom', 'audio/boom.wav');
  game.load.audio('win', 'audio/win.wav');
  game.load.audio('jump', 'audio/jump.wav');
}

function create() {

  initScene();

  drawPlatforms();

  drawPlayer();

  drawBaddies();

  moveBaddies();

  drawStars();

  drawDiamonds();

  initAudio(['pickup_1','pickup_2','jump','boom','win']);

  // The score
  scoreText = game.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000'
  });

  // Our controls.
  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  checkObjectCollisions();

  movePlayer();

  checkBaddieWallCollision();

  checkIfWon();
}

function initScene() {
  // We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // A simple background for our game
  game.add.sprite(0, 0, 'sky');

  // The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  // We will enable physics for any object that is created in this group
  platforms.enableBody = true;
}

function drawPlatforms() {
  var ledge, xPos,yPos;
  var drawnYPositions = [];
  // Max: 3 Min: 1
  var additionalLedges = Math.floor(Math.random()*(3)+1);
  // Here we create the ground.
  var ground = platforms.create(0, game.world.height - 64, 'ground');

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
  ledge = platforms.create(xPos, yPos, 'ground');
  ledge.body.immovable = true;
  drawnYPositions.push(yPos);

  // Make sure there is one medium ledge in the middle
  // Max: 250 Min: 150
  xPos = Math.floor(Math.random()*(101)+150);
  // Max: 350 Min: 300
  yPos = Math.floor(Math.random()*(51)+300);
  yPos = dontOverLap(yPos);
  ledge = platforms.create(xPos, yPos, 'ground');
  ledge.body.immovable = true;
  drawnYPositions.push(yPos);

  // Draw Additional Ledges
  for(var i = 0; i < additionalLedges; ++i) {
    // Max: 600 Min: -200
    xPos = Math.floor(Math.random()*(801)-200);

    // Max: 400 Min: 250
    yPos = Math.floor(Math.random()*(151)+250);

    yPos = dontOverLap(yPos);

    drawnYPositions.push(yPos);

    ledge = platforms.create(xPos, yPos, 'ground');
    ledge.body.immovable = true;
  }

  console.log(drawnYPositions);
}

function drawPlayer() {
  // The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'dude');

  // We need to enable physics on the player and baddie
  game.physics.arcade.enable(player);

  // Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.friction = 0.95;
  player.body.collideWorldBounds = true;

  // Two player animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);
}

function drawBaddies() {
  // The baddie and its settings
  baddies = game.add.group();

  baddies.enableBody = true;

  for (var i = 0; i < 3 + level; i++) {
    var baddie = baddies.create((i * 300) + 25, 0, 'baddie');

    // Baddie physics properties.
    baddie.body.bounce.y = 0.2;
    baddie.body.gravity.y = 300;
    baddie.body.collideWorldBounds = true;

    // Two badie animations, walking left and right.
    baddie.animations.add('left', [0, 1], 10, true);
    baddie.animations.add('right', [2,3], 10, true);

    game.physics.arcade.enable(baddie);
  }
}

function drawStars() {
  // Finally some stars to collect
  stars = game.add.group();

  // We will enable physics for any star that is created in this group
  stars.enableBody = true;

  // Here we'll create 12 of them evenly spaced apart
  var numStars = 12;
  for (var i = 0; i < numStars; i++) {
    // Create a star inside of the 'stars' group
    var star = stars.create(i * (game.width / numStars) + 10, 0, 'star');

    // Let gravity do its thing
    star.body.gravity.y = 300;

    // This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }
}

function drawDiamonds() {
  // Similar to stars, add diamonds as well
  diamonds = game.add.group();

  diamonds.enableBody = true;

  var numDiamonds = 3;
  for (var i = 0; i < numDiamonds; i++) {
    var diamond = diamonds.create(i * (game.width / numDiamonds) + 20, 0, 'diamond');

    diamond.body.gravity.y = 600;

    diamond.body.bounce.y = 0.2 + Math.random() * 0.2;
  }
}

function movePlayer() {
  if (cursors.left.isDown) {
    // Move to the left
    player.body.velocity.x = -150;

    player.animations.play('left');
  } else if (cursors.right.isDown) {
    // Move to the right
    player.body.velocity.x = 150;

    player.animations.play('right');
  } else {
    // Stand still
    player.animations.stop();

    player.frame = 4;
  }

  if (player.body.touching.down) {
    // Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown) {
      game.jump.play();
      player.body.velocity.y = -350;
    }

    // Apply friction when player is sliding
    if (!cursors.left.isDown && !cursors.right.isDown && Math.abs(player.body.velocity.x) > 0) {
      player.body.velocity.x *= player.body.friction;

      if (Math.abs(player.body.velocity.x) < 0.1) {
        player.body.velocity.x = 0;
      }
    }
  }
}

function moveBaddies() {
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
    var velocity = randomVelocity();
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
      baddie.frame = Math.floor((Math.random() * 2) + 1);

      setTimeout(function() {
        moveBaddie(baddie);
      },delay);
    },delay);
  };

  baddies.forEach(moveBaddie);
}

function checkBaddieWallCollision() {
  baddies.forEach(function(baddie) {
    if( baddie.body.x <= 0 ) {

      baddie.animations.stop();
      baddie.body.velocity.x = randomVelocity();
      baddie.animations.play('right');

    } else if( baddie.body.x >= (game.width - baddie.width) ) {

      baddie.animations.stop();
      baddie.body.velocity.x = -randomVelocity();
      baddie.animations.play('left');

    }
  });
}

function checkObjectCollisions() {
  // Collide the entities with the platforms
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(baddies, platforms);

  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.collide(diamonds, platforms);

  // Checks to see if the player overlaps with any of the stars or diamonds
  // Call collectPoints function if so
  game.physics.arcade.overlap(player, stars, collectPoints, null, this);
  game.physics.arcade.overlap(player, diamonds, collectPoints, null, this);

  game.physics.arcade.overlap(player, baddies, gameOver, null, this);
}

function killEm(group) {
  group.children.forEach(function(item) {
    item.kill();
  });
}

function collectPoints(player, object) {
  var points;
  var type = object.key;

  if ( type === 'diamond' ) {
    points = 10;
    game.pickup_2.play();
  } else {
    points = 1;
    game.pickup_1.play();
  }

  // Remove the object from the screen
  object.kill();

  // Add and update the score
  score += points;


  if( score > +highScore.textContent ) {
    highScore.textContent = score;
  }

  scoreText.text = 'Score: ' + score;
}

function reset() {
  player.kill();

  killEm(stars);
  killEm(diamonds);
  killEm(baddies);
  killEm(platforms);

  drawPlatforms();
  drawStars();
  drawDiamonds();
  
  drawBaddies(level);
  moveBaddies();

  drawPlayer();
}

function initAudio(sounds) {
  sounds.forEach(function(sound) {
    game[sound] = game.add.audio(sound);
    game[sound].volume = 0.2;
  });
}

function checkIfWon() {
  if( stars.total === 0 && diamonds.total === 0) {
    game.win.play();
    
    currLevel.textContent = ++level + 1;

    reset();
  }
}

function gameOver() {

  game.boom.play();

  score = 0;
  level = 0;
  currLevel.textContent = 1;
  scoreText.text = 'Score: ' + score;

  reset();
}
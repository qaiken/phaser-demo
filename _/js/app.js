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

function preload() {
  game.load.image('sky', 'img/sky.png');
  game.load.image('diamond', 'img/diamond.png');
  game.load.image('ground', 'img/platform.png');
  game.load.image('star', 'img/star.png');
  game.load.image('sky', 'img/sky.png');
  game.load.spritesheet('baddie', 'img/baddie.png', 32, 32);
  game.load.spritesheet('dude', 'img/dude.png', 32, 48);
}

function create() {

  initScene();

  drawPlayer();

  drawBaddies();
  moveBaddies();

  drawStars();

  drawDiamonds();

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
  var ground,ledge;

  // We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // A simple background for our game
  game.add.sprite(0, 0, 'sky');

  // The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  // We will enable physics for any object that is created in this group
  platforms.enableBody = true;

  // Here we create the ground.
  ground = platforms.create(0, game.world.height - 64, 'ground');

  // Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(2, 2);

  // This stops it from falling away when you jump on it
  ground.body.immovable = true;

  // Now let's create two ledges
  ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;

  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;
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

  for (var i = 0; i < 3; i++) {
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
    if (cursors.up.isDown)
      player.body.velocity.y = -350;

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
      baddie.body.velocity.x = 0
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
  var points = (object.key === 'diamond' ? 10 : 1);

  // Remove the object from the screen
  object.kill();

  // Add and update the score
  score += points;

  scoreText.text = 'Score: ' + score;
}

function reset() {
  player.kill();

  killEm(stars);
  killEm(diamonds);
  killEm(baddies);

  drawStars();
  drawDiamonds();
  
  drawBaddies();
  moveBaddies();

  drawPlayer();
}

function checkIfWon() {
  if( stars.total === 0 && diamonds.total === 0) {
    reset();
  }
}

function gameOver() {
  score = 0;
  scoreText.text = 'Score: ' + score;

  reset();
}
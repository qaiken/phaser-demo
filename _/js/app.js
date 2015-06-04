var Phaser = require('Phaser');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function preload() {
  game.load.image('sky', 'img/sky.png');
  game.load.image('diamond', 'img/diamond.png');
  game.load.image('ground', 'img/platform.png');
  game.load.image('star', 'img/star.png');
  game.load.spritesheet('dude', 'img/dude.png', 32, 48);
}

function create() {

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  A simple background for our game
  game.add.sprite(0, 0, 'sky');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  //  We will enable physics for any object that is created in this group
  platforms.enableBody = true;

  // Here we create the ground.
  var ground = platforms.create(0, game.world.height - 64, 'ground');

  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(2, 2);

  //  This stops it from falling away when you jump on it
  ground.body.immovable = true;

  //  Now let's create two ledges
  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;

  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;

  // The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'dude');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.friction = 0.95;
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  //  Finally some stars to collect
  stars = game.add.group();

  //  We will enable physics for any star that is created in this group
  stars.enableBody = true;

  var numStars = 12;

  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < numStars; i++) {
      //  Create a star inside of the 'stars' group
      var star = stars.create(i * (game.width/numStars) + 10, 0, 'star');

      //  Let gravity do its thing
      star.body.gravity.y = 300;

      //  This just gives each star a slightly random bounce value
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  //  Similar to stars, add diamonds as well
  diamonds = game.add.group();

  diamonds.enableBody = true;

  var numDiamonds = 3;

  for (var i = 0; i < numDiamonds; i++) {
      var diamond = diamonds.create(i * (game.width/numDiamonds) + 20, 0, 'diamond');

      diamond.body.gravity.y = 600;

      diamond.body.bounce.y = 0.2 + Math.random() * 0.2;
  }

  //  The score
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  //  Our controls.
  cursors = game.input.keyboard.createCursorKeys();
    
}

function update() {

  // Collide the entities with the platforms
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.collide(diamonds, platforms);

  // Checks to see if the player overlaps with any of the stars or diamonds
  // Call collectPoints function if so
  game.physics.arcade.overlap(player, stars, collectPoints, null, this);
  game.physics.arcade.overlap(player, diamonds, collectPoints, null, this);

  if (cursors.left.isDown)
  {
      //  Move to the left
      player.body.velocity.x = -150;

      player.animations.play('left');
  }
  else if (cursors.right.isDown)
  {
      //  Move to the right
      player.body.velocity.x = 150;

      player.animations.play('right');
  }
  else
  {


      //  Stand still
      player.animations.stop();

      player.frame = 4;
  }
  
  if (player.body.touching.down) {
    //  Allow the player to jump if they are touching the ground.
    if(cursors.up.isDown)
      player.body.velocity.y = -350;

    // Apply friction when player is sliding
    if( !cursors.left.isDown && !cursors.right.isDown && Math.abs(player.body.velocity.x) > 0 ) {
      player.body.velocity.x *= player.body.friction;

      if( Math.abs(player.body.velocity.x) < 0.1 ) {
        player.body.velocity.x = 0;
      }
    }

  }

}

function collectPoints(player, object) {    
  // Remove the object from the screen
  object.kill();

  var points = object.key === 'diamond' ? 10 : 1;

  // Add and update the score
  score += points;

  scoreText.text = 'Score: ' + score;
}
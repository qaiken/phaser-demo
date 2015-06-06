var Phaser = require('Phaser');
var preLoader = require('./Preloader');
var Game = require('./Game');

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container');

game.state.add('Preloader', preLoader);

game.state.add('Game', Game);

game.state.start('Preloader');
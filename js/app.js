!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){function d(){n.load.image("sky","img/sky.png"),n.load.image("diamond","img/diamond.png"),n.load.image("ground","img/platform.png"),n.load.image("star","img/star.png"),n.load.spritesheet("dude","img/dude.png",32,48)}function e(){n.physics.startSystem(m.Physics.ARCADE),n.add.sprite(0,0,"sky"),i=n.add.group(),i.enableBody=!0;var a=i.create(0,n.world.height-64,"ground");a.scale.setTo(2,2),a.body.immovable=!0;var b=i.create(400,400,"ground");b.body.immovable=!0,b=i.create(-150,250,"ground"),b.body.immovable=!0,h=n.add.sprite(32,n.world.height-150,"dude"),n.physics.arcade.enable(h),h.body.bounce.y=.2,h.body.gravity.y=300,h.body.friction=.95,h.body.collideWorldBounds=!0,h.animations.add("left",[0,1,2,3],10,!0),h.animations.add("right",[5,6,7,8],10,!0),k=n.add.group(),k.enableBody=!0;for(var c=12,d=0;c>d;d++){var e=k.create(d*(n.width/c)+10,0,"star");e.body.gravity.y=300,e.body.bounce.y=.7+.2*Math.random()}diamonds=n.add.group(),diamonds.enableBody=!0;for(var f=3,d=0;f>d;d++){var g=diamonds.create(d*(n.width/f)+20,0,"diamond");g.body.gravity.y=600,g.body.bounce.y=.2+.2*Math.random()}l=n.add.text(16,16,"score: 0",{fontSize:"32px",fill:"#000"}),j=n.input.keyboard.createCursorKeys()}function f(){n.physics.arcade.collide(h,i),n.physics.arcade.collide(k,i),n.physics.arcade.collide(diamonds,i),n.physics.arcade.overlap(h,k,g,null,this),n.physics.arcade.overlap(h,diamonds,g,null,this),j.left.isDown?(h.body.velocity.x=-150,h.animations.play("left")):j.right.isDown?(h.body.velocity.x=150,h.animations.play("right")):(h.animations.stop(),h.frame=4),h.body.touching.down&&(j.up.isDown&&(h.body.velocity.y=-350),!j.left.isDown&&!j.right.isDown&&Math.abs(h.body.velocity.x)>0&&(h.body.velocity.x*=h.body.friction,Math.abs(h.body.velocity.x)<.1&&(h.body.velocity.x=0)))}function g(a,b){b.kill();var c="diamond"===b.key?10:1;o+=c,l.text="Score: "+o}var h,i,j,k,l,m=window.Phaser,n=new m.Game(800,600,m.AUTO,"",{preload:d,create:e,update:f}),o=0},{}]},{},[1]);
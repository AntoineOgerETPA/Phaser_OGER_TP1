var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
scene: {
		init: init,
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;
var jump = 2;
var djump = 1;
var vie = 3;

function init() {
var platforms;
var player;
var cursors;
var stars;
var pieces;
var scoreText;
var bomb;
var bombaex;
}

function preload(){

	this.load.image('background','assets/sky.png');
	this.load.image('etoile','assets/star2.png');
	this.load.image('sol','assets/platform2.png');
	this.load.image('sol2','assets/platform3.png');
	this.load.image('bomb','assets/bomb.png');
	this.load.image('bombaex','assets/bombaex.png');
	this.load.image('piece','assets/collectible.png');
	this.load.spritesheet('perso','assets/dudee.png',{frameWidth: 32, frameHeight: 32});
	this.load.image('life1','assets/vie1.png');
	this.load.image('life2','assets/vie2.png');
	this.load.image('life3','assets/vie3.png');
}


function create(){
	this.add.image(400,300,'background');

	life1 = this.add.image(400,300,'life1').setScale(0.25);
	life2 = this.add.image(400,300,'life2').setScale(0.25);
	life3 = this.add.image(400,300,'life3').setScale(0.25);

	platforms = this.physics.add.staticGroup();

	platforms.create(220,568,'sol2').setScale(3).refreshBody();
	platforms.create(400,400,'sol');
	platforms.create(600,200,'sol');
	platforms.create(50,250,'sol');

	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);

	cursors = this.input.keyboard.createCursorKeys();

	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 6}),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:4}],
		frameRate: 20
	});

	stars = this.physics.add.group({
		key: 'etoile',
		repeat:1,
		setXY: {x:12,y:0,stepX:70}
	});

	pieces = this.physics.add.group({
		key: 'piece',
		repeat:1,
		setXY: {x:250,y:0,stepX:50}
	});

	this.physics.add.collider(stars,platforms);
	this.physics.add.collider(pieces,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);
	this.physics.add.overlap(player,pieces,collectPiece,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	bombs = this.physics.add.group();
	bomb2 = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(bomb2,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
	this.physics.add.collider(player,bomb2, hitBomb2, null, this);
}

function hitBomb(player, bomb){
	vie --;
	bomb.destroy(true);
}
function hitBomb2(player, bombaex){
	vie --;
	bombaex.destroy(true);
}
function update(){

	if(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(true);
	}else if(cursors.right.isDown){
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(false);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}

//jump & Double jump
	if(cursors.up.isDown && player.body.touching.down){
		this.jump = 2;
	}
if((this.djump == 1) && (this.jump > 0) && (cursors.up.isDown)){
	this.jump --;
	this.djump = 0;
	if(this.jump == 1){
		player.setVelocityY(-250);
	}
	if(this.jump == 0){
		player.setVelocityY(-250);
	}
}
if(cursors.up.isUp) {
	this.djump = 1;
}

//Inverser la gravité
	if(cursors.down.isDown){
		player.body.setGravityY(-500);
		player.setVelocityY(330);
		player.setFlipY(true);
	}

//Perte de Vie

	if (vie == 2){
		life3.destroy(true);
	}
	else if (vie == 1){
		life2.destroy(true);
	}
	else if (vie == 0){
		life1.destroy(true);
		this.physics.pause();
		player.setTint(0xff0000);
		player.anims.play('turn');
		gameOver = true;
		score = 0;
		vie = 3;
	}
}



function collectStar(player,star){
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	if(stars.countActive(true)===0){
		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});

		var x = (player.x < 400) ?
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-20, 700), 20);
	}
}
function collectPiece(player,piece){
	piece.disableBody(true,true);
	score += 100;
	scoreText.setText('score: '+score);
	if(pieces.countActive(true)===0){
		pieces.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});

		var x = (player.x < 400) ?
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bombaex = bomb2.create(x, 16, 'bombaex');
		bombaex.setBounce(1);
		bombaex.setCollideWorldBounds(true);
		bombaex.setVelocity(Phaser.Math.Between(100, 1700), 10);
	}
}

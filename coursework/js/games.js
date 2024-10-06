
var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 810,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    inputKeyboard: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0 },
            debug: false
        }
    }
};

function redirect(display_content){
    window.location.href = `form.html?${display_content}`;
}


var game;
window.onload = function (){
    const email = window.location.search.split("?")[1];
    if (!email){
        alert("You must login to play");
    }
    else{
       game  = new Phaser.Game(config);
    }
};



var score = 0;;
var jump = 200;
var frameRate = 5;
var scoreText;
var count = 0;
var paused = false;
var contactHealth = false;
var player;
var enemy;
var enemy_2;
var healthPowerup;

var playerProperties = {
    object : player,
    health: 400,
    isGreen: false,
    isRed: false,
    flickerCount: 0,
    flickerStop: 2,
    greenCount: 0,
    redCount: 0,
    form: 'base_form_shooting'
}

class Enemy{
    static children = [];
    static bullet = [];
    static physics;
    static tweens;
    constructor(){
        this.type = "enemy_type_1"
        this.health;
        this.object = Enemy.physics.add.sprite(400, 100,this.type).setScale(1.5);
        this.isGreen = false;
        this.isRed = false;
        this.flickerCount = 0;
        this.flickerStop = 2;
        this.greenCount = 0;
        this.redCount = 0;
        this.form = 'normal';
        Enemy.checkType(this);
        Enemy.addEnemy(this);
    }

    static setPhysics(classClass){
        this.physics = classClass;
    }

    static setTweens(classClass){
        this.tweens = classClass;
    }

    static addEnemy(enemyObject) {
        this.children.push(enemyObject);
    }

    static removeEnemy(enemyObject) {
        this.children.pop(enemyObject);
    }

    static checkType(enemyObject){
        if (enemyObject.type == "enemy_type_1"){
            enemyObject.health = 50;
        }
        if (enemyObject.type == "enemy_type_2"){
            enemyObject.health = 100;
        }
        if (enemyObject.type == "enemy_type_3"){
            enemyObject.health = 150;
        }
    }
    
    static checkBullets(){
        this.bullet.forEach( (bullet) => {
            if (bullet.y > 810){
                // child.disableBody(true, true);   
                child.destroy();             
            }
        }); 
    }
    
    shoot(x, y) {
        var enemyBullet;
        if (this.form == "normal") {
            enemyBullet = Enemy.physics.add.sprite(this.object.x + 4, this.object.y + 10,"enemy_bullet").setScale(0.5);
            Enemy.bullet.push(enemyBullet);
            // enemyBullet.setVelocityY(200);
            
        }

        Enemy.tweens.add({
            targets: enemyBullet,
            x: x,
            y: y,
            duration: 8800,
            ease: 'Linear'
        });
    }

}


function preload ()
{
    this.load.image('sky', 'assets/sky.png');

    this.load.spritesheet('jet', 'sprites/jet.png', { frameWidth: 70, frameHeight: 49 });
    
    this.load.spritesheet('explosion', 'sprites/explosion.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('bullet', 'sprites/bullets/jet_bullets.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('enemy_bullet', 'sprites/bullets/enemy_bullet.png', { frameWidth: 30, frameHeight: 30 });

    this.load.image('health', 'sprites/powerups/health.png');


    this.load.spritesheet('enemy_type_1', 'sprites/enemies/enemy_type_1.png', { frameWidth: 23, frameHeight: 19 });

}

function create ()
{
    Enemy.setPhysics(this.physics);
    Enemy.setTweens(this.tweens);
    
    player = this.physics.add.sprite(500, 700, "jet").setScale(1.5);

    // enemy = this.physics.add.sprite(800, 200, "enemy_type_1").setScale(1.5);
    
    // enemy_bullet = this.physics.add.sprite(800, 100,"enemy_bullet").setScale(0.5);

    enemy_2 = new Enemy();

    healthPowerup = this.physics.add.sprite(500, 300, 'health');
    player.setCollideWorldBounds(true);
    healthPowerup.body.setVelocityY(80);

    this.anims.create({
        key: "boom",
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 3 }),
        frameRate: frameRate,
        repeat: 0
    });

    this.anims.create({
            key: "base_form_shooting",
            frames: this.anims.generateFrameNumbers('jet', { start: 0, end: 1 }),
            frameRate: frameRate,
            repeat: -1
    });

    this.anims.create({
        key: "base_form",
        frames: this.anims.generateFrameNumbers('jet', { start: 0, end: 0 }),
        frameRate: frameRate,
        repeat: -1
    });
    this.anims.create({
        key: "form1",
        frames: this.anims.generateFrameNumbers('jet', { start: 2, end: 2 }),
        frameRate: frameRate,
        repeat: -1
    });


    this.anims.create({
        key: "form1_shooting",
        frames: this.anims.generateFrameNumbers('jet', { start: 2, end: 3 }),
        frameRate: frameRate,
        repeat: -1
    });

    this.anims.create({
        key: "form2_shooting",
        frames: this.anims.generateFrameNumbers('jet', { start: 4, end: 5 }),
        frameRate: frameRate,
        repeat: -1
    });


    this.anims.create({
        key: "form3",
        frames: this.anims.generateFrameNumbers('jet', { start: 6, end: 6 }),
        frameRate: frameRate,
        repeat: -1
    });

    this.anims.create({
        key: "form3_shooting",
        frames: this.anims.generateFrameNumbers('jet', { start: 6, end: 7 }),
        frameRate: frameRate,
        repeat: -1
    });

    

    

    bullets = this.physics.add.group();
    // bullets.setVelocityY(-300);
    explosions = this.physics.add.group();


    cursors = this.input.keyboard.createCursorKeys();
    keyboard = this.input.keyboard.addKeys("Q, P");

    // stars = this.physics.add.group({
    //     key: 'star',
    //     repeat: 11,
    //     setXY: { x: 12, y: 0, stepX: 70, stepY: 20 }
    // });

    // stars.children.iterate(function (child) {

    //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    // });

    // this.physics.add.collider(stars, platforms);
    // this.physics.add.overlap(player, stars, collectStar, null, this);

    // scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });


    // bombs = this.physics.add.group();

    // this.physics.add.collider(bombs, platforms);

    // this.physics.add.collider(player, bombs, hitBomb, null, this);
    // this.physics.add.collider(player, powerup, hitLife, null, this);
    // this.physics.add.collider(enemy, bullets);

}

function update ()
{
    if (keyboard.Q.isDown && paused == false){
        this.physics.pause();
        this.anims.pauseAll();
        this.tweens.pauseAll();
        paused = true;
    }
    else if (keyboard.P.isDown && paused == true){
        this.physics.resume();
        this.anims.resumeAll();
        paused = false;
    }

    if (paused == false){

        if (count % 50 == 0){
            player.anims.play(playerProperties.form, true);
            // jump = Phaser.Math.Between(0, 300) * -1;
            // jump = jump * -1;
            // enemy_2.object.x = enemy_2.object.x  + jump;
            // enemy_2.shoot(player.x, player.y);
            // shoot();
        }

        if (count % 75 == 0){
            jump = jump * -1;
            enemy_2.object.x = enemy_2.object.x  + jump;
            enemy_2.shoot(player.x, player.y);
            shoot();
        }
    
        if (cursors.up.isDown){
            playerProperties.form = "base_form_shooting";
        }
        else if (cursors.down.isDown){
            playerProperties.form = "form1_shooting";
        }
        else if (cursors.left.isDown)
        {
            player.setVelocityX(-200);
            playerProperties.form = "form2_shooting";
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(200);
            playerProperties.form = "form3_shooting";
        }
        else{
            player.setVelocityX(0);
        }
        count++;
    
    
        checkBullets();
    
        if ((( player.x - 20 <= healthPowerup.x) && (player.x + 20 >= healthPowerup.x)) && 
        (( healthPowerup.y >=  player.y - 20 ) && (healthPowerup.y <  player.y + 20))){
            contactHealth = true;
    
        }
    
        checkPowerups();
    
        if (count == 1000){
            count = 0;
        }
        checkExplosion();

    }
    
}



function bulletsToFire(stageCheck){

    if(stageCheck[0]){
        bullets.create(player.x, player.y - 40, "bullet").setScale(0.5);
    }
    
    if(stageCheck[1]){
        bullets.create(player.x + 10, player.y - 20, "bullet").setScale(0.5);
        bullets.create(player.x - 10, player.y - 20, "bullet").setScale(0.5);
    }
    
    if(stageCheck[2]){
        bullets.create(player.x + 20, player.y - 20, "bullet").setScale(0.5);
        bullets.create(player.x - 20, player.y - 20, "bullet").setScale(0.5);
    }
    
    if(stageCheck[3]){
        bullets.create(player.x + 30, player.y - 10, "bullet").setScale(0.5);
        bullets.create(player.x - 30, player.y - 10, "bullet").setScale(0.5);
    }
}

function shoot(){
    if (playerProperties.form == "base_form_shooting"){
        bulletsToFire([true,false,false,false]);
    }
    if (playerProperties.form == "form1_shooting"){
        bulletsToFire([true,true,false,false]);
    }
    if (playerProperties.form == "form2_shooting"){
        bulletsToFire([true,true,true,false]);
    }
    if (playerProperties.form == "form3_shooting"){
        bulletsToFire([true,true,true,true]);
    }

    bullets.children.iterate(function (child) {
        child.setVelocityY(-300);
    });
    
}
// function collectStar (player, star)
// {
//     star.disableBody(true, true);

//     score += 10;
//     scoreText.setText('Score: ' + score);
//     // alert(stars.countActive(true));

//     if (stars.countActive(true) - 1 === 0)
//     {
//         // alert("Here");
//         stars.children.iterate(function (child) {

//             child.enableBody(true, child.x, 0, true, true);

//         });

//         var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

//         var bomb = bombs.create(x, 16, 'bomb');
//         bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

//     }
// }

// function hitLife (player)
// {
//     player.setTint(0x00ff00);
//     player.clearTint();
//     player.setTint(0x00ff00);
//     player.clearTint();
// }


function checkBullets(){
    bullets.children.iterate(function (child) {
        if (child){
            if (child.y < 0){
                // child.disableBody(true, true);   
                child.destroy();             
            }

            Enemy.children.forEach((enemy_child) => {
                var enemyObject = enemy_child.object
                if ((((enemyObject.x + 25) >= child.x) && ((enemyObject.x - 25) <= child.x)) && (child.y == enemyObject.y)){
                    child.destroy();
                    explosion = explosions.create(enemyObject.x, enemyObject.y, "explosion");
                    explosion.anims.play("boom", true);
                    enemyObject.destroy();
                    Enemy.removeEnemy(enemy_child);
    
                }
            });
        }
        
    });
}

function checkExplosion(){
    explosions.children.iterate(function (child){
        if (child){
            child.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim, frame, gameObject) {

                this.disableBody(true, true);
        
            });
        }
    });
}

function checkPowerups(){
    if (contactHealth){

        healthPowerup.setX(1000);
        healthPowerup.destroy(true); 

        // make health stop only when flicker complete
        if (playerProperties.flickerCount > playerProperties.flickerStop){
            contactHealth = false;
        }
        else{

            if(playerProperties.greenCount < 50){
                player.setTint(0x00ff00);
                playerProperties.greenCount++;
            }
            else if((playerProperties.greenCount >= 50) && (playerProperties.greenCount <= 100)){
                player.clearTint();
                playerProperties.greenCount++;
            }
            else{
                playerProperties.greenCount = 0;
                playerProperties.flickerCount++;
                player.clearTint();
            }
        }  
        
    }

}

// function flicker
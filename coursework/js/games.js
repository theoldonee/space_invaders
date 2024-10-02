
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
    // alert(email);
    // console.log(queryString);
    // var email = "emaail";
    if (!email){
        alert("You must login to play");

        // var name = 'fool'

        // document.getElementById("dummy_div").innerHTML = `<h3>${}</h3>`;

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

// var enemy_properties = {
//     object : enemies,
//     health: 400,
//     is_green: false,
//     is_red: false,
//     flicker_count: 0,
//     flicker_stop: 2,
//     green_count: 0,
//     red_count: 0,
//     form: 'base_form_shooting'
// }

class Enemy{
    static children = [];
    constructor(enemyObject){
        this.enemy = enemyObject;
        this.health = 400;
        this.isGreen = false;
        this.isRed = false;
        this.flickerCount = 0;
        this.flickerStop = 2;
        this.greenCount = 0;
        this.redCount = 0;
        this.form = 'normal';
    }

    static addEnemy(enemyObject) {
        this.children.push(enemyObject);
    }


    static removeEnemy(enemyObject) {
        this.children.pop(enemyObject);
    }
    

}


function preload ()
{
    this.load.image('sky', 'assets/sky.png');

    this.load.spritesheet('jet', 'sprites/jet.png', { frameWidth: 70, frameHeight: 49 });
    
    this.load.spritesheet('explosion', 'sprites/explosion.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('bullet', 'sprites/bullets/jet_bullets.png', { frameWidth: 32, frameHeight: 32 });
    // this.load.spritesheet('powerups', 'sprites/powerups.png', { frameWidth: 32, frameHeight: 38 });

    this.load.image('health', 'sprites/powerups/health.png');


    this.load.spritesheet('enemy_type_1', 'sprites/enemies/enemy_type_1.png', { frameWidth: 23, frameHeight: 19 });

}

function create ()
{
    // this.add.image(450, 450, 'sky');
    
    // platforms = this.physics.add.staticGroup();

    // platforms.create(400, 568, "ground").setScale(1).refreshBody();
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');

    // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    

    player = this.physics.add.sprite(500, 700, "jet").setScale(1.5);

    enemy = this.physics.add.sprite(800, 200, "enemy_type_1").setScale(1.5);

    // enemies = this.physics.add.staticGroup();

    // platforms.create(400, 568, "ground").setScale(1).refreshBody();

    // bullet = this.physics.add.sprite(500, 500, "bullet").setScale(0.5);

    // explosion = this.physics.add.sprite(100, 450, "explosion")
    // explosion.setCollideWorldBounds(true);

    healthPowerup = this.physics.add.sprite(500, 300, 'health');
    // player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    // player.body.setGravityY(10);
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

    

    

    // enemies = this.physics.add.group();
    // powerups = this.physics.add.group();

    // this.anims.create({
    //     key: "left",
    //     frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    // this.anims.create({
    // key: 'turn',
    // frames: [ { key: 'dude', frame: 4 } ],
    // frameRate: 20
    // });

    // this.anims.create({
    //     key: 'right',
    //     frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    // this.physics.add.collider(player, platforms);
    // this.physics.add.collider(powerup, bullets);

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
    // game.scale.pageAlignHorizontally = true;
    // game.scale.pageAlignVertically = true;
    // game.scale.refresh();
    // alert(Phaser.Game.getTime());
    // if ()


    if (keyboard.Q.isDown && paused == false){
        this.physics.pause();
        this.anims.pauseAll();
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
            jump = jump * -1;
            enemy.x = enemy.x  + jump;
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
    
        // if (count > 149){
        //     createEnemy();
        // }
    
        if (count == 1000){
            count = 0;
        }
        // 0 - 49 green, 50, 100 normal, 101 - 150 green
    
        // if (cursors.up.isDown && player.body.touching.down)
        // {
        //     player.setVelocityY(-330);
        // }
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
//         bomb.setBounce(1);
//         bomb.setCollideWorldBounds(true);
//         bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

//     }
// }

// function hitBomb (player, bomb)
// {
//     this.physics.pause();

//     player.setTint(0xff0000);

//     player.anims.play('turn');

//     gameOver = true;
// }
function hitLife (player)
{
    player.setTint(0x00ff00);
    player.clearTint();
    player.setTint(0x00ff00);
    player.clearTint();
}

function checkBullets(){
    bullets.children.iterate(function (child) {
        if (child){
            if (child.y < 0){
                // child.disableBody(true, true);   
                child.destroy();             
            }
            // (((child.x >= enemy.x - 2) || (child.x <= enemy.x + 2)) && child.y == enemy.y)
            // alert(enemy.x)
            // alert(enemy.x - 2)
            // alert(enemy.x)

            if ((((enemy.x + 25) >= child.x) && ((enemy.x - 25) <= child.x)) && (child.y == enemy.y)){
                child.destroy();
                explosion = explosions.create(enemy.x, enemy.y, "explosion");
                explosion.anims.play("boom", true);
                enemy.setX(2000);
                enemy.disableBody(true, true); 

            }
            // child.enableBody(true, child.x, 0, true, true);
        }

        
    });
}

function createEnemy(){
    enemy = enemies.create(player.x, player.y - 200, "enemy_type_1");
    // bullet.setVelocityY(-300);

    // bullets.children.iterate(function (child) {

    //     if (child.y < 200){
    //         child.disableBody(true, true);                
    //     }
    //     // child.enableBody(true, child.x, 0, true, true);
    // });
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
    
    // player_properties.flicker_count
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

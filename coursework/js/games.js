import { UserManager } from "./account.js";

var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 810,
    parent: "game_div",
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


var game;
window.onload = function (){
    const email = window.location.search.split("?")[1];
    if (!email){
        alert("You must login to play");
    }
    else{
        if (UserManager.isUser(email)){
            game  = new Phaser.Game(config);
        }else{
            alert("Only registered users can play");
        }
       
    }
};



var score = 0;;
var frameRate = 5;
var count = 0;
var paused = false;
var contactHealth = false;
var healthPowerup;
var player, bullets, explosions, cursors, keyboard;

var playerProperties = {
    health: 400,
    isGreen: false,
    isRed: false,
    flickerCount: 0,
    flickerStop: 2,
    greenCount: 0,
    redCount: 0,
    form: 'base_form_shooting',
    points: 0,
    enemiesKilled: 0,
    bulletsFired: 0,
    currentPlayTime: 0,
}

class Enemy{
    static enemyType1Children = [];
    static type1UpgradedChildren = [];
    static enemyType2Children = [];
    static enemyType3Children = []; 
    static children = [];

    static bullet = [];
    static physics;
    static tweens;

    constructor(type, x){
        this.type = type;
        this.health;
        this.object = Enemy.physics.add.sprite(x, 100,this.type).setScale(1.7);
        this.isGreen = false;
        this.isRed = false;
        this.tint;
        this.flickerCount = 0;
        this.flickerStop = 2;
        this.greenCount = 0;
        this.redCount = 0;
        this.form = 'normal';
        this.createdTime = new Date();
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
        if (enemyObject.type == "enemy_type_1"){
            this.enemyType1Children.push(enemyObject);
        }

        if (enemyObject.type == "type_1_upgraded"){
            this.type1UpgradedChildren.push(enemyObject);
        }

        if (enemyObject.type == "enemy_type_2"){
            this.enemyType2Children.push(enemyObject);
        }

        if (enemyObject.type == "enemy_type_3"){
            this.enemyType3Children.push(enemyObject);
        }
    }

    static createEnemy(enemiesToCreate){
        for (var type of enemiesToCreate){
            var enemy;
            enemy = new Enemy(type.type, type.location);
        }
    }

    static removeEnemy(enemyObject) {
        var indexInChildren = this.children.indexOf(enemyObject);
        this.children.splice(indexInChildren, 1);  

        if (this.isInArray(enemyObject, this.enemyType1Children)){
            var type1Index = this.enemyType1Children.indexOf(enemyObject);
            this.enemyType1Children.splice(type1Index, 1);
        }
            
        if (this.isInArray(enemyObject, this.type1UpgradedChildren)){
            var type1Upgradedindex = this.type1UpgradedChildren.indexOf(enemyObject);
            this.type1UpgradedChildren.splice(type1Upgradedindex, 1);
        }

        if (this.isInArray(enemyObject, this.enemyType2Children)){
            var type2Index = this.enemyType2Children.indexOf(enemyObject);
            this.enemyType2Children.splice(type2Index, 1);
        }
        if (this.isInArray(enemyObject, this.enemyType3Children)){
            var type3Index = this.enemyType3Children.indexOf(enemyObject);
            this.enemyType3Children.splice(type3Index, 1);
        }
    }

    static isInArray(enemyObject, array){
        for(var i = 0; i < array.length; i++){
            if( array[i] == enemyObject){
                return true;
            }
        }

        return false;
    }

    static checkType(enemyObject){
        if (enemyObject.type == "enemy_type_1"){
            enemyObject.health = 50;
        }
        if (enemyObject.type == "type_1_upgraded"){
            enemyObject.health = 100;
        }
        if (enemyObject.type == "enemy_type_2"){
            enemyObject.health = 150;
        }
        if (enemyObject.type == "enemy_type_3"){
            enemyObject.health = 200;
        }
    }

    static setBulletVelocity(playerX, playerY, bullet_object){
        var seconds = 9;
        var velX = (playerX - bullet_object.x)/seconds;
        var velY = (playerY - bullet_object.y)/seconds;

        bullet_object.setVelocityX(velX);
        bullet_object.setVelocityY(velY);
    }
    
    shoot(x, y) {
        var enemyBullet;
        if (this.type == "enemy_type_1") {
            enemyBullet = Enemy.physics.add.sprite(this.object.x + 4, this.object.y + 10,"enemy_bullet").setScale(0.5);
            Enemy.bullet.push(enemyBullet);
        }else{
            enemyBullet = Enemy.physics.add.sprite(this.object.x + 4, this.object.y + 18,"enemy_bullet").setScale(0.5);
            Enemy.bullet.push(enemyBullet);
        }

        Enemy.setBulletVelocity(x, y, enemyBullet);
    }

    getElapsedTime() {
        const now = new Date();
        return Math.floor((now - this.createdTime) / 1150);  // Return time in seconds
    }

    jump(){
        var location = Math.floor(Math.random() * 800);

        if (location < 50){
            location = 50;
        }

        this.object.x = location;
    }

    static loaderCount = 1;
    // static loaderCount = 7;
    static enemyTypes = ["enemy_type_1", "type_1_upgraded", "enemy_type_2","enemy_type_3"]
    static enemyToLoadIndex = 0;
    // static enemyToLoadIndex = 2;

    static loadEnemies(){
        var enemy_info, enemy_info1, enemy_info2, enemy_info3;
    
        if (this.loaderCount == 1){
            enemy_info = {type: "enemy_type_1", location: 500 };
            this.createEnemy([enemy_info]);
        }
        if (this.loaderCount == 2){
            enemy_info = {type: "enemy_type_1", location: 300 };
            enemy_info1 = {type: "enemy_type_1", location: 700 };
            this.createEnemy([enemy_info, enemy_info1]);
        }
        if (this.loaderCount == 3){
            enemy_info = {type: "enemy_type_1", location: 250 };
            enemy_info1 = {type: "enemy_type_1", location: 500 };
            enemy_info2 = {type: "enemy_type_1", location: 750 };
            this.createEnemy([enemy_info, enemy_info1, enemy_info2]);
        }

        if (this.loaderCount > 3 & this.loaderCount < 11){

            if(this.loaderCount % 2 == 0){
                enemy_info = {type: this.enemyTypes[this.enemyToLoadIndex], location: 200 };
                enemy_info1 = {type: this.enemyTypes[this.enemyToLoadIndex], location: 400 };
                enemy_info2 = {type: this.enemyTypes[this.enemyToLoadIndex], location: 600 };
                enemy_info3 = {type: this.enemyTypes[this.enemyToLoadIndex], location: 800 };
                this.createEnemy([enemy_info, enemy_info1, enemy_info2, enemy_info3]);
            }else{
                enemy_info = {type: this.enemyTypes[this.enemyToLoadIndex + 1], location: 200 };
                enemy_info1 = {type: this.enemyTypes[this.enemyToLoadIndex], location: 400 };
                enemy_info2 = {type: this.enemyTypes[this.enemyToLoadIndex], location: 600 };
                enemy_info3 = {type: this.enemyTypes[this.enemyToLoadIndex + 1], location: 800 };
                this.createEnemy([enemy_info, enemy_info1, enemy_info2, enemy_info3]);
                this.enemyToLoadIndex++;
            }
        }

        if (this.loaderCount < 11){
            this.loaderCount++;
        }
        
    }

    static check(){

        if (this.children.length == 0){
            this.loadEnemies();
        }

        this.enemyType2Children.forEach((child) => {
            if((child.getElapsedTime() + 1) % 5 == 0){
                child.object.anims.play("jump");
                child.jump();
            }
        });

        this.enemyType3Children.forEach((child) => {
            if((child.getElapsedTime() + 1) % 8 == 0){
                child.object.anims.play("blink");
            }
        });
        
    }



}

class Controller{
    
}

function preload ()
{

    this.load.spritesheet('jet', 'sprites/jet.png', { frameWidth: 70, frameHeight: 46 });
    
    this.load.spritesheet('explosion', 'sprites/explosion.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('bullet', 'sprites/bullets/jet_bullets.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('enemy_bullet', 'sprites/bullets/enemy_bullet.png', { frameWidth: 30, frameHeight: 30 });

    // load powerup sprites
    this.load.image('health', 'sprites/powerups/health.png');

    // load enemy sprites
    this.load.spritesheet('enemy_type_1', 'sprites/enemies/enemy_type_1.png', { frameWidth: 23, frameHeight: 19 });
    this.load.spritesheet('type_1_upgraded', 'sprites/enemies/enemy_type_1_upgraded.png', { frameWidth: 26, frameHeight: 19 });
    this.load.spritesheet('enemy_type_2', 'sprites/enemies/enemy_type_2.png', { frameWidth: 32, frameHeight: 26 });
    this.load.spritesheet('enemy_type_3', 'sprites/enemies/enemy_type_3.png', { frameWidth: 32, frameHeight: 26 });

}

function create ()
{
    Enemy.setPhysics(this.physics);
    Enemy.setTweens(this.tweens);
    
    player = this.physics.add.sprite(500, 700, "jet").setScale(1.5);
    playerProperties.object = player;

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


    this.anims.create({
        key: "jump",
        frames: this.anims.generateFrameNumbers('enemy_type_2', { start: 1, end: 3 }),
        frameRate: frameRate,
        repeat: 2
    });

    this.anims.create({
        key: "blink",
        frames: this.anims.generateFrameNumbers('enemy_type_3', { start: 0, end: 6 }),
        frameRate: frameRate,
        repeat: 1
    });


    bullets = this.physics.add.group();
    explosions = this.physics.add.group();

    score = this.add.text(50, 10, `Score: ${playerProperties.points}`, {
        font: "25px Montserrat",
        fill: "#ffffff",
    });


    cursors = this.input.keyboard.createCursorKeys();
    keyboard = this.input.keyboard.addKeys("Q, P");

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
        // console.log(count);
        Enemy.check();

    
        if (count % 50 == 0){
            player.anims.play(playerProperties.form, true);
            shoot();
        }

        if (count % 150 == 0){

            Enemy.children.forEach((child) =>{
                child.shoot(playerProperties.object.x, playerProperties.object.y);
            });
        }
    
        if (cursors.up.isDown){
            // playerProperties.form = "base_form_shooting";
        }
        else if (cursors.down.isDown){
            // playerProperties.form = "form1_shooting";

        }
        else if (cursors.left.isDown)
        {
            player.setVelocityX(-100);
            // playerProperties.form = "form2_shooting";
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(100);
            // playerProperties.form = "form3_shooting";
        }
        else{
            player.setVelocityX(0);
        }
        count++;
        
        // if(count > 1000){
        //     Enemy.children[0].object.anims.play('jump', true);
        // }
    
        checkBullets();
        if (playerProperties.isRed){
            flicker(playerProperties, "red");
        }
    
        if ((( player.x - 20 <= healthPowerup.x) && (player.x + 20 >= healthPowerup.x)) && 
        (( healthPowerup.y >=  player.y - 20 ) && (healthPowerup.y <  player.y + 20))){
            contactHealth = true;
    
        }
    
        checkPowerups();
    
        if (count == 1350){
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


function checkBullets(){
    bullets.children.iterate(function (child) {
        if (child){
            if (child.y < 0){
                child.destroy();             
            }

            Enemy.children.forEach((enemy_child) => {
                var enemyObject = enemy_child.object
                if ((((enemyObject.x + 25) >= child.x) && ((enemyObject.x - 25) <= child.x)) && (child.y == enemyObject.y)){
                    child.destroy();
                    if (enemy_child.health != 0){
                        enemy_child.health = enemy_child.health - 25;
                        enemy_child.tint = 0xff0000;
                        enemyObject.setTint(enemy_child.tint);
                        if (enemy_child.isRed){
                            enemy_child.tint = enemy_child.tint - 0x100000;
                            enemyObject.setTint(enemy_child.tint);
                        }
                    }
                    if (enemy_child.health == 0){
                        playerProperties.points = playerProperties.points + 20;
                        score.setText(`Score: ${playerProperties.points}`);
                        var explosion = explosions.create(enemyObject.x, enemyObject.y, "explosion");
                        explosion.anims.play("boom", true);
                        enemyObject.destroy();
                        Enemy.removeEnemy(enemy_child);
                    }
    
                }
            });
        }
        
    });

    
    Enemy.bullet.forEach( (bullet_child) => {
        var index;
        // alert(this);
        index = Enemy.bullet.indexOf(bullet_child);
        if (bullet_child.y > 800){   
            bullet_child.destroy();  
            Enemy.bullet.splice(index, 1);           
        }

        if ((( player.x - 20 <= bullet_child.x) && (player.x + 20 >= bullet_child.x)) && 
            (( bullet_child.y >=  player.y ) && (bullet_child.y <  player.y + 20))){
                bullet_child.destroy();
                Enemy.bullet.splice(index, 1);
                playerProperties.isRed = true;
                flicker(playerProperties, "red");

        }
    
    }); 

}

// Checks if an explosion is displayed
function checkExplosion(){
    explosions.children.iterate(function (child){
        if (child){
            child.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim, frame, gameObject) {

                this.disableBody(true, true);
        
            });
        }
    });
}

// Checks if player is in contact with a powerup
function checkPowerups(){
    if (contactHealth){

        healthPowerup.setX(1000);
        healthPowerup.destroy(true); 

        // make health stop only when flicker complete
        if (playerProperties.flickerCount > playerProperties.flickerStop){
            contactHealth = false;
        }
        else{

            flicker(playerProperties, 'green');
        }  
        
    }

}

// Function that flickers player
function flicker(objectToFlicker, flickerColor){

    var color ;
    var functionCount = 40;

    // checks if player colour is green
    if (flickerColor == "green"){
        color = 0x00ff00;
        if(objectToFlicker.greenCount < functionCount){
            objectToFlicker.object.setTint(color);
            objectToFlicker.greenCount++;
        }
        else if((objectToFlicker.greenCount >= functionCount) && (playerProperties.greenCount <= 100)){
            objectToFlicker.object.clearTint();
            objectToFlicker.greenCount++;
        }
        else{
            objectToFlicker.greenCount = 0;
            objectToFlicker.flickerCount++;
            objectToFlicker.object.clearTint();
        }
    }

    // checks if player colour is red
    if (flickerColor == "red"){
        color = 0xff0000;
        if(objectToFlicker.redCount < functionCount){
            // objectToFlicker.isRed = true;
            objectToFlicker.object.setTint(color);
            objectToFlicker.redCount++;
        }
        else{
            objectToFlicker.isRed = false;
            objectToFlicker.redCount = 0;
            objectToFlicker.object.clearTint();
        }
    }

}

function redirect(display_content){
    window.location.href = `form.html?${display_content}`;
}

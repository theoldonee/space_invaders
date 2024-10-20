import { UserManager } from "./userManager.js";

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
            Controller.userEmail = email;
            game  = new Phaser.Game(config);
        }else{
            alert("Only registered users can play");
        }
       
    }
};
var healthPowerup;
var player, bullets, explosions, cursors, keyboard, score;

const playerProperties = {
    health: 200,
    isGreen: false,
    isRed: false,
    flickerCount: 0,
    flickerStop: 2,
    greenCount: 0,
    redCount: 0,
    form: 'base_form_shooting',
    points: 0,
    enemiesKilled: 0,
    bulletsFired: 0
}

class Powerups{
    static physics;
    static powerupTypes = ["health", "upgrade1", "upgrade2", "upgrade3"];
    static children = [];
    constructor(){
        this.type = Powerups.powerupTypes[(Math.floor(Math.random() * Powerups.powerupTypes.length))];
        this.collected = false;
        this.object = Powerups.createPowerup(this.type);
        this.object.body.setVelocityY(80);
        Powerups.children.push(this);
    }

    static setPhysics(classClass){
        this.physics = classClass;
    }

    static createPowerup(type){
    
        var object;
        var x = Math.floor(Math.random() * 800);
        if(x < 50){
            x = 50;
        }

        if (type != "health"){
            object = Powerups.physics.add.sprite(x, 0, "upgrades");
            if(type == "upgrade1"){
                object.anims.play(type, true);
            }else if(type == "upgrade2"){
                object.anims.play(type, true);
            }else{
                object.anims.play(type, true);
            }
        }else{
            object = Powerups.physics.add.sprite(x, 0, "health");
        }

        return object;
    }

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
        Enemy.setHealth(this);
        Enemy.addEnemy(this);
    }

    // sets physics class for enemy class use
    static setPhysics(classClass){
        this.physics = classClass;
    }

    // sets tweens class for enemy class use
    static setTweens(classClass){
        this.tweens = classClass;
    }
    
    // adds enemy to list
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

    // creates enemy object
    static createEnemy(enemiesToCreate){
        for (var type of enemiesToCreate){
            var enemy = new Enemy(type.type, type.location);
        }
    }

    // removes enemy from array
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

    // checks if an enemy object is in an array
    static isInArray(enemyObject, array){
        for(var i = 0; i < array.length; i++){
            if( array[i] == enemyObject){
                return true;
            }
        }
        return false;
    }

    // sets enemy health based on type
    static setHealth(enemyObject){
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

    // determines the velocity of each pullet
    static setBulletVelocity(playerX, playerY, bullet_object, seconds){

        var velX = (playerX - bullet_object.x)/seconds; // calculation for velocity in x direction
        var velY = (playerY - bullet_object.y)/seconds; // calculation for velocity in y direction
        bullet_object.setVelocityX(velX);
        bullet_object.setVelocityY(velY);
    }
    
    // shoots bullet in player direction
    shoot(x, y) {
        var enemyBullet;

        // checks enemy type to determine where bullet should spawn
        if (this.type == "enemy_type_1") {
            enemyBullet = Enemy.physics.add.sprite(this.object.x + 4, this.object.y + 10,"enemy_bullet").setScale(0.5);
            Enemy.bullet.push(enemyBullet);
            // alert(Enemy.bullet.length);
        }else{
            enemyBullet = Enemy.physics.add.sprite(this.object.x + 4, this.object.y + 18,"enemy_bullet").setScale(0.5);
            Enemy.bullet.push(enemyBullet);
            // alert(Enemy.bullet.length);
        }

        Enemy.setBulletVelocity(x, y, enemyBullet, 5);
    } 

    // retuns the lenght of time an enemy has been on screen
    getElapsedTime() {
        const now = new Date();
        return Math.floor((now - this.createdTime) / 1150);  // Return time in seconds
    }

    // Makes enemy jump to random location
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

    // displays enemy on screen
    static loadEnemies(){
        var enemy_info, enemy_info1, enemy_info2, enemy_info3;
        
        // loads enemy based off load count
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

        // increments count when count less than 11
        if (this.loaderCount < 11){
            this.loaderCount++;
        }
        
    }


    static check(){

        // loads enemies if enemy list is empty
        if (this.children.length == 0){
            this.loadEnemies();
        }

        // makes type 2 enemies jump every 5 seconds.
        this.enemyType2Children.forEach((child) => {
            if((child.getElapsedTime() + 1) % 5 == 0){
                child.object.anims.play("jump");
                child.jump();
            }
        });

        // makes type 3 enemies blink every 8 seconds.
        this.enemyType3Children.forEach((child) => {
            if((child.getElapsedTime() + 1) % 8 == 0){
                child.object.anims.play("blink");
            }
        });
        
    }

}

class Controller{
    static userEmail;
    static size = 200;
    static frameRate = 5; // frame rate of animations
    static count = 0;
    static start;
    static powerupContact;
    static paused = false;
    static pauseInitialized;
    static pauseStart;
    static totalPauseTime = 0;

    // static resumeInitialized = true;
    // static playTimeStart;
    static totalPlayTime = 0;
    static resumed;
    static physics;
    static add;
    static flag = true;
    static minutesElapsed = 0;

    static getMinutesElapsed(){
        var secondsElapsed = this.getSecondsElapsed(this.start);
        return  parseFloat(parseFloat((secondsElapsed/60)).toFixed(2));
    }

    static getSecondsElapsed(dateClass){
        const now = new Date();
        return Math.floor( (now - dateClass) / 1150);
    }

    static updateSecondsPaused(){
        var secondsElapsed = this.getSecondsElapsed(this.pauseStart);
        this.totalPauseTime += secondsElapsed;
    }

    // static updateSecondsplayTime(){
    // //     var secondsElapsed = this.getSecondsElapsed(this.playTimeStart);
    // //     this.totalPlayTime += secondsElapsed;
    // // }


    static pauseGame(){
        this.paused = true;
        if(this.flag){
            this.pauseInitialized = false;
        }
    }

    static startGame(){
        this.paused = false;
        this.resumed = true;
        // this.resumeInitialized = true;
    }

    static initializeStart(){
        this.start = new Date();
    }

    // sets physics class for enemy class use
    static setPhysics(classClass){
        this.physics = classClass;
    }

    static setAdd(classClass){
        this.add = classClass;
    }

    // Checks if an explosion is displayed
    static checkExplosion(){
        explosions.children.iterate(function (child){
            if (child){
                child.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim, frame, gameObject) {

                    this.disableBody(true, true);
            
                });
            }
        });
    }

    // Checks if player is in contact with a powerup
    static checkPowerups(){

        if(this.count % 2700 == 0){
            this.dropPowerUp();
        }

        Powerups.children.forEach( (child) =>{
            if (child){
                var powerupObject = child.object;
                if ((( player.x - 20 <= powerupObject.x) && (player.x + 20 >= powerupObject.x)) && 
                (( powerupObject.y >=  player.y - 20 ) && (powerupObject.y <  player.y + 20))){

                    if(child.type == "health"){
                        playerProperties.health += 25;
                    }else if (child.type == "upgrade1"){
                        playerProperties.form = "form1_shooting";
                    }else if (child.type == "upgrade2"){
                        playerProperties.form = "form2_shooting";
                    }else{
                        playerProperties.form = "form3_shooting";
                    }

                    powerupObject.destroy();
                    Powerups.children.pop();
                    this.powerupContact = true;
                }

                if(powerupObject.y > 800){
                    powerupObject.destroy();
                    Powerups.children.pop();
                }
            }

        });
        

        if (this.powerupContact){
            // make health stop only when flicker complete
            if (playerProperties.flickerCount > playerProperties.flickerStop){
                this.powerupContact = false;
            }
            else{
                this.flicker(playerProperties, 'green');
            }  

        }
    }

    static destroyPowerup

    // checks all bullets fired
    static checkBullets(){
        bullets.children.iterate(function (child) {
            // checks if a child exist
            if (child){
                // checks if bullet is no more on screen
                if (child.y < 0){
                    child.destroy(); // destroys bullet   
                }
    
                Enemy.children.forEach((enemy_child) => {
                    var enemyObject = enemy_child.object

                    // chceks if bullet is in contact with an enemy
                    if ((((enemyObject.x + 25) >= child.x) && ((enemyObject.x - 25) <= child.x)) && (child.y == enemyObject.y)){
                        child.destroy(); // destroys bullet

                        // checks if enemy health is above zero
                        if (enemy_child.health != 0){
                            enemy_child.health = enemy_child.health - 25;
                            enemy_child.tint = 0xff0000;
                            enemyObject.setTint(enemy_child.tint);
                            if (enemy_child.isRed){
                                enemy_child.tint = enemy_child.tint - 0x100000;
                                enemyObject.setTint(enemy_child.tint);
                            }
                        }else{
                            playerProperties.points += 20;
                            playerProperties.enemiesKilled += 1;
                            score.setText(`Score: ${playerProperties.points}`);
                            var explosion = explosions.create(enemyObject.x, enemyObject.y, "explosion");
                            explosion.anims.play("boom", true); // plays explosion animation
                            enemyObject.destroy(); // removes enemy from screen
                            Enemy.removeEnemy(enemy_child);
                        }
                    }
                });
            }
            
        });
        
        Enemy.bullet.forEach((bullet_child) => {
            var index;
            index = Enemy.bullet.indexOf(bullet_child);
            // checks if enemy bullet is no more on screen
            if (bullet_child.y > 800){  
                bullet_child.destroy();  
                Enemy.bullet.splice(index, 1);  
            }
            

            // checks if enemy bullet in contact with player
            if ((( player.x - 20 <= bullet_child.x) && (player.x + 20 >= bullet_child.x)) && 
                (( bullet_child.y >=  player.y ) && (bullet_child.y <  player.y + 20))){
                    bullet_child.destroy();
                    Enemy.bullet.splice(index, 1);
                    playerProperties.isRed = true;
                    playerProperties.health -= 25;
                    this.flicker(playerProperties, "red");
            }
        
        }); 
    
    }

    static dropPowerUp(){
        const powerup = new Powerups();
    }
    
    // Function that flickers player
    static flicker(objectToFlicker, flickerColor){

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

    // determines which set of bullets to fire
    static bulletsToFire(stageCheck){

        if(stageCheck[0]){
            playerProperties.bulletsFired += 1;
            bullets.create(player.x, player.y - 40, "bullet").setScale(0.5);
        }
        
        if(stageCheck[1]){
            playerProperties.bulletsFired += 2;
            bullets.create(player.x + 10, player.y - 20, "bullet").setScale(0.5);
            bullets.create(player.x - 10, player.y - 20, "bullet").setScale(0.5);
        }
        
        if(stageCheck[2]){
            playerProperties.bulletsFired += 2;
            bullets.create(player.x + 20, player.y - 20, "bullet").setScale(0.5);
            bullets.create(player.x - 20, player.y - 20, "bullet").setScale(0.5);
        }
        
        if(stageCheck[3]){
            playerProperties.bulletsFired += 2;
            bullets.create(player.x + 30, player.y - 10, "bullet").setScale(0.5);
            bullets.create(player.x - 30, player.y - 10, "bullet").setScale(0.5);
        }
    }

    static playerDead(classRef){
        if(this.flag){
            player.destroy();
            this.flag = false;
            var jet_explosion = this.physics.add.sprite(player.x, player.y + 10, "jet_explosion").setScale(3);
            jet_explosion.anims.play("jet_boom", true);

            jet_explosion.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                Controller.pauseGame();
                this.add.text(180, 300, `GAME OVER`, {
                    font: "100px Montserrat",
                    fill: "#ffffff",
                });
            }, classRef);

            this.minutesElapsed = this.getMinutesElapsed();
            UserManager.updateUserInfo(
                this.userEmail, 
                playerProperties.points, 
                this.minutesElapsed, 
                playerProperties.bulletsFired, 
                playerProperties.enemiesKilled
            );
        }
    }

    static createLifeBar(){
        return  this.add.graphics();
    }

}

function preload ()
{

    this.load.spritesheet('jet', 'sprites/jet.png', { frameWidth: 70, frameHeight: 46 });
    
    this.load.spritesheet('explosion', 'sprites/explosion.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('jet_explosion', 'sprites/jet_explosion.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('bullet', 'sprites/bullets/jet_bullets.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('enemy_bullet', 'sprites/bullets/enemy_bullet.png', { frameWidth: 30, frameHeight: 30 });

    // load powerup sprites
    this.load.image('health', 'sprites/powerups/health.png');
    this.load.spritesheet('upgrades', 'sprites/powerups/jet_upgrades.png', { frameWidth: 32, frameHeight: 33 });

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

    Controller.setPhysics(this.physics);
    Controller.setAdd(this.add);
    Controller.initializeStart();

    Powerups.setPhysics(this.physics);
    player = this.physics.add.sprite(500, 700, "jet").setScale(1.5);
    playerProperties.object = player;
    playerProperties.playTimeStart = new Date();
    player.setCollideWorldBounds(true);


    this.anims.create({
        key: "boom",
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 3 }),
        frameRate: Controller.frameRate,
        repeat: 0
    });

    this.anims.create({
        key: "jet_boom",
        frames: this.anims.generateFrameNumbers('jet_explosion', { start: 0, end: 4 }),
        frameRate: Controller.frameRate,
        repeat: 0
    });

    this.anims.create({
            key: "base_form_shooting",
            frames: this.anims.generateFrameNumbers('jet', { start: 0, end: 1 }),
            frameRate: Controller.frameRate,
            repeat: -1
    });

    this.anims.create({
        key: "base_form",
        frames: this.anims.generateFrameNumbers('jet', { start: 0, end: 0 }),
        frameRate: Controller.frameRate,
        repeat: -1
    });

    this.anims.create({
        key: "form1",
        frames: this.anims.generateFrameNumbers('jet', { start: 2, end: 2 }),
        frameRate: Controller.frameRate,
        repeat: -1
    });

    this.anims.create({
        key: "form1_shooting",
        frames: this.anims.generateFrameNumbers('jet', { start: 2, end: 3 }),
        frameRate: Controller.frameRate,
        repeat: -1
    });

    this.anims.create({
        key: "form2_shooting",
        frames: this.anims.generateFrameNumbers('jet', { start: 4, end: 5 }),
        frameRate: Controller.frameRate,
        repeat: -1
    });


    this.anims.create({
        key: "form3",
        frames: this.anims.generateFrameNumbers('jet', { start: 6, end: 6 }),
        frameRate: Controller.frameRate,
        repeat: -1
    });

    this.anims.create({
        key: "form3_shooting",
        frames: this.anims.generateFrameNumbers('jet', { start: 6, end: 7 }),
        frameRate: Controller.frameRate,
        repeat: -1
    });


    this.anims.create({
        key: "jump",
        frames: this.anims.generateFrameNumbers('enemy_type_2', { start: 1, end: 3 }),
        frameRate: Controller.frameRate,
        repeat: 2
    });

    this.anims.create({
        key: "blink",
        frames: this.anims.generateFrameNumbers('enemy_type_3', { start: 0, end: 6 }),
        frameRate: Controller.frameRate,
        repeat: 1
    });

    this.anims.create({
        key: "upgrade1",
        frames: this.anims.generateFrameNumbers('upgrades', { start: 0, end: 0 }),
        frameRate: Controller.frameRate,
        repeat: -1
    });

    this.anims.create({
        key: "upgrade2",
        frames: this.anims.generateFrameNumbers('upgrades', { start: 1, end: 1 }),
        frameRate: Controller.frameRate,
        repeat: -1
    });

    this.anims.create({
        key: "upgrade3",
        frames: this.anims.generateFrameNumbers('upgrades', { start: 2, end: 2 }),
        frameRate: Controller.frameRate,
        repeat: -1
    });

    bullets = this.physics.add.group();
    explosions = this.physics.add.group();

    score = this.add.text(50, 10, `Score: ${playerProperties.points}`, {
        font: "25px Montserrat",
        fill: "#ffffff",
    });

    // pause = this.add.text(50, 10, `Score: ${playerProperties.points}`, {
    //     font: "25px Montserrat",
    //     fill: "#ffffff",
    // });

   
    cursors = this.input.keyboard.createCursorKeys();
    keyboard = this.input.keyboard.addKeys("Q, P");
    
}

function update ()
{
    if(keyboard.Q.isDown ){
        Controller.pauseGame();
    }

    if(keyboard.P.isDown ){
        Controller.startGame();
    }

    if (Controller.paused){
        this.physics.pause(); // stops physics
        this.anims.pauseAll(); // stops all animations
        this.tweens.pauseAll(); // stops all timed movements

        if(!(Controller.pauseInitialized)){
            Controller.pauseInitialized = true;
            // Controller.updateSecondsplayTime();
            // Controller.pauseStart = new Date();
        }

    }else{

        if(Controller.resumed){
            this.physics.resume();
            this.anims.resumeAll();
            Controller.resumed = false;
            Controller.updateSecondsPaused();

        }
    }

    if (!(Controller.paused)){
        Enemy.check();

        // if(Controller.resumeInitialized){
        //     Controller.playTimeStart = new Date();
        //     Controller.resumeInitialized = false;
        // }

        if (Controller.count % 75 == 0){

            Enemy.children.forEach((child) =>{
                child.shoot(playerProperties.object.x, playerProperties.object.y);
            });
        }
    
        if(Controller.flag){
            if (Controller.count % 100 == 0){
                if (playerProperties.form != "base_form"){
                    player.anims.play(playerProperties.form, true);
                    shoot();
                }else{
                    player.anims.play(playerProperties.form, true);
                }
                
            }

            if (cursors.up.isDown){
                playerProperties.form = "base_form_shooting";
            }
            else if (cursors.down.isDown){
                playerProperties.form = "form3_shooting";
            }
            else if (cursors.left.isDown)
            {
                player.setVelocityX(-100);
            }
            else if (cursors.right.isDown)
            {
                player.setVelocityX(100);
            
            }
            else{
                player.setVelocityX(0);
            }
        }

        Controller.count++;
    
        Controller.checkBullets();
        if (playerProperties.isRed){
            Controller.flicker(playerProperties, "red");
        }
        
        if(playerProperties.health < 1){
            Controller.playerDead(this);
        }

        Controller.checkPowerups();

        if (Controller.count == 3900){
            Controller.count = 0;
        }

        Controller.checkExplosion();       
    }
    
}

function shoot(){
    // console.log(bullets.getLength())
    if (playerProperties.form == "base_form_shooting"){
        Controller.bulletsToFire([true,false,false,false]);
    }
    if (playerProperties.form == "form1_shooting"){
        Controller.bulletsToFire([true,true,false,false]);
    }
    if (playerProperties.form == "form2_shooting"){
        
        Controller.bulletsToFire([true,true,true,false]);
    }
    if (playerProperties.form == "form3_shooting"){
        Controller.bulletsToFire([true,true,true,true]);
    }

    bullets.children.iterate(function (child) {
        child.setVelocityY(-300);
    });  
}

function redirect(display_content){
    window.location.href = `form.html?${display_content}`;
}

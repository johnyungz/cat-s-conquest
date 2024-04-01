////spritesheet animation referenced from https://www.youtube.com/watch?v=CY0HE277IBM&t=891s

// html selectors
const playerSelector = document.getElementById( "player" );
const enemySelector = document.getElementById( "enemy" );

const playerName = document.getElementById( "player-name" );
const enemyName = document.getElementById( "enemy-name" )

const playerHealthBar = document.getElementById( "player-health-bar" );
const enemyHealthBar = document.getElementById( "enemy-health-bar" );
const playerHealthNumber = document.getElementById( "player-health" );
const enemyHealthNumber = document.getElementById( "enemy-health" );

const weakAttack = document.getElementById( "weak-attack" );
const strongAttack = document.getElementById( "strong-attack" );
const strongAttackCount = document.getElementById ( "strongAtkCounter" )

const startButton = document.getElementById( "start-button" );
const menuScreen = document.getElementById( "menu" )
const gameContainer = document.getElementById( "game-play" );
const displayMove = document.getElementById( "move" )
const playAgain = document.getElementById( "play-again" )
const playAgainScreen = document.querySelector( ".play-again-container" );
const helpButton = document.getElementById( "help-button" )
const helpMenu = document.getElementById( "help" )
const mainMenu = document.getElementById( "main-menu" ) 
const returnButton = document.getElementById ( "return-button" );
const playerControls = document.getElementById ( "player-controls" );

//note this blocker is necessary because i didn't know you can't disable p tags and i was running a bit low on time 
//so i just thought that i would just place an invisible rectangle to disable multiple attacks at one time
const blocker = document.getElementById ( "blocker" )

const outcome = document.getElementById( "outcome" )


//character class for player and enemy
class Character {
  constructor(name, health, damage) {
    this.name = name
    this.health = health;
    this.healthValueHolder = health;
    this.damage = damage;
    this.strongAttackCounter = 3;
  }
  //two attacks, one weak and one strong with 3 uses 
  weakAttack() {
    const attack = Math.floor(Math.random() * this.damage);
    return attack;
  }

  usingStrongAttack(){
    if(this.strongAttackCounter > 0 ){
      const attack = Math.floor(Math.random() * (this.damage) + 5)
      return attack;
    } else {
      return 0
    }
  }
  minus(){
     return this.strongAttackCounter--
  }
}

class Enemy {
  constructor(name, health, damage) {
    this.name = name
    this.health = health;
    this.healthValueHolder = health
    this.damage = damage;
  }

  //enemy attacking player
  enemyReturnAttack() {
    return Math.floor(Math.random() * this.damage);
  }
}


//create player and enemy variables first so we can make classes for them later
let player;
let enemy;

//sprite animation using canvas
//creates a class so i can set x, y, image, how fast it animates, total frames and also what animation
class CharacterAnimation {
  constructor(ctx, spriteWidth, spriteHeight, imageSrc, staggerFrames, totalFrames, numRows) {
    this.ctx = ctx;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.image = new Image();
    this.image.src = imageSrc;
    this.frameX = 0;
    this.gameFrame = 0;
    this.staggerFrames = staggerFrames;
    this.totalFrames = totalFrames
    this.currentRow = numRows
    this.playOnce = false;
  }

  //changes animation based on what is happening
  changeAnimationRow(row) {
      this.currentRow = row;
      this.frameX = 0;
      this.gameFrame = 0;
  }

  //takes image then makes a box using dimension of how big 1 sprite frame is, then animates by scanning horizontally through sprite sheet
  animate() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.spriteHeight * this.currentRow,
      this.spriteWidth,
      this.spriteHeight,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
      //this just sets how fast animation is
    if(this.gameFrame % this.staggerFrames === 0) {
      if (this.frameX < this.totalFrames) this.frameX += 1;
      else this.frameX = 0;
    }
    this.gameFrame++
  }
}

// Get the canvas for animation
const playerCanvas = document.getElementById( "player-canvas" );
const playerCtx = playerCanvas.getContext( "2d" );

const enemyCanvas = document.getElementById( "enemy-canvas" );
const enemyCtx = enemyCanvas.getContext( "2d" );

// Create objects for player and enemy animation that we can pass through the animation class for our desired sprite dimensions, frames etc...
const playerAnimation = new CharacterAnimation(
  playerCtx,
  200,
  190,
  "/media/Meow-Knight_Idle4.png",
  8,
  5,
  0
);

const enemyAnimation = new CharacterAnimation(
  enemyCtx,
  500,
  350,
  "/media/evilwizsprites.png",
  8,
  7,
  0
);

// Call the animate functions to start the animations using request animation frame
function animatePlayer() {
  playerAnimation.animate();
  requestAnimationFrame(animatePlayer);
}

function animateEnemy() {
  enemyAnimation.animate();
  requestAnimationFrame(animateEnemy);
}


animatePlayer();
animateEnemy();


//function that makes it easier for me to change the animation with the desired framecount
function changeAnimation(animation, frameCount, animationRowNumber){
  animation.totalFrames = frameCount
  animation.changeAnimationRow(animationRowNumber) 
}


//checking battle conditions, if any unit has 0 hp battle is over
//i check for damage > health because i dont want the number to be negative. i can just set the hp to 0 after

function checkHealth() {
  if(enemy.health < player.weakAttack() || enemy.health < player.usingStrongAttack()){
    enemy.health = 0;
    enemyHealthNumber.textContent = "HP: 0";
    enemyHealthBar.style.width = 0 + "%";
    outcome.textContent = "The Evil Sorcerer has been defeated!";

    blocker.classList.toggle("startGame")

    changeAnimation(enemyAnimation, 7, 3)
    setTimeout(() => {
      enemyCanvas.style.opacity = 0;
      playerAnimation.changeAnimationRow(0);
    }, 2000);
  
    playAgainScreen.style.display = "flex";
  } else if (player.health < enemy.enemyReturnAttack()){
    player.health = 0;
    playerHealthNumber.textContent = "HP: 0";
    outcome.textContent = "You Have been Defeated!!"

    blocker.classList.toggle("startGame")

    playerAnimation.changeAnimationRow(3)
    setTimeout(() => {
      playerCanvas.style.opacity = 0;
      enemyAnimation.changeAnimationRow(0);
    }, 2000);
    playAgainScreen.style.display = "flex";
  }
}

//menu buttons for help and returning back to menu
helpButton.addEventListener("click", function(){
  helpMenu.classList.toggle('start');
  mainMenu.classList.toggle('startGame')
})

returnButton.addEventListener("click", function(){
  helpMenu.classList.toggle("start")
  mainMenu.classList.toggle('startGame')
})


//start button for when menu gets added, to generate player and enemy classes
startButton.addEventListener('click', function(){
  gameContainer.classList.toggle('start');
  menuScreen.classList.toggle('startGame');
  playerControls.style.display = "block"
  startButton.style.display = 'none'
  startButton.disabled = true
  //creating classes
  player = new Character("Player 1", 57, 8);
  enemy =  new Enemy("Enemy 1", 40, 4);

  //setting names
  playerName.textContent = player.name;
  enemyName.textContent = enemy.name;

  //setting hp values
  playerHealthNumber.textContent = "HP: " + player.health;
  enemyHealthNumber.textContent = "HP: " + enemy.health;
})

//play again button
playAgain.addEventListener("click", function(){
  location.reload();
})


//battle sequences and attacking 
//1. player attacks, we change enemy health 
//we also change player animation to attack and enemy animation to take damage
//2.after a delay of 2 seconds enemy returns attack
//we then change player animation to take damage and enemy attacks
//3.after 4 seconds we reset both animations back to idle
//we call check health to see if a unit's hp value "is at 0"

//weak attack
weakAttack.addEventListener('click', function() {
  blocker.classList.toggle("startGame")
  //player attacks and then enemy
  enemy.health -= player.weakAttack();
  enemyHealthNumber.textContent = "HP: " + enemy.health;
  enemyHealthBar.style.width = (enemy.health / enemy.healthValueHolder) * 100 + "%";
  displayMove.textContent = "You used weak attack"
  changeAnimation(playerAnimation, 3, 1);
  changeAnimation(enemyAnimation, 2, 4)
  weakAttack.disabled = true;
  //enemy attacks after a delay
  if(enemy.health > player.weakAttack()){
  const enemyAttack = setInterval(() => {
    player.health -= enemy.enemyReturnAttack();
    playerHealthNumber.textContent = "HP: " + player.health;
    playerHealthBar.style.width = (player.health / player.healthValueHolder) * 100 + "%";
    displayMove.textContent = "Enemy used weak attack";
    
    changeAnimation(playerAnimation, 2, 4)
    changeAnimation(enemyAnimation, 7, 1)

clearInterval(enemyAttack)
    const clearText = setInterval(() => {
      displayMove.textContent = ""
      clearInterval(clearText)

      changeAnimation(playerAnimation, 5, 0)
      changeAnimation(enemyAnimation, 7, 0)
      blocker.classList.toggle("startGame")
    }, 4000);

  }, 2000);}

  //clears attack text
  checkHealth();
});

//strong attack 
strongAttack.addEventListener('click', function() {
    //player attacks and then enemy
    enemy.health -= player.usingStrongAttack();
    enemyHealthNumber.textContent = "HP: " + enemy.health;
    enemyHealthBar.style.width = (enemy.health / enemy.healthValueHolder) * 100 + "%";
    displayMove.textContent = "You used strong attack"
    player.minus();
    //player attack!
    strongAttackCount.textContent = `Strong attack counter: ${player.strongAttackCounter}`
    changeAnimation(playerAnimation, 5, 2);
    changeAnimation(enemyAnimation, 2, 4)

    blocker.classList.toggle("startGame")
    //enemy attacks after a delay
    if(enemy.health > player.usingStrongAttack()){
    const enemyAttack = setInterval(() => {
      player.health -= enemy.enemyReturnAttack();
      playerHealthNumber.textContent = "HP: " + player.health;
      playerHealthBar.style.width = (player.health / player.healthValueHolder) * 100 + "%";
      displayMove.textContent = "Enemy used strong attack as well!";
      
      changeAnimation(playerAnimation, 2, 4)
      changeAnimation(enemyAnimation, 7, 2)
  
  clearInterval(enemyAttack)
      const clearText = setInterval(() => {
        displayMove.textContent = ""
        clearInterval(clearText)
  
        changeAnimation(playerAnimation, 5, 0)
        changeAnimation(enemyAnimation, 7, 0)

        blocker.classList.toggle("startGame")
      }, 4000);
  
    }, 2000);}
    checkHealth();
});




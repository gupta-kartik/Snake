/*
Create by Learn Web Developement
Youtube channel : https://www.youtube.com/channel/UC8n8ftV94ZU_DJLOLtrpORA
*/

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// load images

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// create the snake

let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// create the food

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score var

let score = 0;
let previousScores = [];
let gameOver = false;

//control the snake

let d;

let gameSpeed = 100; // Initial speed
const MIN_SPEED = 50; // Minimum speed limit
const SPEED_INCREMENT = 5; // How much faster it gets per food

document.addEventListener("keydown",direction);

function direction(event){
    if(gameOver) {
        // Reset game state
        snake = [{
            x: 9 * box,
            y: 10 * box
        }];
        food = {
            x: Math.floor(Math.random()*17+1) * box,
            y: Math.floor(Math.random()*15+3) * box
        };
        score = 0;
        d = undefined;
        gameSpeed = 100;
        gameOver = false;
        game = setInterval(draw, gameSpeed);
        return;
    }

    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        up.play();
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        right.play();
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        down.play();
    }
}

// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// draw everything to the canvas

function draw(){
    
    ctx.drawImage(ground,0,0);
    
    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    
    ctx.drawImage(foodImg, food.x, food.y);
    
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // // which direction
    // if( d == "LEFT") snakeX -= box;
    // if( d == "UP") snakeY -= box;
    // if( d == "RIGHT") snakeX += box;
    // if( d == "DOWN") snakeY += box;

    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    
    // Wrap around logic
    if(snakeX < box) {
        snakeX = 17 * box;
    } else if(snakeX > 17 * box) {
        snakeX = box;
    }
    
    if(snakeY < 3*box) {
        snakeY = 17*box;
    } else if(snakeY > 17*box) {
        snakeY = 3*box;
    }
    
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        // Increase speed
        gameSpeed = Math.max(MIN_SPEED, gameSpeed - SPEED_INCREMENT);
        clearInterval(game);
        game = setInterval(draw, gameSpeed);
    }else{
        // remove the tail
        snake.pop();
    }
    
    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    
    // game over
    
    // if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
    //     clearInterval(game);
    //     dead.play();
    // }

    // game over only on self collision
    if(collision(newHead,snake)){
        clearInterval(game);
        dead.play();
        gameOver = true;
        previousScores.unshift(score);
        if (previousScores.length > 4) {
            previousScores.pop();
        }
        updateScoreDisplay();
        
        // Add game over text
        ctx.fillStyle = "white";
        ctx.font = "45px Changa one";
        ctx.fillText("Game Over - Press any key", 4*box, 10*box);
    }
    
    snake.unshift(newHead);
    
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);
}

// call draw function every 100 ms

let game = setInterval(draw, gameSpeed);

// Global variable for task counter
// let foodCollected = 0;

// Function to check if Snake eats the food
// function checkCollision(snake, food) {
//     if (snake.x === food.x && snake.y === food.y) {
//         foodCollected++;
//         pauseGame(); // Pauses the game
//         showTask(foodCollected); // Displays the task
//     }
// }

// Pausing the game
function pauseGame() {
    clearInterval(game); // Stops the game loop
}

// Function to show task
function showTask(taskNumber) {
    const taskPopup = document.getElementById('taskPopup');
    taskPopup.style.display = 'block';
    taskPopup.innerHTML = `Task ${taskNumber}: Write a function to reverse a string using Copilot.`;

    // You can change the task based on the food collected or use an array of tasks
}

// Add at the end of the file
function updateScoreDisplay() {
    const scoresList = document.getElementById('previousScores');
    scoresList.innerHTML = '';
    previousScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `Game ${previousScores.length - index}: ${score} points`;
        scoresList.appendChild(li);
    });
}


















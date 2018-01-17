let xVelocity = 1;
let yVelocity = 0;
let collisionsOn = true;
let isRunning = false;
//Iunno how to include these variables in the scope of playGame
document.onkeydown = keyPushS;

window.onload = function playSnakes() {
    if (!isRunning) {
        isRunning = true;
        let scalefact = 20;
        let canvas = document.getElementById("snakes-canvas");
        let ctx = canvas.getContext("2d");
        let itemWidth = (canvas.height / scalefact);
        let score = 0;

        let snake = [];
        newSnake();
        let apple = new AppleObject();

        //Updates the snake/apple in some time
        window.setInterval(pGame, 1000/10);

        function SnakeObject(x, y) {
            this.xPos = x;
            this.yPos = y;
        }

        function AppleObject() {
            this.xPos = ((Math.round(Math.random() * scalefact)) * itemWidth);
            this.yPos = ((Math.round(Math.random() * scalefact)) * itemWidth);
        }

        function pGame() {
            let consumedApple = false;
            appleCheck();

            //Make sure apple lies within bounds
            if (apple.xPos > canvas.width - itemWidth
                || apple.yPos > canvas.height - itemWidth) {
                apple = new AppleObject();
            }

            //Clear canvas at start of every iteration
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //Make background black
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#FF00FF";
            ctx.font = "15px Comic Sans MS";
            ctx.strokeText(score + " ", 5, 15);

            ctx.fillStyle = "#FF0000";
            ctx.fillRect(apple.xPos, apple.yPos, itemWidth, itemWidth);
            ctx.strokeStyle = "#00FFFF";
            ctx.rect(apple.xPos, apple.yPos, itemWidth, itemWidth);
            ctx.stroke();

            //Draw the snakes pieces
            ctx.fillStyle = "#1FFF1F";
            for (let i = 0; i < snake.length; i+=1) {
                ctx.fillRect(snake[i].xPos+1, snake[i].yPos+1, itemWidth-2, itemWidth-2);
            }
            ctx.fillStyle = "#0000FF";
            ctx.fillRect(snake[0].xPos, snake[0].yPos, itemWidth, itemWidth);

            //Determine the new position for the snake head segment
            let newX = snake[0].xPos + (xVelocity * itemWidth);
            let newY = snake[0].yPos + (yVelocity * itemWidth);

            //Check if snake exceeds bounds of the canvas
            if (newX > canvas.width-1) newX = 0;
            if (newY > canvas.height-1) newY = 0;
            if (newX < -1) newX = canvas.width - itemWidth;
            if (newY < -1) newY = canvas.height - itemWidth;

           if (collisionsOn) {
               collisionCheck();
           }
           else {
               snake.unshift(new SnakeObject(newX, newY));
               snake.splice(-1,1);
           }

           function collisionCheck() {
               //If head consumes apple
               if (newX === apple.xPos && newY === apple.yPos) {
                   consumedApple = true;
               }

               let restart = false;
               //if snake hit its own body pieces
               for (let i = 0; i < snake.length; i++) {
                   if (snake[i].xPos === newX && snake[i].yPos === newY) {
                       newSnake();
                       score = 0;
                       xVelocity = 1;
                       yVelocity = 0;
                       restart = true;
                   }
               }

               if (!restart) {
                   //Move head piece forward and delete last body piece
                   snake.unshift(new SnakeObject(newX, newY));
                   if (!consumedApple) {
                       snake.splice(-1, 1);
                   }
                   else {
                       apple = new AppleObject();
                       score++;
                   }
               }
           }
        }

        //Generates an array with the starting snake of len 5
        function newSnake() {
            snake = [];
            for (let i = (itemWidth * 5); i <= (itemWidth*5) + (itemWidth * 5); i += itemWidth) {
                snake.push(new SnakeObject((itemWidth * 10), i));
            }
        }

        function appleCheck() {
            let recheck = false;
            for (let i = 0; i < snake.length; i++) {
                if (apple.xPos === snake[i].xPos && apple.yPos === snake[i].yPos) {
                    apple = new AppleObject();
                    recheck = true;
                    break;
                }
            }
            if (recheck) {
                appleCheck();
            }
        }
    }
}

function keyPushS(key) {
    switch (key.keyCode) {
        case 37: // Left arrow
            if (xVelocity !==1) {
                xVelocity = -1;
                yVelocity = 0;
            }
            break;
        case 38: // Up arrow
            if (yVelocity!==1) {
                xVelocity = 0;
                yVelocity = -1;
            }
            break;
        case 39: // Right arrow
            if (xVelocity!==-1) {
                xVelocity = 1;
                yVelocity = 0;
            }
            break;
        case 40: // Down arrow
            if (yVelocity !==-1) {
                xVelocity = 0;
                yVelocity = 1;
            }
            break;
        case 13:
            collisionsOn = !collisionsOn;
            break;
        case 116:
            location.reload();
            break;
        default:
            break;
    }
    key.preventDefault();
}
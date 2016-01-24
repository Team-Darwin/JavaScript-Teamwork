// Set up canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Get the width and height from the canvas element
var width = canvas.width;
var height = canvas.height;

// Work out the width and height in blocks
var blockSize = 10;
//var widthInBlocks = width / blockSize;
//var heightInBlocks = height / blockSize;

// Draw the border
var drawBorder = function () {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// The Block constructor
var Block = function (col, row) {
    this.col = col;
    this.row = row;
};

// Draw a square at the block's location
Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

var Food = function() {
    this.x = Math.round((Math.random() * 30) + 1); // could improve the random algorithm
    this.y = Math.round((Math.random() * 30) + 1);
    this.food = new Block(this.x, this.y);
};

Food.prototype.draw = function() {
    this.food.drawSquare("Blue");
};

// The Snake constructor
var Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];

    this.direction = "right";
    this.nextDirection = "right";
};

// Draw a square for each segment of the snake's body
Snake.prototype.draw = function () {
    for (var i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("Blue");
    }
};

// Create a new head and add it to the beginning of
// the snake to move the snake in its current direction
Snake.prototype.move = function () {
    var head = this.segments[0];
    var newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }

    // Check if there is a wall hit
    if(newHead.col === -1 || newHead.col === width / blockSize || newHead.row === -1 || newHead.row === height / blockSize) {
        console.log('Hit a wall!');
        //TODO: Add game over clause
    }

    this.segments.unshift(newHead);

    //prevent snake trailing
    this.segments.pop(head);

};

// Check if the snake's new head has collided with the wall or itself
Snake.prototype.checkCollision = function (head) {
    var leftCollision = (head.col === 0);
    var topCollision = (head.row === 0);
    var rightCollision = (head.col === widthInBlocks - 1);
    var bottomCollision = (head.row === heightInBlocks - 1);

    var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

    var selfCollision = false;

    for (var i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }

    return wallCollision || selfCollision;
};

// Set the snake's next direction based on the keyboard
Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    }

    this.nextDirection = newDirection;
};


// Create the snake object
var snake = new Snake();
var food  = new Food();


// Pass an animation function to setInterval
var init = function () {
    setInterval(function() {
        ctx.clearRect(0, 0, width, height);
        snake.move();
        snake.draw();
        food.draw();
        drawBorder();
    },80);
};

init();

// Convert keycodes to directions
var directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

// The keydown handler for handling direction key presses
$("body").keydown(function (event) {
    var newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});
var canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    score = 0;
    blockSize = 10;


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

// Draw the score in the top-left corner
var drawScore = function () {
    ctx.font = "15px Courier";
    ctx.fillStyle = "Green";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
};

var Food = function() {
    this.col = createRandomCoordinates();
    this.row = createRandomCoordinates();
    this.food = new Block(this.col, this.row);
};

Food.prototype.draw = function() {
    this.food.drawSquare("Red");
};

Food.prototype.updatePosition = function(){
    this.food.row = createRandomCoordinates();
    this.food.col = createRandomCoordinates();
};

function createRandomCoordinates() {
    var number = Math.floor((Math.random() * 30) + 1);

    return number;
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

// Create a new head and add it to the bginning of
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

    food.draw();

    // Check if there is a wall hit
    if(newHead.col === -1 || newHead.col === width / blockSize || newHead.row === -1 || newHead.row === height / blockSize) {
        clearInterval(init);
        console.log('Hit a wall!');
        var n = $('#noty').noty({
            text: 'Ooops! It looks like you hit a wall!',
            //layout: 'center',
            closeWith: ['click'],
            type: 'alert',
            buttons: [
                {addClass: 'btn btn-primary btn-disabled', text: 'New Game', onClick: function($noty) {
                    noty({text: 'The server is busy! You should wait 5 min for a new slot', type: 'warning'});

                }},
                {addClass: 'btn btn-danger', text: 'Cancel', onClick: function($noty) {
                        noty({text: 'THANKS FOR PLAYING!', type: 'information'});
                        $noty.close();
                    }
                }
            ]
        });
    }

    if(newHead.col === food.food.col && newHead.row === food.food.row) {
        console.log('eat');
        this.segments.push(new Block(newHead.col, newHead.row));
        score++;
        if(score == 10) {
            noty({text: 'Well done!', type: 'success'});
        }
        food.updatePosition();
    }

    this.segments.unshift(newHead);

    //prevent snake trailing
    this.segments.pop(head);

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

var snake = new Snake();
var food  = new Food();

// Pass an animation function to setInterval
var init = setInterval(function() {
        ctx.clearRect(0, 0, width, height);
        drawScore();
        snake.move();
        snake.draw();
},80);


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



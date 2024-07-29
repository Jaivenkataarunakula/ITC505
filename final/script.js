var audioEnabled = true;
var musicEnabled = true;
var isometricView = false;
var $droneAudio = $('#drone');
var $backgroundMusic = $('#song');
var musicTimeout;
var musicPlaying = false;

var timerRunning = false; // Flag to track whether the timer has started
var gameTimer; // Timer variable
var gameMinutes = 0;
var gameSeconds = 0;

var squareModule = (function(){
    var xCoord = 0;
    var yCoord = 0; 
    var sqHeight = 100;

    function setHeight(val){
        sqHeight = val;
    }

    function getCoords(){
        return [[xCoord, yCoord],
                [xCoord + sqHeight, yCoord],
                [xCoord + sqHeight, yCoord + sqHeight],
                [xCoord, yCoord + sqHeight]];
    }

    function setXY(valX, valY){
        xCoord = valX;
        yCoord = valY;
    }

    function init(valX, valY, height){
        setXY(valX, valY);
        setHeight(height);
    }

    function toString(){
        var coords = getCoords();
        var coordString = "[";
        for (let pair of coords){
            coordString += "[" + pair + "], ";
        }
        coordString = coordString.substring(0, coordString.length - 2) + "]";
        return coordString;
    }

    function getPathString(){
        var coords = getCoords();
        var pathString = "M";
        for (let pair of coords){
            pathString += pair[0] + "," + pair[1] + "L";
        }
        pathString = pathString.substring(0, pathString.length - 1) + "Z";
        return pathString;
    }

    return {
        setHeight,
        getCoords,
        toString,
        setXY,
        init,
        getPathString
    };
})();

var lightsOutModule = (function(){
    var ROWS = 5;
    var COLS = ROWS;
    var clickToggleCount = 0;

    var paperWidth = $("#raphael-container").width() - 30;
    var gutterRatio = 0.1;
    var unitWidth = paperWidth / (ROWS + ROWS * gutterRatio + gutterRatio);
    var gutterWidth = unitWidth * gutterRatio;
    
    var unitColor = "#1495ff";
    var strokeColor = "#1495ff";
    var inactiveOpacity = "0.1";
    var activeOpacity = "0.65";

    var paper = Raphael("raphael-container", "100%", "100%");
    var grid = [];
    var gameActive = true;
    var activeSquaresCount = 0;

    var updateSquareCount = function(int){
        activeSquaresCount += int;
        $("#counter").html(activeSquaresCount);
    };

    var checkForWin = function(){
        if(activeSquaresCount == 0 && gameActive){
            alert("You win!");
            resetGame();
        }
    };

    var getNeighbors = function(x, y, grid){
        var potentialNeighbors = [[x-1, y], [x, y-1], [x, y+1], [x+1, y]];
        var neighbors = [];

        for (var i = 0; i < potentialNeighbors.length; i++){
            if ((potentialNeighbors[i][0] >= 0 && potentialNeighbors[i][0] < COLS) &&
                (potentialNeighbors[i][1] >= 0 && potentialNeighbors[i][1] < ROWS)){
                neighbors.push(grid[potentialNeighbors[i][1]][potentialNeighbors[i][0]]);
            }
        }

        return neighbors;
    };

    var toggleSquare = function(square){
        if (!timerRunning) { // Start the timer when the first square is clicked
            startGameTimer();
            timerRunning = true;
        }
        if (audioEnabled){
            clickToggleCount = (clickToggleCount + 1) % 5;
            document.getElementById('smallClick' + clickToggleCount).play();
        }
        if (square.data("active")){
            square.data("active", false);
            square.attr({"fill-opacity": inactiveOpacity});
            updateSquareCount(-1);
        } else {
            square.data('active', true);
            square.attr({"fill-opacity": activeOpacity});
            updateSquareCount(1);
        }

        for (var i = 0; i < square.data("neighbors").length; i++){
            var neighbor = square.data("neighbors")[i];
            if (neighbor.data("active")){
                neighbor.data("active", false);
                neighbor.attr({"fill-opacity": inactiveOpacity});
                updateSquareCount(-1);
            } else {
                neighbor.data('active', true);
                neighbor.attr({"fill-opacity": activeOpacity});
                updateSquareCount(1);
            }
        }
        checkForWin();
    };

    var createSquare = function(pathString, valX, valY){
        var sq = paper.path(pathString);
        sq.node.setAttribute('class', 'square');
        sq.attr({fill: unitColor});
        sq.attr({stroke: strokeColor});
        sq.attr({"fill-opacity": inactiveOpacity});
        sq.data("x", valX);
        sq.data("y", valY);
        sq.data("active", false);

        sq.attr({cursor: "pointer"}).mouseup(function(){
            toggleSquare(this);
        });
        return sq;
    };

    var drawGameBoard = function(){
        for (var i = 0; i < ROWS; i++){
            var xOffset = gutterWidth;
            var yOffset = gutterWidth * (i + 1) + unitWidth * i;
            var gridRow = [];

            for (var j = 0; j < ROWS; j++){
                squareModule.init(xOffset, yOffset, unitWidth);
                var pathString = squareModule.getPathString();
                var sq = createSquare(pathString, j, i);
                gridRow[j] = sq;
                xOffset += unitWidth + gutterWidth;
            }
            grid[i] = gridRow;
        }

        for (i = 0; i < grid.length; i++){
            for (j = 0; j < grid[i].length; j++){
                grid[i][j].data('neighbors', getNeighbors(j, i, grid));
            }
        }
    };

    var resetGame = function(){
        gameActive = false;
        var toggleAudio = false;
        if (audioEnabled){
            toggleAudio = true;
            audioEnabled = false;
        }
        for (var i = 0; i < grid.length; i++){
            for (var j = 0; j < grid[i].length; j++){
                if (Math.floor(Math.random() * 2) == 1){
                    console.log("Toggled square " + i + ", " + j);
                    toggleSquare(grid[i][j]);
                } else {
                    console.log("Didn't toggle square " + i + ", " + j);
                }
            }
        }
        if (toggleAudio){
            audioEnabled = true;
        }
        gameActive = true;
        resetGameTimer(); // Reset timer when game is reset
        timerRunning = false; // Reset timer flag
    };

    drawGameBoard();
    resetGame();

    return { resetGame };
})();

$(document).ready(function() {
    $(".loading-icon").fadeOut(500, function() {
        $(".overlay-text").fadeIn(3000, function() {
            $('.overlay-subtext').fadeIn(3000, function() {
                setTimeout(function() {
                    document.getElementById('lightswitch').play();
                    $('.overlay').hide();
                }, 2000);
            });
        });
    });
});

$(document).on("click", ".volume-control", function(){
    if (audioEnabled){
        $(".volume-control i").removeClass('fa-volume-up').addClass('fa-volume-off');
        audioEnabled = false;
    } else {
        $(".volume-control i").removeClass('fa-volume-off').addClass('fa-volume-up');
        audioEnabled = true;
    }
}).on("click", ".reset-control", function(){
    $('#reset-icon').addClass('spinAnim');
    lightsOutModule.resetGame();
    setTimeout(function(){
        $('#reset-icon').removeClass('spinAnim');
    }, 500);
}).on("click", ".music-control", function(){
    if (musicEnabled){
        $('.music-control i').addClass('disabled');
        musicEnabled = false;
        stopMusic();
    } else {
        $('.music-control i').removeClass('disabled');
        musicEnabled = true;
        startMusic(false);
    }
}).on("click", ".isometric-control", function(){
    if (isometricView){
        $('.isometric-control i').removeClass('active');
        $('svg').attr('class', '');
        $('.isometric-control i').addClass('disabled');
        isometricView = false;
    } else {
        $('.isometric-control i').addClass('active');
        $('svg').attr('class', 'isometric');
        $('.isometric-control i').removeClass('disabled');
        isometricView = true;
    }
});

var startMusic = function(intro){
    $droneAudio.on('ended', function(){
        this.currentTime = 0;
        this.play();
    });
    $backgroundMusic.on('ended', function(){
        musicPlaying = false;
        this.currentTime = 0;
        setMusicTimeout();
    });

    if (intro){
        $droneAudio.on('canplaythrough', function(){
            this.currentTime = 0;
            this.volume = 0.4;
            this.play();
        });
    } else {
        $droneAudio.on('canplaythrough', function(){
            this.volume = 0;
            this.play();
            $(this).animate({volume: 0.4}, 1000);
        });
    }

    if (musicPlaying){
        $backgroundMusic.on('canplaythrough', function(){
            this.volume = 0;
            this.play();
            $(this).animate({volume: 0.04}, 1000);
        });
    } else {
        setMusicTimeout();
    }
};

var setMusicTimeout = function(){
    musicTimeout = setTimeout(function(){
        musicPlaying = true;
        $backgroundMusic.on('canplaythrough', function(){
            this.currentTime = 0;
            this.volume = 0.04;
            this.play();
        });
    }, Math.floor((Math.random() * 15) + 31) * 1000);
};

var stopMusic = function(){
    $droneAudio.animate({volume: 0}, 500);
    $backgroundMusic.animate({volume: 0}, 500);
    clearTimeout(musicTimeout);
    setTimeout(function(){
        $droneAudio.get(0).pause();
        $backgroundMusic.get(0).pause();
    }, 500);
};

// Timer functions
function startGameTimer() {
    gameTimer = setInterval(updateGameTimer, 1000);
}

function updateGameTimer() {
    gameSeconds++;
    if (gameSeconds == 60) {
        gameMinutes++;
        gameSeconds = 0;
    }
    displayGameTimer();
}

function displayGameTimer() {
    var timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = (gameMinutes < 10 ? "0" + gameMinutes : gameMinutes) + ":" + (gameSeconds < 10 ? "0" + gameSeconds : gameSeconds);
}

function resetGameTimer() {
    clearInterval(gameTimer);
    gameMinutes = 0;
    gameSeconds = 0;
    displayGameTimer();
}

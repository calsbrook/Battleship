/*vars and stuff*/
var opponentGrid = document.getElementById('opponentGrid');
var msg = document.getElementById('msg');
var winMsg = document.getElementById('winMsg');
var guess, coord;
var turn = 1
var playerScore = 0;
var aiScore = 0;
var goodGuess = false;
var holder = false;
var tries = 0;

var ships = [
    {
        name: 'aircraft-carrier',
        size: 5,
        sound: 'placeholder'
    },
    {
        name: 'battleship',
        size: 4,
        sound: 'placeholder'
    },
    {
        name: 'cruiser',
        size: 3,
        sound: 'placeholder'
    },
    {
        name: 'submarine',
        size: 3,
        sound: 'placeholder'
    },
    {
        name: 'destroyer',
        size: 2,
        sound: 'placeholder'
    }
]

var boardA = new Array(100).fill(0);

var boardP = new Array(100).fill(0);

var hits = {
    H: 'url("https://www.caribbeannationalweekly.com/wp-content/uploads/2017/06/ornage.jpg")',
    M: 'url("http://www.porcelaingres.com/img/collezioni/JUST-GREY/big/just_grey_light_grey.jpg")',
    0: '',
    A: '',
    B: '',
    C: '',
    S: '',
    D: ''
}

/*event listeners*/

opponentGrid.addEventListener('click', function(e){
    coord = e.target.id;
    holder = goodGuess;
    checkHit(boardA);
    render();
    goodGuess = holder;
    checkTurn();
});
/*AI*/

function guessCoord() {
    if (goodGuess) {
        coord = guess + tries;
    } else {
    coord = Math.floor(Math.random() * 100);
    guess = coord;
    }
    checkHit(boardP);
    render();
}

/*functions*/
function checkHit(board) {
    console.log(coord)
    switch(board[coord]) {
        case 'H':
            if (turn === 1)break;
            if (turn === (-1)) guessCoord();
        case 'M':
            if (turn === 1)break;
            if (turn === (-1)) guessCoord();
        case 0:
            board[coord] = 'M';
            turn *= (-1)
            goodGuess = false;
            break;
        case 'A': //aircraft carrier
            board[coord] = 'H';
            scoreAdd();
            turn *= (-1)
            goodGuess = true;
            tries += 1

            if (checkSink('A', board)) {
                break} else {
                    msg.innerHTML =`You sunk the ${ships[0].name}`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'B': //battleship
            board[coord] = 'H';
            scoreAdd();
            turn *= (-1)
            goodGuess = true;
            tries += 1

            if (checkSink('B', board)) {
                break} else {
                    msg.innerHTML =`You sunk the ${ships[1].name}`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'C': //cruiser
            scoreAdd();
            board[coord] = 'H';
            turn *= (-1)
            goodGuess = true;
            tries += 1

            if (checkSink('C',board)) {
                break} else {
                    msg.innerHTML =`You sunk the ${ships[2].name}`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'S': //submarine
            scoreAdd();
            board[coord] = 'H';
            turn *= (-1)
            goodGuess = true;

            tries += 1
            if (checkSink('S', board)) {
                break} else {
                    msg.innerHTML =`You sunk the ${ships[3].name}`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'D': //destroyer
            scoreAdd();
            board[coord] = 'H';
            turn *= (-1)
            goodGuess = true;
            tries += 1
            if (checkSink('D', board)) {
                break} else {
                    msg.innerHTML =`You sunk the ${ships[4].name}`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
    }
    if(checkWin(playerScore)) {
        winMsg.innerHTML = 'Y O U W O N';
    }
    if(checkWin(aiScore)) {
        winMsg.innerHTML = 'This AI is a couple days old and beat you...'
    }
}

function checkWin(playOrAI) {
    if(playOrAI === 17) {
        return true;
    } else {
        return false;
    }
}

function scoreAdd() {
    if (turn === 1) {
        playerScore += 1;
    } else if (turn === (-1)) {
        aiScore += 1;
    }
}

function render() {
    arrayCallback();
}

function checkSink(type, board) {
    return board.some(function (val) {
        return val === type;
    })
}

function arrayCallback(turn, idx) {
    for (i=0; i<boardA.length; i++) {
        document.getElementById(i).style.backgroundImage = hits[boardA[i]];
        document.getElementById((i + 100)).style.backgroundImage = hits[boardP[i]];
    }
}

function init() {
    boardA = new Array(100).fill(0);
    boardP = new Array(100).fill(0);
    playerScore = aiScore = 0;
    turn = 1;
    render();
}

function checkTurn() {
    if (turn === 1) {
        return
    } else {
        guessCoord();
    }
}

/*calling to start*/
init();

/*vars and stuff*/
var opponentGrid = document.getElementById('opponentGrid');
var coord = 0;
var msg = document.getElementById('msg');
var winMsg = document.getElementById('winMsg');
var turn, guess;
var playerScore = 0;
var aiScore = 0;

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
    checkHit(boardA);
    render();
});
/*AI*/

function guessCoord() {
    guess = Math.floor(Math.random() * 100);
    checkHit(boardB);
    render();
}

/*functions*/
function checkHit(board) {
    switch(board[coord]) {
        case 'H':
            break;
        case 'M':
            break;
        case 0:
            board[coord] = 'M'
            break;
        case 'A': //aircraft carrier
            board[coord] = 'H';
            playerScore += 1;
            if (checkSink('A')) {
                break} else {
                    msg.innerHTML =`You sunk the ${ships[0].name}`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'B': //battleship
            board[coord] = 'H';
            playerScore += 1;
            if (checkSink('B')) {
                break} else {
                    msg.innerHTML =`You sunk the ${ships[1].name}`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'C': //cruiser
            board[coord] = 'H';
            playerScore += 1;
            if (checkSink('C')) {
                break} else {
                    msg.innerHTML =`You sunk the ${ships[2].name}`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'S': //submarine
            board[coord] = 'H';
            playerScore += 1;
            if (checkSink('S')) {
                break} else {
                    msg.innerHTML =`You sunk the ${ships[3].name}`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'D': //destroyer
            board[coord] = 'H';
            playerScore += 1;
            if (checkSink('D')) {
                break} else {
                    msg.innerHTML =`You sunk the ${ships[4].name}`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
    }
    if(checkPWin()) {
        winMsg.innerHTML = 'Y O U W O N';
    }
    if(checkAWin()) {
        winMsg.innerHTML = 'This AI is a couple days old and beat you...'
    }
    turn *= (-1)
}

function checkPWin() {
    if(playerScore === 17) {
        return true;
    } else {
        return false;
    }
}

function checkAWin() {
    if(aiScore === 17) {
        return true;
    } else {
        return false;
    }
}

function render() {
    arrayCallback();
}

function checkSink(type) {
    return boardA.some(function (val) {
        return val === type;
    })
}

function arrayCallback(turn, idx) {
    for (i=0; i<boardA.length; i++) {
        document.getElementById(i).style.backgroundImage = hits[boardA[i]]
    }
}

function init() {
    boardA = boardB = new Array(100).fill(0);
    playerScore = aiScore = 0;
    turn = 1;
    render();
}

/*calling to start*/
init();

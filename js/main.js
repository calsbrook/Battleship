/*vars and stuff*/
var opponentGrid = document.getElementById('opponentGrid');
var playerGrid = document.getElementById('playerGrid');
var msg = document.getElementById('msg');
var winMsg = document.getElementById('winMsg');
var bank = document.getElementById('bank');
var horiVert = document.getElementById('horiVert');
var shipToPlace = '';
var guess, coord;
var turn = 1
var playerScore = 0;
var aiScore = 0;
var goodGuess = false;
var holder = false;
var tries = 0;
var horiz = true;
var player = new Audio();

var ships = {
    'aircraft-carrier': {
        name: 'aircraft-carrier',
        abb: 'A',
        size: 5,
        sound: 'placeholder'
    },
    battleship: {
        name: 'battleship',
        abb: 'B',
        size: 4,
        sound: 'placeholder'
    },
    cruiser: {
        name: 'cruiser',
        abb: 'C',
        size: 3,
        sound: 'placeholder'
    },
    submarine: {
        name: 'submarine',
        abb: 'S',
        size: 3,
        sound: 'placeholder'
    },
    destroyer: {
        name: 'destroyer',
        abb: 'D',
        size: 2,
        sound: 'placeholder'
    }
}

var boardA = new Array(100).fill(0);

var boardP = new Array(100).fill(0);

var hitsA = {
    H: 'url("https://i.imgur.com/QLotCpU.png")',
    M: 'url("https://i.imgur.com/DtyBdAn.png")',
    0: 'url("https://i.imgur.com/sljAQJ1.png)'
}
var hitsP = {
    H: 'url("https://i.imgur.com/QLotCpU.png")',
    M: 'url("https://i.imgur.com/DtyBdAn.png")',
    0: 'url("https://i.imgur.com/sljAQJ1.png)',
    A0: 'url("https://i.imgur.com/6dK6uJh.png")',
    A1: 'url("https://i.imgur.com/Rn6DeJm.png")',
    A2: 'url("https://i.imgur.com/z9ZEWk8.png")',
    A3: 'url("https://i.imgur.com/DzYdHpy.png")',
    A4: 'url("https://i.imgur.com/klA39sv.png")',
    B0: 'url("https://i.imgur.com/0LWdSN8.png")',
    B1: 'url("https://i.imgur.com/6Eduamo.png")',
    B2: 'url("https://i.imgur.com/B3mxgyv.png")',
    B3: 'url("https://i.imgur.com/Yk8Yxpk.png")',
    C0: 'url("https://i.imgur.com/wg6rjF9.png")',
    C1: 'url("https://i.imgur.com/0BIzrkg.png")',
    C2: 'url("https://i.imgur.com/b9NqDc8.png")',
    S0: 'url("https://i.imgur.com/vjzvQlF.png")',
    S1: 'url("https://i.imgur.com/qdEVwGb.png")',
    S2: 'url("https://i.imgur.com/GJIHDNv.png")',
    D0: 'url("https://i.imgur.com/EXshJ9V.png")',
    D1: 'url("https://i.imgur.com/pHeIkOj.png")'
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

playerGrid.addEventListener('click', function(e){
    place = e.target.id;
    placePlayerShips(shipToPlace);
    render();
})

bank.addEventListener('click', function(e){
    shipToPlace = e.target.id;
})

horiVert.addEventListener('click', function(e){
    if (e.target.innerText === 'Verticle') {
        horiz = false;
    } else if (e.target.innerText === 'Horizontal') {
        horiz = true;
    }
})

/*AI*/

function guessCoord() {
    if (goodGuess) {
        coord = guess + tries;
    } else {
        tries = 0;
        coord = Math.floor(Math.random() * 100);
        guess = coord;
    }
    checkHit(boardP);
    render();
}

function hideShips() {
    coord = Math.floor(Math.random() * 100);
    placeAIShips('aircraft-carrier', coord);
    coord = Math.floor(Math.random() * 100);
    placeAIShips('battleship', coord);
    coord = Math.floor(Math.random() * 100);
    placeAIShips('cruiser', coord);
    coord = Math.floor(Math.random() * 100);
    placeAIShips('submarine', coord);
    coord = Math.floor(Math.random() * 100);
    placeAIShips('destroyer', coord);
}

function placeAIShips(ship) {
    if(horiz === true){
    for (i = 0; i < ships[ship].size; i++) {
        boardA[i + (coord)] = ships[ship].abb + i;
    }
} else {
    for (i=0; i<ships[ship].size; i++) {
        boardA[(i * 10)+ (coord)] = ships[ship].abb + i;
    }
}
    render();
}

/*functions*/
function checkHit(board) {
    console.log(coord)
    switch(board[coord].toString().charAt(0)) {
        case 'H':
            goodGuess = false;
            tries = 0;
            guessCoord();
        case 'M':
            if (turn === 1)break;
            if (turn === (-1)) {
                goodGuess = false;
                tries = 0;
                guessCoord();
            }
        case '0':
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
                    msg.innerHTML =`You sank the aircraft carrier`;
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
                    msg.innerHTML =`You sank the battleship`;
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
                    msg.innerHTML =`You sank the cruiser`;
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
                    msg.innerHTML =`You sank the submarine`;
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
                    msg.innerHTML =`You sank the destroyer`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
    }
    if(checkWin(playerScore)) {
        winMsg.innerHTML = 'Y O U W O N';
        player.src = "http://k003.kiwi6.com/hotlink/9mtc9dy3dq/Soviet_Union_National_Anthem_8-bit_Remix_25Osc_.mp3";
        player.play();
        turn = 0;
    }
    if(checkWin(aiScore)) {
        winMsg.innerHTML = 'This AI is a couple days old and beat you...';
        turn = 0
    }
}

function placePlayerShips(ship) {
    if(horiz === true){
    for (i = 0; i < ships[ship].size; i++) {
        boardP[i + (place - 100)] = ships[ship].abb + i;
    }
} else {
    for (i=0; i<ships[ship].size; i++) {
        boardP[(i * 10)+ (place - 100)] = ships[ship].abb + i;
    }
}
    render();
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
        return val.toString().charAt(0) === type;
    })
}

function arrayCallback() {
    for (i=0; i<boardA.length; i++) {
        document.getElementById(i).style.backgroundImage = hitsA[boardA[i]];
        document.getElementById((i + 100)).style.backgroundImage = hitsP[boardP[i]];
    }
}

function init() {
    boardA = new Array(100).fill(0);
    boardP = new Array(100).fill(0);
    playerScore = aiScore = 0;
    turn = 1;
    player.pause();
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

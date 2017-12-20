/*------------------------vars and stuff--------------------------*/
var opponentGrid = document.getElementById('opponentGrid');
var playerGrid = document.getElementById('playerGrid');
var msg = document.getElementById('speech');
var winMsg = document.getElementById('winMsg');
var bank = document.getElementById('bank');
var horiVert = document.getElementById('horiVert');
var shipToPlace = '';
var guess, coord;
var turn = 1
var goodGuess = false;
var tries = 0;
var horiz = true;
var unplaced = true;
var player = new Audio();
var sfx = new Audio();
var north = south = east = west = true;
var dir = 4;

var playerBoard = createEmptyBoard();
var aiBoard = createEmptyBoard();

var ships = {
    aircraftCarrier: {
        name: 'aircraftCarrier',
        abb: 'A',
        size: 5,
        sound: 'placeholder',
        count: 0
    },
    battleship: {
        name: 'battleship',
        abb: 'B',
        size: 4,
        sound: 'placeholder',
        count: 0
    },
    cruiser: {
        name: 'cruiser',
        abb: 'C',
        size: 3,
        sound: 'placeholder',
        count: 0
    },
    submarine: {
        name: 'submarine',
        abb: 'S',
        size: 3,
        sound: 'placeholder',
        count: 0
    },
    destroyer: {
        name: 'destroyer',
        abb: 'D',
        size: 2,
        sound: 'placeholder',
        count: 0
    }
}

var hitsA = {
    H: 'url("https://i.imgur.com/QLotCpU.png")',
    M: 'url("https://i.imgur.com/DtyBdAn.png")',
    0: 'url("https://i.imgur.com/sljAQJ1.png)'
}
var hitsP = {
    H: 'url("https://i.imgur.com/QLotCpU.png")',
    M: 'url("https://i.imgur.com/DtyBdAn.png")',
    0: 'url("https://i.imgur.com/sljAQJ1.png)',
    //aircraft carrier
    A0: 'url("https://i.imgur.com/6dK6uJh.png")',
    A1: 'url("https://i.imgur.com/Rn6DeJm.png")',
    A2: 'url("https://i.imgur.com/z9ZEWk8.png")',
    A3: 'url("https://i.imgur.com/R1OyKrY.png")',
    A4: 'url("https://i.imgur.com/klA39sv.png")',
    A0V: 'url("https://i.imgur.com/yLaoc5y.png")',
    A1V: 'url("https://i.imgur.com/hKRiZl3.png")',
    A2V: 'url("https://i.imgur.com/YFQvWzB.png")',
    A3V: 'url("https://i.imgur.com/JgMAG4j.png")',
    A4V: 'url("https://i.imgur.com/HxLllQY.png")',
    //battleship
    B0: 'url("https://i.imgur.com/0LWdSN8.png")',
    B1: 'url("https://i.imgur.com/6Eduamo.png")',
    B2: 'url("https://i.imgur.com/B3mxgyv.png")',
    B3: 'url("https://i.imgur.com/Yk8Yxpk.png")',
    B0V: 'url("https://i.imgur.com/55ekjqQ.png")',
    B1V: 'url("https://i.imgur.com/n3JoHuf.png")',
    B2V: 'url("https://i.imgur.com/v7zhplI.png")',
    B3V: 'url("https://i.imgur.com/Owu8s1n.png")',
    //cruiser
    C0: 'url("https://i.imgur.com/wg6rjF9.png")',
    C1: 'url("https://i.imgur.com/0BIzrkg.png")',
    C2: 'url("https://i.imgur.com/b9NqDc8.png")',
    C0V: 'url("https://i.imgur.com/YUJcERD.png")',
    C1V: 'url("https://i.imgur.com/P798N8N.png")',
    C2V: 'url("https://i.imgur.com/qjqOxli.png")',
    //submarine
    S0: 'url("https://i.imgur.com/vjzvQlF.png")',
    S1: 'url("https://i.imgur.com/qdEVwGb.png")',
    S2: 'url("https://i.imgur.com/GJIHDNv.png")',
    S0V: 'url("https://i.imgur.com/tVLMiBR.png")',
    S1V: 'url("https://i.imgur.com/DUsWCV7.png")',
    S2V: 'url("https://i.imgur.com/Z02Onos.png")',
    //destroyer
    D0: 'url("https://i.imgur.com/9yJ3PdZ.png")',
    D1: 'url("https://i.imgur.com/qi73pUy.png")',
    D0V: 'url("https://i.imgur.com/qnJFouc.png")',
    D1V: 'url("https://i.imgur.com/21Djxsu.png")'
}

/*----------------------------event listeners---------------------*/

opponentGrid.addEventListener('click', function(e){
    if (start()) {
    coord = e.target.id;
    checkHit(aiBoard);
    render();
    guessCoord();
    } else return;
});

playerGrid.addEventListener('click', function(e){
    var place = e.target.id;
    placePlayerShip(shipToPlace, place);
    sfx.src = "http://k003.kiwi6.com/hotlink/ioc4dg2gb4/waterDrop.wav";
    sfx.play();
    render();
})

bank.addEventListener('click', function(e){
    shipToPlace = e.target.id;
})

horiVert.addEventListener('click', function(e){
    if (e.target.innerText === 'Vertical') {
        horiz = false;
    } else if (e.target.innerText === 'Horizontal') {
        horiz = true;
    } else if (e.target.innerText === 'Reset') {
        init();
    }
})

/*--------------------------AI----------------------------*/
function guessCoord() {
    if (goodGuess) {
        switch(true) {
            case east:
                coord = guess + tries;
                if (onBoard(coord)) {
                checkHit(playerBoard);
                } else {
                    changeDirection();
                    guessCoord();
                }
                break;
            case west:
                coord = guess - tries;
                if (onBoard(coord)) {
                    checkHit(playerBoard);
                    } else {
                        changeDirection();
                        guessCoord();
                    }
                break;
            case north:
                coord = guess + (10 * tries);
                if (onBoard(coord)) {
                    checkHit(playerBoard);
                    } else {
                        changeDirection();
                        guessCoord();
                    }
                break;
            case south:
                coord = guess - (10 * tries);
                if (onBoard(coord)) {
                    checkHit(playerBoard);
                    } else {
                        changeDirection();
                        guessCoord();
                    }
                break;
            default:
                break;
        }
    } else {
        tries = 0
        coord = Math.floor(Math.random() * 100);
        guess = coord;
        checkHit(playerBoard);
    }
    render();
}

function hideShips() {
    horiz = true;
    for (var key in ships) {
        spotFinder((ships[key].name))
    }
}

function spotFinder(ship) {
    coord = Math.floor(Math.random() * (100 - (ships[ship].size)));
    for (i = 0; i < ships[ship].size; i++) {
        if (aiBoard[coord + i] !== 0) {
            coord = Math.floor(Math.random() * (100 - (ships[ship].size)));
            spotFinder(ship);
        } else {
            placeAIShips(ships[ship].name, coord)
        }
    }
}

function placeAIShips(ship, coord) {
    if(horiz === true){
    for (i = 0; i < ships[ship].size; i++) {
        aiBoard[i + (coord)] = ships[ship].abb + i;
    }
} else {
    for (i=0; i<ships[ship].size; i++) {
        aiBoard[(i * 10)+ (coord)] = ships[ship].abb + i;
    }
}
    render();
}

function changeDirection(){
    if (turn === -1 && goodGuess) {
        if(dir === 4) {
            east = false;
        } else if (dir === 3) {
            west = false;
        } else if (dir === 2) {
            north = false;
        } else if (dir ===1) {
            south = false;
        } else if (dir <= 0) {
            aiReset();
        }
    dir -= 1;
}}

function onBoard(coord) {
    if (coord >= 100 || coord < 0) {
        return false;
    } else return true;
}
/*-----------------------functions---------------------------------*/
function checkHit(board) {
    console.log(turn)
    if (turn === 0) return;
    switch(board[coord].toString().charAt(0)) {
        case 'H':
            if (turn === -1 && goodGuess){
            changeDirection();
            tries = 1;
            guessCoord();
            } else if (turn === -1) {
                guessCoord();
            } else break;
        case 'M':
            if (turn === 1)break;
            if (turn === (-1) && goodGuess) {
                changeDirection();
                tries = 1;
                guessCoord();
            } else if (turn === (-1)) {
                guessCoord();
            }
        case '0':
            board[coord] = 'M';
            if (turn === (-1) && goodGuess) {
            changeDirection();
            tries = 1;
            }
            turn *= (-1);
            break;
        case 'A': //aircraft carrier
            hit(board, coord);
            if (checkSink('A', board)) {
                break} else {
                    if(turn=== (1)) aiReset();
                    msg.innerHTML =`${playerOrAI()} sank an aircraft carrier comrade`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'B': //battleship
            hit(board, coord);
            if (checkSink('B', board)) {
                break} else {
                    if(turn=== (1)) aiReset();
                    msg.innerHTML =`${playerOrAI()} sank a battleship comrade`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                    
                }
            break;
        case 'C': //cruiser
            hit(board, coord);
            if (checkSink('C',board)) {
                break} else {
                    if(turn=== (1)) aiReset();
                    msg.innerHTML =`${playerOrAI()} sank a cruiser comrade`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'S': //submarine
            hit(board, coord);
            if (checkSink('S', board)) {
                break} else {
                    if(turn=== (1)) aiReset();
                    msg.innerHTML =`${playerOrAI()} sank a submarine comrade`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'D': //destroyer
            hit(board, coord);
            if (checkSink('D', board)) {
                break} else {
                    if(turn=== (1)) aiReset();
                    msg.innerHTML =`${playerOrAI()} sank a destroyer comrade`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
    }
    callback(checkWin);
}

function placePlayerShip(ship, place) {
    var x = parseInt(place[2]);
    var y = parseInt(place[1]);
    if(ships[ship].count === 0 && isClear(playerBoard, ship, x, y)) {
        for (var i = 0; i < ships[ship].size; i++) {
            if(horiz === true)
            {
                playerBoard[y][x + i] = ships[ship].abb + i;
                ships[ship].count = 1;
            } else {
                playerBoard[y+i][x] = ships[ship].abb + i + 'V';
                ships[ship].count = 1;
            }
        }
    }return;
}
//     if(ships[ship].count === 0) {
//     if(horiz === true){
//     for (i = 0; i < ships[ship].size; i++) {
//         playerBoard[i + (place - 100)] = ships[ship].abb + i;
//         ships[ship].count = 1;
//     }
// } else {
//     for (i=0; i<ships[ship].size; i++) {
//         playerBoard[(i * 10)+ (place - 100)] = ships[ship].abb + i + 'V';
//         ships[ship].count = 1;
//     }
// }} else return;
//     render();
//     if (start() && unplaced) {
//         unplaced = false;
//         hideShips();
//     }
// }

function isClear(board, ship, x, y) {
    for(var i = 0; i < ships[ship].size; i++) {
        if(horiz) {
            if ((x + i) >= board.length || board[y][x + i] !== 0) {
                return false;
            }
        } else {
            if ((y + i) >= board.length || board[y + i][x] !== 0) {
                return false;
            }
        }
    }return true;
}


function hit(board, coord) {
    board[coord] = 'H';
    if(turn === (-1)) {
        goodGuess = true;
        tries += 1
    }
    turn *= (-1);
}

function aiReset() {
    north = south = east = west = true;
    dir = 4;
    goodGuess = false;
}
function callback(cb) {
    return cb();
}
function checkWin() {
    if(!checkSink('A', aiBoard) && !checkSink('B', aiBoard) && 
    !checkSink('C', aiBoard) && !checkSink('S', aiBoard) &&
    !checkSink('D', aiBoard)) {
        winMsg.innerHTML = 'YOU WON';
        player.src = "http://k003.kiwi6.com/hotlink/9mtc9dy3dq/Soviet_Union_National_Anthem_8-bit_Remix_25Osc_.mp3";
        player.play();
        turn = 0;
    } else if (!checkSink('A', playerBoard) && !checkSink('B', playerBoard) && 
    !checkSink('C', playerBoard) && !checkSink('S', playerBoard) &&
    !checkSink('D', playerBoard)) {
        winMsg.innerHTML = 'This AI is a couple days old and beat you...';
        turn = 0
    }
}

function render() {
    updateBoard();
}

function checkSink(type, board) {
    return board.some(function (val) {
        return val.toString().charAt(0) === type;
    })
}

function updateBoard() {
    for (var i = 0; i < aiBoard.length; i++) {
        for(var j = 0; j < aiBoard[i].length; j++) {
            var aiIndex = i * 10 + j;
            var playerIndex = i * 10 + j + 100;
            document.getElementById(aiIndex).style.backgroundImage = hitsA[aiBoard[i][j]];
            document.getElementById((playerIndex)).style.backgroundImage = hitsP[playerBoard[i][j]];
        }
    }
}

function createEmptyBoard() {
    var arr = new Array(10);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(10).fill(0);
    }return arr;
}

function init() {
    playerBoard = createEmptyBoard();
    aiBoard = createEmptyBoard();
    turn = 1;
    goodGuess = false;
    for (const ship in ships) {
        ships[ship].count = 0;
    }
    winMsg.innerText = '';
    north = south = east = west = true;
    player.pause();
    sfx.src = "http://k003.kiwi6.com/hotlink/ioc4dg2gb4/waterDrop.wav";
    unplaced = true;
    render();
}

function checkTurn() {
    if (turn === 1) {
        return
    } else {
        guessCoord();
    }
}

function playerOrAI() {
    if (turn === (-1)) {
        return 'You';
    } else {
        return 'AI'
    }
}

function start() {
    var x = 0;
    for (var key in ships) {
        x += ships[key].count;
    }
    if (x === 5) {
        return true;
    } else {
        return false;
    }
}

/*------------------------calling to start------------------------*/
init();

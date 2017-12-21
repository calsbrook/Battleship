/*------------------------vars and stuff--------------------------*/
var opponentGrid = document.getElementById('opponentGrid');
var playerGrid = document.getElementById('playerGrid');
var msg = document.getElementById('speech');
var reaganSpeech = document.getElementById('reaganSpeech');
var winMsg = document.getElementById('winMsg');
var bank = document.getElementById('bank');
var horiVert = document.getElementById('horiVert');
var shipToPlace = '';
var guessX, guessY;
var play = 1;
var goodGuess = false;
var tries = 0;
var horiz = true;
var unplaced = true;
var player = new Audio();
var direction = 'east';

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
    var x = parseInt(coord[1]);
    var y = parseInt(coord[0]);
    if (aiBoard[y][x] === 'H' || aiBoard[y][x] === 'M') return;
    checkHit(aiBoard, x, y);
    render();
    aiGuess();
    }
});

playerGrid.addEventListener('click', function(e){
    var place = e.target.id;
    placePlayerShip(shipToPlace, place);
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

function aiGuess() {
    if (!goodGuess) {
        randomGuess();
    } else {
        educatedGuess();
    }
    render();
}

function randomGuess() {
    tries = 0
    var x = Math.floor(Math.random() * 10);
    var y = Math.floor(Math.random() * 10);
    if (isValid(playerBoard, x, y)) {
        guessX = x;
        guessY = y;
        checkHit(playerBoard, x, y)
    } else {
        randomGuess();
    }
}

function educatedGuess() {
    switch(direction) {
        case 'east':
            x = guessX + tries;
            y = guessY;
            if (onBoard(x, y) && isValid(playerBoard, x, y)) {
                checkHit(playerBoard, x, y);
        } else {
            changeDirection();
            educatedGuess();
        }
            break;
        case 'west':
            x = guessX - tries;
            y = guessY;
            if (onBoard(x, y) && isValid(playerBoard, x, y)) {
                checkHit(playerBoard, x, y);
            } else {
                changeDirection();
                educatedGuess();
            }
            break;
        case 'north':
            x = guessX
            y = guessY - tries;
            if (onBoard(x, y) && isValid(playerBoard, x, y)) {
                checkHit(playerBoard, x, y)
            } else {
                changeDirection();
                educatedGuess();
            }
            break;
        case 'south':
            x = guessX
            y = guessY + tries;
            if (onBoard(x, y) && isValid(playerBoard, x, y)) {
                checkHit(playerBoard, x, y)
            } else {
                direction = 'east';
                tries = 0;
                randomGuess();
            }
            break;
        
    }
}

function changeDirection() {
    switch (direction) {
        case 'east':
            direction = 'west';
            tries = 1;
            break;
        case 'west':
            direction = 'north';
            tries = 1;
            break;
        case 'north':
            direction = 'south';
            tries = 1;
            break;
        case south:
            aiReset();
            break;
    }
}

function isValid(board, x,y) {
    if (board[y][x] === 'H' || board[y][x] === 'M') {
        return false;
    } else return true;
}

function hideShips() {
    for (var key in ships) {
        placeAIShips((ships[key].name))
    }
}

function placeAIShips(ship) {
    var x = Math.floor(Math.random() * 10);
    var y = Math.floor(Math.random() * 10);
    var coin = Math.floor(Math.random() * 2)
    if (coin > 0) {
        horiz = true;
    }else {
        horiz = false;
    }
    if(ships[ship].count === 1 && isClear(aiBoard, ship, x, y)) {
        for (var i = 0; i < ships[ship].size; i++) {
            if(horiz === true)
            {
                aiBoard[y][x + i] = ships[ship].abb + i;
                ships[ship].count = 1;
            } else {
                aiBoard[y+i][x] = ships[ship].abb + i + 'V';
                ships[ship].count = 1;
            }
        }
    } else {
        placeAIShips(ship);
    }
}

function onBoard(x, y) {
    if (x >= 10 || x < 0 || y >= 10 || y < 0) {
        return false;
    } else return true;
}
/*-----------------------functions---------------------------------*/
function checkHit(board, x, y) {
    if (play === 0) return;
    switch(board[y][x].toString().charAt(0)) {
        case '0':
            board[y][x] = 'M';
            if (board === playerBoard && goodGuess) {
                changeDirection();
            }
            break;
        case 'A': //aircraft carrier
            hit(board, x, y);
            if (!checkSink('A', board)) {
                break
                } else {
                    message(board, 'aircraft carrier')
                }
            break;
        case 'B': //battleship
            hit(board, x, y);
            if (!checkSink('B', board)) {
                break;
                } else {
                    message(board, 'battleship')
                }
            break;
        case 'C': //cruiser
            hit(board, x, y);
            if (!checkSink('C', board)) {
                break;
                } else {
                    message(board, 'cruiser')
                }
            break;
        case 'S': //submarine
            hit(board, x, y);
            if (!checkSink('S', board)) {
                break;
                } else {
                    message(board, 'submarine')
                }
            break;
        case 'D': //destroyer
            hit(board, x, y);
            if (!checkSink('D', board)) {
                break
                } else {
                    message(board, 'destroyer')
                }
            break;
    }
    callback(checkWin);
}

function message(board, ship) {
    if (board === aiBoard){
        msg.style.display = 'block';
        msg.innerHTML = `We sank their ${ship} comrade!`;
    } else if(board === playerBoard) {
        reaganSpeech.style.display = 'block';
        reaganSpeech.innerHTML = `Take that evil empire, we sank your ${ship}!`;
        aiReset();
    }
    if (play === 1) {
        setTimeout(function() {
            msg.style.display = 'none';
            msg.innerHTML = '';
            reaganSpeech.style.display = 'none';
            reaganSpeech.innerHTML = '';
        }, 3000)
    }
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
    }if (start() && unplaced) {
        unplaced = false;
        hideShips();
    }
}

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


function hit(board, x, y) {
    board[y][x] = 'H';
    if(board === playerBoard) {
        goodGuess = true;
        tries += 1
    }
}

function aiReset() {
    direction = 'east';
    tries = 0;
    goodGuess = false;
}
function callback(cb) {
    return cb();
}
function checkWin() {
    if(checkSink('A', aiBoard) && checkSink('B', aiBoard) && 
    checkSink('C', aiBoard) && checkSink('S', aiBoard) &&
    checkSink('D', aiBoard)) {
        winMsg.innerHTML = 'YOU WON';
        msg.style.display = 'block';
        msg.innerHTML = 'We did it comrade! We defeated the capitalists!'
        // player.src = "https://k003.kiwi6.com/hotlink/9mtc9dy3dq/Soviet_Union_National_Anthem_8-bit_Remix_25Osc_.mp3";
        // player.play();
        play = 0;
    } else if (checkSink('A', playerBoard) && checkSink('B', playerBoard) && 
    checkSink('C', playerBoard) && checkSink('S', playerBoard) &&
    checkSink('D', playerBoard)) {
        winMsg.innerHTML = 'You lose';
        msg.style.display = 'block'
        reaganSpeech.style.display = 'block';
        msg.innerHTML = 'N... Nani?'
        reaganSpeech.innerHTML = 'Get rekt';
        play = 0
    }
}

function render() {
    updateBoard();
}

function checkSink(type, board) {
    return !board.some(function(row) {
        return row.some(function(loc) {
            if (typeof loc === 'number') return false;
            return loc.includes(type);
        })
        
    });
}

function updateBoard() {
    for (var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
            var aiIndex = i * 10 + j;
            if(aiIndex < 10) {
                aiIndex = '0' + aiIndex
            }
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
    play = 1;
    aiReset();
    for (const ship in ships) {
        ships[ship].count = 0;
    }
    winMsg.innerText = '';
    // player.pause();
    unplaced = true;
    render();
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
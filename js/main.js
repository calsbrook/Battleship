/*------------------------vars and stuff--------------------------*/
var opponentGrid = document.getElementById('opponentGrid');
var playerGrid = document.getElementById('playerGrid');
var msg = document.getElementById('msg');
var winMsg = document.getElementById('winMsg');
var bank = document.getElementById('bank');
var horiVert = document.getElementById('horiVert');
var shipToPlace = '';
var guess, coord;
var turn = 1
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
    } else if (e.target.innerText === 'Place AI Ships') {
        hideShips();
    } else if (e.target.innerText === 'Reset') {
        init();
    }
})

/*--------------------------AI----------------------------*/

function guessCoord() {
    if (goodGuess) {
        coord = guess + tries;
    } else {
        tries = 0
        coord = Math.floor(Math.random() * 100);
        guess = coord;
    }
    checkHit(boardP);
    render();
}

function hideShips() {
    coord = Math.floor(Math.random() * (100 - 5));
    placeAIShips('aircraft-carrier', coord);
    coord = Math.floor(Math.random() * (100 - 4));
    placeAIShips('battleship', coord);
    coord = Math.floor(Math.random() * (100 - 3));
    placeAIShips('cruiser', coord);
    coord = Math.floor(Math.random() * (100 - 3));
    placeAIShips('submarine', coord);
    coord = Math.floor(Math.random() * (100 - 2));
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

/*-----------------------functions---------------------------------*/
function checkHit(board) {
    if (turn === 0) return;
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
            hit(board, coord);
            if (checkSink('A', board)) {
                break} else {
                    msg.innerHTML =`${playerOrAI()} sank an aircraft carrier`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'B': //battleship
            hit(board, coord);
            if (checkSink('B', board)) {
                break} else {
                    msg.innerHTML =`${playerOrAI()} sank a battleship`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'C': //cruiser
            hit(board, coord);
            if (checkSink('C',board)) {
                break} else {
                    msg.innerHTML =`${playerOrAI()} sank a cruiser`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'S': //submarine
            hit(board, coord);
            if (checkSink('S', board)) {
                break} else {
                    msg.innerHTML =`${playerOrAI()} sank a submarine`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
        case 'D': //destroyer
            hit(board, coord);
            if (checkSink('D', board)) {
                break} else {
                    msg.innerHTML =`${playerOrAI()} sank a destroyer`;
                    setTimeout(function() {
                        msg.innerHTML = '';
                    },3000)
                }
            break;
    }
    checkWin();
}

function placePlayerShips(ship) {
    if(ships[ship].count === 0) {
    if(horiz === true){
    for (i = 0; i < ships[ship].size; i++) {
        boardP[i + (place - 100)] = ships[ship].abb + i;
        ships[ship].count = 1;
    }
} else {
    for (i=0; i<ships[ship].size; i++) {
        boardP[(i * 10)+ (place - 100)] = ships[ship].abb + i + 'V';
        ships[ship].count = 1;
    }
}} else return;
    render();
}

function hit(board, coord) {
    board[coord] = 'H';
    turn *= (-1)
    goodGuess = true;
    tries += 1
}

function checkWin() {
    if(!checkSink('A', boardA) && !checkSink('B', boardA) && 
    !checkSink('C', boardA) && !checkSink('S', boardA) &&
    !checkSink('D', boardA)) {
        winMsg.innerHTML = 'YOU WON';
        player.src = "http://k003.kiwi6.com/hotlink/9mtc9dy3dq/Soviet_Union_National_Anthem_8-bit_Remix_25Osc_.mp3";
        player.play;
        turn = 0;
    } else if (!checkSink('A', boardP) && !checkSink('B', boardP) && 
    !checkSink('C', boardP) && !checkSink('S', boardP) &&
    !checkSink('D', boardP)) {
        winMsg.innerHTML = 'This AI is a couple days old and beat you...';
        turn = 0
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
    turn = 1;
    for (const ship in ships) {
        ships[ship].count = 0;
    }
    winMsg.innerText = '';
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

function playerOrAI() {
    if (turn === (-1)) {
        return 'You';
    } else {
        return 'AI'
    }
}

/*------------------------calling to start------------------------*/
init();

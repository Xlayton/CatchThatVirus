const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var turn;
var board;
var roomid;
var player;
var vaccineImage = new Image(100, 100);
vaccineImage.src = './Images/vaccine.png';
var virusImage = new Image(100, 100);
virusImage.src = './Images/virus.png';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.addEventListener("click", function (e) {
    clicked(e)
})
const socket = io(`${location.origin}`, {
    path: '/game',
    query: {
        roomid: "017111b0-5620-4658-bb7d-98932b46d30e"
    }
});
socket.on("message", data => {
    let rawBoard;
    try {
        rawBoard = JSON.parse(data);
    } catch (e) {
        console.log("error in message")
        return
    }
    roomid = rawBoard.id
    board = rawBoard.board
    player = rawBoard.player
    turn = 1;
    getBoard()
});
socket.on("updateboard", data => {
    document.getElementById("errortext").style.visibility = "hidden";
    let rawBoard;
    try {
        rawBoard = JSON.parse(data);
    } catch (e) {
        console.log("error updating board");
        return
    }
    roomid = rawBoard.id;
    board = rawBoard.board;
    getBoard();
})
socket.on("error", data => {
    console.log("hit an error");
    document.getElementById("errortext").innerHTML = data;
    document.getElementById("errortext").style.visibility = "visible";
})
socket.on("gameover", data => {
    console.log(`${data} Wins!`)
})
function getBoard() {
    var newText;
    if(player == turn)
    {
        newText = "Its your turn!";
    }
    else if(turn == 0 && player != 0)
    {
        newText = "It's the virus's turn";
    }
    else if(turn == 1 && player != 1)
    {
        newText = "It's the vaccine's turn";
    }
    document.getElementById("turntext").innerHTML = newText;
    turn = turn == 0 ? 1 : 0;
    var size = (canvas.width / board.length) > (canvas.height / board[0].length) ? (canvas.height / board[0].length) : (canvas.width / board.length);
    for (let i = 0; i < board.length; i++) {
        for (let i2 = 0; i2 < board[i].length; i2++) {
            ctx.fillStyle = "#FFF";
            ctx.fillRect((i * size), (i2 * size), size, size);
        }
    }
    for (let i = 0; i < board.length; i++) {
        for (let i2 = 0; i2 < board[i].length; i2++) {
            if (board[i][i2] == "Empty") {
                ctx.strokeRect((i * size), (i2 * size), size, size);
            } else if (board[i][i2] == "Virus") {
                ctx.strokeRect((i * size), (i2 * size), size, size);
                ctx.drawImage(virusImage, (i * size), (i2 * size), size, size);
            } else if (board[i][i2] == "Wall") {
                ctx.strokeRect((i * size), (i2 * size), size, size);
                ctx.drawImage(vaccineImage, (i * size), (i2 * size), size, size);
            }
        }
    }
}

function clicked(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    var size = (canvas.width / board.length) > (canvas.height / board[0].length) ? (canvas.height / board[0].length) : (canvas.width / board.length);
    var x = Math.floor((mouseX / size));
    var y = Math.floor((mouseY / size));
    console.log("size = " + size);
    console.log("mouse x = " + mouseX);
    console.log("mouse y = " + mouseY);
    console.log("x = " + x);
    console.log("y = " + y);
    if (player == 0) {
        socket.emit("movevirus", {
            x: x,
            y: y,
            roomid: roomid
        });
    } else if (player == 1) {
        socket.emit("placewall", {
            x: x,
            y: y,
            roomid: roomid
        });
    }
}
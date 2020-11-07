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
        roomid: "9fb288bb-a014-48d0-8367-7b6337d6ef8f"
    }
});
socket.on("message", data => {
    let rawBoard;
    try {
        rawBoard = JSON.parse(data);
    } catch (e) {
        console.log("dont :)")
        return
    }
    roomid = rawBoard.id
    board = rawBoard.board
    player = rawBoard.player
    getBoard()
});
socket.on("updateboard", data => {
    let rawBoard;
    try {
        rawBoard = JSON.parse(data);
    } catch (e) {
        console.log("dont :)")
        return
    }
    roomid = rawBoard.id
    board = rawBoard.board
    getBoard()
})

function getBoard() {
    var size = (canvas.width / board.length) > (canvas.height / board[0].length) ? (canvas.height / board[0].length) : (canvas.width / board.length);
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
    var x = Math.floor((mouseX / size))
    var y = Math.floor((mouseY / size))
    if (player == 0) {
        socket.emit("movevirus", {
            x: x,
            y: y,
            roomid: roomid
        })
    } else if (player == 1) {
        socket.emit("placewall", {
            x: x,
            y: y,
            roomid: roomid
        })
    }
}
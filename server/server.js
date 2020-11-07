const uuid = require("uuid")
const express = require("express")
const cors = require("cors")
const app = express();
app.use(cors())
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    path: "/game",
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
})

const BOARD_WIDTH = 15
const BOARD_HEIGHT = 15

const generateBoard = (width, height) => {
    board = [];
    for (let w = 0; w < width; w++) {
        if (!board[w]) {
            board[w] = []
        }
        for (let h = 0; h < height; h++) {
            board[w].push("Empty")
        }
    }
    board[Math.trunc(width / 2)][Math.trunc(height / 2)] = "Virus"
    console.log(board[Math.trunc(width / 2)][Math.trunc(height / 2)])
    return board
}


let lobbies = []

app.use(express.static(`${__dirname}/../front-end`))

io.on("connect", (sock) => {
    console.log("Client Connected")
    let room = {
        id: uuid.v4(),
        isOpen: true,
        board: generateBoard(BOARD_HEIGHT, BOARD_HEIGHT)
    }
    lobbies.push(room)
    sock.send(room)
})

server.listen(3000, () => {
    console.log(`Server running on port ${server.address().port}`)
})
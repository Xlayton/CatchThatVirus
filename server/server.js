const uuid = require("uuid")
const express = require("express")
const bparser = require("body-parser")
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server)

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
app.use(bparser.json({
    extended: true
}))

app.post("/createroom", (req, res) => {
    let {
        name,
        boardwidth,
        boardheight
    } = req.body
    let room = {
        id: uuid.v4(),
        name: name,
        isOpen: true,
        isStarted: false,
        players: 0,
        board: generateBoard(boardwidth, boardheight)
    }
    lobbies.push(room)
    res.send(JSON.stringify(lobbies))
})

io.on("connect", (sock) => {
    console.log("Client Attemping Connection...")
    let roomid = sock.handshake.query.roomid
    let lobby = lobbies.filter((lobby) => lobby.id === roomid)[0]
    if (!lobby || lobby.players >= 2) {
        console.log(`Client send invalid room id: ${roomid}`)
        console.log(`All Lobbies: ${lobbies.map(lobby => lobby.id)}`)
        sock.close()
        return
    }
    lobby.players = lobby.players + 1
    if (lobby.players >= 2) {
        lobby.isOpen = false;
        lobby.isStarted = true;
    }
    sock.join(`${lobby.id}`, () => console.log(`Client rooms: ${Object.keys(sock.rooms)}`))
    sock.send(JSON.stringify(lobby))
})

server.listen(3000, () => {
    console.log(`Server running on port ${server.address().port}`)
})
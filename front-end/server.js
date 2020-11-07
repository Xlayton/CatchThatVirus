const uuid = require("uuid")
const express = require("express");
const bodyParser = require("body-parser")
const {
    allowedNodeEnvironmentFlags
} = require("process");

const app = express();
app.use(express.static(`${__dirname}`), bodyParser.json())

app.route("/api/lobbies")
    .post((req, res) => {
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
    .get((req, res) => {
        res.send(JSON.stringify(lobbies))
    })

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

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    path: "/game",
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
})

io.on("connection", (sock) => {
    console.log("Client Attemping Connection...")
    let roomid = sock.handshake.query.roomid
    let lobby = lobbies.filter((lobby) => lobby.id === roomid)[0]
    if (!lobby || lobby.players >= 2) {
        console.log(`Client send invalid room id: ${roomid}`)
        console.log(`All Lobbies: ${lobbies.map(lobby => lobby.id)}`)
        sock.disconnect()
        return
    }
    lobby.players = lobby.players + 1
    if (lobby.players >= 2) {
        lobby.isOpen = false;
        lobby.isStarted = true;
    }
    sock.join(`${lobby.id}`, () => console.log(`Client room: ${Object.keys(sock.rooms)}`))
    sock.send(JSON.stringify(lobby))

    sock.on("placewall", data => {
        console.log(data)
        console.log(Object.keys(sock.rooms))
    })
    sock.on("movevirus", data => {
        console.log(data)
        console.log(Object.keys(sock.rooms))
    })
})

server.listen(3000, () => {
    console.log(`Server running on port ${server.address().port}`)
})
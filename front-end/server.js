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
let connections = []
let isVirusTurn = false;

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
    if (!lobby) {
        console.log(`Client send invalid room id: ${roomid}`)
        console.log(`All Lobbies: ${lobbies.map(lobby => lobby.id)}`)
        sock.disconnect()
        return
    }
    connections.push({
        roomid: roomid,
        socket: sock
    })
    lobby.players = lobby.players + 1
    if (lobby.players >= 2) {
        lobby.isOpen = false;
        lobby.isStarted = true;
    }
    sock.join(`${lobby.id}`, () => console.log(`Client room: ${Object.keys(sock.rooms)}`))
    sock.send(JSON.stringify({
        ...lobby,
        player: lobby.players - 1
    }))

    sock.on("placewall", data => {
        if (!isVirusTurn) {
            let roomid = data.roomid
            let lobby = lobbies.filter((lobby) => lobby.id === roomid)[0]
            if (!lobby) {
                sock.emit("error", "Game Closed.")
                return
            }
            if (lobby.board[data.x][data.y] === "Empty") {
                lobby.board[data.x][data.y] = "Wall"
                let players = connections.filter(conn => conn.roomid === roomid)
                players.forEach(player => {
                    player.socket.emit("updateboard", JSON.stringify(lobby))
                    let virusX = 0;
                    let virusY = 0;
                    for (let w = 0; w < lobby.board.length; w++) {
                        for (let h = 0; h < lobby.board[0].length; h++) {
                            if (lobby.board[w][h] === "Virus") {
                                virusX = w
                                virusY = h
                            }
                        }
                    }
                    if (lobby.board[virusX + 1][virusY] === "Wall" && lobby.board[virusX + 1][virusY - 1] === "Wall" && lobby.board[virusX + 1][virusY + 1] === "Wall" && lobby.board[virusX - 1][virusY] === "Wall" && lobby.board[virusX - 1][virusY - 1] === "Wall" && lobby.board[virusX - 1][virusY + 1] === "Wall" && lobby.board[virusX][virusY - 1] === "Wall" && lobby.board[virusX][virusY + 1] === "Wall") player.socket.emit("gameover", "Vaccine")
                })
                isVirusTurn = true
                return
            } else {
                sock.emit("error", "Invalid Position.")
                return
            }
        }
    })
    sock.on("movevirus", data => {
        if (isVirusTurn) {
            let roomid = data.roomid
            let lobby = lobbies.filter((lobby) => lobby.id === roomid)[0]
            if (!lobby) {
                sock.emit("error", "Game Closed.")
                return
            }
            if (lobby.board[data.x][data.y] === "Empty") {
                for (let w = 0; w < lobby.board.length; w++) {
                    for (let h = 0; h < lobby.board[0].length; h++) {
                        if (lobby.board[w][h] === "Virus") {
                            lobby.board[w][h] = "Empty"
                        }
                    }
                }
                lobby.board[data.x][data.y] = "Virus"
                let players = connections.filter(conn => conn.roomid === roomid)
                players.forEach(player => {
                    player.socket.emit("updateboard", JSON.stringify(lobby))
                    if (!lobby.board[data.x + 1][data.y] || !lobby.board[data.x - 1][data.y] || !lobby.board[data.x][data.y + 1] || !lobby.board[data.x][data.y - 1]) player.socket.emit("gameover", "Virus")
                })
                isVirusTurn = false
                return
            } else {
                sock.emit("error", "Invalid Position.")
                return
            }
        }
    })
})

server.listen(3000, () => {
    console.log(`Server running on port ${server.address().port}`)
})
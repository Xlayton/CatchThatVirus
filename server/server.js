const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server)

app.use(express.static(`${__dirname}/../front-end`))

io.on("connection", () => {
    console.log("Client Connected")
})

app.listen(3000, () => {
    console.log(`Server running on port ${server.address().port}`)
})
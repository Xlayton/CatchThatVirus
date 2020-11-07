const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var turn;
var board;
var virusImage = new Image(100, 100);
virusImage.src = './Images/virus.png';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.addEventListener("click", function(e) {
    clicked(e)
})
const socket = io(`${location.origin}`, {
    path: '/game',
    query: {
        roomid: "cd2af54b-0753-402d-983b-78ef55d6ea3e"
    }
});
socket.on("message", data => {
    board = data.board;
    getBoard()
});

function getBoard() {
    var grassImage = new Image(100, 100);
    grassImage.src = './Images/index.jpg';
    var size = (canvas.width / board.length) > (canvas.height / board[0].length) ? (canvas.height / board[0].length) : (canvas.width / board.length);
     for(let i = 0; i < board.length; i++)
     {
         for(let i2 = 0; i2 < board[i].length; i2++)
         {
             if(board[i][i2] == "Empty")
             {
                ctx.strokeRect((i*size), (i2*size), size, size);
            }
            else if(board[i][i2] == "Virus")
            {
                ctx.drawImage(virusImage, (i*size), (i2*size), size, size);
             }
         }         
     }
}
function clicked(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    var size = (canvas.width / board.length) > (canvas.height / board[0].length) ? (canvas.height / board[0].length) : (canvas.width / board.length);
    var x = Math.floor((mouseX/size))
    var y = Math.floor((mouseY/size))
    console.log(x)
    console.log(y)
    console.log(board[x][y])
    if(board[x][y] == "Empty")
    {
        console.log("hello")
        board[x][y] == "Pillar"
        ctx.drawImage(virusImage, (x*size), (y*size), size, size);
    }
}
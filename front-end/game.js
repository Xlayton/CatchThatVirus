const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
const socket = io(`${location.origin}`, {
    path: '/game',
});
socket.on("message", data => {
    console.log(data)
    console.log("CORS sucks ass")
});

function getBoard() {
    var myImage = new Image();
    myImage.src = './Images/cat.png';
    ctx.drawImage(myImage, 0, 0, 150, 180);
    // var board = [15][15]
    // var i
    // for(i = 0; i < board.length; i++)
    // {
    //     board[i].forEach(element => {
    //         canvas.drawImage("./Images/cat.png", 0 , 0)
    //     })
    // }
}
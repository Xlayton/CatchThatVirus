const lobbyName = document.getElementById("lobbyName")
const boardWidth = document.getElementById("boardWidth")
const boardHeight = document.getElementById("boardHeight")
const createBtn = document.getElementById("createLobbyBtn")

function urlId(id) {
    window.location.replace(`http://localhost:3000/game.html?id=${id}`);
}

createBtn.addEventListener("click", () => {
    fetch(`${location.origin}/api/lobbies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: lobbyName.value,
                boardwidth: boardWidth.value,
                boardheight: boardHeight.value,
            })
        }).then(res => res.json())
        .then(data => {
            let list = document.getElementById("lobbyList")
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
            for (let element of data) {
                console.log(element)
                let lobby = document.createElement("div")
                lobby.classList.add("lobby-div");
                let lobbyName = document.createElement("h2")
                lobbyName.innerText = element.name
                lobbyName.classList.add("lobby-name")
                let lobbyId = document.createElement("p")
                lobbyId.innerText = `Id: ${element.id}`
                lobbyId.classList.add("lobby-id")
                let joinBtn = document.createElement("button")
                joinBtn.innerText = "Join"
                joinBtn.addEventListener("click", () => urlId(element.id))
                joinBtn.classList.add("join-lobby-btn")
                lobby.append(lobbyName, lobbyId, joinBtn)
                document.getElementById("lobbyList").append(lobby)
            }
        })
})

fetch(`${location.origin}/api/lobbies`)
    .then(res => res.json())
    .then(data => {
        for (let element of data) {
            console.log(element)
            let lobby = document.createElement("div")
            let lobbyName = document.createElement("h2")
            lobbyName.innerText = element.name
            lobbyName.classList.add("lobby-name")
            let lobbyId = document.createElement("p")
            lobbyId.innerText = `Id: ${element.id}`
            lobbyId.classList.add("lobby-id")
            let joinBtn = document.createElement("button")
            joinBtn.innerText = "Join"
            joinBtn.addEventListener("click", () => urlId(element.id))
            joinBtn.classList.add("join-lobby-btn")
            lobby.append(lobbyName, lobbyId, joinBtn)
            document.getElementById("lobbyList").append(lobby)
        }
    })
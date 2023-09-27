const homepage = () =>{
    document.getElementById("home").style.display = "block";
    document.getElementById("shop").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("guestbook").style.display = "none";
    document.getElementById("gamelog").style.display = "none";

}

const showshop = () =>{
    document.getElementById("home").style.display = "none";
    document.getElementById("shop").style.display = "block";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("guestbook").style.display = "none";
    document.getElementById("gamelog").style.display = "none";

}

const register = () =>{
    document.getElementById("home").style.display = "none";
    document.getElementById("shop").style.display = "none";
    document.getElementById("register").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("guestbook").style.display = "none";
    document.getElementById("gamelog").style.display = "none";

}

const login = () =>{
    document.getElementById("home").style.display = "none";
    document.getElementById("shop").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("game").style.display = "none";
    document.getElementById("guestbook").style.display = "none";
    document.getElementById("gamelog").style.display = "none";

}

const game = () =>{
    document.getElementById("home").style.display = "none";
    document.getElementById("shop").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("guestbook").style.display = "none";
    document.getElementById("gamelog").style.display = "none";

}

const guestbook = () =>{
    document.getElementById("home").style.display = "none";
    document.getElementById("shop").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("guestbook").style.display = "block";
    document.getElementById("gamelog").style.display = "none";
}

const gamelog = () => {
    document.getElementById("home").style.display = "none";
    document.getElementById("shop").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("guestbook").style.display = "none";
    document.getElementById("gamelog").style.display = "block";
    loadgamelog();
}
const writeComment = () => {
    let c = {"comment":document.getElementById("com").value, "name":document.getElementById("username").value}
    fetch("https://cws.auckland.ac.nz/gas/api/Comment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(c)
    }).then(() => getComments());
}
const getComments = () => {
    const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/Comments", {
        headers: {
            'Content-Type': 'text/html'
        }
    });
    const streamPromise = fetchPromise.then((Response) => Response.text());
    streamPromise.then((data) => {document.getElementById('getComments').innerHTML = data;})
}
const purchaseItem = (name) => {
    if (loggedin){
        alert("Thank you " + username + "! You have successfully purchased " + name)
    }
    else{
        alert("Please Log In")
    }
}
const AllItems = () => {
    const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/AllItems");
    const streamPromise = fetchPromise.then((Response) => Response.json());
    streamPromise.then((data) => ShowItems(data));
}
const ShowItems = (items) => {
    let table = '<th>Photo</th><th>Name</th><th>Description</th><th>Price</th><th></th>'
    
    const eachItem = (x) => {
        table += `<tr><td><img src="https://cws.auckland.ac.nz/gas/api/ItemPhoto/${x.id}" width="90"></td><td style="text-align: center;">${x.name}</td><td>${x.description}</td><td style="text-align: center;">${x.price}</td><td><button onclick="purchaseItem('${x.name}')">Purchase Item</tr>`
        document.getElementById("shopbody").innerHTML=table;
    }
    items.forEach((x)=>eachItem(x))
}
const Search = () => {
    //get the value from search box
    let input = document.getElementById("searchForItem").value;
    if (input == ""){
        AllItems();
    }
    else{
        const fetchPromise = fetch(`https://cws.auckland.ac.nz/gas/api/Items/${input}`);
        const streamPromise = fetchPromise.then((Response) => Response.json());
        streamPromise.then((data) => {
            if (data.length == 0) {
                document.getElementById("shopbody").innerHTML="";
            }
            else{
                ShowItems(data)
            }
        });
    }
    
}

const Register = () => {
    //get inputs from register page
    let newUser = {"username":document.getElementById("newusername").value, "password":document.getElementById("newpassword").value, "address":document.getElementById("newaddy").value}
    fetch("https://cws.auckland.ac.nz/gas/api/Register",{
        method: "POST",
        headers: {'Content-Type': 'application/json', 'Accept': 'text/plain'},
        body: JSON.stringify(newUser)
    }).then((responsebody) => responsebody.text()).then((responsebody) => document.getElementById("response").innerText = responsebody)
}
let loggedin = false;
let username = ""
let password = ""
let GameID = ""
let PreviousMove = ""
const Login = () => {
    username = document.getElementById("u").value;
    password = document.getElementById("pw").value;
    //return the authentication result, sourced from Ed #394
    fetch('https://cws.auckland.ac.nz/gas/api/VersionA',{
        headers:{'Authorization': 'Basic ' + btoa(`${username}:${password}`),}
    }).then(data => data.text())
    .then((data) => {
        if (data.includes("(auth)")){
            document.getElementById("isloggedin").innerHTML = `Hello! ${username} <button onclick="Logout()">Logout</button>`
            document.getElementById("loginresponse").innerText = "User Successfully Logged in"
            loggedin = true;
        }
        else{
            document.getElementById("loginresponse").innerText = "Login Failed! Please check your username and password!"
        }
    });
}
const Logout = () => {
    document.getElementById("isloggedin").innerHTML = ``
    document.getElementById("loginresponse").innerText = ""
    loggedin = false;
}
const gameMove = (event) => {
    //use data transfer set method https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData
    event.dataTransfer.setData("text/plain", event.target.id)

}
const placedown = (event) => {
    //drop the event
    if (event.dataTransfer !== null){
        if (!event.target.id) {
            event.target.appendChild(document.getElementById(event.dataTransfer.getData("text/plain")))
        }
        
    }
}
const dragOver = (event) => {
    //drag the event
    event.preventDefault();
}
const takedown = (event) => {
    //drag and drop the event to the bin and disappears
    if (event.dataTransfer !== null){
        if (!event.target.id) {
            document.getElementById(event.dataTransfer.getData("text/plain")).remove()
        }
        
    }
}
const PlayGame = () => {
    if (loggedin){
        const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/PairMe", {
            method: "GET",
            headers:{'Content-Type': 'application/json; charset=utf-8', 'Authorization': 'Basic ' + btoa(`${username}:${password}`),}
        }).then((data) => data.json())
        fetchPromise.then((status) => {
            GameID = status.gameId;
            console.log(status);
            
            if (status.state === "wait") {
                console.log("current state is wait, " + status.player1);
                document.getElementById("gamepageresponse").innerText = "Currently waiting for a player to join, thank you for your patience."
            }
            else{
                document.getElementById("PlayGame").style.display = "none";
                if (username === status.player1) {
                    document.getElementById("MyMove").style="width: 25%; text-align: center; color: black; background-color: azure; display: 'block';"
                    document.getElementById("Quit").style="width: 25%; text-align: center; color: black; background-color: snow; display: 'block';"
                    document.getElementById("gamepageresponse").innerText = `Dear ${username}, you are now in game, your opponent is ${status.player2}`
                    console.log(username + " vs " + status.player2);

                }
                else{
                    document.getElementById("MyMove").style="width: 25%; text-align: center; color: black; background-color: azure; display: 'block';"
                    document.getElementById("Quit").style="width: 25%; text-align: center; color: black; background-color: snow; display: 'block';"
                    document.getElementById("gamepageresponse").innerText = `Dear ${username}, you are now in game, your opponent is ${status.player1}`
                    console.log(status.player1 + "vs" + username);

                }
            }
        })
    }
    else{
        alert("Please Log In")
    }
}
const MyMove = () => {
    let newMove = {
        "gameID": GameID,
        "move": document.getElementById("container").innerHTML
    }
    if (PreviousMove === document.getElementById("container").innerHTML){
        document.getElementById("gamepageresponse").innerText = `You have not move yet, please try again.`
    }
    else{
        console.log(document.getElementById("container").innerHTML)
        const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/MyMove", {
            method: "POST",
            headers:{'Content-Type': 'application/json; charset=utf-8', 'Authorization': 'Basic ' + btoa(`${username}:${password}`),},
            body: JSON.stringify(newMove)
        }).then((data) => data.text())
        document.getElementById("MyMove").style.display = "none";
        document.getElementById("TheirMove").style="width: 25%; text-align: center; color: black; background-color: azure; display: 'block';"
        PreviousMove = document.getElementById("container").innerHTML;
        document.getElementById("gamepageresponse").innerText = `Your move has been published.`

    }
}
const TheirMove = () => {
    const fetchPromise = fetch(`https://cws.auckland.ac.nz/gas/api/TheirMove?gameId=${GameID}`, {
        method: "GET",
        headers:{'Authorization': 'Basic ' + btoa(`${username}:${password}`),},
    }).then((data) => data.text())
    .then(idresponse => {
        if (idresponse === "(no such gameId)"){
            document.getElementById("gamepageresponse").innerText = `No Such Game ID.`
        }
        else if (idresponse !== ""){
            document.getElementById("MyMove").style="width: 25%; text-align: center; color: black; background-color: azure; display: 'block';"
            document.getElementById("TheirMove").style.display = "none";
            document.getElementById("gamepageresponse").innerText = `Your opponent moved.`
            document.getElementById("container").innerHTML = idresponse;
        
        }
        else{
            document.getElementById("gamepageresponse").innerText = `Your opponent has not moved yet`
        }
        
        PreviousMove = document.getElementById("container").innerHTML;

    })
}
const Quit = () => {
    const fetchPromise = fetch(`https://cws.auckland.ac.nz/gas/api/QuitGame?gameId=${GameID}`, {
        method: "GET",
        headers:{'Authorization': 'Basic ' + btoa(`${username}:${password}`),},
    })
    const streamPromise = fetchPromise.then((Response) => Response.text());
    streamPromise.then((data) => {document.getElementById('gamepageresponse').innerText = "Game Over";})
    document.getElementById("Quit").style.display = "none";
    document.getElementById("MyMove").style.display = "none";
    document.getElementById("TheirMove").style.display = "none";

    document.getElementById("PlayGame").style="width: 25%; text-align: center; color: black; background-color: azure; display: 'block';"

}
const loadgamelog = () => {
    document.getElementById("gl").style.display = "block";
    
    const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/GameLog");
    const streamPromise = fetchPromise.then((Response) => Response.json());
    streamPromise.then((data) => showlogtext(data));
    
}
const showlogtext = (data) => {
    //logstr += '<line x1="90" y1="20" x2="90" y2="180" stroke="black" stroke-width="2" />'
    //logstr += '<line x1="89" y1="180" x2="320" y2="180" stroke="black" stroke-width="2" />'
    //logstr += '<polyline points="90,20 90,180 320,180 320,20 89,20" fill="none" stroke="black" />'
    var gamesplayed = [];
    var gamescompleted = [];
    var lowest = 0;
    var highest = 0;
    let oldest = ""
    let newest = ""
    

    const add = (x) => {
        gamesplayed.push(x.played)
        gamescompleted.push(x.completed)
        if (x == data[0]) {
            oldest = x.date
            console.log("Oldest game: " + oldest);
        }
        else if (x == data[data.length - 1]) {
            newest = x.date
            console.log("Newest game: " + newest);
        }
        if (x.played > highest) {
            highest = x.played
        }
        if (lowest == 0) {
            lowest = x.completed
        }
        else if (x.completed < lowest) {
            lowest = x.completed
        }
    }
    data.forEach((x)=>add(x))
    let logstr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 ${highest + 20}"><rect fill="lightgray" x="75" y="10" height="${highest - lowest + 40}", width="250"></rect>`
    logstr += `<rect fill="none" stroke="black" x="90" y="20" height="${highest - lowest}", width="230" />`
    logstr += `<text x="188" y="16" style="font-size: 5px;">Game Log</text>`
    logstr += `<text x="79" y="${highest - lowest + 20}" style="font-size: 5px;">${lowest}</text><text x="79" y="22" style="font-size: 5px;">${highest}</text>`
    let playedtext = "Played:\n"
    let completedtext = "Completed:\n"
    var start = 90;
    var end = 320;
    var div = (end - start)/(gamesplayed.length - 1);
    //console.log(div)
    for (var i = 0; i < gamesplayed.length; i++) {
        if (i !== gamesplayed.length - 1) {
            logstr += `<line x1="${start}" y1="${highest - (gamesplayed[i] - 20)}" x2="${start + div}" y2="${highest - (gamesplayed[i + 1] - 20)}" stroke="red" />`;
            //logstr += `<text x="${start + div}" y="${highest - (gamesplayed[i + 1] - 20)}" style="font-size: 5px;">${gamesplayed[i + 1]}</text>`

        }

        start += div;
    }
    var start = 90;
    for (var i = 0; i < gamescompleted.length; i++) {
        if (i !== gamescompleted.length - 1) {
            logstr += `<line x1="${start}" y1="${highest - (gamescompleted[i] - 20)}" x2="${start + div}" y2="${highest - (gamescompleted[i + 1] - 20)}" stroke="green" />`;
            //logstr += `<text x="${start + div}" y="${highest - (gamescompleted[i + 1] - 20)}" style="font-size: 5px;">${gamescompleted[i + 1]}</text>`
        }
        
        start += div;
    }
    logstr += `<text x="90" y="${highest - lowest + 30}" style="font-size: 3px;">${oldest}</text><text x="303" y="${highest - lowest + 30}" style="font-size: 3px;">${newest}</text>`
    logstr += `<text x="90" y="${highest - lowest + 40}" style="font-size: 3px;">Played</text><line x1="110" y1="${highest - lowest + 39}" x2="120" y2="${highest - lowest + 39}" stroke="red" stroke-width="2" />`
    logstr += `<text x="90" y="${highest - lowest + 45}" style="font-size: 3px;">Completed</text><line x1="110" y1="${highest - lowest + 44}" x2="120" y2="${highest - lowest + 44}" stroke="green" stroke-width="2" />`

    for (var i = 0; i < gamesplayed.length; i++) {
        //console.log(gamesplayed[i]);
        if (i == gamesplayed.length - 1) {
            playedtext += `${gamesplayed[i]}`
        }
        else{
            playedtext += `${gamesplayed[i]},`
        }
    }
    for (var i = 0; i < gamescompleted.length; i++) {
        //console.log(gamescompleted[i]);
        if (i == gamescompleted.length - 1) {
            completedtext += `${gamescompleted[i]}`
        }
        else{
            completedtext += `${gamescompleted[i]},`
        }
    }
    logstr += "</svg>"
    console.log("y min: " + lowest)
    console.log("y max: " + highest)
    document.getElementById('gl').innerHTML = logstr;
    document.getElementById('played').innerText = playedtext;
    document.getElementById('completed').innerText = completedtext;

}
const initialize = () => {

    AllItems();
    homepage();
    PreviousMove = document.getElementById("container").innerHTML
}
window.onload = initialize;
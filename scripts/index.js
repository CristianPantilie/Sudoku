var gridul = [[5, 3, -1, -1, 7, -1, -1, -1, -1],
    [6, -1, -1, 1, 9, 5, -1, -1, -1],
    [-1, 9, 8, -1, -1, -1, -1, 6, -1],
    [8, -1, -1, -1, 6, -1, -1, -1, 3],
    [4, -1, -1, 8, -1, 3, -1, -1, 1],
    [7, -1, -1, -1, 2, -1, -1, -1, 6],
    [-1, 6, -1, -1, -1, -1, 2, 8, -1],
    [-1, -1, -1, 4, 1, 9, -1, -1, 5],
    [-1, -1, -1, -1, 8, -1, -1, 7, 9]];

var playing = false;
var totalTime;
var intervalId;
var keysCounter = 0;
var player;
var filteredScoreboard = false;
var addedGrids;

window.onload = function () {
    showScoreboard();
    getGrids();
};

function gridChange(option){
    const gridName = option.value;
    for(const grid of addedGrids){
        if(grid.name === gridName){
            console.log(gridul);
            gridul = grid.configuration;
            console.log(gridul);
            return;
        }
    }
}

function showGridsMenu(grids) {
    let optionText = "";
    for(const grid of grids){
        optionText += "<option value="+
                            "'" + grid.name + "'>" +
                             grid.name + "</option>";
    }
    $("#gridOptions").append(optionText);
}

function getGrids(){
    $.ajax({
        url: "http://localhost:3000/api/grids",
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            addedGrids = res;
            showGridsMenu(res);
        }
    });

}

document.onkeydown = function(e) {
    if(playing) {
        let keyPressed = e.key;
        let currentCell = keyNavigation(keyPressed);
        if (!currentCell)
            return;

        if (currentCell.id.attr('class').includes('divTableCellSelectable')) {
            if (parseInt(keyPressed) > 0 && parseInt(keyPressed) < 10) {
                let numberEntered = parseInt(keyPressed);
                if (check(gridul, currentCell.row, currentCell.column, numberEntered)) {
                    currentCell.id.text(keyPressed);
                    currentCell.id.addClass("userInput");
                    gridul[currentCell.row][currentCell.column] = numberEntered;
                }
                keysCounter++;
            } else if (keyPressed === 'Backspace') {
                currentCell.id.text('_');
            } else if (keyPressed === 'ArrowRight' || keyPressed === 'ArrowLeft' || keyPressed === 'ArrowDown' || keyPressed === 'ArrowUp') {
                //do nothing for the arrow keys
            } else {
                alert('You must write a number between 1 and 9 or backspace to delete.')
            }
        } else {
            alert('You must write in a valid cell.');
        }
    }
};

function updateTimer(initTime){
    let now = new Date();
    let milis = now.getTime() - initTime;
    totalTime = milis;

    let secs = Math.floor((milis % (1000 * 60)) / 1000);
    let mins = Math.floor((milis % (1000 * 60 * 60)) / (1000 * 60));
    let hours = Math.floor((milis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    $("#timer").html(
        (hours < 9 ? "0" + hours : hours) + ":" +
        (mins < 9 ? "0" + mins : mins) + ":" +
        (secs < 9 ? "0" + secs : secs)
    );
}

function initTimer() {
    let initTime = new Date().getTime();
    updateTimer();
    intervalId = window.setInterval(updateTimer, 1000, initTime);
}

function end() {
    playing = false;
    $("#totalTime").html(totalTime);
    window.clearInterval(intervalId);
    $("#counter").html("Score: " + keysCounter);

    addScore(player, keysCounter);

}

function addScore(user, score){
    let userScore = {
        "user": user,
        "score": score,
    };
    $.ajax({
        url: 'http://localhost:3000/api/users',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(userScore),
        processData: false,
        success: function () {
            showScoreboard();
            console.log("ok");
        },
        error: function () {
            console.log("Error")
        },
    });
}

function start(){

    playing = true;
    initTimer();
    player = localStorage.getItem("user");
    $("#scoreboard").hide();
    $("#gridOptions").hide();
    showGrid(gridul);
}

function showScoreboard(){
    $("#grid").hide();
    $("#scoreboard").show();
    $.ajax({
        url: "http://localhost:3000/api/users",
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            drawTable(res);
        }
    });
}

function drawTable(totalUsers){
    let table = "<table>" +
        "<tr>" +
        "<td>Place</td>" +
        "<td>Name</td>" +
        "<td>Score</td>" +
        "</tr><tbody>";
    for(let i = 0; i < totalUsers.length; i++){
        if(!filteredScoreboard || totalUsers[i].score > 0){
            table += "<tr>\n" +
                "<td>" + (i + 1) + "</td>\n" +
                "<td>" + totalUsers[i].username + "</td>\n" +
                "<td>" + totalUsers[i].score + "</td>\n" +
                "</tr>";
        }
    }
    table += "</tbody></table>";
    const button = "<button onclick=\"filterScoreboard()\">\n" +
        "            Filter by score\n" +
        "        </button>";
    $("#scoreboard").html(table + button);
}

function filterScoreboard() {
    filteredScoreboard = !filteredScoreboard;
    showScoreboard();
}
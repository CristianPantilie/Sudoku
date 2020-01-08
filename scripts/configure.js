
var gridConfigurat;
var gridFinal;
var editable = false;

window.onload = function () {
    gridConfigurat = emptyGrid;
    gridFinal = emptyGrid;
    showGrid(gridConfigurat);
};

function makeEditable(){
    editable = true;
}

function makeUneditable(){
    editable = false;
}

document.onkeydown = function(e) {

    if(!editable){
        return;
    }

    let keyPressed = e.key;
    let currentCell = keyNavigation(keyPressed);
    if (!currentCell)
        return;

    if (currentCell.id.attr('class').includes('divTableCellSelectable')) {
        if (parseInt(keyPressed) > 0 && parseInt(keyPressed) < 10) {
            let numberEntered = parseInt(keyPressed);
            if (check(gridConfigurat, currentCell.row, currentCell.column, numberEntered)) {
                currentCell.id.text(keyPressed);
                currentCell.id.addClass("userInput");
                gridConfigurat[currentCell.row][currentCell.column] = numberEntered;
            }
            keysCounter++;
        }
        else if (keyPressed === 'Enter'){
            const cellNumber = currentCell.id.text();
            if(cellNumber !== "_"){
                currentCell.id.removeClass("divTableCellSelectable");
                currentCell.id.addClass("divTableCellImmutable");
                gridFinal[currentCell.row][currentCell.column] = parseInt(cellNumber);
            }
        }
        else if (keyPressed === 'Backspace') {
            currentCell.id.text('_');
        } else if (keyPressed === 'ArrowRight' || keyPressed === 'ArrowLeft' || keyPressed === 'ArrowDown' || keyPressed === 'ArrowUp') {
            //do nothing for the arrow keys
        } else {
            alert('You must write a number between 1 and 9 or backspace to delete.')
        }
    } else {
        alert('You must write in a valid cell.');
    }

};

function finish() {
    let grid = {
        "name": $("#gridName").val(),
        "configuration": gridConfigurat,
    };
    $.ajax({
        url: 'http://localhost:3000/api/grids',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(grid),
        processData: false,
        success: function () {
            console.log("ok");
        },
        error: function () {
            console.log("Error")
        },
    });
}


const gridLines = 9;
const gridColumns = 9;
const emptyGrid = [[-1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1]];


function showGrid(grid) {
    $("#grid").show();
    let bigTable = '<div class = "divTable"><div class = "divTableBody">';

    for(let i = 0; i < gridLines / 3; i++){
        bigTable += '<div class = "divTableRow">';
       for(let j = 0; j < gridColumns / 3; j++){
           bigTable += '<div class = "divBigTableCell">';

           let smallTable = '<div class = "divSmallTable">';
           for(let ii = 0; ii < gridLines / 3 ; ii++){
               smallTable += '<div class = "divTableRow">';
               for(let jj = 0; jj < gridColumns / 3; jj++){
                   let x = i * gridLines / 3 + ii;
                   let y = j * gridColumns / 3 + jj;
                   let element = grid[x][y];

                   if(element < 0){
                       smallTable += '<div class = "divTableCellSelectable" id = ' + x.toString() + y.toString() +'>';
                       smallTable += "_";
                   }
                   else{
                       smallTable += '<div class = "divTableCellImmutable" id = ' + x.toString() + y.toString() +'>';
                       smallTable += element;
                   }
                   smallTable += '</div>';
               }
               smallTable += '</div>';
           }
           smallTable += '</div>';

           bigTable += smallTable;

           bigTable += '</div>';
       }
       bigTable += '</div>';
    }

    bigTable += '</div>';



    let container = document.querySelector("#grid");
    container.innerHTML += bigTable;


    changeCellWithMouse();

}

function changeCellWithMouse(){
    $('div[class*=divTableCell]').on("mouseover", function () {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        $('.invalidated').removeClass("invalidated");
    })
}

function changeCellWithKeyboard(currentRow, currentColumn, keyPressed){
    switch (keyPressed) {
        case 'ArrowLeft':
            shiftCell(currentRow, 0, currentColumn, -1);
            return true;
        case 'ArrowRight':
            shiftCell(currentRow, 0, currentColumn, 1);
            return true;
        case 'ArrowUp':
            shiftCell(currentRow, -1, currentColumn, 0);
            return true;
        case 'ArrowDown':
            shiftCell(currentRow, 1, currentColumn, 0);
            return true;
    }
}

function keyNavigation(keyPressed){
    $('.invalidated').removeClass("invalidated");

    let selected =  $('.selected');
    if(selected.length === 0){
        $('#00').addClass('selected');
    }

    let currentPos = selected.attr('id');
    let currentRow = parseInt(currentPos[0]);
    let currentColumn = parseInt(currentPos[1]);

    if(changeCellWithKeyboard(currentRow, currentColumn, keyPressed)){
        return;
    }

    return {
        row: currentRow,
        column: currentColumn,
        id: selected
    };
}


function shiftCell(currentRow, rowShift, currentColumn, columnShift){

    let newCellRow = parseInt(currentRow) + parseInt(rowShift);
    newCellRow  = (newCellRow + gridLines) % gridLines;     //pentru wrap-around

    let newCellColumn = parseInt(currentColumn) + parseInt(columnShift);
    newCellColumn = (newCellColumn + gridColumns) % gridColumns;

    let newCellID = '#' + newCellRow.toString() + newCellColumn.toString();

    $('.selected').removeClass('selected');
    $(newCellID).addClass('selected');
}


function check(grid, row, column, number){
    let valid = true;

    if(!checkRow(grid, row, number))
        valid = false;
    if(!checkColumn(grid, column, number))
        valid = false;
    if(!checkSquare(grid, row, column, number))
        valid = false;

    return valid;
}

function checkRow(grid, row, number){
    let valid = true;
    let rowSum = 0;
    for(let i = 0; i < gridColumns; i++){
        if(grid[row][i] === number) {
            let cellID = '#' + row.toString() + i.toString();
            $(cellID).addClass("invalidated");
            valid =  false;
        }

        if(grid[row][i] > 0)
            rowSum += grid[row][i];
    }
    return valid;
}

function checkColumn(grid, column, number){
    let valid = true;

    for(let i = 0; i < gridLines; i++){
        if(grid[i][column] === number) {
            let cellID = '#' + i.toString() + column.toString();
            $(cellID).addClass("invalidated");
            valid = false;
        }
    }
    return valid;
}

function checkSquare(grid, row, column, number){
    let valid = true;

    let squarePosX = parseInt(row / 3 ) * 3;
    let squarePosY = parseInt(column / 3) * 3;

    for(let i = squarePosX; i < squarePosX + 3; i++){
        for(let j = squarePosY; j < squarePosY + 3; j++){
            if(grid[i][j] === number) {
                let cellID = '#' + i.toString() + j.toString();
                $(cellID).addClass("invalidated");
                valid = false;
            }
        }
    }
    return valid;
}

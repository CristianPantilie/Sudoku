

var gridLines = 9;
var gridColumns = 9;
var SUM = 45;
var grid = [[5, 3, -1, -1, 7, -1, -1, -1, -1],
            [6, -1, -1, 1, 9, 5, -1, -1, -1],
            [-1, 9, 8, -1, -1, -1, -1, 6, -1],
            [8, -1, -1, -1, 6, -1, -1, -1, 3],
            [4, -1, -1, 8, -1, 3, -1, -1, 1],
            [7, -1, -1, -1, 2, -1, -1, -1, 6],
            [-1, 6, -1, -1, -1, -1, 2, 8, -1],
            [-1, -1, -1, 4, 1, 9, -1, -1, 5],
            [-1, -1, -1, -1, 8, -1, -1, 7, 9]];



window.onload = function(){
    showGrid();
};

function showGrid()
{
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
                       // smallTable += '<input class = "inputBox" type = "text" placeholder="_"/>';
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

    $('div[class*=divTableCell]').on("mouseover", function () {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        $('.invalidated').removeClass("invalidated");

    })

}


document.onkeydown = function (e) {
    $('.invalidated').removeClass("invalidated");

  if($('.selected').length === 0){
      $('#00').addClass('selected');
  }

  let currentPos = $('.selected').attr('id');
  let currentRow = parseInt(currentPos[0]);
  let currentColumn = parseInt(currentPos[1]);

  let keyPressed = e.key;

  switch (keyPressed) {
      case 'ArrowLeft':
          shiftCell(currentRow, 0, currentColumn, -1);
          return;
      case 'ArrowRight':
          shiftCell(currentRow, 0, currentColumn, 1);
          return;
      case 'ArrowUp':
          shiftCell(currentRow, -1, currentColumn, 0);
          return;
      case 'ArrowDown':
          shiftCell(currentRow, 1, currentColumn, 0);
          return;
  }

  if($('.selected').attr('class').includes('divTableCellSelectable')){
      if((keyPressed > 0 && keyPressed < 10)){

          let number = parseInt(keyPressed);
          if(check(currentRow, currentColumn, number)) {
              $('.selected').text(keyPressed);
              $('.selected').addClass("userInput");
              grid[currentRow][currentColumn] = number;
              // $('.selected').removeClass('divTableCellSelectable');
              // $('.selected').addClass('divTableCellImmutable');
          }

      }
      else if(keyPressed === 'Backspace'){
          $('.selected').text('_');
      }
      else{
          alert('You must write a number between 1 and 9 or backspace to delete.')
      }

  }
  else{
      alert('You must write in a valid cell.');
  }

};

function shiftCell(currentRow, rowShift, currentColumn, columnShift){

    let newCellRow = parseInt(currentRow) + parseInt(rowShift);
    newCellRow  = (newCellRow + gridLines) % gridLines;

    let newCellColumn = parseInt(currentColumn) + parseInt(columnShift);
    newCellColumn = (newCellColumn + gridColumns) % gridColumns;

    let newCellID = '#' + newCellRow.toString() + newCellColumn.toString();

    $('.selected').removeClass('selected');
    $(newCellID).addClass('selected');
}




function check(row, column, number){
    let valid = true;

    if(!checkSquare(row, column, number))
        valid = false;
    if(!checkRow(row, number))
        valid = false;
    if(!checkColumn(column, number))
        valid = false;

    return valid;
}

function checkRow(row, number){
    let valid = true;
    let rowSum = 0;
    for(let i = 0; i < gridColumns; i++){
        if(grid[row][i] === number) {
            let cellID = '#' + row.toString() + i.toString();
            $(cellID).addClass("invalidated");
            // $(cellID).css("background-color", "red");
            valid =  false;
        }

        if(grid[row][i] > 0)
            rowSum += grid[row][i];
    }
    return valid;
}

function checkColumn(column, number){
    let valid = true;

    for(let i = 0; i < gridLines; i++){
        if(grid[i][column] === number) {
            let cellID = '#' + i.toString() + column.toString();
            $(cellID).addClass("invalidated");
            // $(cellID).css("background-color", "red");
            valid = false;
        }
    }
    return valid;
}

function checkSquare(row, column, number){
    let valid = true;

    let squarePosX = parseInt(row / 3 ) * 3;
    let squarePosY = parseInt(column / 3) * 3;

    for(let i = squarePosX; i < squarePosX + 3; i++){
        for(let j = squarePosY; j < squarePosY + 3; j++){
            if(grid[i][j] === number) {
                let cellID = '#' + i.toString() + j.toString();
                $(cellID).addClass("invalidated");
                // $(cellID).css("background-color", "red");
                valid = false;
            }
        }
    }
    return valid;
}

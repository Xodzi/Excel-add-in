/* global Excel console */

// Вот этот пиздец, написанный chat gpt, обрабатывает диапазоны в функциях и заменяет их массивами названий ячеек
function convertRanges(formula) {
  return formula.replace(/([A-Z]+\d+):([A-Z]+\d+)/g, function(match, start, end) {
      return createArrayFromRange(start, end);
  });
}

function createArrayFromRange(start, end) {
  var startCell = parseCell(start);
  var endCell = parseCell(end);
  var array = [];

  for (var i = startCell.row; i <= endCell.row; i++) {
      for (var j = startCell.column.charCodeAt(0); j <= endCell.column.charCodeAt(0); j++) {
          array.push(createCellName(i, String.fromCharCode(j)));
      }
  }

  return '{' + array.join(';') + '}';
}

function parseCell(cell) {
  var column = cell.match(/[A-Z]+/)[0];
  var row = parseInt(cell.match(/\d+/)[0]);
  return { column: column, row: row };
}

function createCellName(row, column) {
  return column + row;
}

const insertText = async () => {
  
  try {
    Excel.run(async (context) => {
      let range = context.workbook.getSelectedRange();
      range.load("formulas");
      await context.sync();
      var lettersFormula = convertRanges(range.formulas[0][0]); // Take cells formula like a string

      //________________________________________________ convert string formula to formula with numbers
      var cells = lettersFormula.match(/[A-Za-z]+\d+/g);
      var cellsMap = new Map();

      for (var i = 0; i < cells.length; i++) {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        var range2 = sheet.getRange(cells[i]);
        range2.load("text");
        await context.sync();
        if (range2.text[0][0] == "") cellsMap.set(cells[i], 0);
        else cellsMap.set(cells[i], range2.text[0][0]);
      }

      // replace cells names in formula
      var valuesFormula = lettersFormula;
      cellsMap.forEach((value, key) => {
        const regex = new RegExp(key, 'g');
        valuesFormula = valuesFormula.replace(regex, value);
      }); 
      //________________________________________________

      let dialog; // Declare dialog as global for use in later functions.
      Office.context.ui.displayDialogAsync('https://localhost:3000/taskpane.html?dialogID=15&lettersFormula=' + lettersFormula + '&valuesFormula' + valuesFormula, {height: 30, width: 20},
          function (asyncResult) {
              dialog = asyncResult.value;
              dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
          }
      )
    });
  } catch (error) {
    console.log("Error: " + error);
  }
};

export default insertText;
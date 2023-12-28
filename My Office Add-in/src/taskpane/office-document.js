import {parse, visit} from 'excel-formula-parser';

/* global Excel console */

// functions for ranges convert to values arrays
//------------------------------------------------
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

  return array.join(',');
}

function parseCell(cell) {
  var column = cell.match(/[A-Z]+/)[0];
  var row = parseInt(cell.match(/\d+/)[0]);
  return { column: column, row: row };
}

function createCellName(row, column) {
  return column + row;
}

//------------------------------------------------


// function for formulas split (вот это ересь надо довести до ума, потому что она неправильно сплитует строку)
//------------------------------------------------







function traverseTree(node, depth = 0) {
        
  if (node.arguments != undefined && node.arguments.length > 0) {
    console.log(`${"  ".repeat(depth)}${node.name} - Depth: ${depth}`);
    node.arguments.forEach((childNode) => {
      console.log(node, depth)
      traverseTree(childNode, depth + 1);

    });
  }
  else{
    console.log(node);
  }
}







//------------------------------------------------

//var valuesFormulaArray = ["SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))", "SUM(1,2)", "ABS(4)", "3", "AVERAGE(MAX(8,1,5),SUM(4,3,7))", "MAX(8,1,5)", "SUM(4,3,7)"];


// main function
//------------------------------------------------
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
        var valuesRange = sheet.getRange(cells[i]);
        valuesRange.load("text");
        await context.sync();
        if (valuesRange.text[0][0] == "") cellsMap.set(cells[i], 0);
        else cellsMap.set(cells[i], valuesRange.text[0][0]);
      }

      // replace cells names in formula
      var valuesFormula = lettersFormula;
      cellsMap.forEach((value, key) => {
        const regex = new RegExp(key, 'g');
        valuesFormula = valuesFormula.replace(regex, value);
      }); 
      //________________________________________________


      //________________________________________________ create arrays with split formulas (сначала надо довести до ума функцию, которая сплитует нашу строку)
      //const lettersFormulaArray = parse(lettersFormula);
      //const valuesFormulaArray = parse(valuesFormula);
      //console.log(lettersFormulaArray);
      //console.log(valuesFormulaArray);
      var testFormula = "SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))";
      const tree = parse(testFormula);
      console.log(tree);
      traverseTree(tree,0)
      //________________________________________________


      //________________________________________________ create array with pieces formulas and calculate their values
      // example of ideal formula split (здесь должна использоваться именно valuesFormulaArray, потому что по ней ведутся дальнейшие вычисления и создание formulasValuesMap)
      var valuesFormulaArray = ["SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))", "SUM(1,2)", "ABS(4)", "3", "AVERAGE(MAX(8,1,5),SUM(4,3,7))", "MAX(8,1,5)", "SUM(4,3,7)"];
      context.workbook.worksheets.getItemOrNullObject("SpecialCalculationField").delete(); // delete old calculation field
      const creatFieldSheet = context.workbook.worksheets.add("SpecialCalculationField"); // add new calculation field

      var formulasValuesMap = new Map();

      for (var i=0; i<valuesFormulaArray.length; i++) {
        const calcSheet = context.workbook.worksheets.getItem("SpecialCalculationField");
        let calcRange = calcSheet.getRange("A1");
        calcRange.formulas = [["=" + valuesFormulaArray[i]]];
        calcRange = calcSheet.getRange("A1");
        calcRange.load("text");
        await context.sync();
        //console.log(calcRange.text[0][0]); 
        formulasValuesMap.set(valuesFormulaArray[i], calcRange.text[0][0]);
      }

      //console.log([...formulasValuesMap.entries()]);

      context.workbook.worksheets.getItemOrNullObject("SpecialCalculationField").delete(); // delete new calculation field
      await context.sync();
      //________________________________________________


      //________________________________________________ declare dialog as global for use in later functions.
      let dialog;
      Office.context.ui.displayDialogAsync('https://localhost:3000/taskpane.html?dialogID=15&lettersFormula=' + lettersFormula + '&valuesFormula=' + valuesFormula + '&tree=' + tree, {height: 30, width: 20},
          function (asyncResult) {
              dialog = asyncResult.value;
              dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
          }
      )
      //________________________________________________
    });
  } catch (error) {
    console.log("Error: " + error);
  }
};
//------------------------------------------------

export default insertText;
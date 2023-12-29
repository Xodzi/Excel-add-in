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

function getSubFormulas(node) {
  if (node.type === "function") {
    const formula = `${node.name}(${node.arguments.map(getSubFormulas).join(",")})`;
   // console.log(formula)
    return [formula, ...node.arguments.filter((elem) => elem.type == "function").map(getSubFormulas).flat()];
  } else {
    return node.value;
  }
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
      const valuesPIZDEZ = parse(valuesFormula);
      //________________________________________________


      //________________________________________________ create array with pieces formulas and calculate their values
      // example of ideal formula split (здесь должна использоваться именно valuesFormulaArray, потому что по ней ведутся дальнейшие вычисления и создание formulasValuesMap)
      //var valuesFormulaArray = ["SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))", "SUM(1,2)", "ABS(4)", "3", "AVERAGE(MAX(8,1,5),SUM(4,3,7))", "MAX(8,1,5)", "SUM(4,3,7)"];
      console.log(valuesPIZDEZ)
      var valuesFormulaArray = getSubFormulas(valuesPIZDEZ);
      console.log(valuesFormulaArray);
      context.workbook.worksheets.getItemOrNullObject("SpecialCalculationField").delete(); // delete old calculation field
      const creatFieldSheet = context.workbook.worksheets.add("SpecialCalculationField"); // add new calculation field

      const formulasObjectsArray = [];

      var cur_d = 0;

      var formulasValuesMap = new Map();

      for (var i=0; i<valuesFormulaArray.length; i++) {
        const calcSheet = context.workbook.worksheets.getItem("SpecialCalculationField");
        let calcRange = calcSheet.getRange("A1");
        calcRange.formulas = [["=" + valuesFormulaArray[i]]];
        calcRange = calcSheet.getRange("A1");
        calcRange.load("text");
        await context.sync();
        const formulaObject = {
          name: valuesFormulaArray[i],
          depth: cur_d+1, // Здесь должно быть значение глубины, но оно пока не известно
          res: calcRange.text[0][0]
          
        };
        formulasObjectsArray.push(formulaObject);

    
        //console.log(calcRange.text[0][0]); 
        formulasValuesMap.set(valuesFormulaArray[i], calcRange.text[0][0]);
      }
      console.log(formulasValuesMap)
      console.log(formulasObjectsArray)

      //console.log([...formulasValuesMap.entries()]);

      context.workbook.worksheets.getItemOrNullObject("SpecialCalculationField").delete(); // delete new calculation field
      await context.sync();
      //________________________________________________


      //________________________________________________ declare dialog as global for use in later functions.
      return(formulasValuesMap);
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
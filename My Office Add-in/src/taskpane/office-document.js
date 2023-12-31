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
    var args = node.arguments.map(arg => {
   //   console.log(arg)
      if (arg.arguments) {
        // Если аргумент - это массив, извлекаем свойство name из каждого элемента
     //   console.log(arg.arguments.map(subArg => getSubFormulas(subArg).name).join(","))
        return arg.name +"(" +arg.arguments.map(subArg => getSubFormulas(subArg).name).join(",") + ")";
      } else {
        // Если аргумент не является массивом, извлекаем свойство name
        return getSubFormulas(arg).name;
      }
    }).join(",");
    
    var name = `${node.name}(${args})`;
   // console.log(name);
    const formula = {
      name: name,
      depth: node.depth
    };
    return [formula, ...node.arguments.filter((elem) => elem.type == "function").map(getSubFormulas).flat()];
  } else {
    if (node.operand == null) {
      let temp_name = node.value;
      return {name: temp_name}
    }
    let temp_name = 0 - node.operand.value;
    return {name : temp_name}
  }
}



//------------------------------------------------


// function for formulas split (вот это ересь надо довести до ума, потому что она неправильно сплитует строку)
//------------------------------------------------


function setDepth(node, depth) {
  if (node.type === "function" && node.arguments.length > 0) {
    node.depth = depth;
    node.arguments.forEach((arg) => setDepth(arg, depth + 1));
  } else {
    node.depth = depth;
  }
}







//------------------------------------------------

//var valuesFormulaArray = ["SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))", "SUM(1,2)", "ABS(4)", "3", "AVERAGE(MAX(8,1,5),SUM(4,3,7))", "MAX(8,1,5)", "SUM(4,3,7)"];


// main function
//------------------------------------------------
const insertText = async () => {
  try {
    await Excel.run(async (context) => {
      
      let range = context.workbook.getSelectedRange();
      range.load("formulas");
      await context.sync();
      //console.log(range.formulas[0][0]);
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

      console.log(valuesFormula);
      const valuesPIZDEZ = parse(valuesFormula);

      setDepth(valuesPIZDEZ,0);
      //________________________________________________


      //________________________________________________ create array with pieces formulas and calculate their values
      // example of ideal formula split (здесь должна использоваться именно valuesFormulaArray, потому что по ней ведутся дальнейшие вычисления и создание formulasValuesMap)
      //var valuesFormulaArray = ["SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))", "SUM(1,2)", "ABS(4)", "3", "AVERAGE(MAX(8,1,5),SUM(4,3,7))", "MAX(8,1,5)", "SUM(4,3,7)"];
      var valuesFormulaArray = getSubFormulas(valuesPIZDEZ);

      context.workbook.worksheets.getItemOrNullObject("SpecialCalculationField").delete(); // delete old calculation field

      const creatFieldSheet = context.workbook.worksheets.add("SpecialCalculationField"); // add new calculation field

      const formulasObjectsArray = [];

      var cur_d = 0;

      var formulasValuesMap = new Map();

      valuesFormulaArray[0] = {
        name : valuesFormula.substring(1, valuesFormula.length),
        depth : 0
      };

      for (var i=0; i<valuesFormulaArray.length; i++) {
        const calcSheet = context.workbook.worksheets.getItem("SpecialCalculationField");
        let calcRange = calcSheet.getRange("A1");
        calcRange.formulas = [["=" + valuesFormulaArray[i].name]];
        calcRange = calcSheet.getRange("A1");
        calcRange.load("text");
        await context.sync();
        const formulaObject = {
          name: valuesFormulaArray[i].name, // valuesFormulaArray[i].name
          depth: valuesFormulaArray[i].depth, // valuesFormulaArray[i].depth // Здесь должно быть значение глубины, но оно пока не известно
          res: calcRange.text[0][0]
        };
        formulasObjectsArray.push(formulaObject);

    
        formulasValuesMap.set(valuesFormulaArray[i], calcRange.text[0][0]);
      }

      var jsonString = JSON.stringify(formulasObjectsArray);
      console.log(jsonString);
      await localStorage.setItem('arrayData', JSON.stringify(formulasObjectsArray));
      console.log("обновили")

      context.workbook.worksheets.getItemOrNullObject("SpecialCalculationField").delete(); // delete new calculation field
      await context.sync();
      //________________________________________________


      //________________________________________________ declare dialog as global for use in later functions.
      //return(formulasValuesMap);
      let dialog;
      Office.context.ui.displayDialogAsync('https://localhost:3000/taskpane.html?dialogID=15&lettersFormula=' + lettersFormula + '&valuesFormula=' + valuesFormula + '&jsonString=' + jsonString, {height: 50, width: 20},
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
import {parse, visit} from 'excel-formula-parser';

/* global Excel console */



// this part of code convert ranges to values arrays
//------------------------------------------------
// MY COMMENT
function convertRanges(formula) {
  return formula.replace(/([A-Z]+\d+):([A-Z]+\d+)/g, function(match, start, end) {
      return createArrayFromRange(start, end);
  });
}

//MY COMMENT
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

// MY COMMENT
function parseCell(cell) {
  var column = cell.match(/[A-Z]+/)[0];
  var row = parseInt(cell.match(/\d+/)[0]);
  return { column: column, row: row };
}

// MY COMMENT
function createCellName(row, column) {
  return column + row;
}
//------------------------------------------------



// this part of code convert parse tree to array
//------------------------------------------------
// YOUR COMMENT
function getSubFormulas(node) {
  if (node.type === "function") {
    var args = node.arguments.map(arg => {
      if (arg.arguments) {
        // If the argument is an array, extract the name property from each element
        return arg.name + "(" + arg.arguments.map(subArg => getSubFormulas(subArg).name).join(",") + ")";
      } else {
        // If the argument is not an array, extract the name property
        return getSubFormulas(arg).name;
      }
    }).join(",");

    var name = `${node.name}(${args})`;

    if (args === "") {
      // Handle the case where there are no arguments
      name = `${node.name}()`;
    }

    const formula = {
      name: name,
      depth: node.depth
    };
    return [formula, ...node.arguments.filter((elem) => elem.type == "function").map(getSubFormulas).flat()];
  } else {
    if (node.operand == null) {
      let temp_name = node.value;
      return { name: temp_name };
    }
    let temp_name = 0 - node.operand.value;
    return { name: temp_name };
  }
}

// YOUR COMMENT
const getFormula = (node) => {
  if (node.type === "function") {
    if (node.arguments) {
      return node.name + "(" + node.arguments.map(getFormula).join(",") + ")";
    }
    return node.name + "()";
  } else if (node.type === "cell-range"){
    //if (node.left && node.right){}
    return node.left.key + ":" + node.right.key; // короче, эта хуйня
  }else {
    if (node.operator == "+" && node.left != null && node.right != null && node.type == "binary-expression"){
      return getFormula(node.left)+ "+" + getFormula(node.right);
    }
    if(node.operator == "*" && node.left != null && node.right != null && node.type == "binary-expression"){
      return getFormula(node.left)+ "*" + getFormula(node.right);
    }
    if(node.operator == "/" && node.left != null && node.right != null && node.type == "binary-expression"){
      return getFormula(node.left)+ "/" + getFormula(node.right);
    }
    if (node.operator == "-" && node.type == "unary-expression") {
      //console.log(node.operand.arguments.map(getFormula).join(",") + ")")
      return "-" + getFormula(node.operand);
    }
    if(node.operator == "-" && node.type == "binary-expression"){
      return getFormula(node.left) + "-" + getFormula(node.right);
    }
    if(node.type == "number"){
      return node.value;
    }
    else{
      //return node.value;
      return node.key;
    }
  }
  return node.value;
};

// YOUR COMMENT
const walkTree = (node, output=[], depth=0) => {
  if (node.type === "function" || node.type === "cell-range" || node.type === "cell" || node.type == "binary-expression" || node.type == "unary-expression") {
    output.push({
      name: getFormula(node),
      depth
    });
    if (node.arguments) {
      node.arguments.forEach(arg => walkTree(arg, output, depth + 1));
    }
    if(node.operand){
      walkTree(node.operand, output, depth+1)
    }
  }
  console.log(output);
  return output;
};


// function for set tree elements depth
function setDepth(node, depth) {
  if (node.type === "function" && node.arguments.length > 0) {
    node.depth = depth;
    node.arguments.forEach((arg) => setDepth(arg, depth + 1));
  } else {
    node.depth = depth;
  }
};
//------------------------------------------------



// main function
//------------------------------------------------
const insertText = async () => {
  try {
    await Excel.run(async (context) => {
      
      let range = context.workbook.getSelectedRange();
      range.load("formulas");
      range.load("values");
      range.load("text");
      console.log(range)
      await context.sync();
      //console.log("formulas" + range.formulas[0][0]);
      //console.log("values, " + range.values[0][0] + ', ' + typeof range.values[0][0]);
      //console.log("text" + range.text[0][0]);
      //if(typeof range.formulas[0][0] == "string") console.log("AHAHAHAHAHAHAH");
      //console.log(typeof range.formulas[0][0]);
      //range.formulas[0][0] = convertRanges(range.formulas[0][0]);
      //console.log(typeof range.formulas[0][0]);

      //after convert ranges we're check void cells and delete cells without value and cells which have text value
      /*var voidCells = range.formulas[0][0].match(/[A-Za-z]+\d+/g);
      for (var i = 0; i < voidCells.length; i++) {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        var valuesRange = sheet.getRange(voidCells[i]);
        valuesRange.load("values");
        //console.log(valuesRange)
        await context.sync();
        if(typeof valuesRange.values[0][0] == "string"){
          range.formulas[0][0] = range.formulas[0][0].replace(','+voidCells[i], '');
        }
      };
      console.log("formulas" + range.formulas[0][0]);
      return 0;*/

      /*var flag = true;
      while(flag){
        var formulasCells = range.formulas[0][0].match(/[A-Za-z]+\d+/g);
        for (var i = 0; i < formulasCells.length; i++) {
          const new_sheet = context.workbook.worksheets.getActiveWorksheet();
          var formulasRange = new_sheet.getRange(formulasCells[i]);
          formulasRange.load("formulas");
          //console.log(formulasRange)
          await context.sync();
          if(typeof formulasRange.formulas[0][0] == "string"){
            range.formulas[0][0] = range.formulas[0][0].replace(formulasCells[i], formulasRange.formulas[0][0].slice(1))
            console.log("NEW RANGE.FORMULAS[0][0]" + range.formulas[0][0]);
          }
          range.formulas[0][0] = convertRanges(range.formulas[0][0])
          var newCells = range.formulas[0][0].match(/[A-Za-z]+\d+/g);
          for(var j = 0; j < newCells.length; j++){
            const new_new_sheet = context.workbook.worksheets.getActiveWorksheet();
            var newFormulasRange = new_new_sheet.getRange(newCells[i]);
            newFormulasRange.load("formulas");
            await context.sync();
            if(typeof newFormulasRange.formulas[0][0] != "string") flag = false;
            else flag = true;
          }
        }
      };
      


      // replace strings with "-"
      var lettersFormula = range.formulas[0][0].replace(/(-{2,})/g, function(match, p1) {
          return p1.length % 2 === 0 ? '' : '-';
      });*/

      var lettersFormula = range.formulas[0][0];
      console.log(lettersFormula);

      //var lettersFormula = convertRanges(lettersFormula); // Take cells formula like a string

      //________________________________________________ convert string formula to formula with numbers
      /*var cells = lettersFormula.match(/[A-Za-z]+\d+/g);
      var cellsMap = new Map();

      console.log(cells)

      for (var i = 0; i < cells.length; i++) {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        var valuesRange = sheet.getRange(cells[i]);
        //valuesRange.load("formulas");
        valuesRange.load("values");
        //valuesRange.load("text");
        console.log(valuesRange)
        await context.sync();
        if (valuesRange.values[0][0] == "") cellsMap.set(cells[i], 0);
        else cellsMap.set(cells[i], valuesRange.values[0][0]);
      }

      // replace cells names in formula
      var valuesFormula = lettersFormula;
      cellsMap.forEach((value, key) => {
        const regex = new RegExp(key, 'g');
        valuesFormula = valuesFormula.replace(regex, value);
      });*/
      var valuesFormula = "тут должна быть формула с цифрами... или не должна...";

      
      
      //________________________________________________


      //________________________________________________ create arrays with split formulas (сначала надо довести до ума функцию, которая сплитует нашу строку)

      //console.log(valuesFormula);
      //const parseTree = parse(valuesFormula);
      const parseTree = parse(lettersFormula);
      console.log(parseTree);

      setDepth(parseTree,0);
      //________________________________________________


      //________________________________________________ create array with pieces formulas and calculate their values
      // example of ideal formula split (здесь должна использоваться именно valuesFormulaArray, потому что по ней ведутся дальнейшие вычисления и создание formulasValuesMap)
      //var valuesFormulaArray = ["SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))", "SUM(1,2)", "ABS(4)", "3", "AVERAGE(MAX(8,1,5),SUM(4,3,7))", "MAX(8,1,5)", "SUM(4,3,7)"];
      //var valuesFormulaArray = getSubFormulas(parseTree);
      var valuesFormulaArray = walkTree(parseTree);
      console.log(valuesFormulaArray);
 

      //context.workbook.worksheets.getItemOrNullObject("SpecialCalculationField").delete(); // delete old calculation field

      //const creatFieldSheet = context.workbook.worksheets.add("SpecialCalculationField"); // add new calculation field

      const formulasObjectsArray = [];

      var cur_d = 0;

      var formulasValuesMap = new Map();

      console.log(valuesFormulaArray)


      for (var i=0; i<valuesFormulaArray.length; i++) {
        //const calcSheet = context.workbook.worksheets.getItem("SpecialCalculationField");
        //let calcRange = calcSheet.getRange("A1");
        const calcSheet = context.workbook.worksheets.getActiveWorksheet(); //new
        let calcRange = calcSheet.getRange("BBB10000"); // new
        calcRange.formulas = [["=" + valuesFormulaArray[i].name]];
        //calcRange = calcSheet.getRange("A1");
        calcRange = calcSheet.getRange("BBB10000"); // new
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
      console.log(JSON.stringify(parseTree))
      console.log(jsonString);
      await localStorage.setItem('arrayData', JSON.stringify(formulasObjectsArray));
      console.log("обновили")


      //context.workbook.worksheets.getItemOrNullObject("SpecialCalculationField").delete(); // delete new calculation field
      await context.sync();
      //________________________________________________


      //________________________________________________ declare dialog as global for use in later functions.
      //return(formulasValuesMap);
      let dialog;
      Office.context.ui.displayDialogAsync('https://localhost:3000/taskpane.html?dialogID=15&lettersFormula=' + lettersFormula + '&valuesFormula=' + valuesFormula + '&jsonString=' + jsonString, {height: 45, width: 50},
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
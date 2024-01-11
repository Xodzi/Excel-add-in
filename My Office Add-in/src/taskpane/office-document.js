import {parse, visit} from 'excel-formula-parser';
import { HyperFormula } from 'hyperformula';

/* global Excel console */

const options = {
  licenseKey: 'gpl-v3'
};


// this part create string exists @ signs
//------------------------------------------------
function findMatchIndexes(originalString, targetString) {
  const indexStart = originalString.indexOf(targetString);
  
  if (indexStart !== -1) {
      const indexEnd = indexStart + targetString.length - 1;
      //console.log(indexStart + ', ' + indexEnd);
      return [indexStart-1, indexEnd-1];
  } else {
      console.log('Совпадение не найдено.');
  }
}


function createPaddedString(inputString, newStringLength, indexRange) {
  if (indexRange[1] < indexRange[0] || indexRange[1] - indexRange[0] >= inputString.length) {
      console.log('Неверные индексы.');
      return;
  }

  const paddingLength = newStringLength - inputString.length;
  if (paddingLength < 0) {
      console.log('Новая длина строки меньше длины входной строки.');
      return;
  }

  const paddingBefore = '@'.repeat(indexRange[0]);
  const paddingAfter = '@'.repeat(paddingLength - indexRange[0]);
  const resultString = paddingBefore + inputString + paddingAfter;

  return resultString;
}

//------------------------------------------------

function checkStrDigit(str) {
  console.log(/^\d+$/.test(str));
}  


/*function findElements(openArray, closeArray, startIndex, endIndex) {
  const result = [];

  for (let i = 0; i < openArray.length; i++) {
      if (openArray[i] >= startIndex && openArray[i] < endIndex ) {
          for (let j = 0; j < closeArray.length; j++) {
              if (closeArray[j] <= endIndex) {
                  result.push({ open: openArray[i], close: closeArray[j] });
              }
          }
      }
  }

  return result;
}*/


function insertCharacterAt(str, char, index) {
  if (index < 0 || index > str.length) {
      console.error("Index is out of bounds.");
      return str;
  }

  const result = str.slice(0, index-1) + char + str.slice(index-1, str.length-1);
  return result;
}


// this part of code convert parse tree to array
//------------------------------------------------


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


function getListIdx(str, substr) {
  let listIdx = []
  let lastIndex = -1
  while ((lastIndex = str.indexOf(substr, lastIndex + 1)) !== -1) {
    listIdx.push(lastIndex)
  }
  return listIdx
}


function splitByBrackets(inputString) {
  const substrings = [];
  let currentSubstring = '';
  let bracketDepth = 0;

  for (let character of inputString) {
      if (character === '(') {
          bracketDepth++;
          if (bracketDepth > 1) {
              currentSubstring += character;
          }
      } else if (character === ')') {
          bracketDepth--;
          if (bracketDepth > 0) {
              currentSubstring += character;
          } else {
              substrings.push(currentSubstring.trim());
              currentSubstring = '';
          }
      } else if (bracketDepth > 0) {
          currentSubstring += character;
      }
  }

  return substrings;
}

function processSubstrings(inputString) {
  let substrings = splitByBrackets(inputString);
  const allResults = [];
  for(var i=0; i<substrings.length; i++){
      allResults.push(substrings[i].replace(/[()]/g, ''));
  }

  while (substrings.length > 0 && substrings.every(substring => substring !== '')) {
      substrings = substrings
          .map(substring => splitByBrackets(substring))
          .flat();
      for(var i=0; i<substrings.length; i++){
          allResults.push(substrings[i].replace(/[()]/g, ''));
      }
  }

  return allResults;
}


// main function
//------------------------------------------------
const insertText = async () => {
  try {
    await Excel.run(async (context) => {
      let range = context.workbook.getSelectedRange();
      range.load("formulas");
      range.load("values");
      range.load("text");
      range.load("address")
      console.log(range)
      await context.sync();
      //console.log("formulas" + range.formulas[0][0] + ', ' + typeof range.formulas[0][0]);
      //console.log("values, " + range.values[0][0] + ', ' + typeof range.values[0][0]);
      //console.log("text" + range.text[0][0] + ', ' + typeof range.text[0][0]);
      //if(typeof range.formulas[0][0] == "string") console.log("AHAHAHAHAHAHAH");
      //console.log(typeof range.formulas[0][0]);
      //range.formulas[0][0] = convertRanges(range.formulas[0][0]);
      //console.log(typeof range.formulas[0][0]);
      

      var lettersFormula = range.formulas[0][0];
      console.log(lettersFormula);

      var arr = null
      var brackets = processSubstrings(lettersFormula);
      console.log(brackets);
      /*if(lettersFormula.includes("(" && ")")){
        arr = lettersFormula.match(/\(([^)]+?)\)/g)
        brackets = arr.map(bracket => bracket.match(/\(([^)]+?)\)/)[1])
        console.log(arr);
        console.log(brackets);
      }*/
      // brackets =["-SUM(A1:C3;A2;B3);AVERAGE(A1*E5;B1;C6;F3;E3;C1/-SUM(A1:C3);C2+D6;C3+4)", "A1:C3;A2;B3", "A1*E5;B1;C6;F3;E3;C1/-SUM(A1:C3);C2+D6;C3+4", "A1:C3"]
      //brackets =["-SUMA1:C3;A2;B3;AVERAGEA1*E5;B1;C6;F3;E3;C1/-SUMA1:C3;C2+D6;C3+4", "A1:C3;A2;B3", "A1*E5;B1;C6;F3;E3;C1/-SUMA1:C3;C2+D6;C3+4", "A1:C3"]
      
      var valuesFormula = "тут должна быть формула с цифрами... или не должна...";
      
      
      //________________________________________________


      //________________________________________________ 

      const regex = /([A-Z]\d+)\s*([<>]=?|!=)\s*([A-Z]\d+)\s*&\s*([A-Z]\d+)\s*([<>]=?|!=)\s*([A-Z]\d+)/g;
      const transformedString = lettersFormula.replace(regex, "AND($1$2$3, $4$5$6)");

      console.log(transformedString)

      const parseTree = parse(transformedString);

      console.log(parseTree)

      setDepth(parseTree,0);
      //________________________________________________


      const getFormula = (node) => {
        if (node.type === "function") {
          if (node.arguments) {
            return node.name + "(" + node.arguments.map(getFormula).join(",") + ")";
          }
          return node.name + "()";
        } else if (node.type === "cell-range"){
          return getFormula(node.left)+ ":" + getFormula(node.right);
        }else {
          if (node.left != null && node.right != null && node.type == "binary-expression"){
            return getFormula(node.left)+ node.operator + getFormula(node.right);
          }
          if (node.type == "unary-expression") {
            //console.log(node.operand.arguments.map(getFormula).join(",") + ")")
            return node.operator + getFormula(node.operand);
          }
          if(node.type == "number"){
            return node.value;
          }
          else{
            //return node.value;
            console.log(node)
            return node.key;
          }
        }
        return node.value;
      };


      const walkTree = (node, output=[], depth=0) => {
        //console.log(node)
        if (node.type === "function" || node.type === "cell-range" || node.type === "cell" || node.type == "binary-expression" || node.type == "unary-expression") {
          output.push({
            name: getFormula(node),
            depth
          });
          if(node.type=="cell") output.push({
            name: node.key+"IsCell",
            depth
          });;
          if (node.arguments) {
            node.arguments.forEach(arg => walkTree(arg, output, depth + 1));
          }
          if(node.operand){
            walkTree(node.operand, output, depth + 1)
          }
          if(node.type === "binary-expression"){
            walkTree(node.left, output, depth + 1);
            walkTree(node.right, output, depth + 1)
          }
        }
        //  console.log(output);
        return output;
      };


      var valuesFormulaArray = walkTree(parseTree);
      console.log(valuesFormulaArray);
      

      /*
      var openArray = getListIdx(lettersFormula, "(");
      var closeArray = getListIdx(lettersFormula, ")");
      console.log(openArray);
      console.log(closeArray);
      for (var i=1; i<valuesFormulaArray.length; i++){
        var indexRange = findMatchIndexes(valuesFormulaArray[0].name, valuesFormulaArray[i].name);
        var secondString = createPaddedString(valuesFormulaArray[i].name, lettersFormula.length-1, indexRange);
        var checkString = secondString;
        //var result = findElements(openArray, closeArray, indexRange[0], indexRange[1]);
        console.log(indexRange);
        console.log(secondString);
        //console.log(result);
        for (var j=0; j<openArray.length; j++){
          if (secondString[openArray[j]-1] != "("){
            console.log("j: " + secondString[openArray[j]]);
            console.log("j-1: " + secondString[openArray[j]-1]);
            secondString = insertCharacterAt(secondString, "(", openArray[j]);
          }
          console.log(secondString);
        }
        for (var j=0; j<closeArray.length; j++){
          if (secondString[closeArray[j]+1] != ")"){
            secondString = insertCharacterAt(secondString, ")", closeArray[j]);
          }
          //console.log(secondString);
        }
        //console.log(secondString);
      }
      valuesFormulaArray[0].name = lettersFormula.substring(1, lettersFormula.length);
      */


      const formulasObjectsArray = [];

      console.log(brackets)


      for (var i=0; i<valuesFormulaArray.length; i++) {

        var flag = null;

        console.log(valuesFormulaArray[i].name)

        if(valuesFormulaArray[i].name.includes("IsCell")){ //вынести в отдельный метод, это проверка на то что ячейка ссылается на другую ячейку
          console.log(i)
          console.log(valuesFormulaArray[i])
          let temp = context.workbook.worksheets.getActiveWorksheet();
          valuesFormulaArray[i].name = valuesFormulaArray[i].name.split("IsCell")[0]
          let temp_range = temp.getRange(valuesFormulaArray[i].name);
          console.log(valuesFormulaArray[i].name.split("IsCell")[0])
          temp_range.load("formulas")
          temp_range.load("formulasLocal")
          console.log(temp_range)
          await context.sync();

          if(temp_range.formulas[0][0][0] != undefined && temp_range.formulas[0][0][0].includes("=")){
            console.log(temp_range.formulas[0][0][0])
              flag = {
                name: temp_range.formulas[0][0]+"",
                depth: valuesFormulaArray[i].depth+2,
                res: null
              }
            console.log(flag)
          }
          else{
            continue;
          }
        }

        //console.log("tut ostanovka, дальше не идём")
        if(brackets != []){
          var containsElement = brackets.filter(element => valuesFormulaArray[i].name.includes(element));
          console.log(containsElement.length)
          if (containsElement.length > 0) {
            for(let j =0; j < containsElement.length; j++){
              var startIndex = valuesFormulaArray[i].name.indexOf(containsElement[j]);
              var endIndex = startIndex + containsElement[j].length
              var a = valuesFormulaArray[i].name
              console.log(endIndex)
              
              var output = a.substring(0, startIndex) + '(' + a.substring(startIndex);
              valuesFormulaArray[i].name = output.substring(0, endIndex+1) + ')' + output.substring(endIndex+1)
              console.log(valuesFormulaArray[i].name)
            }
          }
        }
        
        const calcSheet = context.workbook.worksheets.getActiveWorksheet();
        let calcRange = calcSheet.getRange("BBB10000"); // new
        calcRange.formulas = [["=" + valuesFormulaArray[i].name]];
        console.log(valuesFormulaArray[i].name)
        calcRange = calcSheet.getRange("BBB10000"); // new
        calcRange.load("text");
        calcRange.load("values");
        calcRange.load("formulasLocal")
        await context.sync();
        console.log(calcRange)

        if(i == 0){ //проверка чтобы добавить аддрес
          const formulaObject = {
            name: range.address.split('!')[1], // valuesFormulaArray[i].name
            depth: valuesFormulaArray[i].depth, // valuesFormulaArray[i].depth // Здесь должно быть значение глубины, но оно пока не известно
            res: calcRange.text[0][0]
          };
          formulasObjectsArray.push(formulaObject);
          console.log(formulasObjectsArray)
        }

        if(flag != null && flag.res == null){
          flag.res = calcRange.text[0][0]
          console.log(flag)
          formulasObjectsArray.push(flag);
          continue;
        }

        var checkNameRegex = /^[a-zA-Z0-9]+$/;

        if(calcRange.values[0][0] == 0 && checkNameRegex.test(valuesFormulaArray[i].name)){
          const CalcSheet = context.workbook.worksheets.getActiveWorksheet();
          let CalcRange = CalcSheet.getRange(valuesFormulaArray[i].name);
          CalcRange.load("values")
          await context.sync();
          console.log(CalcRange)
          console.log(CalcRange.values)
          console.log(typeof CalcRange.values[0][0])
          console.log(valuesFormulaArray[i].name + " NOPE IT'S NOT UNDEFINED")
          const formulaObject = {
            name: valuesFormulaArray[i].name,
            depth: valuesFormulaArray[i].depth+1,
            res: (typeof CalcRange.values[0][0] === "string" ? " " : calcRange.text[0][0])
          };
          console.log(formulasObjectsArray)
          formulasObjectsArray.push(formulaObject);
        } else{
          const formulaObject = {
            name: valuesFormulaArray[i].name,
            depth: valuesFormulaArray[i].depth+1,
            res: (typeof calcRange.values[0][0] === "string" ? " " : calcRange.text[0][0])
          };
          console.log(formulasObjectsArray)
          formulasObjectsArray.push(formulaObject);
        }
        console.log(formulasObjectsArray)

        
        /*if (valuesFormulaArray[i].depth == maxDepth){
          let testRange = calcSheet.getRange(valuesFormulaArray[i].name);
          testRange.load("values");
          await context.sync();
          console.log(typeof testRange.values[0][0] + " : " + testRange.values[0][0]);
          const formulaObject = {
            name: valuesFormulaArray[i].name,
            depth: valuesFormulaArray[i].depth,
            res: (typeof testRange.values[0][0] === "string" ? "пустая ячейка или текст" : testRange.values[0][0])
          };
          formulasObjectsArray.push(formulaObject);
        } else{
          let calcRange = calcSheet.getRange("BBB10000"); // new
          calcRange.formulas = [["=" + valuesFormulaArray[i].name]];
          calcRange = calcSheet.getRange("BBB10000"); // new
          calcRange.load("text");
          calcRange.load("values");
          await context.sync();
          const formulaObject = {
            name: valuesFormulaArray[i].name,
            depth: valuesFormulaArray[i].depth,
            res: calcRange.text[0][0]
          };
          formulasObjectsArray.push(formulaObject);
        }*/
      }


      var jsonString = JSON.stringify(formulasObjectsArray);
      console.log(JSON.stringify(parseTree));
      console.log(jsonString);
      await localStorage.setItem('arrayData', JSON.stringify(formulasObjectsArray));
      console.log("обновили")


      //context.workbook.worksheets.getItemOrNullObject("SpecialCalculationField").delete(); // delete new calculation field
      await context.sync();
      //________________________________________________


      //________________________________________________ declare dialog as global for use in later functions.
      //return(formulasValuesMap);
      let dialog;
      Office.context.ui.displayDialogAsync('https://localhost:3000/taskpane.html?dialogID=15&lettersFormula=' + lettersFormula.replace(/\+/g, "@") + '&valuesFormula=' + valuesFormula + '&jsonString=' + jsonString.replace(/\+/g, "@"), {height: 45, width: 50},
          function (asyncResult) {
              dialog = asyncResult.value;
              dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
          }
      )
      //________________________________________________
    });
  } catch (error) {
    let dialog;
      Office.context.ui.displayDialogAsync('https://localhost:3000/taskpane.html?dialogID=15&lettersFormula=' + lettersFormula + '&valuesFormula=' + valuesFormula + '&jsonString=' + jsonString, {height: 45, width: 50},
          function (asyncResult) {
              dialog = asyncResult.value;
              dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
          }
      )
    console.log("Error: " + error);
  }

};
//------------------------------------------------

export default insertText;
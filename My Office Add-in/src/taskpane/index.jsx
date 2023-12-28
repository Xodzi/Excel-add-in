import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import Tree from './components/TreeNode'; 
import {parse, visit} from 'excel-formula-parser';
import { CompassNorthwestFilled } from "@fluentui/react-icons";

/* global document, Office, module, require */

const title = "Contoso Task Pane Add-in";

const rootElement = document.getElementById("container");
const root = createRoot(rootElement);

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}


//var testFormula = "SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))"; // incorrect (ignore free number for sum)
//var testFormula = "MAX(1,2,3,0,0,0,4,5,9)"; // incorrect (Cannot read properties of null (reading 'arguments'))
//var testFormula = "SUM(1,2,3)"; // incorrect (Cannot read properties of null (reading 'arguments'))
var testFormula = "SUM(MAX(10,3,0,2),SUM(15,3),ABS(6))"; // correct
//var testFormula = "MAX(SUM(9,4,5),5,AVERAGE(2,3),6)"; // incorrect (ignore '5' and '6', like first algos)
//var testFormula = "2+4"; // nu, tut voobsche pizdeц (Cannot read properties of undefined (reading 'forEach'))


const tree = parse(testFormula);
console.log(tree);

var bim = [];

var ob = {
  name : String,
  depth : Number,
  parent : null,
  childrens : []
}

traverseTree(tree,0)

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


/*var cur_par = tree;

let tes = to_array(tree);

function to_array(tree){
 // console.log(tree.arguments.length)
 // console.log('start')
 let general = tree.name + "("
 tree.arguments.forEach(element => {
  let index = 1;
  cur_par = element;
  if(element.type == 'function'){
    let temp = to_array(element);
    if(index == tree.arguments.length){
      temp += ")"
    }
    else{
      temp += ",";
    }
    index++;
    general += temp;
    //console.log(general);
    //console.log(temp);
    //console.log(formulas);
    functions.push(temp);
  }
  else{
    let temp = element.value
    //console.log(cur_par.arguments[cur_par.arguments.length-1])
    console.log(temp)
    console.log(cur_par)
    console.log(cur_par.arguments)
    console.log(cur_par.arguments.length)
    if(cur_par.arguments[cur_par.arguments.length-1].value==temp){
      //console.log("Сревшилось")
      temp += ")"
    }
    else{
      temp += ",";
    }
    index++;
    general += temp
  }
 });
 return general;
}
//console.log("SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))")
//console.log(tes)
//const last_index = tes.lastIndexOf(')')

for(let j = 1; j < functions.length; j++){
  functions[j] = functions[j].slice(0, -1);
  let last_index = functions[j].lastIndexOf(')')
  for(let i=last_index; i < functions[j].length; i++){
    functions[j] = functions[j].replaceAt(i,')')
  }
}

//console.log(tes)
console.log(functions);*/


/* Render application after Office initializes */
Office.onReady(() => {

  root.render(
    <div>
      <App title={title} />
      <Tree tree={tree} />
      </div>
  );
});

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root.render(NextApp);
  });
}

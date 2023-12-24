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


const tree = parse("SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))");
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


var cur_par = tree;

let tes = to_array(tree);

function to_array(tree){
 // console.log(tree.arguments.length)
 // console.log('start')
 let general = tree.name + "("
 let functions = [];
 tree.arguments.forEach(element => {
  let index = 1;
  if(element.type == 'function'){
    let temp = to_array(element);
  //  console.log(general)

    if(index == tree.arguments.length){
      temp += ")"
    }
    else{
      temp += ",";
    }
    index++;
    general += temp;
  }
  else{
    let temp = element.value
    console.log(cur_par.arguments[cur_par.arguments.length-1])
    console.log(temp)
    //console.log(cur_par.arguments.length)
    //console.log(cur_par.arguments)
    if(cur_par.arguments[cur_par.arguments.length-1].value==temp){
      console.log("Сревшилось")
      temp += "),"
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
console.log("SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))")
console.log(tes)
const last_index = tes.lastIndexOf(')')
for(let i=last_index; i < tes.length; i++){
  tes = tes.replaceAt(i,')')
}

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

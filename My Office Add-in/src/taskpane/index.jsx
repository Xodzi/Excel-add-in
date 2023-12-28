import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import Tree from './components/TreeNode'; 
import {parse, visit} from 'excel-formula-parser';
import { CompassNorthwestFilled } from "@fluentui/react-icons";
import TreeComponent from "./components/TreeComponent";
import ArrayComponent from "./components/ArrayComponent";

/* global document, Office, module, require */

const title = "Contoso Task Pane Add-in";

const rootElement = document.getElementById("container");
const root = createRoot(rootElement);

const testArray = [
  {
    name: 'SUM(1,2,3,4,5,6,7,AVERAGE(1,2,3,4,5,6,7),MAX(11,3,4))',
    depth: 0,
    res: '43',
  },
  {
    name: 'AVERAGE(1,2,3,4,5,6,7)',
    depth: 1,
    res: '4',
  },
  {
    name: 'MAX(11,3,4))',
    depth: 1,
    res: '1',
  }
];


//var testFormula = "SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))"; // incorrect (ignore free number for sum)
//var testFormula = "MAX(1,2,3,0,0,0,4,5,9)"; // incorrect (Cannot read properties of null (reading 'arguments'))
//var testFormula = "SUM(1,2,3)"; // incorrect (Cannot read properties of null (reading 'arguments'))
var testFormula = "SUM(MAX(10,3,0,2),SUM(15,3),ABS(6))"; // correct
//var testFormula = "MAX(SUM(9,4,5),5,AVERAGE(2,3),6)"; // incorrect (ignore '5' and '6', like first algos)


const tree = parse("SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))");
console.log(tree);

function getSubFormulas(node) {
  if (node.type === "function") {
    const formula = `${node.name}(${node.arguments.map(getSubFormulas).join(",")})`;
   // console.log(formula)
    return [formula, ...node.arguments.filter((elem) => elem.type == "function").map(getSubFormulas).flat()];
  } else {
    return node.value;
  }
}




const subFormulas = getSubFormulas(tree);
console.log(subFormulas)

traverseTree(tree,0)

function traverseTree(node, depth = 0) {
  
  if (node.arguments != undefined && node.arguments.length > 0) {
   // console.log(`${"  ".repeat(depth)}${node.name} - Depth: ${depth}`);
    node.arguments.forEach((childNode) => {
    //  console.log(node, depth)
      traverseTree(childNode, depth + 1);
    });
  }
  else{
    console.log(node);
  }
}


/*var cur_par = tree;
/* Render application after Office initializes */
Office.onReady(() => {

  root.render(
    <div>
      <App title={title} />
      <Tree tree={tree} />
      <TreeComponent tree={tree} />
      <ArrayComponent valuesFormulaArray={testArray}></ArrayComponent>
      </div>
  );
});

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root.render(NextApp);
  });
}

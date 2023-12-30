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
    name: 'SUM(MAX(3,5),AVERAGE(1,2,3,4,SUM(7,7)),ABS(SUM(-7,4,1)))',
    depth: 0,
    res: '43',
  },
  {
    name: 'MAX(3,5)',
    depth: 1,
    res: '4',
  },
  {
    name: 'AVERAGE(1,2,3,4,SUM(7,7))',
    depth: 1,
    res: '4',
  },
  {
    name: 'SUM(7,7)',
    depth: 2,
    res: '4',
  },
  {
    name: 'ABS(SUM(-7,4,1))',
    depth: 1,
    res: '1',
  },
  {
    name: 'SUM(-7,4,1)',
    depth: 2,
    res: '1',
  }
];

// for first and second trees
const tree = parse("SUM(SUM(1,2),ABS(4),3,AVERAGE(MAX(8,1,5),SUM(4,3,7)))");
console.log(tree);

function getSubFormulas(node) {
  if (node.type === "function") {
    const formula = `${node.name}(${node.arguments.map(getSubFormulas).join(",")})`;
   // console.log(formula)
    return [formula, ...node.arguments.filter((elem) => elem.type == "function").map(getSubFormulas).flat()];
  } else {
    if(node.operand == null){
      return node.value
    }
    return 0-node.operand.value;
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



/* Render application after Office initializes */
Office.onReady(() => {

  root.render(
    <div>
      <App title={title} />
      {/*<Tree tree={tree} />
      <TreeComponent tree={tree} />*/}
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

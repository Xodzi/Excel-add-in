import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
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

var cur_par = null;

let tes = to_array(tree);

function to_array(tree){
 // console.log(tree.arguments.length)
 // console.log('start')
 let general = tree.name + "("
 let functions = [];
 tree.arguments.forEach(element => {
  let index = 1;
  if(element.type == 'function'){
    cur_par = element;
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
console.log(tes)


/* Render application after Office initializes */
Office.onReady(() => {

  root.render(
      <App title={title} />
  );
});

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root.render(NextApp);
  });
}

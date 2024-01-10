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


/* Render application after Office initializes */
Office.onReady(() => {

  root.render(
    <div>
      <App title={title} />
      {/*<Tree tree={tree} />
      <TreeComponent tree={tree} />
      <ArrayComponent valuesFormulaArray={testArray}></ArrayComponent>*/}
      </div>
  );
});

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root.render(NextApp);
  });
}

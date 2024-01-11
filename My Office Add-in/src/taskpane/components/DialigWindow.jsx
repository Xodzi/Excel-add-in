import React, { useEffect, useState } from 'react'
import queryString from 'query-string';
import {parse, visit} from 'excel-formula-parser';
import ArrayComponent from "../components/ArrayComponent";
import Tree from '../components/TreeNode';
import { Button } from 'react-bootstrap';
import TreeViewTable from './TreeViewTable';

export default function DialigWindow(props) {

  // add some styles for Dialog window
  const bodyStyle = {fontSize: "16px"};
  const block = {marginBottom: "15px"};
  const hedlineStyle = {fontSize: "120%", fontWeight: "bold"};
  const treeHedlineStyle = {fontSize: "140%", fontWeight: "bold"};

  const [array,SetArray] = useState([]);

  useEffect(() => {
    // Получение параметра jsonString из URL
    console.log(props);
    const { jsonString } = queryString.parse(window.location.search);
    console.log(jsonString)

    if (jsonString) {
      // Преобразование JSON-строки в массив и установка состояния
      const formulasObjectsArray = JSON.parse(jsonString.replace(/\@/g, "+"));
      SetArray(formulasObjectsArray);
      console.log(formulasObjectsArray);
    }
  }, []);

  //var lettersParts = props.lettersFormula.match(/[^();]+|\([^()]*\)/g);

  //var valuesParts = props.valuesFormula.match(/[^();]+|\([^()]*\)/g);

  /*const options = {
    licenseKey: 'gpl-v3',
    dateFormats: ['MM/DD/YYYY', 'MM/DD/YY', 'YYYY/MM/DD'],
    timeFormats: ['hh:mm', 'hh:mm:ss.sss'], // set by default
    currencySymbol: ['$', 'USD'],
    localeLang: 'en-US',
    functionArgSeparator: ',', // set by default
    decimalSeparator: '.', // set by default
    thousandSeparator: '', // set by default
    arrayColumnSeparator: ',', // set by default
    arrayRowSeparator: ';', // set by default
    nullYear: 30, // set by default
    caseSensitive: false, // set by default
    accentSensitive: true,
    ignorePunctuation: false, // set by default
    useWildcards: true, // set by default
    useRegularExpressions: false, // set by default
    matchWholeCell: true, // set by default
    useArrayArithmetic: true,
    ignoreWhiteSpace: 'any',
    evaluateNullToZero: true,
    leapYear1900: true,
    nullDate: { year: 1899, month: 12, day: 31 },
    smartRounding: true, // set by default
  };*/

  // Выводим результат
  //for (var i = 0; i < parts.length; i++) {
  //  console.log("Часть " + (i + 1) + ":", parts[i]);
  //}

  return (
    <div style={bodyStyle}>

      <div style={block}>
        <div style={hedlineStyle}>Выбранная формула:</div>
        <div>{props.lettersFormula.replace(/\@/g, "+")}</div>
      </div>

      <div style={block}>
        <div style={hedlineStyle}>Формула с подставленными значениями:</div>
        <div>{props.valuesFormula}</div>
      </div>

      <div style={block}>
        <div style={treeHedlineStyle}>Дерево функции</div>
        <ArrayComponent valuesFormulaArray={array}></ArrayComponent>
        <TreeViewTable data={array}/>
        {/*<Tree tree={array} />*/}
      </div>

    </div>
  )
}
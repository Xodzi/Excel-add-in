import React, { useState } from 'react'
//import { ReactTree } from '@naisutech/react-tree';
//import TreeView, { flattenTree } from "react-accessible-treeview";
//import { HyperFormula } from 'hyperformula';
import {parse, visit} from 'excel-formula-parser';
//import to_array from '../office-document'



export default function DialigWindow(props) {



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
  };
  

  const data = [['=SUM(1,2)']];
  const hfInstance = HyperFormula.buildFromArray(data, options);
  const mySum = hfInstance.getCellValue({ col: 3, row: 0, sheet: 0 });

  console.log(mySum);*/
  
  /*var cur_par = null;
  
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
      //console.log(cur_par.arguments[cur_par.arguments.length-1])
      //console.log(temp)
      //console.log(cur_par.arguments.length)
      //console.log(cur_par.arguments)
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
  const last_index = tes.lastIndexOf(')')
  for(let i=last_index; i < tes.length; i++){
    tes = tes.replaceAt(i,')')
  }
  console.log(tes)*/


  

  // Выводим результат
  //for (var i = 0; i < parts.length; i++) {
  //  console.log("Часть " + (i + 1) + ":", parts[i]);
  //}

  return (
    <div>
      <div>DialogWindow</div>
      <div>DialogID: {props.dialogID}</div>
      <div>urlQuery: {props.formula}</div>
      <div>Letters Formula: {props.lettersFormula}</div>
      <div>Values Formula: {props.valuesFormula}</div>

     
    </div>
  )
}
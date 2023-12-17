import React, { useState } from 'react'
import TreeView from 'treeview-react-bootstrap';
import { ReactTree } from '@naisutech/react-tree'



export default function DialigWindow(props) {

  var parts = props.formula.match(/[^();]+|\([^()]*\)/g);


  var data = [
    {
      text: "Parent 1",
      nodes: [
        {
          text: "Child 1",
          nodes: [
            {
              text: "Grandchild 1"
            },
            {
              text: "Grandchild 2"
            }
          ]
        },
        {
          text: "Child 2"
        }
      ]
    },
    {
      text: "Parent 2"
    }
  ];

  // Выводим результат
  for (var i = 0; i < parts.length; i++) {
    console.log("Часть " + (i + 1) + ":", parts[i]);

  }

  return (
    <div>
      <div>DialogWindow</div>
      <div>DialogID: {props.dialogID}</div>
      <div>urlQuery: {props.formula}</div>
      {parts.map((part) => <div>{part}</div>)}
      <ReactTree nodes={data}  />
    </div>
  )
}

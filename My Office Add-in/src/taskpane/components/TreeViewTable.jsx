import React from 'react';


const TreeViewTable = ({ data }) => {
  console.log(data)
  const renderNode = (node) => (
    <tr key={node.name}>
      <td style={{paddingLeft: node.depth * 20}}>{node.name.split('(')[0]}</td>
      <td style={{textAlign: "center"}}>{node.res}</td>
      <td style={{textAlign: "center"}}>cell's address</td>
    </tr>
  );

  const buildTree = (flatData) => {
    const tree = [];
    const map = new Map();

    flatData.forEach((node) => {
      node.children = [];
      map.set(node.name.split('(')[0], node);

      const parentName = node.name.substring(0, node.name.lastIndexOf(':'));
      if (map.has(parentName)) {
        map.get(parentName).children.push(node);
      } else {
        tree.push(node);
      }
    });

    return tree;
  };

  const treeData = buildTree(data);

  return (
    <table style={{width: "100%"}}>
      <colgroup>
       <col span="1" style={{width: "auto"}}></col>
       <col span="1" style={{width: "25%"}}></col>
       <col span="1" style={{width: "25%"}}></col>
      </colgroup>
      <thead>
        <tr>
          <th>Name</th>
          <th>Res</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody style={{fontSize: "90%"}}>
        {treeData.map(renderNode)}
      </tbody>
    </table>
  );
};

export default TreeViewTable;

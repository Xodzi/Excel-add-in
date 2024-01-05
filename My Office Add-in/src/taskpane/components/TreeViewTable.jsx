import React from 'react';

const TreeViewTable = ({ data }) => {
  const renderNode = (node) => (
    <tr key={node.name.split('(')[0]}>
      <td style={{ paddingLeft: node.depth * 20 }}>{node.name}</td>
      <td>{node.res}</td>
      <td>Тут будет какая-то полезная инфа как на примере</td>
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
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Res</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
        {treeData.map(renderNode)}
      </tbody>
    </table>
  );
};

export default TreeViewTable;

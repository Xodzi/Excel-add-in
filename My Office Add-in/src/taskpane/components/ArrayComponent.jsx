import React from 'react';

const TreeNode = ({ node, depth, index }) => {
  const nodeStyle = {
    border: node.type === 'function' ? '1px solid black' : 'none',
    padding: '10px',
    marginBottom: '10px',
    display: 'inline-block',
    marginLeft: `${depth * 20}px`,
    backgroundColor: `rgba(0, 128, ${255 - depth * 30})`,
    cursor: node.type === 'function' ? 'pointer' : 'auto',
  };

  return (
    <div style={nodeStyle}>
      <p>
        Name: {node.name}, Depth: {node.depth}, Result: {node.res}
      </p>
      {node.children &&
        node.children.map((child, i) => (
          <TreeNode key={i} node={child} depth={depth + 1} index={i} />
        ))}
    </div>
  );
};

const ArrayComponent = ({ valuesFormulaArray }) => {
  return (
    <div>
      <h1>Array Component</h1>
      {valuesFormulaArray.map((node, index) => (
        <div key={index}>
          <TreeNode node={node} depth={node.depth} index={index} />
        </div>
      ))}
    </div>
  );
};

export default ArrayComponent;

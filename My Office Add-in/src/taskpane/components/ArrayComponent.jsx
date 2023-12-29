import React from 'react';
import Collapsible from 'react-collapsible';
import cl from './ArrayComponent.module.css';

const TreeNode = ({ node }) => {
  const nodeStyle = {
    border: node.type === 'function' ? '1px solid black' : 'none',
    padding: '5px',
    marginBottom: '5px',
    display: 'inline-block',
    marginLeft: `${node.depth * 25}px`,
    backgroundColor: `rgba(${node.depth + 16}, ${255 - node.depth + 50}, ${255 - node.depth * 30})`,
    cursor: node.type === 'function' ? 'pointer' : 'auto',
  };

  return (
    <div>
      {/*<p>
        Name: {node.name}, Depth: {node.depth}, Result: {node.res}
      </p>*/}
      <p style={nodeStyle}>
        {node.name}  &#8883;  {node.res}
      </p>
    </div>
  );
};

const ArrayComponent = ({ valuesFormulaArray }) => {
  return (
    <div>
      <h1>Array Component</h1>
      {valuesFormulaArray.map((node, index) => (
        <div key={index}>
          <TreeNode node={node} />
        </div>
      ))}
    </div>
  );
};

export default ArrayComponent;

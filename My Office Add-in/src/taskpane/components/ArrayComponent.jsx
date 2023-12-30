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
    backgroundColor: node.depth % 2 === 0 ? `rgba(255, ${node.depth * 50}, ${node.depth * 50}, 0.7)` : `rgba(225, ${node.depth * 50}, ${node.depth * 50}, 0.7)`,
    cursor: node.type === 'function' ? 'pointer' : 'auto',
    
  };

  return (
    <div>
      {/*<p>
        Name: {node.name}, Depth: {node.depth}, Result: {node.res}
      </p>*/}
      <div style={nodeStyle}>
        {node.name}  &#8883;  <strong>{node.res}</strong>
      </div>
    </div>
  );
};

const ArrayComponent = ({ valuesFormulaArray }) => {
  return (
    <div>
      <h3>Array Component</h3>
      {valuesFormulaArray.map((node, index) => (
        <div key={index}>
          <TreeNode node={node} />
        </div>
      ))}
    </div>
  );
};

export default ArrayComponent;

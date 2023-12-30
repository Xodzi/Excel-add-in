/* global Excel console */
import React from 'react';

const TreeNode = ({ node, depth }) => (
  <div style={{ marginLeft: `${depth * 7+5}px`, border: '1px solid #ccc', padding: '5px' }}>
    {node.type === "function" ? (
      <>
        {node.name} 
        {node.arguments.length > 0 && (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {node.arguments.map((childNode, index) => (
          <TreeNode key={index} node={childNode} depth={depth + 1} />
        ))}
      </div>
    )}
      </>
    ) : (
      <>
        {node.value}
      </>
    )}

  </div>
);

const Tree = ({ tree }) => <TreeNode node={tree} depth={0} />;

export default Tree;

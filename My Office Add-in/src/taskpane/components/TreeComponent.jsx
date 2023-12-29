import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Collapsible from 'react-collapsible';

const TreeNode = ({ node, depth, index }) => {
  const nodeStyle = {
    border: node.type === 'function' ? '1px solid black' : 'none',
    padding: '10px',
    marginBottom: '10px',
    display: 'inline-block',
    marginLeft: `${depth * 20}px`, // Используем уровень вложенности для определения отступа
    backgroundColor: `rgba(0, 128, ${255- depth * 30})`, // Зависимость цвета от уровня вложенности
    cursor: node.type === 'function' ? 'pointer' : 'auto',
  };

  const [open, setOpen] = useState(true);



  if (node.type === 'function') {
    return (
      <Collapsible style={nodeStyle} trigger={`Function: ${node.name} - Результат`}>
      <div style={nodeStyle}>
       <div className="collapse" id={index}>
          {node.arguments.map((arg, index) => (
            <div onClick={() => setOpen(!open)} key={index}>
              <TreeNode
                node={arg}
                depth={depth + 1} // Увеличиваем уровень вложенности для вложенных узлов
              />
            </div>
          ))}
        </div> 
      </div>
      </Collapsible>
    );
  } else if (node.type === 'number') {
    return (
      <div style={nodeStyle}>
        <p>Number: {node.value}</p>
      </div>
    );
  }

  return null;
};

const TreeComponent = ({ tree }) => {
  return (
    <div>
      <h1>Tree</h1>
      <TreeNode node={tree} depth={0} index={0} />
    </div>
  );
};

export default TreeComponent;

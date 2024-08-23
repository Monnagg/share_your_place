import React from 'react';
import { Button } from 'primereact/button';
        

const MyButton = props => {
  return (
    <Button
     
      severity= {props.severity || "info"}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </Button>
  );
};

export default MyButton;

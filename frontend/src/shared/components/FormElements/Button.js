import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'primereact/button';
        
import './Button.css';

const MyButton = props => {
  if (props.href) {
    return (
      <a
        className={`button button--${props.size || 'default'} ${props.inverse &&
          'button--inverse'} ${props.danger && 'button--danger'}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      
      <Link
      to={props.to} // 设置 Link 组件的 to 属性，用于内部路由
      exact={props.exact} // 如果提供了 exact 属性，则应用于路由匹配
      className={`button button--${props.size || 'default'} ${props.inverse &&
        'button--inverse'} ${props.danger && 'button--danger'}`}
    >
      {props.children} {/* 在 Link 组件内渲染子元素 */}
    </Link>
    );
  }
  return (
    <Button
      // className={`button button--${props.size || 'default'} ${props.inverse &&
      //   'button--inverse'} ${props.danger && 'button--danger'}`}
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

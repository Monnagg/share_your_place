import React, { useRef, useEffect } from 'react'; // 从React库中导入useRef和useEffect钩子

import './Map.css'; 

const Map = props => {
  const mapRef = useRef(); // 使用useRef钩子来创建对DOM元素的引用

  const { center, zoom } = props; // 从props中解构出center和zoom属性

  useEffect(() => {
    // useEffect钩子在组件加载后执行
    const map = new window.google.maps.Map(mapRef.current, {
      // 创建一个新的Google地图实例
      center: center, // 设置地图中心点
      zoom: zoom // 设置地图缩放级别
    });

    new window.google.maps.Marker({ position: center, map: map });
    // 在地图中心添加一个标记
  }, [center, zoom]); // 当center或zoom变化时，重新执行此效果

  return (
    <div
      ref={mapRef} // 将mapRef引用附加到div元素
      className={`map ${props.className}`} // 应用传入的className和默认的map样式
      style={props.style} // 应用传入的样式
    ></div>
  );
};

export default Map;
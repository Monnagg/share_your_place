import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    // 如果 file 为空（未选择文件），则直接返回，不执行后续代码
    if (!file) {
      return;
    }
  
    // 创建一个新的 FileReader 实例
    const fileReader = new FileReader();
  
    // 当文件读取完成时触发的事件
    fileReader.onload = () => {
      // 将读取的结果（即文件的 URL）设置为预览 URL
      setPreviewUrl(fileReader.result);
    };
  
    // 开始读取文件，并将文件数据作为 Data URL 进行读取
    // Data URL 是 Base64 编码的字符串，表示文件内容
    fileReader.readAsDataURL(file);
  }, [file]); // useEffect 的依赖项，当 file 发生变化时，useEffect 重新执行
  

  const pickedHandler = event => {
    // 初始化 pickedFile 变量，用于存储用户选择的文件
    let pickedFile;
    
    // 初始化 fileIsValid 变量，用于记录文件是否有效，初始值为 isValid 的值
    let fileIsValid = isValid;
    
    // 检查是否有文件被选中，并且文件数量是否为 1
    if (event.target.files && event.target.files.length === 1) {
      // 如果条件满足，将第一个文件存储到 pickedFile 变量中
      pickedFile = event.target.files[0];
      
      // 调用 setFile 函数，将 pickedFile 存储到组件的状态中
      setFile(pickedFile);
      
      // 设置文件有效性为 true，因为成功选择了一个文件
      setIsValid(true);
      fileIsValid = true;
    } else {
      // 如果没有文件被选中，或者文件数量不为 1，将文件有效性设置为 false
      setIsValid(false);
      fileIsValid = false;
    }
    
    // 调用父组件传递的 onInput 方法，传递 id, pickedFile 和 fileIsValid
    // - props.id: 当前组件实例的唯一标识符
    // - pickedFile: 用户选择的文件（如果有）
    // - fileIsValid: 文件是否有效的布尔值
    props.onInput(props.id, pickedFile, fileIsValid);
  };
  

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}//不再页面上显示输入框input，点击pickImageHandler打开本地文件夹
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;

import { useState, useCallback, useRef, useEffect } from 'react';

// 自定义钩子，用于处理HTTP请求
export const useHttpClient = () => {
  // 管理请求加载状态的state
  const [isLoading, setIsLoading] = useState(false);
  // 管理请求过程中出现的错误的state
  const [error, setError] = useState();

  // useRef用于跟踪当前活跃的HTTP请求（以便可以取消）
  const activeHttpRequests = useRef([]);

  // sendRequest函数用于发起HTTP请求
  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true); // 在发起请求前，将加载状态设为true
      // const httpAbortCtrl = new AbortController(); // 创建一个AbortController，以便在需要时取消请求
      // activeHttpRequests.current.push(httpAbortCtrl); // 存储当前的AbortController

      try {
        // 发送HTTP请求
        const response = await fetch(url, {
          method,
          body,
          headers,
          // signal: httpAbortCtrl.signal // 将abort信号附加到请求中
        });

        // 解析JSON响应数据
        const responseData = await response.json();

        // 从活跃请求列表中移除当前的AbortController
        // activeHttpRequests.current = activeHttpRequests.current.filter(
        //   reqCtrl => reqCtrl !== httpAbortCtrl
        // );

        // 检查响应是否不正常（发生错误）
        if (!response.ok) {
          throw new Error(responseData.message); // 抛出带有响应消息的错误
        }

        setIsLoading(false); // 请求完成后，将加载状态设为false
        return responseData; // 返回响应数据
      } catch (err) {
        setError(err.message); // 将错误状态设为错误消息
        setIsLoading(false); // 将加载状态设为false
        throw err; // 再次抛出错误，以便调用者处理
      }
    },
    []
  );

  // 函数用于清除任何现有的错误
  const clearError = () => {
    setError(null);
  };

  // // useEffect用于组件卸载时清除所有未完成的请求
  // useEffect(() => {
  //   return () => {
  //     // 清除所有未完成的请求
  //     activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
  //   };
  // }, []);

  return { isLoading, error, sendRequest, clearError };//回了一个对象，这个对象包含了钩子内部管理的状态和函数。
};

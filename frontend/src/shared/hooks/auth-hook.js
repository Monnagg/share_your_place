import {useState, useCallback,useEffect} from 'react'

let logoutTimer;

export const useAuth = ()=>{
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(false);
    const [tokenExpDate, setTokenExpDate] = useState();
  
    const login = useCallback((userId,token,expirationDate) => {
      setToken(token);
      setUserId(userId);
      const tokenExpirationDate = expirationDate||new Date(new Date().getTime()+ 1000* 60*60);
      setTokenExpDate(tokenExpirationDate)
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: userId,
          token: token,
          expiration: tokenExpirationDate.toISOString()
        })
      );
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setUserId(null);
  localStorage.removeItem('userData')
    }, []);
  
    useEffect(() => {
      // 检查 token 和 tokenExpirationDate 是否存在
      if (token && tokenExpDate) {
        // 计算剩余时间，单位为毫秒
        const remainingTime = tokenExpDate.getTime() - new Date().getTime();
        // 设置一个定时器，在 token 过期时调用 logout 函数
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        // 如果没有 token 或 tokenExpirationDate，则清除定时器
        clearTimeout(logoutTimer);
      }
    }, [token, logout, tokenExpDate]); // 依赖项：token, logout, tokenExpirationDate
    
  
    useEffect(() => {
      // 从 localStorage 中获取存储的用户数据并解析为对象
      const storedData = JSON.parse(localStorage.getItem('userData'));
      
      // 检查是否有存储的数据，并且 token 存在
      // 以及 token 的过期时间是否在当前时间之后
      if (
        storedData &&
        storedData.token &&
        new Date(storedData.expiration) > new Date()
      ) {
        // 如果条件成立，则调用 login 函数，传入用户 ID、token 和过期时间
        console.log(storedData.token);
        login(storedData.userId, storedData.token, new Date(storedData.expiration));
      }
    }, [login]); // 依赖项：login，当 login 函数发生变化时，重新执行 useEffect
    return { token, login, logout, userId };

}
import React, { useState, useEffect } from 'react';
import { render as renderAmis } from 'amis';
import './App.css';

function App() {
  const [pageSchema, setPageSchema] = useState(null);

  // 获取页面配置
  useEffect(() => {
    fetch('/api/page-config.json')
      .then(response => response.json())
      .then(data => {
        setPageSchema(data.data);
      })
      .catch(error => {
        console.error('获取页面配置失败:', error);
      });
  }, []);

  if (!pageSchema) {
    return <div>加载中...</div>;
  }

  return (
    <div className="app-container">
      {renderAmis(pageSchema, {}, {
        fetcher: async ({url, method = 'GET'}) => {
          console.log('请求:', url);
          try {
            const response = await fetch(url, { method });
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            console.log('响应:', data);
            return { data };
          } catch (error) {
            console.error('请求失败:', error);
            return { 
              data: { 
                status: 1, 
                msg: '请求失败: ' + error.message 
              } 
            };
          }
        }
      })}
    </div>
  );
}

export default App;

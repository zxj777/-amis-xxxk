import React, { useState } from 'react';
import { render as renderAmis } from 'amis';
import './App.css';

function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // 主页面配置
  const mainSchema = {
    type: "page",
    title: "用户管理",
    body: [
      {
        type: "crud",
        api: "/api/users.json",
        columns: [
          { name: "id", label: "ID" },
          { name: "name", label: "姓名" },
          { name: "email", label: "邮箱" },
          { name: "department", label: "部门" },
          {
            type: "operation",
            label: "操作",
            buttons: [
              {
                type: "button",
                label: "查看详情",
                level: "link",
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: "custom",
                        script: `
                          // 通过自定义脚本来调用 React 组件的方法
                          window.showUserDetail && window.showUserDetail(event.data.id);
                        `
                      }
                    ]
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  };

  // 详情区域配置（动态渲染）
  const detailSchema = showDetail ? {
    type: "container",
    style: {
      marginTop: "20px",
      border: "2px solid #007bff", 
      borderRadius: "8px",
      backgroundColor: "#f8f9ff"
    },
    body: [
      {
        type: "flex",
        justify: "space-between",
        alignItems: "center",
        style: {
          padding: "15px 20px",
          backgroundColor: "#007bff",
          color: "white",
          margin: "-1px -1px 20px -1px",
          borderRadius: "6px 6px 0 0"
        },
        items: [
          {
            type: "tpl",
            tpl: "👤 用户详情",
            style: {
              fontSize: "16px",
              fontWeight: "bold"
            }
          },
          {
            type: "button",
            label: "✕ 关闭",
            level: "link",
            size: "sm",
            style: { color: "white" },
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: "custom",
                    script: "window.hideUserDetail && window.hideUserDetail();"
                  }
                ]
              }
            }
          }
        ]
      },
      {
        type: "service",
        api: `/api/user-detail-${selectedUserId}.json`,
        body: [
          "${detailSchema}"
        ],
        style: {
          padding: "0 20px 20px 20px"
        }
      }
    ]
  } : null;

  // 完整的页面配置（包含主内容和详情）
  const fullSchema = {
    type: "page", 
    title: "用户管理",
    body: [
      mainSchema.body[0], // 表格
      ...(detailSchema ? [detailSchema] : []) // 详情（如果显示的话）
    ]
  };

  // 暴露方法给 amis 调用
  React.useEffect(() => {
    window.showUserDetail = (userId) => {
      console.log('显示用户详情:', userId);
      setSelectedUserId(userId);
      setShowDetail(true);
    };
    
    window.hideUserDetail = () => {
      console.log('隐藏用户详情');
      setShowDetail(false);
      setSelectedUserId(null);
    };

    return () => {
      delete window.showUserDetail;
      delete window.hideUserDetail;
    };
  }, []);

  return (
    <div className="app-container">
      {renderAmis(fullSchema, {}, {
        fetcher: async ({url, method = 'GET'}) => {
          console.log('请求:', url);
          try {
            const response = await fetch(url, { method });
            if (!response.ok) {
              // 如果特定用户详情不存在，使用默认的详情页面
              if (url.includes('user-detail-') && !url.includes('user-detail-1.json')) {
                console.log('用户详情不存在，使用默认详情');
                const fallbackResponse = await fetch('/api/user-detail.json', { method });
                const data = await fallbackResponse.json();
                return { data };
              }
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

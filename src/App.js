import React from 'react';
import { render as renderAmis } from 'amis';
import './App.css';

// 简化的页面配置
const pageSchema = {
  type: "page",
  title: "用户管理",
  body: [
    {
      type: "service",
      name: "mainService",
      data: {
        showDetail: false,
        detailId: null
      },
      body: [
        // 数据表格
        {
          type: "crud",
          name: "userTable",
          api: "/api/users.json",
          columns: [
            { name: "id", label: "ID", width: 80 },
            { name: "name", label: "姓名" },
            { name: "email", label: "邮箱" },
            {
              name: "department",
              label: "部门",
              type: "mapping",
              map: {
                "tech": "技术部",
                "sales": "销售部",
                "marketing": "市场部",
                "hr": "人事部"
              }
            },
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
                          actionType: "setValue",
                          componentId: "mainService",
                          args: {
                            value: {
                              showDetail: true,
                              detailId: "${id}"
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          ]
        },

        // 详情区域
        {
          type: "container",
          visibleOn: "${showDetail}",
          style: {
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px"
          },
          body: [
            {
              type: "service",
              name: "detailContainer",
              api: {
                method: "get",
                url: "/api/user-detail.json",
                data: { id: "${detailId}" }
              },
              body: "${detailSchema}"
            }
          ]
        }
      ]
    }
  ]
};

function App() {
  return (
    <div className="app-container">
      {renderAmis(pageSchema)}
    </div>
  );
}

export default App;

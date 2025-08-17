import React, { useState, useEffect } from 'react';
import { Table, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const CustomTable = (props) => {
  const { data, dispatchEvent, columns: amisColumns } = props;
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data && data.items) {
      setTableData(data.items);
    }
  }, [data]);

  const handleViewDetail = (record) => {
    // 使用amis的事件系统
    if (dispatchEvent) {
      dispatchEvent('setValue', {
        componentName: 'page',
        value: {
          selectedUserId: Number(record.id)
        }
      });
    }
  };

  // 处理 amis 事件
  const handleAmisEvent = (eventConfig, record) => {
    if (!eventConfig || !dispatchEvent) return;

    const { actions } = eventConfig;
    if (actions && Array.isArray(actions)) {
      actions.forEach(action => {
        if (action.actionType === 'setValue') {
          // 处理变量替换
          let value = action.args?.value;
          if (value && typeof value === 'object') {
            const processedValue = {};
            Object.keys(value).forEach(key => {
              let val = value[key];
              if (typeof val === 'string' && val.includes('${')) {
                // 替换变量，如 ${id} -> record.id
                val = val.replace(/\$\{(\w+)\}/g, (match, field) => {
                  const fieldValue = record[field];
                  // 如果是数字字段，确保返回数字类型
                  if (field === 'id' && !isNaN(fieldValue)) {
                    return Number(fieldValue);
                  }
                  return fieldValue || '';
                });
              }
              processedValue[key] = val;
            });
            value = processedValue;
          }

          dispatchEvent('setValue', {
            componentName: action.componentName || 'page',
            value: value
          });
        }
      });
    }
  };

  // 默认列配置
  const defaultColumns = [];

  // 将 amis 格式的列配置转换为 antd Table 格式
  const convertAmisColumnsToAntd = (amisColumns) => {
    if (!amisColumns || !Array.isArray(amisColumns)) {
      return defaultColumns;
    }

    return amisColumns.map((col, index) => {
      // 处理操作列
      if (col.type === 'operation') {
        return {
          title: col.label,
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              {col.buttons && Array.isArray(col.buttons) ? (
                col.buttons.map((button, btnIndex) => (
                  <Button
                    key={btnIndex}
                    type={button.level === 'link' ? 'link' : 'default'}
                    icon={button.icon ? <EyeOutlined /> : null}
                    onClick={() => {
                      if (button.onEvent && button.onEvent.click) {
                        handleAmisEvent(button.onEvent.click, record);
                      } else {
                        // 默认查看详情行为
                        handleViewDetail(record);
                      }
                    }}
                  >
                    {button.label}
                  </Button>
                ))
              ) : (
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetail(record)}
                >
                  查看详情
                </Button>
              )}
            </Space>
          ),
        };
      }

      // 处理普通列
      return {
        title: col.label,
        dataIndex: col.name,
        key: col.name || col.label,
        width: col.width,
        ellipsis: col.ellipsis !== false, // 默认启用省略号
        render: col.render, // 支持自定义渲染函数
      };
    });
  };

  const columns = convertAmisColumnsToAntd(amisColumns);

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      rowKey="id"
      loading={loading}
      pagination={{
        total: data?.total || 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
      }}
    />
  );
};

export default CustomTable;

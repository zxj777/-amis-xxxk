// 主页面配置
const mainPageSchema = {
    type: "page",
    title: "用户管理系统",
    body: [
        {
            type: "service",
            name: "mainService",
            data: {
                showDetail: false,
                detailId: null
            },
            body: [
                // 筛选表单
                {
                    type: "form",
                    title: "筛选条件",
                    mode: "horizontal",
                    target: "userTable",
                    submitText: "搜索",
                    body: [
                        {
                            type: "input-text",
                            name: "name",
                            label: "姓名",
                            placeholder: "请输入姓名",
                            clearable: true
                        },
                        {
                            type: "select",
                            name: "department",
                            label: "部门",
                            placeholder: "请选择部门",
                            clearable: true,
                            options: [
                                { label: "技术部", value: "tech" },
                                { label: "销售部", value: "sales" },
                                { label: "市场部", value: "marketing" },
                                { label: "人事部", value: "hr" }
                            ]
                        },
                        {
                            type: "select",
                            name: "status",
                            label: "状态",
                            placeholder: "请选择状态",
                            clearable: true,
                            options: [
                                { label: "在职", value: "active" },
                                { label: "离职", value: "inactive" },
                                { label: "试用期", value: "trial" }
                            ]
                        }
                    ]
                },
                
                // 数据表格
                {
                    type: "crud",
                    name: "userTable",
                    title: "用户列表",
                    api: "./api/users.json",
                    defaultParams: {
                        perPage: 10
                    },
                    headerToolbar: [
                        "bulkActions",
                        {
                            type: "tpl",
                            tpl: "共 ${total} 条记录",
                            className: "v-middle"
                        },
                        "pagination"
                    ],
                    footerToolbar: [
                        "statistics",
                        "pagination"
                    ],
                    columns: [
                        {
                            name: "id",
                            label: "ID",
                            width: 80,
                            sortable: true
                        },
                        {
                            name: "avatar",
                            label: "头像",
                            type: "image",
                            width: 80
                        },
                        {
                            name: "name",
                            label: "姓名",
                            searchable: true,
                            sortable: true
                        },
                        {
                            name: "email",
                            label: "邮箱",
                            type: "email"
                        },
                        {
                            name: "department",
                            label: "部门",
                            type: "mapping",
                            map: {
                                "tech": "<span class='label label-info'>技术部</span>",
                                "sales": "<span class='label label-success'>销售部</span>",
                                "marketing": "<span class='label label-warning'>市场部</span>",
                                "hr": "<span class='label label-primary'>人事部</span>"
                            }
                        },
                        {
                            name: "status",
                            label: "状态",
                            type: "mapping",
                            map: {
                                "active": "<span class='label label-success'>在职</span>",
                                "inactive": "<span class='label label-danger'>离职</span>",
                                "trial": "<span class='label label-warning'>试用期</span>"
                            }
                        },
                        {
                            name: "createTime",
                            label: "入职时间",
                            type: "datetime",
                            format: "YYYY-MM-DD"
                        },
                        {
                            type: "operation",
                            label: "操作",
                            width: 200,
                            buttons: [
                                {
                                    type: "button",
                                    label: "查看详情",
                                    level: "link",
                                    size: "sm",
                                    onEvent: {
                                        click: {
                                            actions: [
                                                {
                                                    actionType: "setValue",
                                                    componentId: "mainService",
                                                    args: {
                                                        value: {
                                                            showDetail: true,
                                                            detailId: "${id}",
                                                            currentUser: "${name}"
                                                        }
                                                    }
                                                },
                                                {
                                                    actionType: "reload",
                                                    componentId: "detailContainer"
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    type: "button",
                                    label: "编辑",
                                    level: "primary",
                                    size: "sm"
                                },
                                {
                                    type: "button",
                                    label: "删除",
                                    level: "danger",
                                    size: "sm"
                                }
                            ]
                        }
                    ]
                },

                // 动态详情容器
                {
                    type: "container",
                    visibleOn: "${showDetail}",
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
                                    tpl: "👤 ${currentUser} 的详细信息",
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
                                    style: {
                                        color: "white"
                                    },
                                    onEvent: {
                                        click: {
                                            actions: [
                                                {
                                                    actionType: "setValue",
                                                    componentId: "mainService",
                                                    args: {
                                                        value: {
                                                            showDetail: false,
                                                            detailId: null,
                                                            currentUser: null
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            type: "service",
                            name: "detailContainer",
                            api: {
                                method: "get",
                                url: "./api/user-detail.json",
                                data: {
                                    id: "${detailId}"
                                },
                                sendOn: "this.detailId"
                            },
                            body: "${detailSchema}",
                            style: {
                                padding: "0 20px 20px 20px"
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

// 初始化 amis
(function () {
    let amis = amisRequire('amis/embed');
    let amisScoped = amis.embed('#root', mainPageSchema, {
        theme: 'cxd'
    });
})();

// miniprogram/pages/todoList/todoList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

        todosList: [],
        completedList: [],

        statusType: [{
                name: "新增事项",
                page: 0
            },
            {
                name: "待完成",
                page: 1
            },
            {
                name: "已完成",
                page: 2
            }
        ],
        currentType: 0,
        list: [
            [],
            [],
            [],
            [],
            []
        ],
        goodsMap: [{}, {}, {}, {}, {}],
        logisticsMap: [{}, {}, {}, {}, {}],
        windowHeight: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        var systemInfo = wx.getSystemInfoSync()
        this.setData({
            windowHeight: systemInfo.windowHeight
        });

        // this.addTodo();
        // this.removeTodo();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    // 点击tab切换 
    swichNav: function(res) {
        if (this.data.currentType == res.detail.currentNum) return;

        this.setData({
            currentType: res.detail.currentNum
        })

        this.getTodosData(res.detail.currentNum);

    },
    // 提交表单
    formSubmit(e) {
        if (e.detail.value['todoInput']) {
            this.addTodo(e.detail.value['todoInput']);
        } else {
            wx.showToast({
                title: '请输入待办事项！',
                icon: 'none'
            })
        }
    },
    // 清空表单
    formReset() {
        console.log('formReset')
    },
    // todos cloud-action
    todosAction(_data) {
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'todosAction',
                data: {
                    ..._data
                },
                success: res => {
                    resolve(res.result.data);
                },
                fail: err => {
                    reject(err);

                }
            })
        })

    },

    // 获取todos数据
    getTodosData(curIndex) {
        const _this = this;
        if (curIndex === 0) return;

        this.todosAction({
            _type: 'getSome',
            done: curIndex === 2
        }).then(res => {
            if (curIndex === 1) {
                _this.setData({
                    todosList: res
                })
            } else {
                _this.setData({
                    completedList: res
                })
            }
        }).catch(err => {
            wx.showToast({
                icon: 'none',
                title: '获取list数据失败',
            })
            console.error('[云函数] [getTodos] 调用失败：', err)
        })
    },
    // 新增待办
    addTodo(todo) {
        this.todosAction({
            _type: 'addTodo',
            name: todo,
            done: false
        }).then(res => {
            wx.showToast({
                title: '新增事项成功',
            })
        }).catch(err => {
            wx.showToast({
                icon: 'none',
                title: '新增todo失败',
            })
            console.error('[云函数] [addTodo] 调用失败：', err)
        })
    },
    // 删除
    removeTodo(e) {
        const id = e.currentTarget.dataset['id'];

        this.todosAction({
            _type: 'removeTodo',
            id
        }).then(res => {
            wx.showToast({
                title: '删除事项成功',
            })
            this.getTodosData(this.data.currentType);
        }).catch(err => {
            wx.showToast({
                icon: 'none',
                title: '删除todo失败',
            })
            console.error('[云函数] [removeTodo] 调用失败：', err)
        })
    },
    // 切换完成状态
    switchChange(e){
        const id = e.currentTarget.dataset['id'];
        this.todosAction({
            _type: 'editTodo', 
            id,
            done: e.detail.value
        }).then(res => {
            wx.showToast({
                title: '编辑事项成功',
            })
            this.getTodosData(this.data.currentType);
        }).catch(err => {
            wx.showToast({
                icon: 'none',
                title: '编辑todo失败',
            })
            console.error('[云函数] [editTodo] 调用失败：', err)
        })
    }
})
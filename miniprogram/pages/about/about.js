// pages/about/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(res) {
        // return {
        //     title: 'VWeather',
        //     path: '/pages/index/index',
        //     imageUrl: '',
        // }
    },

    // 跳转详情
    toSystem() {
        wx.navigateTo({
            url: '/pages/system/system',
        })
    },
    // 跳转todolist
    toTODOList(){
        wx.navigateTo({
            url: '/pages/todoList/todoList',
        })
    },
    // 复制到剪贴板
    copyHandler(e){
        let _href = e.currentTarget.dataset['href'];
        wx.setClipboardData({
            data: _href,
            success(res) {
                wx.getClipboardData({
                    success(res) {
                        // console.log(res.data) // data
                    }
                })
            }
        })
    }
})
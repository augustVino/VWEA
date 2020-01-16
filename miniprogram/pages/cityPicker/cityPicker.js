// miniprogram/pages/cityPicker/cityPicker.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 当前选中的值
        province: '',
        city:'',
        district: '',

        // 数据源
        citiesData: [],

        provinces: [],
        cities: [],
        districts: [],

        value: [0,0,0],

        region: ['河北省', '张家口市', '崇礼区'],
        customItem: '全部'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取省市区数据
        this.getCitiesData();
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
    onShareAppMessage: function () {

    },
    // 滚动时 改变数据源
    bindChange(e){
        
        this.setData({
            value: e.detail.value
        });
        let { provinces, cities, districts } = this.sortData();
        console.log(provinces)
        this.setData({
            provinces, cities, districts,
            province: provinces[e.detail.value[0]].name,
            city: cities[e.detail.value[1]].name,
            district: districts[e.detail.value[2]].name
        })
    },
    // 获取城市数据
    getCitiesData() {
        const _this = this;
        // 1.先从本地储存中同步获取储存的数据 key
        let cityDatas = wx.getStorageInfoSync({
            key: 'citiesData',
            success: (res) => {
                
            }
        });
        // 2.判断本地储存的keys中是否有城市数据
        if (cityDatas && cityDatas.keys.includes('citiesData')) {
            // 3.有的话，直接获取并赋值
            wx.getStorage({
                key: 'citiesData',
                success: (res) => {
                    const { provinces, cities, districts } = this.sortData(res.data);
                    _this.setData({
                        citiesData: res.data, provinces, cities, districts,
                        province: provinces[this.data.value[0]].name,
                        city: cities[this.data.value[1]].name,
                        district: districts[this.data.value[2]].name
                    })
                }
            })
        } else {
            // 4.没有储存过的话，调用云函数获取，然后储存起来
            wx.cloud.callFunction({
                name: 'getCities',
                data: {},
                success: res => {
                    let data = res.result.data[0].data
                    // console.log(data)
                    wx.setStorage({
                        key: 'citiesData',
                        data
                    });
                    const { provinces, cities, districts } = this.sortData(data);
                    _this.setData({
                        citiesData: data, provinces, cities, districts,
                        province: provinces[this.data.value[0]].name,
                        city: cities[this.data.value[1]].name,
                        district: districts[this.data.value[2]].name
                    })
                },
                fail: err => {
                    wx.showToast({
                        icon: 'none',
                        title: '调用失败',
                    })
                    console.error('[云函数] [city] 调用失败：', err)
                }
            })
        }
    },
    // 处理数据
    sortData(data){
        data = data || this.data.citiesData

        let indexArr = this.data.value;
        let provinces = data;
        let cities = data[indexArr[0]].cities;
        let districts = data[indexArr[0]].cities[indexArr[1]].districts;
        return { provinces, cities, districts };
    },
    bindRegionChange(e){
        this.setData({
            region: e.detail.value
        })
    }
})
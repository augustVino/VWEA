//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    // 当前城市天气
    curWeatherInfo:{},
    hasCurWeatherInfo: false,
    // 是否切换了城市
    located: true,

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getCurLatLon();


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 调用微信接口，获取当前位置的经纬度
  getCurLatLon(){
    const _this = this;
    wx.getLocation({
      success: function(res) {
        console.log(res)
        const { latitude,longitude} = res;
        
        _this.getCurWeather(latitude, longitude);
      },
    })
  },
  // 获取天气
  getCurWeather(lat, lon){
    const _this = this;
    app.client.callMinaAPI({
      domain: app.config.API_URL.HEFENG_API,
      moduleName: 's6/weather/now',
      params: {
        key: app.config.API_KEY.HEFENG_KEY,
        location: lat + ',' + lon
      },
      success: res => {
        _this.hasCurWeatherInfo = true
        _this.setData({
          curWeatherInfo: res.HeWeather6[0],
          hasCurWeatherInfo:true
        })
      }
    })
    
  },
  // 选择城市 
  toCitychoose(){

  }
})

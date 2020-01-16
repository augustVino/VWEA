const jinrishici = require('../../utils/jinrishici.js')
let utils = require('../../utils/utils')

import { normalWeather, hourWeather } from '../../api/HF_API.js'

let globalData = getApp().globalData
let SYSTEMINFO = globalData.systeminfo



Page({
    data: {
        isIPhoneX: globalData.isIPhoneX,
        // 今日诗词
        famousRemark:'',
        // 当前天气数据
        curWeather: {},

        // 所有城市数据
        citiesData:[],

        hourlyDatas: [],
        weatherIconUrl: globalData.weatherIconUrl,
        detailsDic: {
            key: ['tmp', 'fl', 'hum', 'pcpn', 'wind_dir', 'wind_deg', 'wind_sc', 'wind_spd', 'vis', 'pres', 'cloud', ''],
            val: {
                tmp: '温度(℃)',
                fl: '体感温度(℃)',
                hum: '相对湿度(%)',
                pcpn: '降水量(mm)',
                wind_dir: '风向',
                wind_deg: '风向角度(deg)',
                wind_sc: '风力(级)',
                wind_spd: '风速(mk/h)',
                vis: '能见度(km)',
                pres: '气压(mb)',
                cloud: '云量',
            },
        },
        lifestyles: {
            'comf': '舒适度指数',
            'cw': '洗车指数',
            'drsg': '穿衣指数',
            'flu': '感冒指数',
            'sport': '运动指数',
            'trav': '旅游指数',
            'uv': '紫外线指数',
            'air': '空气污染扩散条件指数',
            'ac': '空调开启指数',
            'ag': '过敏指数',
            'gl': '太阳镜指数',
            'mu': '化妆指数',
            'airc': '晾晒指数',
            'ptfc': '交通指数',
            'fsh': '钓鱼指数',
            'spi': '防晒指数',
        },
        
        setting: {},

        region: ['河北省', '张家口市', '崇礼区'],
        customItem: ''
    },
    
    
    // wx.openSetting 要废弃，button open-type openSetting 2.0.7 后支持
    // 使用 wx.canIUse('openSetting') 都会返回 true，这里判断版本号区分
    canUseOpenSettingApi() {
        let systeminfo = getApp().globalData.systeminfo
        let SDKVersion = systeminfo.SDKVersion
        let version = utils.cmpVersion(SDKVersion, '2.0.7')
        if (version < 0) {
            return true
        } else {
            return false
        }
    },
    
    
    onShow() {
        
    },
    onLoad() {
        this.init();

        // 设置页面导航条颜色
        wx.setNavigationBarColor({
            frontColor:'#000000',
            backgroundColor: '#b7b8ba'
        })
    },
    // 小程序顶部转发设置
    onShareAppMessage(res) {
        return {
            title: 'VWeather',
            path: '/pages/index/index',
            imageUrl: '',
        }
    },
    // 小程序下拉刷新
    onPullDownRefresh(res) {
        this.init()
    },


    // 页面初始化
    init() {
        // 判断小程序是否需要升级新版本
        this.checkUpdate()

        // 获取城市数据
        // this.getCitiesData()
        
        // 获取今日诗词数据
        this.getFamousRemark()

        // 获取微信当前定位经纬度
        this.getCurLocation({})
    },
    // 获取微信当前定位经纬度
    getCurLocation(params, callback) {
        const _this = this;
        wx.getLocation({
            success: (res) => {
                this.getWeather(`${res.latitude},${res.longitude}`)
                this.getHourly(`${res.latitude},${res.longitude}`)
                callback && callback()
            },
            fail: (res) => {
                wx.stopPullDownRefresh()

                let errMsg = res.errMsg || ''
                // 拒绝授权地理位置权限
                if (errMsg.indexOf('deny') !== -1 || errMsg.indexOf('denied') !== -1) {
                    wx.showToast({
                        title: '需要开启地理位置权限',
                        icon: 'none',
                        duration: 2500,
                        success: (res) => {
                            if (_this.canUseOpenSettingApi()) {
                                let timer = setTimeout(() => {
                                    clearTimeout(timer)
                                    wx.openSetting({})
                                }, 2500)
                            } else {

                            }
                        },
                    })
                } else {
                    wx.showToast({
                        title: '网络不给力，请稍后再试',
                        icon: 'none',
                    })
                }
            }
        })
    },
    // 获取天气数据
    getWeather(location) {
        const _this = this;
        normalWeather({ location }).then(res => {
            // 关闭下拉刷新
            wx.stopPullDownRefresh();
            
            let data = res.HeWeather6[0];
            
            let curTime = data.update.loc.split('-');
            data.updateTimeFormat = curTime[1] + '-' + curTime[2];
            
            this.setData({
                curWeather: data,
            })
        }).catch(err => {
            wx.showToast({
                title: '获取天气失败',
                icon: 'none',
            })
        })
    },
    // 获取24小时逐3小时预报
    getHourly(location) {
        const _this = this;
        hourWeather({ location }).then(res => {
            // console.log(res)
            let data = res.HeWeather6[0]
            _this.setData({
                hourlyDatas: data.hourly || []
            })
        }).catch(err => {
            wx.showToast({
                title: '查询失败',
                icon: 'none',
            })
        })
    },
    // 升级小程序
    checkUpdate() {
        // 兼容低版本
        if (!wx.getUpdateManager) {
            return
        }
        let updateManager = wx.getUpdateManager()
        // updateManager.onCheckForUpdate((res) => {
        //     console.error(res)
        // })
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已下载完成，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })
    },

    // 获取城市数据
    getCitiesData(){
        const _this = this;
        // 1.先从本地储存中同步获取储存的数据 key
        let cityDatas = wx.getStorageInfoSync({
            key: 'citiesData',
            success: (res) => {
                
            }
        });
        // 2.判断本地储存的keys中是否有城市数据
        if (cityDatas && cityDatas.keys.includes('citiesData')){
            // 3.有的话，直接获取并赋值
            wx.getStorage({
                key: 'citiesData',
                success: (res) => {
                    _this.setData({
                        citiesData: res.data
                    })
                }
            })
        }else{
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
                    _this.setData({
                        citiesData: data
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
    // 获取今日诗词
    getFamousRemark(){
        jinrishici.load(result => {
            this.setData({ "famousRemark": result.data.content })
        })
    },
    // 选择城市
    bindRegionChange: function (e) {
        this.getWeather(`${e.detail.value[2]}`);
        this.getHourly(`${e.detail.value[2]}`)
    },
    // 跳转详情
    toDetail(){
        wx.navigateTo({
            url: '/pages/about/about',
        })
    }
})
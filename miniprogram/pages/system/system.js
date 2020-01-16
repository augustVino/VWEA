// miniprogram/pages/system.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        systemInfo:{},
        // 当前屏幕亮度
        curBrightness: 0,
        // 扫码结果
        scanCodeInfo: {},
        // 是否设置屏幕常亮
        switchScreenStatus: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取设备信息
        wx.getSystemInfo({
            success: res=>{
                this.setData({
                    systemInfo:res
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '获取系统信息失败',
                })
            }
        });

        // 获取设备电量
        wx.getBatteryInfo({
            success: res => {
                this.setData({
                    systemInfo: { ...this.data.systemInfo, batteryLevel: res.level, batteryIsCharging: res.isCharging}
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '获取设备电量失败',
                })
            }
        });

        // 获取设备是否支持NFC
        wx.getHCEState({
            success: res=> {
                let code = res.errCode;
                let msg = '';
                if (code == 13000){
                    msg = '不支持';
                } else if (code == 13001){
                    msg = '当前设备支持NFC，但系统NFC开关未开启';
                } else if (code == 13002) {
                    msg = '当前设备支持NFC，但不支持HCE';
                } else if (code == 13004) {
                    msg = '未设置微信为默认NFC支付应用';
                }
                this.setData({
                    systemInfo: { ...this.data.systemInfo, NFCInfo: msg }
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '获取系统NFC信息失败',
                })
            }
        });

        // 获取网络类型
        wx.getNetworkType({
            success: res => {
                this.setData({
                    systemInfo: { ...this.data.systemInfo, networkType: res.networkType }
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '获取网络类型失败',
                })
            }
        });

        // 获取屏幕亮度
        this.getScreenBright();
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

    // 拨打电话
    phoneCall(e){
        const num = e.currentTarget.dataset['num'];
        wx.makePhoneCall({
            phoneNumber: num
        })
    },
    
    // slider 滑动事件
    sliderchange(e){
        const val = e.detail.value;
        this.setScreenBright(val/100);
    },
    // 设置屏幕亮度
    setScreenBright(val) {
        wx.setScreenBrightness({
            value: val,
            success: res => {
                this.setData({
                    curBrightness: val
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '设置屏幕亮度失败',
                })
            }
        })
    },
    // 获取屏幕亮度
    getScreenBright() {
        wx.getScreenBrightness({
            success: res => {
                this.setData({
                    curBrightness: res.value
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '设置屏幕亮度失败',
                })
            }
        })
    },
    // 扫码
    scanCode(){
        wx.scanCode({
            // 是否只能从相机扫码，不允许从相册选择图片
            onlyFromCamera: false,
            // 扫码类型
            // scanType
            success: res => {
                console.log(res)
                this.setData({
                    scanCodeInfo: res
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '扫码失败',
                })
            }
        })
    },
    // 短振动
    vibrateShort(){
        wx.vibrateShort({
            success: res => {
                console.log(res)
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '振动失败',
                })
            }
        })
    },
    // 长振动
    vibrateLong() {
        wx.vibrateLong({
            success: res => {
                console.log(res)
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '振动失败',
                })
            }
        })
    },
    // 清除缓存
    clearStorage(){
        wx.clearStorage();
    },
    // 设置屏幕是否常亮
    keepScreenOn(e){
        wx.setKeepScreenOn({
            keepScreenOn: e.detail.value,
            success: res => {
                this.setData({
                    switchScreenStatus: e.detail.value
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '振动失败',
                })
            }
        })
    }
})
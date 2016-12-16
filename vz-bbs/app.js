//app.js
var api = require("/utils/api.js")
var util = require("/utils/util.js");
var crypt = require("/utils/crypt.js");
var constdata = require("/utils/constdata.js");
App({
  onLaunch: function () {
    let that = this
    // that.getInitData()
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  /**
   * 获取初始信息
   */
  getInitData: function (cb) {
    let that = this
    // wx.clearStorageSync()
    let init = wx.getStorageSync('init')

    console.log("显示初始数据", init)

    if (init && typeof cb == "function") {
      cb(init)
    } else {
      util.showLoading("初始化数据")
      api.wxApi(wx.login)({})
        .then(function (loginRes) {
          return "https://api.weixin.qq.com/sns/jscode2session?" + "appid=wx61575c2a72a69def&secret=442cc056f5824255611bef6d3afe8d33&" +
            "js_code=" + loginRes.code + "&grant_type=authorization_code";
        })
        .then(function (url) {
          return api.wxApi(wx.request)({ "url": url, "method": "GET" })
            .then(function (sessionRes) {
              return sessionRes
            })
        })
        .then(function (sessionRes) {
          return api.wxApi(wx.getUserInfo)({})
            .then(function (userInfoRes) {
              var str = crypt.decryptUserInfo(userInfoRes.encryptedData, sessionRes.data.session_key, userInfoRes.iv); // 解密用户信息
              var userInfo = JSON.parse(str);
              console.log("获取用户信息成功", userInfo)
              wx.setStorageSync('userInfo', userInfo)
              wx.setStorageSync('unionId', userInfo.unionId)
              return userInfo
            })
        })
        .then(function (userInfo) {
          let verifyModel = util.primaryLoginArgs();
          /**
          * loginByWeiXin
          */
          // let u = wx.getStorageSync('userInfo')
          let data = {
            "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
            "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,

            "openid": userInfo.openId, "nickname": userInfo.nickName, "sex": userInfo.gender,
            "province": userInfo.province, "city": userInfo.city, "country": userInfo.country,
            "headimgurl": userInfo.avataUrl, "unionid": userInfo.unionId
          }
          api.loginByWeiXin(data)
          .then(function(success){
            return success
          })
          .then(function(success) {
            data = {
              "fid": constdata.minisnsId, "deviceType": verifyModel.deviceType, "uid": verifyModel.uid,
              "sign": verifyModel.sign, "timestamp": verifyModel.timestamp, "versionCode": verifyModel.versionCode
            }
            return api.user(data)
              .then(function (success) {
                wx.setStorageSync('user', success.obj._LookUser);
                wx.setStorageSync('minisns', success.obj._Minisns);
                wx.setStorageSync('myArtCount', success.obj._MyArtCount);
                wx.setStorageSync('myMinisnsCount', success.obj._MyMinisnsCount);
                wx.setStorageSync('concernCount', success.obj.ConcernCount);
                wx.setStorageSync('myConcernCount', success.obj.MyConcernCount);
                wx.setStorageSync('unionId', success.obj._LookUser.unionid)
                // result.obj.tmpFile = wx.getStorageSync('tmpFile');
                wx.setStorageSync('init', success);
                util.endLoading()
                if (typeof cb == "function") {
                  cb(success);
                }
                console.log("初始化数据完成")
              })
          })
        })
    }
  },
  /**
   * 获取最新用户信息
   */
  getNewInitData(cb) {
    let that = this
    wx.clearStorageSync()
    that.getInitData(cb)
  },
  
  globalData: {
    userInfo: null
  }
})
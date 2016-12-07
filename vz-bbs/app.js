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
    let init = wx.getStorageSync('init')
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
          return api.wxApi(wx.downloadFile)({ "url": "https://snsapi.vzan.com/images/vzan.jpg", "type": "image" })
            .then(function (res) {
              console.log("下载文件成功", res)
              wx.setStorageSync('tmpFile', res.tempFilePath)
              return res.tempFilePath
            })
        })
        .then(function (tmpFile) {
          return api.wxApi(wx.saveFile)({ "tempFilePath": tmpFile })
            .then(function (res) {
              console.log("保存下载文件到本地成功", res)
              wx.setStorageSync('tmpFile', res.savedFilePath);
              return res.savedFilePath
            })
        })
        .then(function (tmpFile) {
          let verifyModel = util.primaryLoginArgs();
          let data = {
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
              if (typeof cb == "function"){
                cb(success);
              }
              console.log("初始化数据完成")
            })
        })
    }
  },
  globalData: {
    userInfo: null
  }
})
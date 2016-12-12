
var util = require("../../utils/util.js")
var crypt = require("../../utils/crypt.js")
var api = require("../../utils/api.js")
var app = getApp();

var that
Page({
  data: {
    selected: 1,
    scoreList: null, // 积分列表
    exchangeList: null // 兑换列表
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    that = this
    this.init();
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  /**
   * 初始化数据
   */
  init: function () {

    app.getInitData(function (result) {
      var tmpFile = result.obj.tmpFile;
      var minisId = result.obj._Minisns.Id+"";
      var unionid = result.obj._LookUser.unionid;
      var verifyModel = util.primaryLoginArgs(unionid);
      api.integralLog({
        "deviceType": verifyModel.deviceType, "uid": verifyModel.uid, "versionCode": verifyModel.versionCode,
        "timestamp": verifyModel.timestamp, "sign": verifyModel.sign, fid: minisId
      }).then(function (success) {
        let scoreList = success.objArray || []
        scoreList.forEach(function (item) {
          item.CreateDate = item.CreateDate.replace("T", " ")
        })
        that.setData({ "scoreList": scoreList })
      })
    })
  },

  /**
   * 切换列表
   */
  showList: function (e) {
    let id = e.currentTarget.dataset.id;
    if (id == 1) {
      that.setData({ selected: 1 })
      // 获取积分记录
      that.getScoreList();
    } else {
      that.setData({ selected: 2 })
      // 获取兑换记录记录
      that.getExchangeList();
    }
  },

  /**
   * 获取积分记录 
   */
  getScoreList: function () {
    var that = this;
    app.getInit(function (result) {
      var minisId = result.obj._Minisns.Id+"";
      var unionid = result.obj._LookUser.unionid;
      var verifyModel = util.primaryLoginArgs(unionid);
      api.integralLog({
        "deviceType": verifyModel.deviceType, "uid": verifyModel.uid, "versionCode": verifyModel.versionCode,
        "timestamp": verifyModel.timestamp, "sign": verifyModel.sign, fid: minisId
      }).then(function (success) {
        let scoreList = success.objArray || []
        scoreList.forEach(function (item) {
          item.CreateDate = item.CreateDate.replace("T", " ")
        })
        that.setData({ "scoreList": scoreList })
      })
    })
  },

  /**
   * 获取兑换记录
   */
  getExchangeList: function () {
    var that = this;
    app.getInit(function (result) {
      var tmpFile = result.obj.tmpFile;
      var minisId = result.obj._Minisns.Id+"";
      var unionid = result.obj._LookUser.unionid;
      var verifyModel = util.primaryLoginArgs(unionid);
      api.integralexLog({
        "deviceType": verifyModel.deviceType, "uid": verifyModel.uid, "versionCode": verifyModel.versionCode,
        "timestamp": verifyModel.timestamp, "sign": verifyModel.sign, fid: minisId
      }).then(function (success) {
        let result = JSON.parse(res.data);
        console.log("获取积分兑换记录", result)
      })
    })
  },

})  
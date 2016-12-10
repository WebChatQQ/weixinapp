// pages/articles/articles.js

var api = require("../../utils/api.js")
var util = require("../../utils/util.js");
var constdata = require("../../utils/constdata.js");


var app = getApp()
var that
Page({
  data: {
    "showAddress": true,
    "pageIndex": 1,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    that = this
    that.setData({ "uid": options.id })
    that.init()
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

  init: function () {
    let uid = that.data.uid
    that.setData({ "loading": true })

    app.getInitData(function (result) {
      that.setData({ "user": result.obj._LookUser, "minisns": result.obj._Minisns })
      if (result.obj._LookUser.Id != that.data.uid) {
        wx.setNavigationBarTitle({ "tilte": "TA的发帖" })
      }
      that.getArticles(uid);
    })
  },
  /**
   * 获取我的帖子
   */
  getArticles: function () {
    let uid = that.data.uid
    var minisId = that.data.minisns.Id;
    var unionid = that.data.user.unionid;
    var verifyModel = util.primaryLoginArgs(unionid);
    util.showLoading()
    /**获取帖子 */
    api.myArticles({
      "userid": uid, "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "fid": minisId, "pageIndex": 1
    }).then(function (success) {
      let articles = success.objArray || []
      articles = util.articleFilter(articles)
      that.setData({ "articles": articles })
      util.endLoading();
    }, function (fail) {
      util.endLoading()
    })
  },

  /**
  * 上拉加载
  */
  nextPage: function () {
    let uid = that.data.uid
    var minisId = that.data.minisns.Id;
    var unionid = that.data.user.unionid;
    var verifyModel = util.primaryLoginArgs(unionid);
    let pageIndex = that.data.pageIndex + 1
    util.showLoading()
    api.myArticles({
      "userid": uid, "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "fid": minisId, "pageIndex": 1
    }).then(function (success) {
      pageIndex = success.pageIndex
      let currentArticles = that.data.articles || []
      let articles = util.articleFilter((success.objArray || []))
      currentArticles = currentArticles.concat(articles)
      that.setData({ "articles": currentArticles, "pageIndex": success.pageIndex })
      util.endLoading()
    }, function (faile) {
      util.endLoading();
    })
  },
})
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
      "fid": minisId, "pageIndex": 1+""
    }).then(function (success) {
      let articles = success.objArray || []
      articles = util.articleFilter(articles)
      that.setData({ "articles": articles })
      util.endLoading();
    }, function (fail) {
      util.endLoading()
      util.loadedSuccess()
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
      "fid": minisId, "pageIndex": pageIndex+""
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

  /**
   * 点击显示大图
   */
  previewImage: function (e) {
    let url = e.currentTarget.dataset.url
    if (url) {
      wx.previewImage({
        // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
        urls: [url],
        success: function (res) {
          console.log("展示大图成功", res)
        },
        fail: function (res) {
          console.log("展示大图失败", res)
        }
      })
    } else {
      console.log("显示大图的URL为", url)
    }
  },
  /**
    * 播放语音
    */
  playAudio: function (e) {
    let vid = e.currentTarget.dataset.id
    let vSrc = e.currentTarget.dataset.vSrc
    util.playVoice(vid, vSrc, this)
  },
  


})
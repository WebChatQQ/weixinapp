//index.js
//获取应用实例

var api = require("../../utils/api.js")
var util = require("../../utils/util.js");
var constdata = require("../../utils/constdata.js");

var app = getApp()
var that
Page({
  data: {
    "hidTop": false,
    "showSearch": false,
    "showComment": false,
    "currentCategory": { "id": 0, "hot": 0 },
    "pageIndex": 1,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    that = this
    //调用应用实例的方法获取全局数据
    that.init()
  },
  /**
   * 顶部版块显示
   */
  scroll: function (e) {
    let {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY} = e.detail;
    if (scrollTop && scrollTop > 200) {
      this.setData({ "hidTop": true })
    } else {
      this.setData({ "hidTop": false })
    }
  },
  /**
   * 展示搜索框
   */
  search: function (e) {
    console.log("搜索", e)
    this.setData({ "showSearch": false })
  },
  /**
   * 关闭搜索框
   */
  cancleSearch: function (e) {
    console.log("取消搜索")
    this.setData({ "showSearch": false })
  },
  /**
   * 展示评论框
   */
  showComment: function (e) {
    console.log("展示评论框", e)
    this.setData({ "showComment": true })
  },
  /**
   * 关闭评论框
   */
  cancleComment: function (e) {
    console.log("关闭评论框", e)
    this.setData({ "showComment": false })
  },
  /**
   * 初始化
   */
  init: function () {
    app.getInitData(function (initData) {
      util.showLoading("数据记载中")
      console.log("初始化Index Page")
      let verifyModel = util.primaryLoginArgs()
      that.setData({
        "user": initData.obj._LookUser,
        "minisns": initData.obj._Minisns,
      })

      let unionId = wx.getStorageSync('unionId')
      unionId = "oW2wBwUJF_7pvDFSPwKfSWzFbc5o"
      /**获取头部信息 */
      api.headInfo({
        "deviceType": verifyModel.deviceType, "uid": verifyModel.uid, "versionCode": verifyModel.versionCode,
        "timestamp": verifyModel.timestamp, "sign": verifyModel.sign, "id": constdata.minisnsId
      }).then(function (success) {
        that.setData({
          "headInfo": {
            "backMap": success.obj.BackMap, "logoUrl": success.obj.LogoUrl, "articleCount": success.obj.ArticleCount,
            "clickCount": success.obj.ClickCount, "isSign": success.obj.IsSign, "isConcern": success.obj.IsConcern
          },
          "categories": success.obj.Categories
        })
        wx.setStorageSync('categories', success.obj.Categories);
      })
      /**获取帖子 */
      api.articles({
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": unionId, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        "fid": constdata.minisnsId, "hotshow": 0, "categoryId": 0, "pageIndex": 1
      }).then(function (success) {
        let articles = success.objArray || []
        articles = util.articleFilter(articles)
        that.setData({ "articles": articles})
        util.endLoading();
      }, function(fail) {
        util.endLoading()
      })
    })




  }


})

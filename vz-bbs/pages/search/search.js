// pages/search/search.js
var api = require("../../utils/api.js")
var util = require("../../utils/util.js")

var app = getApp()
var that

Page({
  data: {
    "pageIndex": 1,
    "fixed": false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let keyWord = options.keyWord || ""
    this.setData({ "keyWord": keyWord })
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

  init: function () {
    app.getInitData(function (result) {
      var minisId = result.obj._Minisns.Id+"";
      var unionid = result.obj._LookUser.unionid;
      var verifyModel = util.primaryLoginArgs(unionid);
      // 设置全局数据
      that.setData({ "user": result.obj._LookUser, "minisns": result.obj._Minisns })
      let keyWrod = that.data.keyWord;
      that.searchHandler(keyWrod);
    })
  },

  /**
     * 搜索
     */
  search: function (e) {
    let keyWord = e.detail.value.keyWord
    this.searchHandler(keyWord)
  },
  searchHandler: function (keyWrod) {
    var minisId = that.data.minisns.Id+"";
    var unionid = that.data.user.unionid;
    var verifyModel = util.primaryLoginArgs(unionid);
    let data = {
      "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "id": minisId, "keyWord": keyWrod, "pageIndex": 1
    }
    that.setData({ "loading": true })
    util.showLoading()
    api.getartlistbykeyword(data)
      .then(function (success) {
        let articles = success.objArray
        articles = util.articleFilter(articles)
        that.setData({ "articles": articles })
        that.setData({ "loading": false })
        util.endLoading()
      }, function (fail) {
        that.setData({ "loading": false })
        util.endLoading()
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
   * 搜索下一页
   */
  nextPage: function (e) {
    let verifyModel = util.primaryLoginArgs()
    let currentCategory = this.data.currentCategory
    let pageIndex = that.data.pageIndex + 1 + ""
    var minisId = that.data.minisns.Id+"";
    util.showLoading()
    api.getartlistbykeyword({
      "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "id": minisId, "keyWord": keyWrod, "pageIndex": pageIndex
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

  scroll: function (e) {
    let scrollTop = e.detail.scrollTop
    if (scrollTop >= 200) {
      this.setData({ "fixed": true })
    } else {
      this.setData({ "fixed": false })
    }
  },

  /**
    * 播放语音
    */
  playAudio: function (e) {
    let vid = e.currentTarget.dataset.id
    let vSrc = e.currentTarget.dataset.vSrc
    util.playVoice(vid, vSrc)
  },
})
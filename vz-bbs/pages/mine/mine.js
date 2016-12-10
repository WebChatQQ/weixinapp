// pages/user/user.js

var app = getApp()
var that
var api = require("../../utils/api.js")
var util = require("../../utils/util.js");
var constdata = require("../../utils/constdata.js");
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this
    that.init()
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  /**
   * 获取用户关注论坛列表
   */
  init: function () {
    let that = this;
    app.getInitData(function (result) {
      var tmpFile = result.obj.tmpFile;
      var minisns = result.obj._Minisns;
      var user = result.obj._LookUser;
      var verifyModel = util.primaryLoginArgs(user.unionid);
      that.setData({
        user: user,
        minisns: minisns,
        info: { articleCount: user.ArticleCount }
      })
    })
  },
})
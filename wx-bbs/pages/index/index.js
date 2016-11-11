var index = require("../../data/index-list.js")
var typeList
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    articles: [],
    pageIndex:1,
    pageSize:2,
    audioIcon:"http://i.pengxun.cn/content/images/voice/voiceplaying.png",
    css:{
      "bankuaiSelected":""
    },
    typeList:[],
    currentTypeId:0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    this.ready();
  },
  more_bankuai: function () {
    console.log ("获取更多版块");
  },
  // 加载数据
  ready: function () {
    console.log ("ready: 获取初始数值");
    console.log ("ready: " + index);
    this.setData({
      articles:index.articles.slice(0,10),
      typeList:index.typeList
    })
    console.log ("ready " + this.data.articles);
  },
  moreArticle: function (event) {
    console.log ("moreArticle: 加载更多");
    console.log("moreArticle: pageIndex: " + event.target.dataset.pageIndex);
    wx.showNavigationBarLoading();
    var first = (this.data.pageIndex) * this.data.pageSize;
    this.getArticle(first);
  },
  getArticle:function(first) {
    console.info(first);
    if ( (first == "undefined") || (first == null) ) {
      first = 1;
    }
    if (first > index.articles.length) {
      wx.hideNavigationBarLoading();
      return
    }
    var end = first + this.data.pageSize;
    if (end > index.articles.length) {
        end = index.articles.length;
    }
    var newArticle = index.articles.slice(first, end);
    this.setData({
      articles:this.data.articles.concat(newArticle),
      pageIndex:parseInt(this.data.pageIndex)+1
    });
    wx.hideNavigationBarLoading();
  },
  // 点击版块跳转
  toBankuai: function (event) {
    console.log("点击版块跳转");
    console.log(event.target.dataset);
    var typeId = event.target.dataset.typeId;
    var hot = event.target.dataset.hot;
    console.log(typeId);
    console.log(hot);
    this.setData({
      currentTypeId:1,
      articles:this.data.articles
    })
  },
  // 展开箭头
  openArrow: function(event) {
    console.info("openArrow: ");
    wx.showActionSheet({
        itemList:["举报", "取消"],
        success: function(res) {

          if (res.tapIndex==0) {
            // 举报
            console.info("举报");
          }
          console.info("openArrow: success");
          console.info(res);
        },
        fail: function(res) {
          console.info("openArrow: fail: ");
          console.info(res);
        },
        complete: function(res) {
          console.info("openArrow: complete ");
          console.info(res);
        }
    });
  }
})

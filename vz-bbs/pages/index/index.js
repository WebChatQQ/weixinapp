//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    "hidTop": false,
    "showSearch":false,
    "showComment":false,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
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
  search: function(e){
    console.log("搜索", e)
    this.setData({"showSearch":false})
  },
  /**
   * 关闭搜索框
   */
  cancleSearch: function(e) {
    console.log("取消搜索")
    this.setData({"showSearch":false})
  },
  /**
   * 展示评论框
   */
  showComment: function(e) {
    console.log("展示评论框", e)
    this.setData({"showComment":true})
  },
  /**
   * 关闭评论框
   */
  cancleComment: function(e) {
    console.log("关闭评论框", e)
    this.setData({"showComment":false})
  }


})

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    "hidTop": false
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
    if (scrollTop && scrollTop > 500) {
      this.setData({ "hidTop": true })
    } else {
      this.setData({ "hidTop": false })
    }
  }
})

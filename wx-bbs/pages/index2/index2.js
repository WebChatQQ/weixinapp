var index = require("../../data/index-list.js")
var util = require("../../utils/util.js")
var crypt = require("../../utils/crypt.js")
var app = getApp()
Page({
  data:{
    loading:true,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.init()
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
  init: function(){
      var that = this;
      // 获取用户信息
      app.getInit2(function(result){
          that.setData({"user":result.obj._LookUser, "minisns":result.obj._Minisns})
      })
      // 获取头部信息

      that.setData({"headinfo":index.headinfo,"articles":index.articles,"loading":false})
  },
  /**
   * 跳转版块
   */
  toBankuai:function(event) {
    var that = this;
    console.log("点击版块跳转", event);
    var typeId = event.currentTarget.dataset.typeid;
    var hot = event.currentTarget.dataset.hot;
    if (hot) {
      typeId = 0;
      hot = 1;
    } else {
      typeId= typeId;
      hot = 0;
    }
    that.setData({currentTypeId:typeId, hot:hot, articles:[], loading:true});
    // 获取articles
    var minisId = that.data.minisns.Id;
    var unionid = that.data.user.unionid;
    var verifyModel = util.primaryLoginArgs(unionid);
    that.setData({"articles":index.category.objArray,"loading":false})

    // wx.request({
    //   url: 'https://xiuxun.top/wx/app/minisnsapp/getartlistbyminisnsid',
    //   data: {"deviceType":verifyModel.deviceType, "timestamp":verifyModel.timestamp, 
    //     "uid": unionid, "versionCode":verifyModel.versionCode, "sign":verifyModel.sign,
    //     "fid": minisId, "hotshow":1, "categoryId": that.data.currentTypeId, "pageIndex":1},
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: function(res){
    //       var result = res.data;
    //       that.setData({articles:result.objArray, pageIndex:1});
    //   },
    //   complete: function() {
    //       that.setData({loading:false})
    //   }
    // })
  },
  /**
   * 更多版块
   */
  moreType: function(event) {
    var that = this;
    var categories = that.data.headinfo.obj.Categories //wx.getStorageSync('categories');
    if (typeof categories == "undefined") {
      return ;
    }
    var typeIds = [];
    var typeNames = [];
    for (var i = 0; i < categories.length; i++) {
      typeIds[i] = categories[i].Id;
      typeNames[i] = categories[i].Title;
    }
    wx.showActionSheet({
        itemList:typeNames,
        success:function(res){
          if (res.cancel) { console.log("取消");
          } else {
            // 获取新的内容
            var idx = res.tapIndex;
            var typeId = typeIds[idx];
            that.typeChange(typeId);
          }
        }
    })
  },
  typeChange: function(typeId) {
      var that = this;
      var tmp =that.data.headinfo.obj.Categories;
      var typeList = tmp;
      for (var i=0 ; i<typeList.length ; i++) {
          if (typeList[i].Id == typeId) {
            var tmpType={ Id:typeId, Title:typeList[i].Title }
            typeList.splice(i,1);
            typeList.splice(0, 0, tmpType);
          }
      }
      // 获取新的数据
      var minisId = that.data.minisns.Id;
      var unionid = that.data.user.unionid;
      var verifyModel = util.primaryLoginArgs(unionid);
      let headinfo = that.data.headinfo
      headinfo.obj.Categories = typeList 
      that.setData({"articles":index.category.objArray,"loading":false})
      that.setData({ currentTypeId : typeId, headinfo:headinfo, scrollLeft:-900, pageIndex:1 })
    //   wx.request({
    //     url: 'https://xiuxun.top/wx/app/minisnsapp/getartlistbyminisnsid',
    //     data: {"deviceType":verifyModel.deviceType, "timestamp":verifyModel.timestamp, 
    //     "uid": unionid, "versionCode":verifyModel.versionCode, "sign":verifyModel.sign,
    //     "fid": minisId, "hotshow":1, "categoryId": typeId, "pageIndex":1},
    //     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //     // header: {}, // 设置请求的 header
    //     success: function(res){
    //         var result = res.data;
    //         that.setData({articles:result.objArray})
    //         that.setData({ currentTypeId : typeId, categories:typeList, scrollLeft:-900, pageIndex:1 })
    //     }
    //   })
  },
  
  /**
   * 展示评论显示框
   */
showReComment: function(e) {
    let id = e.currentTarget.id;
    this.setData({"showRecomment":{"id":id}})
},
/**
 * 取消评论
 */
commentCancle: function(e) {
  this.setData({"showRecomment":null,"recomment":null})
},
/**
 * 选择图片
 */
selectImg: function(e) {
      var that = this;
      var minisId = that.data.minisns.Id;
      var unionid = that.data.user.unionid;
      var verifyModel = util.primaryLoginArgs(unionid);
      wx.chooseImage({
        count: 9, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function(res){
          var tmp = res.tempFilePaths;
          /**
           * 模拟
           */
          let recomment = that.data.recomment;
          recomment.imgs = recomment.imgs.push({"id":result.obj.id, "src":result.obj.url})
          that.setData({"recomment":recomment})
          // for(var i=0; i<tmp.length; i++) {
          //       // 上传图片s
          //     wx.uploadFile({
          //       url: 'http://apptest.vzan.com/minisnsapp/uploadfilebytype',
          //       filePath:tmp[i],
          //       name:'file',
          //       // header: {}, // 设置请求的 header
          //       formData: {"fid":minisId, "uploadType":"img", "deviceType":verifyModel.deviceType, "timestamp":verifyModel.timestamp, 
          //                  "uid": unionid, "versionCode":verifyModel.versionCode, "sign":verifyModel.sign}, // HTTP 请求中其他额外的 form data
          //       success: function(res){
          //           var result = JSON.parse(res.data);
          //           console.log("上传图片成功", result);
          //           // 刷新页面
          //           let recomment = that.data.recomment; // 获取评论信息
          //           recomment.imgs = recomment.imgs.push({"id":result.obj.id, "src":result.obj.url});
          //           that.setData({"recomment":recomment});
          //       }
          //     })
          // }
        }
      })
}

})
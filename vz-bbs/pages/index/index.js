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
    "commentReImgs": null, // [{'id':id,'url':url}]
    "record": null, // {'tmpFile':tmpfile,'id':id, 'url':url}
    "comment": null, // { "artId": artId, "commentId": commentId, "commentName": commentName }
    "searchComment": null, //
    "showAddress":false,
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
   * 下拉刷新
   */
  onPullDownRefresh: function() {
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
  showSearchBox: function (e) {
    console.log("搜索", e)
    this.setData({ "showSearch": true })
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
    let artId = e.currentTarget.dataset.artId
    let commentId = e.currentTarget.dataset.commentId
    let commentName = e.currentTarget.dataset.commentName
    let toUserId = e.currentTarget.dataset.toUserId
    this.setData({ "showComment": true, "comment": { "artId": artId, "commentId": commentId, "toUserId": toUserId, "commentName": commentName } })
  },
  /**
   * 关闭评论框
   */
  cancleComment: function (e) {
    console.log("关闭评论框", e)
    this.setData({ "showComment": false })
    this.setData({ "commentReImgs": null, "comment": null })

  },
  /**
   * 展示表情框
   */
  showEmoijBox: function (e) {
    console.log("展示表情框", e)
    wx.showModal({ "title": "提示", "content": "暂不支持", "showCancel": false })
  },



  /**
   * 初始化
   */
  init: function () {
    app.getInitData(function (initData) {
      util.showLoading("数据加载中")
      console.log("初始化Index Page")
      let verifyModel = util.primaryLoginArgs()
      that.setData({
        "user": initData.obj._LookUser,
        "minisns": initData.obj._Minisns,
      })

      let unionId = wx.getStorageSync('unionId')
      // unionId = "oW2wBwUJF_7pvDFSPwKfSWzFbc5o"
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
        "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        "fid": constdata.minisnsId, "hotshow": 0, "categoryId": 0, "pageIndex": 1
      }).then(function (success) {
        let articles = success.objArray || []
        articles = util.articleFilter(articles)
        that.setData({ "articles": articles })
        util.endLoading();
      }, function (fail) {
        util.endLoading()
      })
    })
  },


  /**
   * 评论框选择图片 
   */
  commentReImage: function (e) {
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log("选择图片成功", res)
        let imgFiles = res.tempFilePaths || []
        let commentReImgs = that.data.commentReImgs || []
        let uploading = false;
        for (let i = 0; i < imgFiles.length && !uploading; i++) {
          uploading = true
          let verifyModel = util.primaryLoginArgs()
          wx.uploadFile({
            url: 'https://snsapi.vzan.com/minisnsapp/uploadfilebytype',
            filePath: imgFiles[i],
            name: 'file',
            // header: {}, // 设置请求的 header
            formData: {
              "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp, "uid": verifyModel.uid,
              "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
              "fid": constdata.minisnsId, "uploadType": "img"
            }, // HTTP 请求中其他额外的 form data
            success: function (res) {
              console.log(res)
              let result = JSON.parse(res.data)
              if (result.result) {
                console.log("上传图片成功", imgFiles[i], result)
                commentReImgs.push({ "id": result.obj.id, "url": result.obj.url })
                that.setData({ "commentReImgs": commentReImgs })
              } else {
                console.log("上传图片失败", imgFiles[i], res)
              }
              uploading = false
            },
            fail: function (res) {
              console.log("上传图片失败", imgFiles[i], res)
              uploading = false
            }
          })
        }
      }
    })
  },

  /**
   * 评论框删除图片
   */
  removeImg: function (e) {
    let id = e.currentTarget.dataset.id
    let imgs = this.data.commentReImgs || []
    for (let i = 0; i < imgs.length; i++) {
      if (imgs[i].id == id) {
        imgs.splice(i, 1)
        break
      }
    }
    that.setData({ "commentReImgs": imgs })
  },

  /**
   * 提交评论
   */
  comment: function (e) {
    console.log("提交评论", e)
    let content = e.detail.value.content
    let commentReImgs = that.data.commentReImgs
    let verifyModel = util.primaryLoginArgs()
    let imgs = util.imgArrayToString(commentReImgs)
    if (!content && !commentReImgs) {
      wx.showModal({ "title": "提示", "content": "请输入内容或上传图片", "showCancel": false })
    }
    let comment = that.data.comment

    if (comment && comment.artId) {
      if (comment.commentId) {// 回复用户评论
        api.replyartcommentbyid({
          "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
          "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
          "artId": comment.artId, "toUserId": comment.toUserId, "commontId": comment.commentId, "comment": content, "images": imgs
        }).then(function (success) {
          // 关闭评论框
          that.cancleComment()
        })

      } else { // 回复帖子评论
        api.commentartbyid({
          "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
          "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
          "artId": comment.artId, "comment": content, "images": imgs
        }).then(function (success) {
          // 关闭评论框
          that.cancleComment()
        })
      }
    }
  },

  /**
   * 点赞
   */
  praise: function (e) {
    let verifyModel = util.primaryLoginArgs()
    let artId = e.currentTarget.dataset.artId
    api.articlepraise({
      "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "artId": artId
    }).then(function (success) {
      // 更新点赞状态
      let articles = that.data.articles || []
      for (let i = 0; i < articles.length; i++) {
        if (articles[i].Id == artId) {
          articles[i].Praise += 1
          articles[i].IsPraise = true
          break
        }
      }
      that.setData({ "articles": articles })
    })

  },



  /**
   * 上拉加载
   */
  nextPage: function () {
    let verifyModel = util.primaryLoginArgs()
    let currentCategory = this.data.currentCategory
    let pageIndex = that.data.pageIndex + 1
    util.showLoading()
    api.articles({
      "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "fid": constdata.minisnsId, "hotshow": currentCategory.hot, "categoryId": currentCategory.id, "pageIndex": pageIndex
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
   * 切换版块
   */
  changeCategory: function (e) {
    let verifyModel = util.primaryLoginArgs()
    let id = e.currentTarget.dataset.categoryId || 0
    let hot = e.currentTarget.dataset.hot || 0
    util.showLoading("加载中...")
    api.articles({
      "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "fid": constdata.minisnsId, "hotshow": hot, "categoryId": id, "pageIndex": 1
    }).then(function (success) {
      let articles = success.objArray || []
      articles = util.articleFilter(articles)
      that.setData({ "articles": articles, "pageIndex": success.pageIndex })
      that.setData({ "currentCategory": { "id": id, "hot": hot } })
      util.endLoading();
    }, function (fail) {
      util.endLoading();
    })

  },
  /**
   * 播放语音
   */
  playAudio: function (e) {
    let vid = e.currentTarget.dataset.id;
    let vSrc = e.currentTarget.dataset.vSrc;
    util.playVoice(vid, vSrc)
  },


})

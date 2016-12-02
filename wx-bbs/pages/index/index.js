var index = require("../../data/index-list.js")
var util = require("../../utils/util.js")
var api = require("../../utils/api.js")


//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    loading: true,  // 当前页面是否正在加载
    articles: [],
    pageIndex: 1,
    audioIcon: "http://i.pengxun.cn/content/images/voice/voiceplaying.png",
    currentTypeId: 0,
    hot: 0,
    scrollLeft: 0,
    praised: {}, // 是否已经点赞
    showRecomment: null,
    emoij: false, // 是否选择emoij
    commentText: "",
    selectedImgs: [], // 评论选择图片
    currentMoreComment: "",
    headInfo: {},
    categories: []
  },

  onLoad: function () {
    this.init();
  },
  onShow: function () {
    this.resetData()
    this.init();
  },

  /**
   * 下拉加载
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.articles) {
      this.nextPage();
    }
  },
  /**
   * 上拉刷新
   */
  onPullDownRefresh: function () {

  },
  /**
   * 重置数据
   */
  resetData: function () {
    let that = this;
    that.setData({
      "articles": [], "pageIndex": 1, "currentTypeId": 0, "hot": 0, "scrollLeft": 0, "praised": {},
      "showRecomment": null, "emoij": false, "commentText": '', "selectedImgs": [], "currentMoreComment": "",
      "searchClicked": false,
    })
  },

  /**
   * 初始化
   */
  init: function () {
    var that = this;
    that.setData({ "loading": true })
    //提示加载
    util.showLoading()

    app.getInit(function (result) {
      var tmpFile = result.obj.tmpFile;
      var minisId = result.obj._Minisns.Id;
      var unionid = result.obj._LookUser.unionid;
      var verifyModel = util.primaryLoginArgs(unionid);
      // 设置全局数据
      that.setData({ "user": result.obj._LookUser, "minisns": result.obj._Minisns, "tmpFile": tmpFile })
      // 设置头部信息
      api.snsApi({
        "url": 'https://snsapi.vzan.com/minisnsapp/getminisnsheadinfo', "filePath": tmpFile, "name": "file", "formData": {
          "deviceType": verifyModel.deviceType, "uid": verifyModel.uid, "versionCode": verifyModel.versionCode,
          "timestamp": verifyModel.timestamp, "sign": verifyModel.sign, "id": minisId
        }
      }, function (result) {
        that.setData({
          "headInfo": {
            "backMap": result.obj.BackMap, "logoUrl": result.obj.LogoUrl, "articleCount": result.obj.ArticleCount,
            "clickCount": result.obj.ClickCount, "isSign": result.obj.IsSign, "isConcern": result.obj.IsConcern
          },
          "categories": result.obj.Categories
        })
        wx.setStorageSync('categories', result.obj.Categories);
      })
      // 获取初始数据
      api.snsApi({
        "url": "https://snsapi.vzan.com/minisnsapp/getartlistbyminisnsid", "filePath": tmpFile, "name": "file", "formData": {
          "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
          "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
          "fid": minisId, "hotshow": 1, "categoryId": 0, "pageIndex": 1
        }
      }, function (result) {
        let articles = result.objArray
        if (articles == null) { articles = [] }
        // 过滤HTML标签
        articles = util.articleFilter(articles)
        that.setData({ "articles": articles, "loading": false })
        // 关闭加载
        util.endLoading()
      }, function (result) {
        that.setData({ "loading": false })
        // 关闭加载
        util.endLoading()
      })
    })
  },
  /**
   * 上拉加载
  */
  nextPage: function (e) {
    console.log("开启下拉加载");
    var that = this;
    that.setData({ "loading": true });
    util.showLoading()
    var minisId = that.data.minisns.Id;
    var unionid = that.data.user.unionid;
    var tmpFile = that.data.tmpFile
    var verifyModel = util.primaryLoginArgs(unionid);
    var pageIndex = that.data.pageIndex + 1;

    api.snsApi({
      "url": "https://snsapi.vzan.com/minisnsapp/getartlistbyminisnsid", "filePath": tmpFile, "name": "file", "formData": {
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        "fid": minisId, "hotshow": that.data.hot, "categoryId": that.data.currentTypeId, "pageIndex": pageIndex
      }
    }, function (result) {
      console.log("上拉加载成功", result)
      let articles = that.data.articles || []
      if (result.objArray != null) { // 过滤HTML元素
        articles = articles.concat(util.articleFilter(result.objArray))
      }
      that.setData({ "articles": articles, "pageIndex": pageIndex, "loading": false })
      util.endLoading()
    }, function (result) {
      that.setData({ "loading": false, pageIndex: that.data.pageIndex })
      util.endLoading()
    })
  },


  /**
   * 点击版块跳转
  */
  toBankuai: function (event) {
    var that = this;
    console.log("点击版块跳转", event);
    var typeId = event.currentTarget.dataset.typeid;
    var hot = event.currentTarget.dataset.hot;
    that.setData({ loading: true });
    util.showLoading()
    // 获取articles
    var minisId = that.data.minisns.Id;
    var unionid = that.data.user.unionid;
    let tmpFile = that.data.tmpFile
    var verifyModel = util.primaryLoginArgs(unionid);
    api.snsApi({
      "url": "https://snsapi.vzan.com/minisnsapp/getartlistbyminisnsid", "filePath": tmpFile, "name": "file", "formData": {
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        "fid": minisId, "hotshow": hot, "categoryId": typeId, "pageIndex": 1
      }
    }, function (result) {
      console.log("跳转版块成功", result)
      let articles = result.objArray || []
      articles = util.articleFilter(articles)
      that.setData({ "articles": articles, "hot": hot, "pageIndex": 1, "loading": false, "currentTypeId": typeId })
      util.endLoading()
    }, function (result) {
      console.log("跳转版块失败", result)
      that.setData({ "loading": false })
      util.endLoading()
    })
  },
  /**
   * 操作帖子
   */
  openArrow: function (e) {
    var that = this;
    let artId = e.currentTarget.dataset.artId;
    // 获取权限
    var tmpFile = that.data.tmpFile;
    var minisId = that.data.minisns.Id;
    var unionid = that.data.user.unionid;
    var verifyModel = util.primaryLoginArgs(unionid);
    api.snsApi({
      "url": "https://snsapi.vzan.com//minisnsapp/checkpermissionbyuser",
      "filePath": tmpFile,
      "name": "file",
      "formData": {
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        artId: artId
      }
    }, function (result) {
      let actionList = []
      if (result.obj.BlackOne) {
        actionList.push("举报")
      }
      actionList.push("取消")
      api.wxApi(wx.showActionSheet)({ "itemList": actionList })
        .then(function (result) {
          if (!res.cancel) {
            let idx = res.tapIndex;
            if (actionList[idx] == "举报") {
              console.log("举报成功")
            }
          }
        })
    })
  },
  /**
   * 播放声音 
   */
  playAudio: function (event) {
    let vid = event.currentTarget.dataset.vId;
    let vSrc = event.currentTarget.dataset.vSrc;
    util.playVoice(vid, vSrc)
  },
  /**
   * 更多版块
   */
  moreType: function (event) {
    var that = this;
    var categories = wx.getStorageSync('categories');
    if (typeof categories == "undefined") {
      return;
    }
    var typeIds = [];
    var typeNames = [];
    for (var i = 0; i < categories.length; i++) {
      typeIds[i] = categories[i].Id;
      typeNames[i] = categories[i].Title;
    }
    wx.showActionSheet({
      itemList: typeNames,
      success: function (res) {
        if (res.cancel) {
          console.log("取消");
        } else {
          // 获取新的内容
          var idx = res.tapIndex;
          var typeId = typeIds[idx];
          that.typeChange(typeId);
        }
      }
    })
  },
  /**
   * 切换版块
   * 
   */
  typeChange: function (typeId) {
    var that = this;
    var tmp = wx.getStorageSync('categories');
    var typeList = tmp;
    for (var i = 0; i < typeList.length; i++) {
      if (typeList[i].Id == typeId) {
        var tmpType = { Id: typeId, Title: typeList[i].Title }
        typeList.splice(i, 1);
        typeList.splice(0, 0, tmpType);
      }
    }
    // 获取新的数据
    var minisId = wx.getStorageSync('minisns').Id;
    var unionid = wx.getStorageSync('user').unionid;
    var verifyModel = util.primaryLoginArgs(unionid);
    let tmpFile = that.data.tmpFile
    that.setData({ "loading": true });
    util.showLoading()
    api.snsApi({
      "url": "https://snsapi.vzan.com/minisnsapp/getartlistbyminisnsid",
      "filePath": tmpFile,
      "name": "file",
      "formData": {
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        "fid": minisId, "hotshow": 0, "categoryId": typeId, "pageIndex": 1
      }
    }, function (result) {
      console.log("跳转版块成功", result)
      let articles = util.articleFilter(result.objArray)
      that.setData({ "articles": articles, "loading": false, "currentTypeId": typeId, "hot": 0 })
      util.endLoading()
    }, function (result) {
      console.log("跳转版块失败", result)
      that.setData({ "loading": false })
      util.endLoading()
    })
  }
  ,
  showBigImg: function (e) { // 展示大图
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src],
    })
    return false;
  },
  /**
   * 签到
   */
  sign: function () {
    let that = this
    var tmpFile = that.data.tmpFile;
    var minisId = that.data.minisns.Id;
    var unionid = that.data.user.unionid;
    var verifyModel = util.primaryLoginArgs(unionid);

    api.snsApi({
      "url": "https://snsapi.vzan.com//minisnsapp/signin",
      "filePath": tmpFile,
      "name": "file",
      "formData": {
        "deviceType": verifyModel.deviceType, "uid": verifyModel.uid, "versionCode": verifyModel.versionCode,
        "timestamp": verifyModel.timestamp, "sign": verifyModel.sign, "fid": minisId
      }
    }, function (result) {
      console.log("签到成功", result)
      wx.showToast({
        "title": "签到成功,连续签到" + result.obj.SigDays + "天",
        "icon": "success"
      })
      api.snsApi({
        "url": "https://snsapi.vzan.com/minisnsapp/userinfo",
        "filePath": tmpFile,
        "name": "file",
        "formData": {
          "fid": minisId, "deviceType": verifyModel.deviceType, "uid": verifyModel.uid,
          "sign": verifyModel.sign, "timestamp": verifyModel.timestamp, "versionCode": verifyModel.versionCode
        }
      }, function (result) {
        console.log("更新用户信息成功", result)
        that.setData({ "user": result.obj._LookUser })
      }, function (error) {
        console.log("签到后更新用户信息失败", error)
      })
    }, function(error) {
      console.log("签到失败", error)
    })
  },
  // 关注
  concern: function () {

  },
  /**
   * 对帖子点赞
   */
  praise: function (e) {
    var that = this;
    var minisId = wx.getStorageSync('minisns').Id;
    var unionid = wx.getStorageSync('user').unionid;
    var verifyModel = util.primaryLoginArgs(unionid);
    var id = e.currentTarget.dataset.id; // 帖子ID
    var verifyModel = util.primaryLoginArgs(unionid);
    wx.uploadFile({
      url: 'https://snsapi.vzan.com/minisnsapp/articlepraise',
      filePath: wx.getStorageSync('tmpFile'),
      name: 'file',
      // header: {}, // 设置请求的 header
      formData: {
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign, "artId": id
      }, // HTTP 请求中其他额外的 form data
      success: function (res) {
        var tmp = that.data.articles;
        var result = JSON.parse(res.data);
        console.log("点赞成功", result)
        // 修改状态
        if (result.result == true) {
          for (var i = 0; i < tmp.length; i++) {
            if (tmp[i].Id == id) {
              tmp[i].IsPraise = true;
              tmp[i].Praise = tmp[i].Praise + 1;
            }
          }
          that.setData({ articles: tmp })
        } else {
          wx.showModal({ title: "提示", content: result.msg, showCancel: false, confirmText: "取消" })
        }
      }
    })
  },
  /**
   * 初始化评论信息
   */
  initRecomment: function () {
    var that = this;
    that.setData({
      "emoij": false,
      "commentText": "",
      "selectedImgs": []
    })
  },
  /**
   * 评论帖子
   */
  showReComment: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;  // 帖子ID
    let showRecomment = that.data.showRecomment;
    if (showRecomment != null) { // 关闭评论
      that.setData({ "showRecomment": null })
      that.initRecomment();
    } else { // 打开评论
      that.setData({ "showRecomment": { "id": id } })
      that.initRecomment();
    }
  },
  /**
   * 回复用户评论
   */
  commentUser: function (e) {
    var that = this;
    let showRecomment = that.data.showRecomment;
    if (showRecomment != null) { // 关闭评论
      that.setData({ "showRecomment": null })
      that.initRecomment();
    } else {
      let artId = e.currentTarget.dataset.artid;
      let uid = e.currentTarget.dataset.uid;
      let name = e.currentTarget.dataset.name;
      let id = e.currentTarget.dataset.id;
      that.setData({
        "showRecomment": {
          "id": artId,
          "toUserId": uid,
          "commontId": id,
          "toUserName": name
        }
      })
    }
  },

  /**
   * 转发
   */
  zhuan: function () {

  },
  /**
   * 赏
   */
  reward: function () {
    wx.request({
      url: 'https://xiuxun.top/wx/eee/',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log("测试.top")
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 打开或关闭Emoij选框
   */
  selectEmoij: function (e) {
    var emoij = this.data.emoij;
    this.setData({ "emoij": !emoij })
  },
  /**
   * 保存评论的内容
   */
  saveTextValue: function (e) {
    var content = e.detail.value;
    this.setData({ commentText: content });
  },
  /**
   * 保存选择的表情
   */
  emoijSelected: function (e) {
    var code = e.currentTarget.dataset.code;
    var tmp = this.data.commentText;
    tmp = tmp + code;
    this.setData({ commentText: tmp });
  },

  /**
   * 选择图片
   */
  selectImg: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var minisId = wx.getStorageSync('minisns').Id;
    var unionid = wx.getStorageSync('user').unionid;
    var verifyModel = util.primaryLoginArgs(unionid);
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tmp = res.tempFilePaths;

        for (var i = 0; i < tmp.length; i++) {
          // 上传图片s
          wx.uploadFile({
            url: 'https://snsapi.vzan.com/minisnsapp/uploadfilebytype',
            filePath: tmp[i],
            name: 'file',
            // header: {}, // 设置请求的 header
            formData: {
              "fid": minisId, "uploadType": "img", "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
              "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign
            }, // HTTP 请求中其他额外的 form data
            success: function (res) {
              var result = JSON.parse(res.data);
              console.log("上传图片成功", result);
              // 刷新页面
              var rtmp = that.data.selectedImgs;
              rtmp = rtmp.concat({ "id": result.obj.id, "src": result.obj.url });
              that.setData({ selectedImgs: rtmp });
            }
          })
        }
      }
    })
  },
  // 删除图片
  removeImg: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    var imgs = that.data.selectedImgs;
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].id == id) {
        imgs.splice(i, 1)
        break;
      }
    }
    that.setData({ "selectedImgs": imgs })
  },
  /**
   * 取消评论
   */
  commentCancle: function (e) {
    console.log("取消评论")
    this.setData({ showRecomment: null, emoij: false, commentText: "", selectedImgs: [] })
  },
  /**
   * 提交帖子评论 | 回复
   */
  commentSubmit: function (e) {
    var that = this;
    let content = e.detail.value.content;
    that.setData({ "commentText": content })
    var showRecomment = that.data.showRecomment;
    if (showRecomment.commontId) { // 回复用户
      that.replyComment();
    } else {
      that.replyPost(); // 回复帖子
    }

  },


  /**
   * 回复帖子
   * @Param id 帖子ID
*/
  replyPost: function () {
    var that = this;
    var minisId = wx.getStorageSync('minisns').Id;
    var unionid = wx.getStorageSync('user').unionid;
    var verifyModel = util.primaryLoginArgs(unionid);
    var imgs = "";
    for (var i = 0; i < that.data.selectedImgs.length; i++) {
      if (i = 0) { imgs = that.data.selectedImgs[i].id; }
      else { imgs = imgs + "," + that.data.selectedImgs[i].id; }
    }
    var content = that.data.commentText;
    let id = that.data.showRecomment.id;// 帖子ID
    wx.uploadFile({
      url: 'https://snsapi.vzan.com/minisnsapp/commentartbyid',
      filePath: wx.getStorageSync('tmpFile'),
      name: 'file',
      // header: {}, // 设置请求的 header
      formData: {
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        "artId": id, "comment": content, "images": imgs
      }, // HTTP 请求中其他额外的 form data
      success: function (res) {
        var result = JSON.parse(res.data);
        console.log("回复帖子成功", result)
        if (result.result == true) { // 发帖成功
          wx.request({
            url: "https://snsapi.vzan.com/minisnsapp/getcmt-" + id,
            data: { fid: minisId, pageIndex: 1 },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
              var arts = that.data.articles;
              for (var i = 0; i < arts.length; i++) {
                var tmp = arts[i];
                if (tmp.Id == id) {
                  tmp.articleComments = that.generateComments(res.data.CommentList);
                  arts[i] = tmp;
                  // 更新数据
                  that.setData({ articles: arts })
                  break;
                }
              }
              console.log("获取帖子评论列表成功")
            }
          })
        }
      },
      complete: function () {
        // 清空评论数据
        that.setData({ showRecomment: null, emoij: false, commentText: "", selectedImgs: [] })
      }
    })
  },

  /**
   * 回复用户评论
   * @param id 帖子ID
    */
  replyComment: function () {
    var that = this;
    var minisId = that.data.minisns.Id;
    var unionid = that.data.user.unionid;
    var verifyModel = util.primaryLoginArgs(unionid);
    var imgs = "";
    for (var i = 0; i < that.data.selectedImgs.length; i++) {
      if (i = 0) {
        imgs = that.data.selectedImgs[i].id;
      } else {
        imgs = imgs + "," + that.data.selectedImgs[i].id;
      }
    }
    var content = that.data.commentText;
    var showRecomment = that.data.showRecomment;
    wx.uploadFile({
      url: 'https://snsapi.vzan.com/minisnsapp/replyartcommentbyid',
      filePath: wx.getStorageSync('tmpFile'),
      name: 'file',
      // header: {}, // 设置请求的 header
      formData: {
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        "artId": showRecomment.id, "toUserId": showRecomment.toUserId, "commontId": showRecomment.commontId, "comment": content, "images": imgs
      }, // HTTP 请求中其他额外的 form data
      success: function (res) {
        var result = JSON.parse(res.data);
        console.log("回复用户评论成功", result)
        if (result.result == true) { // 发帖成功
          wx.request({
            url: "https://snsapi.vzan.com/minisnsapp/getcmt-" + showRecomment.id,
            data: { fid: minisId, pageIndex: 1 },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
              var arts = that.data.articles;
              for (var i = 0; i < arts.length; i++) {
                var tmp = arts[i];
                if (tmp.Id == showRecomment.id) {
                  tmp.articleComments = that.generateComments(res.data.CommentList);
                  arts[i] = tmp;
                  // 更新数据
                  that.setData({ articles: arts })
                  break;
                }
              }
              console.log("获取评论列表成功")
            }
          })
        }
      },
      complete: function () {
        // 清空评论数据
        that.setData({
          showRecomment: null,
          emoij: false, commentText: "", selectedImgs: []
        })
      }
    })

  },

  /**
   * 获取论坛帖子列表(包含热帖)
  */
  getartlistbyminisnsid: function (hotshow, categoryId, pageIndex) {
    var that = this;
    app.getInit(function (result) {
      var tmpFile = result.obj.tmpFile;
      var minisId = result.obj._Minisns.Id;
      var unionid = result.obj._LookUser.unionid;
      var verifyModel = util.primaryLoginArgs(unionid);
      wx.uploadFile({
        url: 'https://snsapi.vzan.com/minisnsapp/getartlistbyminisnsid',
        filePath: wx.getStorageSync('tmpFile'),
        name: 'file',
        // header: {}, // 设置请求的 header
        formData: {
          "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
          "uid": unionid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
          "fid": minisId, "hotshow": hotshow, "categoryId": categoryId, "pageIndex": pageIndex
        }, // HTTP 请求中其他额外的 form data
        success: function (res) {
          var result = JSON.parse(res.data);
          var articles = [];
          if (pageIndex <= 1) {
            articles = result.objArray; // 更新数据
          } else {
            articles = taht.data.articles.concat(result.objArray == null ? [] : result.objArray);
          }
          that.setData({ articles: articles })
        }
      })
    })
  },



  /**
   * 整合评论信息
   */
  generateComments: function (commentList) {
    var comment = {};
    console.log("获取帖子评论列表", commentList)
    for (var i = 0; i < commentList.length; i++) {
      var tmp = commentList[i];
      // 回复者
      for (var j = 0; j < tmp.Comments.length; j++) {
        var rTmp = tmp.Comments[j];
        rTmp.DUser = { "Id": tmp.User.Id, "Headimgurl": tmp.User.Headimgurl, "NickName": tmp.User.Nickname };
        rTmp.ComUser = rTmp.User;
        comment[rTmp.Id] = rTmp;
      }
      if (typeof comment[tmp.Id] == "undefined") {
        tmp.ComUser = tmp.User;
        comment[tmp.Id] = tmp;
      }
    }
    var list = [];
    for (var key in comment) {
      list.push(comment[key])
    }
    console.log("转换后的评论列表", list);
    return list.reverse();
  },
  /**
   * 更多评论信息
   */
  moreComment: function (e) {
    this.setData({ currentMoreComment: e.currentTarget.dataset.id })
  },
  /**
   * 跳转到用户信息
   */
  navicateToUser: function (e) {
    let uid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/user/user?uid=' + uid,
    })
  },
  /**
   * 点击搜索按钮
   */
  searchClick: function () {
    this.setData({ "searchClicked": true })
  },
  /**
   * 取消搜索
   */
  searchCancle: function () {
    this.setData({ "searchClicked": false })
  },
  /**
   * 搜索 帖子 
   */
  search: function (e) {
    let keyWord = e.detail.value.keyWord
    if (!keyWord || keyWord == "") {
      return
    }
    wx.navigateTo({
      url: '/pages/search/search?keyWord=' + keyWord,
    })
  }




})





// pages/article/article.js
var api = require("../../utils/api.js")
var util = require("../../utils/util.js");
var constdata = require("../../utils/constdata.js");
var app = getApp()
var that
Page({
  data: {
    "pageIndex": 1,
    "allLoad": false,
    "showComment": false,
    "recording": 0,
    "voiceSelected": 0,
    "voice": null,
    "commentReImgs": null, // [{'id':id,'url':url}]
    "record": null, // {'tmpFile':tmpfile,'id':id, 'url':url}
    "comment": null, // { "artId": artId, "commentId": commentId, "commentName": commentName }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    that = this
    that.setData({ "artId": options.artId })
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
    let verifyModel = util.primaryLoginArgs()

    let getArtData = {
      "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "fid": constdata.minisnsId, "artid": that.data.artId + ""
    }
    let commentData = {
      "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "fid": constdata.minisnsId, "id": that.data.artId + "", "pageIndex": "1", "sort": 1
    }
    api.getarticle(getArtData)
      .then(function (success) {
        return success.obj
      }).then(function (article) {
        // 获取评论信息
        api.getCommentList(commentData)
          .then(function (success) {
            let commentList = success.CommentList
            util.commentFilter(commentList)
            article.articleComments = commentList
            that.setData({ "article": article, "pageIndex": 1 })
          })
      })
  },

  /**
   * 上拉加载
   */
  nextPage: function (e) {
    let verifyModel = util.primaryLoginArgs()
    let commentData = {
      "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "fid": constdata.minisnsId, "id": that.data.artId + "", "pageIndex": (that.data.pageIndex + 1) + "", "sort": 1
    }
    api.getCommentList(commentData)
      .then(function (success) {
        let article = that.data.article
        let currentComments = article.articleComments || []
        if (success.CommentList && success.CommentList.length > 0) {
          article.articleComments = currentComments.concat(success.CommentList)
          that.setData({ "article": article, "pageIndex": that.data.pageIndex + 1 })
        } else {
          that.setData({ "allLoad": true })
          wx.showToast({ "title": "已经加载全部数据", "icon": "success", "duration": 500 })
        }
      })
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
   * 评论框选择图片 
   */
  commentReImage: function (e) {
    api.chooseImg()
      .then(function (res) {
        let imgFiles = res.tempFilePaths || []
        let commentReImgs = that.data.commentReImgs || []
        util.showLoading("正在上传图片")
        for (let i = 0; i < imgFiles.length; i++) {
          // uploading = true
          let verifyModel = util.primaryLoginArgs()
          let formData = {
            "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp, "uid": verifyModel.uid,
            "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
            "fid": constdata.minisnsId, "uploadType": "img"
          }
          api.uploadImg(imgFiles[i], formData)
            .then(function (success) {
              commentReImgs.push({ "id": success.obj.id, "url": success.obj.url })
              that.setData({ "commentReImgs": commentReImgs })
              util.endLoading()
            }, function (fail) {
              util.endLoading()
            })
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
    let comment = that.data.comment
    let voice = that.data.voice

    let commentData = {
      "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "fid": constdata.minisnsId, "id": that.data.artId + "", "pageIndex": "1", "sort": 1
    }

    let data = {
      "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
      "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
      "artId": comment.artId + ""
    }
    let imgs = util.imgArrayToString(commentReImgs)
    if (!content && !commentReImgs) {
      wx.showModal({ "title": "提示", "content": "请输入内容或上传图片", "showCancel": false })
    }
    if (content) {
      data.comment = content
    }
    if (imgs) {
      data.images = imgs
    }
    if (voice && voice.id) {
      data.voiceId = voice.id
    }
    if (comment && comment.artId) {
      if (comment.commentId) {// 回复用户评论
        data.toUserId = comment.toUserId
        data.commontId = comment.commentId

        api.replyartcommentbyid(data)
          .then(function (success) {
            // 关闭评论框
            that.cancleComment()
            return true
          }).then(function (res) {
            // 刷新帖子
            api.getCommentList(commentData)
              .then(function (success) {
                let article = that.data.article || []
                if (success.CommentList && success.CommentList.length > 0) {
                  if (!article.articleComments || !article.articleComments.length < 1) {
                    article.articleComments.unshift(success.CommentList[0])
                    that.setData({ "article": article })
                  } else if (article.articleComments[0].Id != success.CommentList[0].Id) {
                    article.articleComments.unshift(success.CommentList[0])
                    that.setData({ "article": article })
                  }
                }
              })
          })
      } else { // 回复帖子评论
        api.commentartbyid(data)
          .then(function (success) {
            // 关闭评论框
            that.cancleComment()
            return true
          }).then(function (res) {
            // 刷新帖子
            api.getCommentList(commentData)
              .then(function (success) {
                let article = that.data.article || []
                if (success.CommentList && success.CommentList.length > 0) {
                  if (!article.articleComments || !article.articleComments.length < 1) {
                    article.articleComments.unshift(success.CommentList[0])
                    that.setData({ "article": article })
                  } else if (article.articleComments[0].Id != success.CommentList[0].Id) {
                    article.articleComments.unshift(success.CommentList[0])
                    that.setData({ "article": article })
                  }
                }
              })
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
      "artId": artId + ""
    }).then(function (success) {
      // 更新点赞状态
      let article = that.data.article || []
      article.Praise += 1
      article.IsPraise = true
      that.setData({ "article": article })
    })

  },

  /**
   * 赞赏
   */
  rewardArticle: function (e) {
    let artId = e.currentTarget.dataset.artId
    console.log("赞赏" + artId)
    util.modelBox()
  },
  /**
  * 播放语音
  */
  playAudio: function (e) {
    let vid = e.currentTarget.dataset.id
    let vSrc = e.currentTarget.dataset.vSrc
    util.playVoice(vid, vSrc)
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
  * 录音 
  */
  selectVoice: function () {
    that.setData({ "voiceSelected": 1, "showComment": false })
  },
  /**
   * 开始录音
   */
  startRecord: function () {
    let that = this;
    that.setData({ recording: 1 })
    // recordTimeInterval = setInterval(function () {
    //   var recordTime = that.data.recordTime + 1;
    //   that.setData({
    //     recordTime: recordTime,
    //     formatedRecordTime: util.formatTime(recordTime)
    //   })
    // }, 1000)
    wx.startRecord({
      success: function (res) {
        console.log("录音结束", res)
        // 上传到服务器
        util.showLoading("正在上传")
        let verifyModel = util.primaryLoginArgs()
        let data = {
          "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp, "uid": verifyModel.uid,
          "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
          "uploadType": "audio", "fid": constdata.minisnsId
        }
        console.log("上传录音参数", data)
        wx.uploadFile({
          url: 'https://snsapi.vzan.com/minisnsapp/uploadfilebytype',
          filePath: res.tempFilePath,
          name: 'file',
          // header: {}, // 设置请求的 header
          formData: data, // HTTP 请求中其他额外的 form data
          success: function (res) {
            let result = JSON.parse(res.data)
            if (result.result) {
              console.log("上传录音成功", result)
              that.setData({ "voice": { "id": result.obj.id, "url": result.obj.url } })
            } else {
              console.log("上传录音失败", result)
            }
            util.endLoading()
            that.setData({ "showComment": true })
          },
          fail: function (res) {
            console.log("上传录音失败", res)
            that.setData({ hasRecorded: 1, recording: 0, recordTime: 0, })
            that.setData({ "showComment": true })
            util.endLoading()
          }
        })
      },
      fail: function (res) {
        console.info("录音失败", res);
        that.setData({ recording: 0, voiceSelected: 0, formatedRecordTime: "00:00:00" })
        // clearInterval(recordTimeInterval);
        that.setData({ "showComment": true })
      }
    })
  },/**
   * 结束录音
   */
  stopRecord: function () {
    wx.stopRecord({
      success: function (res) {
        console.log("结束录音成功", res)
        that.setData({ recording: 0, hasRecorded: 1, formatedRecordTime: util.formatTime(that.data.recordTime) })
        that.setData({ voiceSelected: 0, recording: 0, hasRecorded: 1, recordTime: 0, formatedRecordTime: "00:00:00" })
      },
      fail: function (res) {
        console.info("停止录音失败", res);
        that.setData({ recording: 0, hasRecorded: 1, formatedRecordTime: util.formatTime(that.data.recordTime) })
        that.setData({ voiceSelected: 0, recording: 0, hasRecorded: 1, recordTime: 0, formatedRecordTime: "00:00:00" })
        // clearInterval(recordTimeInterval);
      }
    })
  },
  /**
   *  取消录音 
   */
  cancleRecord: function () {
    wx.stopRecord({
      success: function (res) {
        console.log("取消录音成功", res)
        that.setData({ "showComment": true })
      },
      fail: function (res) {
        console.log("取消录音失败", res)
        that.setData({ "showComment": true })
      }
    })
    this.setData({ "voiceSelected": 0, "recording": 0 })
  },
})
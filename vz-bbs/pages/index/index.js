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
        "showAddress": false,
        "keyWord": null,
        "scrollTop": 1000,
        "voiceSelected": 0,
        "recording": 0,
        "voice": { "id": 6017724, "url": "http://s.vzan.cc:8080/test.mp3" },
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
    onShow: function () { // 刷新数据
        that.init()
    },
    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        that.init()
        that.refresh()
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        that.init()
        that.refresh()
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
        this.setData({
            "showComment": true,
            "comment": { "artId": artId, "commentId": commentId, "toUserId": toUserId, "commentName": commentName }
        })
    },
    /**
   * 关闭评论框
   */
    cancleComment: function (e) {
        console.log("关闭评论框", e)
        this.setData({ "showComment": false })
        this.setData({ "commentReImgs": null, "comment": null, "voice": null, "voiceSelected": 0, "recording": 0 })
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
                        "backMap": success.obj.BackMap,
                        "logoUrl": success.obj.LogoUrl,
                        "articleCount": success.obj.ArticleCount,
                        "clickCount": success.obj.ClickCount,
                        "isSign": success.obj.IsSign,
                        "isConcern": success.obj.IsConcern
                    },
                    "categories": success.obj.Categories
                })
                wx.setStorageSync('categories', success.obj.Categories);
            })
            /**获取帖子 */
            api.articles({
                "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
                "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
                "fid": constdata.minisnsId, "hotshow": 0 + "", "categoryId": 0 + "", "pageIndex": 1 + ""
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
     * 下拉刷新
     */
    refresh: function () {
        that.setData({
            "showSearch": false,
            "showComment": false,
            "commentReImgs": null,
            "record": null,
            "comment": null,
            "searchComment": null
        })
        util.showLoading("正在刷新")
        let hot = that.data.currentCategory.hot
        let currentCategoryId = that.data.currentCategory.id
        let verifyModel = util.primaryLoginArgs()

        api.articles({
            "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
            "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
            "fid": constdata.minisnsId, "hotshow": hot + "", "categoryId": currentCategoryId + "", "pageIndex": 1 + ""
        }).then(function (success) {
            console.log("下拉刷新成功", success)
            let articles = success.objArray || []
            articles = util.articleFilter(articles)
            that.setData({ "articles": articles, "pageIndex": success.pageIndex })
            util.endLoading();
            wx.stopPullDownRefresh()
        }, function (fail) {
            console.log("下拉刷新失败", fail)
            util.endLoading()
            wx.stopPullDownRefresh()
        })
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
                        "deviceType": verifyModel.deviceType,
                        "timestamp": verifyModel.timestamp,
                        "uid": verifyModel.uid,
                        "versionCode": verifyModel.versionCode,
                        "sign": verifyModel.sign,
                        "fid": constdata.minisnsId,
                        "uploadType": "img"
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

        let getArtData = {
            "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
            "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
            "fid": constdata.minisnsId, "artid": comment.artId + ""
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
                        api.getarticle(getArtData)
                            .then(function (success) {
                                let articles = that.data.articles || []
                                for (let i = 0; i < articles.length; i++) {
                                    if (articles[i] == comment.artId) {
                                        articles.splice(i, 1, success.obj)
                                        break
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
                        api.getarticle(getArtData)
                            .then(function (success) {
                                let articles = that.data.articles || []
                                for (let i = 0; i < articles.length; i++) {
                                    if (articles[i] == comment.artId) {
                                        articles.splice(i, 1, success.obj)
                                        break
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
     * 赞赏
     */
    rewardArticle: function (e) {
        let artId = e.currentTarget.dataset.artId
        console.log("赞赏" + artId)
        util.modelBox()
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
            "deviceType": verifyModel.deviceType,
            "timestamp": verifyModel.timestamp,
            "uid": verifyModel.uid,
            "versionCode": verifyModel.versionCode,
            "sign": verifyModel.sign,
            "fid": constdata.minisnsId,
            "hotshow": currentCategory.hot + "",
            "categoryId": currentCategory.id + "",
            "pageIndex": pageIndex + ""
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
        that.setData({ "articles": [] })
        api.articles({
            "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
            "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
            "fid": constdata.minisnsId, "hotshow": hot + "", "categoryId": id + "", "pageIndex": 1 + ""
        }).then(function (success) {
            let articles = success.objArray || []
            articles = util.articleFilter(articles)
            that.setData({ "articles": articles, "pageIndex": success.pageIndex })
            that.setData({ "currentCategory": { "id": id, "hot": hot }, "scrollTop": 0 })
            util.endLoading();
        }, function (fail) {
            util.endLoading();
        })

    },
    /**
     * 播放语音
     */
    playAudio: function (e) {
        console.log("播放语音事件", e)
        let vid = e.currentTarget.dataset.id
        let vSrc = e.currentTarget.dataset.vSrc
        util.playVoice(vid, vSrc, this)
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
     * 搜索 帖子
     */
    search: function (e) {
        let keyWord = e.detail.value.keyWord
        if (!keyWord || keyWord == "") {
            return
        }
        wx.navigateTo({
            url: '/pages/search/search?keyWord=' + keyWord,
            success: function (res) {
                console.log("跳转到搜索页面成功", res)
                that.setData({ "showSearch": false })
            },
            fail: function (res) {
                console.log("跳转到搜索页面失败", res)
                that.setData({ "showSearch": false })
            }
        })
    },
    /*************************************录音***************************************************** */
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
                            that.setData({ "voice": { "id": result.obj.id, "url": result.obj.url } })
                            console.log("上传录音成功", result, that.data)
                        } else {
                            console.log("上传录音失败", result, that.data)
                        }
                        util.endLoading()
                        that.setData({ "showComment": true, "voiceSelected": 0, "recording": 0 })
                    },
                    fail: function (res) {
                        console.log("上传录音失败", res)
                        that.setData({ hasRecorded: 1, recording: 0, recordTime: 0, })
                        that.setData({ "showComment": true, "voice": null, "voiceSelected": 0, "recording": 0 })
                        util.endLoading()
                    }
                })
            },
            fail: function (res) {
                console.info("录音失败", res);
                that.setData({ recording: 0, voiceSelected: 0, formatedRecordTime: "00:00:00" })
                // clearInterval(recordTimeInterval);
                that.setData({ "showComment": true, "voice": null, "voiceSelected": 0, "recording": 0 })
            }
        })
    }, 
    /**
     * 结束录音
     */
    stopRecord: function () {
        wx.stopRecord({
            success: function (res) {
                console.log("结束录音成功", res)
                that.setData({ recording: 0, hasRecorded: 1, formatedRecordTime: util.formatTime(that.data.recordTime) })
                that.setData({
                    voiceSelected: 0,
                    recording: 0,
                    hasRecorded: 1,
                    recordTime: 0,
                    formatedRecordTime: "00:00:00"
                })
            },
            fail: function (res) {
                console.info("停止录音失败", res);

                that.setData({ recording: 0, hasRecorded: 1, formatedRecordTime: util.formatTime(that.data.recordTime) })
                that.setData({
                    voiceSelected: 0,
                    recording: 0,
                    hasRecorded: 1,
                    recordTime: 0,
                    formatedRecordTime: "00:00:00"
                })
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
                that.setData({ "showComment": true, "voice": null, "voiceSelected": 0, "recording": 0 })
            },
            fail: function (res) {
                console.log("取消录音失败", res)
                that.setData({ "showComment": true, "voice": null, "voiceSelected": 0, "recording": 0 })
            }
        })
    },
    articleOperation: function (e) {
        let verifyModel = util.primaryLoginArgs();
        console.log("帖子ID", e);
        that = this;
        let data = {
            "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
            "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
            "artId": e.currentTarget.dataset.id + ""
        }
        util.showLoading();
        api.checkPermissionByUser(data)
            .then(function (success) {
                console.log(success);
                util.endLoading();
                let obj = success.obj;
                let args = [];
                obj.DelTopic ? args.push( 1 ) : null;
                obj.TopAll ? args.push( 0 ) : null;
                obj.AddReply ? args.push( 2 ) : null;
                obj.BlackOne ? args.push( 3 ) : null;
                obj.BlackAll ? args.push( 4 ) : null;

                that.showArticlePermission(args)

            }, function (fail) {
                util.endLoading();
            })
            
    },
    showArticlePermission: function (list) {

        let names = []
        for (let i = 0; i < list.length; i++) {
          names.push(constdata.permission[list[i]])
        }

        wx.showActionSheet({
            itemList: list,
            success: function (res) {
                if (!res.cancel) {
                    // TODO 操作帖子
                    let index = res.tapIndex
                    api.operateArticle(list[index])
                }
            }
        });
    },


    /**
     * 更多版块
     */
    moreCategory: function () {
        let categories = that.data.categories || []
        let names = []
        for (let i = 0; i < categories.length; i++) {
            names.push(categories[i].Title)
        }
        let verifyModel = util.primaryLoginArgs()
        wx.showActionSheet({
            "itemList": names,
            "success": function (res) {
                if (!res.cancel) {
                    let index = res.tapIndex
                    // 切换版块
                    util.showLoading("加载中...")
                    that.setData({ "articles": [] })
                    api.articles({
                        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
                        "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
                        "fid": constdata.minisnsId, "hotshow": 0 + "", "categoryId": categories[index].Id + "", "pageIndex": 1 + ""
                    }).then(function (success) {
                        let articles = success.objArray || []
                        articles = util.articleFilter(articles)
                        that.setData({ "articles": articles, "pageIndex": success.pageIndex })
                        that.setData({ "currentCategory": { "id": categories[index].Id, "hot": 0 }, "scrollTop": 0 })
                        util.endLoading();
                    }, function (fail) {
                        util.endLoading();
                    })
                }
            }
        })
    }

})

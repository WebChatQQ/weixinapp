//index.js
//获取应用实例

var api = require("../../utils/api.js")
var util = require("../../utils/util.js");
var constdata = require("../../utils/constdata.js");
var eventHandler = require("../../utils/event-handler.js")


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
        "openRecordBox": 0,
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
        eventHandler.showComment(this, e)
    },
    /**
   * 关闭评论框
   */
    cancleComment: function (e) {
       eventHandler.cancleComment(this)
    },
    /**
     * 展示表情框
     */
    showEmoijBox: function (e) {
        eventHandler.showEmoijBox(this)
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
            eventHandler.getFirstPageArticles(that, 0, 0)
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
        let result = eventHandler.getFirstPageArticles(that, hot, currentCategoryId)
        if (result) {
            wx.stopPullDownRefresh()
        } else {
            wx.stopPullDownRefresh()
        }
    },

    /**
     * 评论框选择图片
     */
    commentReImage: function (e) {
        eventHandler.uploadImg(that,e)
    },

    /**
     * 评论框删除图片
     */
    removeImg: function (e) {
       eventHandler.removeImg(that, e)
    },

    /**
     * 提交评论
     */
    comment: function (e) {
       eventHandler.submitComment(that, e)
    },

    /**
     * 点赞
     */
    praise: function (e) {
        eventHandler.praiseArticle(that, e)
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
    nextPage: function (e) {
       eventHandler.getNextPageArticles(that, e)
    },

    /**
     * 切换版块
     */
    changeCategory: function (e) {
        let verifyModel = util.primaryLoginArgs()
        let id = e.currentTarget.dataset.categoryId || 0
        let hot = e.currentTarget.dataset.hot || 0
        eventHandler.getFirstPageArticles(that, hot, id)
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
       eventHandler.previewImage(that, e)
    },

    /**
     * 搜索 帖子
     */
    search: function (e) {
       eventHandler.searchArticles(that, e)
    },
    /*************************************录音***************************************************** */
    /**
     * 录音
     */
    selectVoice: function () {
        eventHandler.openRecordBox(that)
    },
    /**
     * 开始录音
     */
    startRecord: function () {
       eventHandler.startRecord(that)
    }, 
    /**
     * 结束录音
     */
    stopRecord: function () {
        eventHandler.stopRecord(that)
    },
    /**
     *  取消录音
     */
    cancleRecord: function () {
       eventHandler.cancleRecord(that)
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
            itemList: names,
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

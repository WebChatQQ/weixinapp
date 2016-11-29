
/**
 * 获取发帖列表
 */
function myarticles(data, filepath, cb) {
    wx.uploadFile({
        url: 'http://apptest.vzan.com/minisnsapp/myarticles',
        filePath: filePath,
        name: 'file',
        // header: {}, // 设置请求的 header
        formData: data, // HTTP 请求中其他额外的 form data
        success: function (res) {
            let result = JSON.parse(res.data);
            if (result.result) {
                cb.success(result);
            }
        }
    })
}

/**
 * 搜索帖子
 */
function getartlistbykeyword(data, filepath, cb) {
    wx.uploadFile({
        url: 'http://apptest.vzan.com/minisnsapp/getartlistbykeyword',
        filePath: filepath,
        name: 'file',
        // header: {}, // 设置请求的 header
        formData: data, // HTTP 请求中其他额外的 form data
        success: function (res) {
            let result = JSON.parse(res.data);
            if (result.result) { 
                cb.success(result);
            }
        },
        fail: function () {
            cb.fail()
        },
        complete: function () {
            cb.complete();
        }
    })
}

function wxApi() {

}




module.exports = {
    "myarticles": myarticles,
    "getartlistbykeyword":getartlistbykeyword,
}
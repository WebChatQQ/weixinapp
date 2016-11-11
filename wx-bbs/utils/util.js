function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getData() {
  articles:{
    
  }
}

function getArticles(typeId, pn) {
  wx.request({
    url: 'http://vzan.com/f/getarticlebottom-1',
    data: {
      "pageIndex":pn,
      "typeId":typeId,
      "h":"",
      "hongbao":"",
      "from":"qq",
      "rspan":"1"
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      "content-type":"application/json;charset=utf-8"
      }, // 设置请求的 header
    success: function(res){
      
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })

}


module.exports = {
  formatTime: formatTime
}


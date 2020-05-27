var _token = 'c92114bcc9e4454f1d2b7399dc9d62a9';
var _time = 1480576266
var _url_base = 'http://shen.amrtang.com/dati_sz/api/web/v1/';


function post(_data, _url, callback, failback) {
  console.log('我说啥你哈')
  _data.time = _time;
    _data.token = _token;
    _data.authToken = localStorage.getItem('authToken_dati_sz') == null ? '' : localStorage.getItem('authToken_dati_sz')
    console.log(11111)
  layer.open({type: 2, shadeClose: false})
  $.ajax({
        type: 'POST',
        url: _url_base + _url ,
        data: _data ,
        success: function (data) {
          console.log('似懂非懂分')
          layer.closeAll()
            console.log(data)
            if(data.status == 1){
                callback(data)
            }else if(data.status == 100){
                layerMsg(data.msg)
                 window.localStorage.removeItem('authToken_dati_sz')
                 // window.location.href = 'index.html'
            }else{
                if(failback){
                    failback(data)
                }
                layerMsg(data.msg)
            }
        }
    })
}
function layerMsg(msg) {
    layer.open({
        content: msg,
        skin: 'msg',
        style: 'font-size: 24px;padding: 10px 20px',
        time: 2 //2秒后自动关闭
    });
}

//对象转路由参数转字符串
function objToParams(obj, isEncodeURIComponent) {
  var str = "";
  for (var key in obj) {
    if (str !== "") {
      str += "&";
    }
    str += key + "=" + (isEncodeURIComponent ? encodeURIComponent(obj[key]) : obj[key]);
  }
  return str;
}
function paramsToObj(str, isDecodeURI) {
  var obj = {};
  str = (isDecodeURI ? decodeURIComponent(str) : str)
  str = str.substring(str.indexOf('?') + 1);
  try {
    obj = JSON.parse('{"' + str.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
  } catch (e) {
    console.log(e);
  }
  return obj;
}

function convertBase64UrlToBlob(urlData){

  var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

  //处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }

  return new Blob( [ab] , {type : 'image/png'});
}

function dataURLtoFile(dataurl, filename = 'file') {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var suffix = mime.split('/')[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime });

}


function postBase64(base64String, callback) {
  var form = new FormData()
  form.append('img', dataURLtoFile(base64String),"file.jpeg")
  postUploadImg(form, function (data) {
    callback && callback(data)
  })
}
function postUploadImg(file, callback) {
  var authToken = localStorage.getItem('authToken_dati_sz') == null ? '' : localStorage.getItem('authToken_dati_sz')
  file.append('time', _time)
  file.append('token', _token)
  file.append('authToken', authToken)
  $.ajax({
    url: _url_base + "index/upload",
    type: "POST",
    data: file,
    processData: false,
    contentType: false,
    success: function (data) {
      if(data.status == 1){
        callback(data.data)
      }else if(data.status == 100){
        layerMsg(data.msg)
        window.localStorage.removeItem('authToken_dati_sz')
        // window.location.href = 'index.html'
      }else{
        if(failback){
          failback(data)
        }
        layerMsg(data.msg)
      }
    }
  });
}

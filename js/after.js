function doThing() {
  $(function () {
    var agent = navigator.userAgent.toLowerCase();
    if(agent.indexOf('iphone') != -1  || agent.indexOf('ipad') != -1 ){
      $('.js_upFile').removeAttr("capture");
    }

    var inputElem = null;
    $('.main_con').on('click', 'p', function (e) {
      if(e.target.id.indexOf('ipt') === 0){
        inputElem = $(e.target)
        layer.open({
          type: 1
          ,content: '<div><textarea type="text" id="input"></textarea><img class="btn" src="images/btn_choose.png" /></div>'
          ,anim: 'up'
          ,style: 'position:fixed; bottom:0; left:0; width: 100%; height: 40vw; border:none;'
        });
        var text = inputElem.html();
        console.log(text)
        var reg=new RegExp("<br>","g");
        text = text.replace(reg,"\r\n");
        console.log(text)
        // $('#input').focus();
        var tempScrollTop = 0;
        $('#input').val(text).on("focus", function() {
          tempScrollTop = $(window).scrollTop()
        }).on("blur", function() {
          window.scroll(0, tempScrollTop);
        });

        //点击编辑完成
        $('.btn').click(function () {
          inputElem.html($('#input').val().replace(/\n/g,'<br />'))
          layer.closeAll()
        })
      }
    })

    $('.js_upFile').change(function (e) {
      var str = $(e.target).parent().attr('id').split('_')[0]
      var tempImgNode = $('#'+str).find('img')
      console.log(tempImgNode)
      if(!check_Image_Format(this.value)){
        alert('格式错误！');
        return;
      }
      var file = this.files[0];
      var form = new FormData()
      form.append('img', file)
      var that = this;

      $(this).val('')
      var fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function () {
        if (fileReader.readyState == fileReader.DONE) {
          var previewImg = null;
          $('.cropper-wrapper').show()
          previewImg = $('#cropper').attr("src",fileReader.result);
          previewImg.cropper({
            dragMode: 'move',//拖拽模式
            viewMode: 1//视图模式
          });

          $('#sureCropper').unbind('click').click(function () {
            console.log(1233)
            var cropper = previewImg.cropper('getCroppedCanvas');
            var base64url = cropper.toDataURL('image/jpeg');
            // postBase64(base64url, function (data) {
            //   //提交请求
            //   that.setAttribute("path",data.path)
            // })
            previewImg.cropper('destroy');
            tempImgNode.attr('src', base64url);
            $('.cropper-wrapper').hide()
          })
          $('#cancelCropper').unbind('click').click(function () {
            previewImg.cropper('destroy');
            $('.cropper-wrapper').hide()
          })
        }

      };
    })


    $('.btn-done').click(function () {
      // window.scroll(0, 0);
      html2canvas($('#captureId')[0], {
        useCORS:true,
        logging:true,
        y: 0,
        width:$('#captureId').width(),//设置canvas尺寸与所截图尺寸相同，防止白边
        height:$('#captureId').height(),//防止白边
      }).then(function (canvas) {
        var imgs = ''
        $('.js_upFile').each(function(index,element){
          var tempStr = element.getAttribute('path')
          if(tempStr){
            imgs += ('#' + tempStr)
          }
        })
        imgs = imgs.slice(1)
        console.log('imgs', imgs)

        var img = new Image()
        img.src = canvas.toDataURL('image/jpeg')
        // postBase64(img.src, function (data) {
        //   //提交请求
        //   post({
        //     img: data.path,
        //     imgs: imgs,
        //     type: 2
        //   },'user/update-poster', function () {
        //     layerMsg('提交成功！');
        //   })
        // })
        img.style.cssText += 'position:absolute;width:100%;left:0;top:0;opacity: 0;z-index: 20;'
        $('body').append(img)
        $('.btn-done').hide()
        $('.btn-save').show()
      }).catch(function (reason) {
        alert(JSON.stringify(reason))
      })

    })
  })
}

/**
 * 判断图片格式
 * @param value
 * @returns {boolean}
 */
function check_Image_Format(value)
{
  var regexp = new RegExp("(.JPEG|.jpeg|.JPG|.jpg|.PNG|.png|.svg|.gif|.bmp)$",'g');
  return regexp.test(value);
}

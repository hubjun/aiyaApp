function doUpload() {
  var pictures = $("#browseFile");
  for(var i = 0; i < pictures.length; i++){
    var pictureName = $(pictures[i]).val();
    if(pictureName != null && pictureName.length != 0){
      var suffix = pictureName.substr(pictureName.lastIndexOf(".")+1,pictureName.length);
      suffix = suffix.toLowerCase();
      if(suffix != "jpg" && suffix != "gif" && suffix != "png"){
        alert("图片格式只能为:gif,jpg,png.请检查!");
        return false;
      }
    }
  }
  var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
  if($(pictures).val().length!=0) {
    var fileSize = 0;
    if (isIE && !target.files) {
      var filePath = $(pictures).val();

      var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
      if (!fileSystem.FileExists(filePath)) {
        alert("附件不存在，请重新输入！");
        var file = document.getElementById(id);
        file.outerHTML = file.outerHTML;
        return false;
      }
      var file = fileSystem.GetFile (filePath);
      fileSize = file.size();
    } else {
      fileSize = pictures[0].files[0].size;
    }
    var size = fileSize / 1000 / 1000;
    if (size > 5) {
      $.message('error', '上传图片最大为5M!');
      return false;
    }
  }

  var formData = new FormData($( "#uploadForm" )[0]);
  $.ajax({
    url: 'http://192.168.3.167:8001/member/uploadPhoto' ,
    type: 'POST',
    data: formData,
    async: false,
    cache: false,
    contentType: false,
    processData: false,
    success: function (returndata) {
      //location.href  = tabsUrl+"index.html#/userInfo";
      refresh();
    },
    error: function (returndata) {
      alert("error");
    }
  });
}
function refresh(){
  window.location.reload();//刷新当前页面.

  //或者下方刷新方法
  //parent.location.reload()刷新父亲对象（用于框架）--需在iframe框架内使用
  // opener.location.reload()刷新父窗口对象（用于单开窗口
  //top.location.reload()刷新最顶端对象（用于多开窗口）
}

'use strict';

angular.module('starter.utils', [])

  .factory('Constant', ['$location', function($location) {
    var PAGE_SIZE = 6;
    var SERVICE_URL_DEVELOP  = "http://localhost:8080/";
    var SERVICE_URL_PRODUCTION = "http://localhost:8080/"

    var ApiVer = 'v1';
    var WebPath = 'N/A';
    var ApiPath = 'N/A';

    var url = $location.absUrl();
    if (url.indexOf("localhost") > -1 || url.indexOf("127.0.0.1") > -1
    		|| url.indexOf("192.168") > -1 || url.indexOf("172.16") > -1 || url.indexOf("10.0") > -1) { // development
    	WebPath = SERVICE_URL_DEVELOP;
    } else if (url.indexOf("file://") > -1) {    // app test
	  	WebPath = SERVICE_URL_DEVELOP;
    } else {    // production
    	WebPath = SERVICE_URL_PRODUCTION;
    }

    ApiPath =  WebPath + 'api/' + ApiVer + '/';

    return {
      PageSize: PAGE_SIZE,
      WebPath: WebPath,
      ApiPath: ApiPath,

      HTTP_RETURN_CODE_SUCCESS: 1,
      HTTP_RETURN_CODE_FAIL: 0,
      HTTP_RETURN_CODE_NO_MORE: -100
    };
  }])

  .factory('Vari', [function() {
    return {
      Test: null
    };
  }])

  .factory('Util', ['ENV',function(ENV){
    return {
      getScreenSize: function () {
        var sh = window.screen.height;
//        if (document.body.clientHeight < sh) {
//          sh = document.body.clientHeight;
//        }

        var sw = window.screen.width;
//        if (document.body.clientWidth < sw) {
//          sw = document.body.clientWidth;
//        }

        var landscape = this.landscape();
        if (landscape && sh > sw) {
        	var temp = sh;
        	sh = sw;
        	sw = temp;
        }

        return {h: sh, w: sw};
      },

      landscape: function () {
	  	var orientation;
	    if (window.orientation == 0 || window.orientation == 180) {
	        orientation = 'portrait';
	        return false;
	    }
	    else if (window.orientation == 90 || window.orientation == -90) {
	        orientation = 'landscape';
	        return true;
	    }
      },
      getFullImg: function(img){
        return (/(^http:\/\/)/g).test(img) ? img : ENV.imgUrl + img;
      },
      /*手机端上传图片调用地址*/
      getFullImg1:function(img){
        return (/(^http:\/\/)/g).test(img) ? img : ENV.siteUrl + img;
      },
      getStockTip: function(stock){
        var result = '';
        if(!isNaN(stock)){
          var num = parseInt(stock);
          if(num <= 0){
            result = ENV.stockStatusMap[0];
          } else if(num <= 3){
            result = ENV.stockStatusMap[1];
          } else {
            result = ENV.stockStatusMap[2];
          }
        }
        return result;
      }
    }
  }])
  .factory('StringUtil', [function(){
		return {
			trim: function (o){
				if (this.isEmpty(o)) {
					return '';
				}

				o = o.replace(/(^\s*)|(\s*$)/g, '');
				return o;
			},
      isEmpty: function (o){
          if (o === null || o === "null" || o === undefined || o === "undefined" || o === "") {
              return true;
          } else {
              return false;
          }
      },
      isNotEmpty: function(o){
        if(o !== null  && o !== undefined && o !== 'undefined' && o !== ''){
          return true;
        } else {
          return false;
        }
      },
      upcaseFirst: function(str) {
        var first = str.substring(0,1).toUpperCase();
        var others = str.substring(1,str.length);
        var ret = first + others;
        return ret;
      }
		};
  }])
/*删除数组中指定对象
* @param arrayObj 指定的对象数组
* @param o 需删除的对象
* return 删除之后对象数组
* */
  .factory('ArrayUtil',[function(){
    return{
      remove: function(arrayObj,o){
        debugger
        if(angular.isArray(arrayObj)){
          var index;
          for(var i = 0; i < arrayObj.length; i ++){
            if(arrayObj[i].id == o.id){
              index = i;
              break;
            }
          }
          arrayObj.splice(index,1);
        }
        return arrayObj;
      }

    }
  }])
/*一些公共方法*/
  .factory('CommonUtil',['$ionicLoading','$ionicPopup',function($ionicLoading,$ionicPopup){
      return{
        /*
         * 消息提示
         * msg: 提示内容
         * noBackdrop: 是否有无背景,默认为true,
         * duration: 时间间隔,默认1500
         * */
        tip:function(msg,noBackdrop,duration){
          noBackdrop = noBackdrop || true;
          duration = duration == null || duration == '' ? 1500 : duration;
          $ionicLoading.show({
            template:msg,
            noBackdrop: noBackdrop,
            duration: duration
          });
        },

        confirm: function(title, template, okText, cancelText,cssClass) {
          return $ionicPopup.confirm({
            title: title,
            template: template,
            okText:  okText ? okText:'确定',
            okType: 'button-positive',
            cancelText: cancelText ? cancelText : '取消',
            cancelType: 'button-light button-line',
            cssClass: cssClass
          });
        },
        alter: function(title, template, okText, cssClass) {
          return  $ionicPopup.alert({
            title: title,
            template: template,
            okText: okText ? okText : '确定',
            okType: 'button-positive',
            cssClass:cssClass
          });
        }
      }
  }]);


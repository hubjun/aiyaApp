angular.module('aiyakuApp', [
  'ionic',
  'ngCookies',
  'ngCordova',
  'starter.route',
  'starter.controllers',
  'starter.config',
  'starter.services',
  'starter.utils',
  'starter.directives',
  'starter.filter',
  'CoderYuan',
  'ngIOS9UIWebViewPatch',
  'ngFileUpload'
])

.run([
  '$rootScope',
  '$state',
  '$stateParams',
  '$ionicPlatform',
  '$ionicScrollDelegate',
  '$ionicHistory',
  '$ionicActionSheet',
  '$ionicLoading',
  '$location',
  'userService',
  '$ionicModal',
  'ENV',
  'StringUtil',
  '$cookies',
  '$window',
  function($rootScope, $state, $stateParams, $ionicPlatform, $ionicScrollDelegate, $ionicHistory ,$ionicActionSheet, $ionicLoading, $location, userService,$ionicModal,ENV,StringUtil,$cookies,$window) {
    $ionicPlatform.ready(function() {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.deviceHeight = document.body.clientHeight;
      $rootScope.imgUrl = ENV.imgUrl;
    });

    //用户cookies
    var currentUser = $cookies.get(ENV.currentUser);
    if(StringUtil.isNotEmpty(currentUser)){
      $rootScope.currentUserObj = JSON.parse(currentUser);
    }

    /*回到顶部*/
    $rootScope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop(true);
    };

    /*返回*/
    $rootScope.back = function() {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $location.path('/home');
      }
    };

    /*采购单数量*/
    $rootScope.$on('purchaseCounts',function(event,data){
      $rootScope.purchaseCounts = data;
    });

    //$rootScope.linkHelp = function(){
    //  $ionicActionSheet.show({
    //    buttons: [
    //      { text: '拨打耗材客服电话' },
    //      { text: '拨打义齿加工客服电话' },
    //      { text: '耗材在线咨询'},
    //      { text: '义齿加工在线咨询'}
    //    ],
    //    titleText: '服务电话<br/>周一至周六09:00-18:00(法定节假日除外)',
    //    cancelText: '取消',
    //    cancel: function() {
    //      // add cancel code..
    //    },
    //    buttonClicked: function(index) {
    //      switch(index){
    //        case 0:
    //          $window.location.href="tel://"+ENV.consumableTel;
    //          break;
    //        case 1:
    //          $window.location.href="tel://"+ENV.toothTel;
    //          break;
    //        case 2:
    //          break;
    //        case 3:
    //          break;
    //      }
    //      return true;
    //    }
    //  });
    //}

    $rootScope.$on('$stateChangeStart', (function () {
      var restrictedState = [
        'user', 'myOrders', 'orderDetail', 'orderOk', 'orderAddress', 'orderPay', 'mylog', 'purchaseOrderList',
        'purchaseOrderEdit', 'setting', 'favorite', 'purchaseOrderList'];
      var isRestricted = function (stateName) {
        return _.indexOf(restrictedState, stateName) !== -1;
      };
      return function(e, toState) {
        //hide loading
        $ionicLoading.hide();
        if(isRestricted(toState.name) && !userService.isLogin()) {
          e.preventDefault();
          $state.go('login');
        }
      }
    }()));

    //统一选择
    var scope = $rootScope.$new();
    $rootScope.commonSelect=function(o){
      if(!$rootScope.modalSelect){
        $ionicModal.fromTemplateUrl('templates/common/select.html',{
          animation: 'none',
          scope:scope
        }).then(function(modal){
          $rootScope.modalSelect= modal;
          $rootScope.modalSelect.show();
          scope.$broadcast('commonSelect:show',o);
        });
      }else{
        $rootScope.modalSelect.show();
        scope.$broadcast('commonSelect:show',o);
      }
    }
    //关闭选择弹窗
    $rootScope.closeSelectModal=function(){
      $rootScope.modalSelect.hide();
    }
  }
])

.config([
  '$locationProvider',
  '$ionicConfigProvider',
  '$httpProvider',
  function($locationProvider, $ionicConfigProvider, $httpProvider) {
    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.ios.views.transition('ios');

    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
    $ionicConfigProvider.platform.android.views.transition('android');

    //是否使用JS或原生滚动 --> android滚动兼容
    $ionicConfigProvider.scrolling.jsScrolling(true);

    // 解决键盘弹出屏幕折叠问题
    ionic.Platform.isFullScreen = true;

    //设置http post请求的默认内容类型为form-urlencoded
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8;';
    //为$http请求添加token参数
    $httpProvider.interceptors.push([
        'ENV',
        '$cookies',
        function(ENV, $cookies) {
          return {
            request: function(config) {
              var noTokenList = [ENV.siteUrl+'index/getrecommendproductc',ENV.siteUrl+'member/resetpass',ENV.siteUrl + 'member/login'];
              if((!/.*\.html$/.test(config.url) && /^\/.*/.test(config.url) || config.url.indexOf(ENV.siteUrl) !== -1) && _.indexOf(noTokenList,config.url) === -1) {
                if(config.method.toUpperCase() === 'GET') {
                  config.params = config.params || {};
                  config.params.token = $cookies.get(ENV.token_id);
                }
                if(config.method.toUpperCase() === 'POST' && config.headers['Content-Type'] != null && config.headers['Content-Type'] != 'undefined' && config.headers['Content-Type'] != undefined) {
                  if(config.headers['Content-Type'].indexOf( 'application/x-www-form-urlencoded;') != -1) {
                    var prefix = '&';
                    if(!config.data) {
                      config.data = prefix = ''
                    }
                    config.data += prefix + 'token=' + encodeURIComponent($cookies.get(ENV.token_id));
                  }
                  if(config.headers['Content-Type'].indexOf('application/json') != -1){
                    if(config.data){
                      config.data.token = $cookies.get(ENV.token_id);
                      config.data = JSON.stringify(config.data);
                    }
                  }
                }
              }
              return config;
            }
          }
        }
      ]);
      // $http异常处理
      // $httpProvider.interceptors.push([
      //   '$rootScope',
      //   '$q',
      //   '$location',
      //   '$ionicLoading',
      //   function($rootScope, $q, $location, $ionicLoading) {
      //     return {
      //       request: function(config) {
      //         $ionicLoading.show({
      //           template: '<aiya-loading></aiya-loading>',
      //           noBackdrop: true
      //         });
      //         if (!config.params) {
      //           config.params = {};
      //         }
      //         if (config.url.indexOf('/API/') > -1 && config.params) {
      //           config.params.PAGESIZE = {};
      //         }
      //         return config || $q.when(config);
      //       },
      //
      //       requestError: function(rejection) {
      //         $ionicLoading.hide();
      //         return $q.reject(rejection);
      //       },
      //
      //       response: function(response) {
      //         $ionicLoading.hide();
      //         var code = response.date.code;
      //         /**
      //          * 返回码 说明
      //          * 1 成功
      //          * 0 失败
      //          * 900 未知错误
      //          * 901 用户未登录或已过期
      //          * 902 权限不足
      //          */
      //         if (code === 0) {
      //           if ($rootScope.modal) {
      //             $rootScope.modal.hide();
      //           }
      //         }
      //         if (code === 901) {
      //           console.log('用户未登陆或已过期')
      //           $location.path("/signon");
      //         }
      //         if (code === 902) {
      //           console.log('权限不足');
      //         }
      //         return response;
      //       },
      //
      //       responseError: function(rejection) {
      //         if ($rootScope.modal) {
      //           $rootScope.modal.hide();
      //         }
      //         console.log('网络请求异常');
      //         return $q.reject(rejection);
      //       }
      //     };
      //   }
      // ]);
  }
]);

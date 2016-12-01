aiyaController.controller('registerController', [
  '$scope',
  '$state',
  'userService',
  'authCodeService',
  '$ionicLoading',
  'StringUtil',
  '$interval',
  'CommonUtil',
  '$window',
  '$ionicHistory',
  '$interval',
  function($scope, $state, userService, authCodeService, $ionicLoading,StringUtil,$interval,CommonUtil,$window,$ionicHistory,$interval){
    var user = {
      'mobile':'',
      'authCode':'',
      'password1':'',
      'password2':''
    };
    $scope.user = user;
    $scope.sendMessageCode = '免费获取验证码';
    $scope.sendMessageBtn = false;
    var reg=/^(?:13\d|15\d|18\d)\d{5}(\d{3}|\*{3})$/;

    $scope.submit = function () {
      var isPass = true;
      var msg = '';
      if(StringUtil.isEmpty($scope.user.mobile)){
        msg = '请输入你的手机号码！';
        isPass = false;
      }else if(!reg.test($scope.user.mobile)){
        msg = '请输入有效的手机号码！';
        isPass = false;
      }else if(StringUtil.isEmpty($scope.user.authCode)){
        msg = '请输入短信验证码！';
        isPass = false;
      }else if(StringUtil.isEmpty($scope.user.password1)){
        msg = '请输入密码！';
        isPass = false;
      } else if($scope.user.password1.length < 6 || $scope.user.password1.length > 20){
        msg = '请输入6-20字的字符';
        isPass = false;
      }else if(StringUtil.isEmpty($scope.user.password2)){
        msg = '请再次输入密码！';
        isPass = false;
      }else if($scope.user.password2!=$scope.user.password1){
        msg = '密码不统一！';
        isPass = false;
      }
      if(isPass) {
        var opt = {
          username: $scope.user.mobile,
          password: $scope.user.password1,
          captchacode: $scope.user.authCode
        };
        userService.register(opt)
          .then(function () {
            CommonUtil.tip('注册成功!');
            setTimeout(function () {
              return $ionicHistory.goBack(-2);
            }, 1000);
          }, function (errorMsg) {
            CommonUtil.tip(errorMsg);
          });
      }else {
        CommonUtil.tip(msg);
      }
    };
    var canClick = true;
    $scope.sendMessage=function(){
      if(canClick){
        var mobile = $scope.user.mobile;
        var timeCount = 60; //间隔函数，1秒执行
        if(!mobile){
          CommonUtil.tip('请输入手机号码！');
        }else if(!reg.test(mobile)) {
          CommonUtil.tip('请输入有效的手机号码！');
        }else{
            canClick = false;
            authCodeService.get(mobile, 1)
              .then(function () {
                $scope.sendMessageBtn = true;
                var timer = $interval(function(){
                  if(timeCount <= 0){
                    $interval.cancel(timer);
                    canClick = true;
                    $scope.sendMessageBtn = false;
                    $scope.sendMessageCode = "重新发送验证码";
                    return;
                  }
                  $scope.sendMessageCode = timeCount + '秒后可重发';
                  timeCount --;
                },1000);
              },function(errorMsg){
                canClick = true;
                CommonUtil.tip(errorMsg);
                return;
              });
          }
      }
    };


  }]);

aiyaController.controller('resetPwdController', [
  '$scope',
  '$state',
  '$ionicLoading',
  'userService',
  'StringUtil',
  'authCodeService',
  'CommonUtil',
  '$interval',
  function($scope, $state, $ionicLoading, userService,StringUtil, authCodeService,CommonUtil,$interval) {
    var userList = [{
      'mobile': '',
      'authCode': '',
      'password':''
    }];
    $scope.userList = userList;
    $scope.sendMessageCode = '免费获取验证码';
    $scope.sendMessageBtn = false;
    var tip = function (msg) {
      $ionicLoading.show({
        template: msg,
        noBackdrop: true,
        duration: 1500
      });
    };
    var reg=/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;

    $scope.submit = function () {
      var isPass = true;
      var msg = '';
      for (var i = 0; i < $scope.userList.length; i++) {
        var item = $scope.userList[i];
        if (StringUtil.isEmpty(item.mobile)) {
          msg = '请输入您的手机号码';
          isPass = false;
          break;
        }
        if(!reg.test(item.mobile)){
          msg = '请输入有效的手机号码！';
          isPass = false;
          break;
        }
        if (StringUtil.isEmpty(item.authCode)) {
          msg = '请输入短信验证码';
          isPass = false;
          break;
        }
        if(StringUtil.isEmpty(item.password)){
          msg = '请输入新密码';
          isPass = false;
          break;
        }
        if(item.password.length<6 || item.password.length>20){
          msg = '请输入6-20字的字符';
          isPass = false;
          break;
        }
      }
      if (isPass) {
        var opt = {
          username: item.mobile,
          password: item.password,
          captchacode: item.authCode
        };
        userService.resetPwd(opt)
          .then(function () {
            tip('密码重置成功，即将返回');
            setTimeout(function () {
              $scope.back();
            }, 1000);
          }, function (errorMsg) {
            tip(errorMsg);
          })
      } else {
        $ionicLoading.show({template: msg, noBackdrop: true, duration: 2000});
      }
    };

    var canClick = true;
    $scope.sendMessage=function(){
      if(canClick){
        var mobile = $scope.userList[0].mobile;
        var timeCount = 60; //间隔函数，1秒执行
        if(!mobile){
          CommonUtil.tip('请输入手机号码！');
        }else if(!reg.test(mobile)) {
          CommonUtil.tip('请输入有效的手机号码！');
        }else{
          canClick = false;
          authCodeService.get(mobile, 2)
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

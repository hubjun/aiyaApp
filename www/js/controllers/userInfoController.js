aiyaController.controller('userInfoController',[
  '$rootScope',
  '$scope',
  '$state',
  '$timeout',
  '$ionicLoading',
  '$ionicActionSheet',
  '$location',
  'userService',
  'logisticService',
  'StringUtil',
  'ENV',
  'Util',
  'CommonUtil',
  'orderService',
  'Upload',
  '$cookies',
  function($rootScope,$scope, $state, $timeout, $ionicLoading, $ionicActionSheet,$location, userService, logisticService, StringUtil, ENV, Util, CommonUtil, orderService,Upload,$cookies){
    var userInfoPromise;

    function init(){
      $ionicLoading.show();
      userInfoPromise = userService.getInfo();
      userInfoPromise.then(function (user) {
        $scope.user = user;
        // debugger
        $scope.userID = user.id;
        if(StringUtil.isEmpty($scope.user.photo)){
          $scope.user.photo = './img/myaiyaku/tou_icon.png';
        }else{
          $scope.user.photo = Util.getFullImg($scope.user.photo);
        }
        if(user.gender == ''){
          user.isHasGender = false;
        }else{
          user.isHasGender = true;
        }
        if(user.email == ''){
          user.isHasEmail = false;
        }else{
          user.isHasEmail = true;
        }
        if(user.birth == ''){
          user.isHasBirth = true;
        }else{
          user.isHasBirth = false;
        }

        $scope.serverData = {loadLazyTime:""};
        $timeout(function () {
          $scope.serverData.loadLazyTime = user.birth;
        },100);

        $scope.user.picTempFile = [];
        $ionicLoading.hide();
      }, function () {
        $ionicLoading.hide();
        $state.go('login');
      });
    }

    $scope.init = init;

    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.init();
      $scope.token = orderService.getTokenOne;
    });
    $scope.$on('$destroy', function () {
      if(userInfoPromise.abort) {
        userInfoPromise.abort();
      }
      $ionicLoading.hide();
    });

    //牙科名称
    $scope.linkDentistryOk = function(dentistryNameForm){
      $scope.validate = true;
      if(dentistryNameForm.$valid){
        var opt = {
          name: $scope.dentistryName
        }
        userService.update(opt)
          .then(function(){
            CommonUtil.tip('更新成功');
            setTimeout(function(){
              $state.go('userInfo');
            }, 1000);
            // $scope.user.name = $scope.user.name;
          },function(errMsg){
            CommonUtil.tip(errMsg);
          })
      }else if(dentistryNameForm.$invalid){
        CommonUtil.tip('请输入4~30个字符');
        dentistryNameForm.dentistryNameFocus = true;
      }else if(dentistryNameForm.$error.required){
        CommonUtil.tip('请填写牙科名称');
        dentistryNameForm.dentistryNameFocus = true;
      }
    };

    $scope.linkMobileOk = function(cellPhoneForm){
      $scope.validate = true;
      console.log('cellPhoneForm'+cellPhoneForm);
      if(cellPhoneForm.$valid){
        var opt = {
          mobile: $scope.mobile
        }
        userService.update(opt)
          .then(function(){
            CommonUtil.tip('更新成功');
            setTimeout(function(){
              $state.go('userInfo');
            }, 1000);
            // $scope.user.name = $scope.user.name;
          },function(errMsg){
            tip(errMsg);
          })
      }else if(cellPhoneForm.cellPhone.$invalid){
        CommonUtil.tip('请填写正确的手机号码');
        cellPhoneForm.cellPhoneFocus = true;
      }else if(cellPhoneForm.cellPhone.$error.required){
        CommonUtil.tip('请填写正确的手机号码');
        cellPhoneForm.cellPhoneFocus = true;
      }

    };

    $scope.linkTelOk = function(telPhoneForm){
      $scope.validate = true;
      if(telPhoneForm.$valid){
        var opt = {
          phone: $scope.tel
        }
        userService.update(opt)
          .then(function(){
            CommonUtil.tip('更新成功');
            setTimeout(function(){
              $state.go('userInfo');
            }, 1000);
          },function(errMsg){
            CommonUtil.tip(errMsg);
          })
      }else if(telPhoneForm.telNumber.$invalid){
        CommonUtil.tip('请填写正确的座机号码');
        telPhoneForm.cellPhoneFocus = true;
      }else if(telPhoneForm.telNumber.$error.required){
        CommonUtil.tip('请填写正确的座机号码');
        telPhoneForm.telNumberFocus = true;
      }
    };

    $scope.linkEmailOk = function(emailForm){
      $scope.validate = true;
      if(emailForm.$valid){
        var opt = {
          email: $scope.email
        }
        userService.update(opt)
          .then(function(){
            CommonUtil.tip('更新成功');
            setTimeout(function(){
              $state.go('userInfo');
            }, 1000);
          },function(errMsg){
            CommonUtil.tip(errMsg);
          })
      }else if(emailForm.emailName.$invalid){
        CommonUtil.tip('请填写正确的Email地址');
        emailForm.emailNameFocus = true;
      }else if(emailForm.telNumber.$error.required){
        CommonUtil.tip('请填写正确的Email地址');
        emailForm.emailNameFocus = true;
      }
    };

    $scope.saveDate = function(dateTime){
      console.log(dateTime);
      userService.update({id: $scope.userID, birth: dateTime})
        .then(function(){
          CommonUtil.tip('更新成功');
        }, function(err){
          CommonUtil.tip(err);
        });
    };

    //个人信息性别编辑
    $scope.linkGender = function(){
      $ionicActionSheet.show({
        buttons: [
          {text: '男'},
          {text: '女'}
        ],
        titleText: '',
        cancelText: '取消',
        buttonClicked: function(index){
          switch(index){
            case 0:
              userService.update({id: $scope.userID ,gender: 0})
                .then(function(){
                  $scope.user.genderDesc = '男';
                  CommonUtil.tip('更新成功');
                },function(errormsg){
                  tip(errormsg);
                })
              //console.log('男');
              break;
            case 1:
              userService.update({id: $scope.userID ,gender: 1})
                .then(function(){
                  $scope.user.genderDesc = '女';
                  CommonUtil.tip('更新成功');
                },function(errormsg){
                  CommonUtil.tip(errormsg);
                })
              //console.log('女');
              break;
          }
          return true;
        }
      });
    };

    //登出
    $scope.logout = function(){
      userService.logout()
        .then(function(){
          CommonUtil.tip('成功退出！');
          setTimeout(function(){
            $location.path('/home');
          },1000);
        },function(errMsg){
          CommonUtil.tip(errMsg);
        });
    }

    //上传头像module的监视，每次改编都会执行
    $scope.$watch('user.picTempFile', function () {
      if ($scope.user) {
        if ($scope.user.picTempFile.length > 0) {
          $scope.onFileSelect($scope.user.picTempFile);
        }
      }
    }, false);
    //上传图片，并将返回的id传给接口方法
    $scope.onFileSelect = function (file) {
      file.upload = Upload.upload({
        url:ENV.siteUrl + 'member/uploadPhoto',      //图片上传路径
        method: 'POST',
        file: file,
        data :{
          token: $cookies.get(ENV.token_id)         //token
        }
      });

      file.upload.then(function (response) {
        $timeout(function () {
              if (response.data.code == 1) {
                //如果上传成功
                $scope.user.photo = Util.getFullImg(response.data.data.photo);
              } else {
                CommonUtil.tip('上传图像失败');
              }
            });
        },function(response){

      });
      }


}]);

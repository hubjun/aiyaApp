aiyaController.controller('findAssistant',[
  '$scope',
  '$state',
  '$ionicLoading',
  'StringUtil',
  '$cordovaCamera',
  '$ionicActionSheet',
  'CommonUtil',
  'Upload',
  function($scope,$state,$ionicLoading,StringUtil,$cordovaCamera,$ionicActionSheet,CommonUtil,Upload){
    $scope.tabNav={curNav:'findAssistant'};

    var productList = [{
      'productTempImage':'../www/img/assistant_default.jpg',
      'productImage':'../www/img/assistant_default.jpg',
      'productName':'',
      'forBrand':'',
      'category':'',
      'purchaseNumber':''
    }];
    $scope.name = ''; //联系人姓名
    $scope.phone = '';//联系人电话
    $scope.hospitalName = ''//联系人医院地址
    $scope.productList = productList;


  $scope.$on('$ionicView.enter',function(){
    //判断是否登录
  });
    $scope.upload = function (file) {
      console.log(file);
    }

  /*新增*/
  $scope.addProduct = function(){
    var item =  {
      'productTempImage':'../www/img/assistant_default.jpg',
      'productImage':'../www/img/assistant_default.jpg',
      'productName':'',
      'forBrand':'',
      'category':'',
      'purchaseNumber':''
    };
    $scope.productList.push(item);
  }
  $scope.cutProduct = function(){
    if($scope.productList.length > 1){
      $scope.productList.splice($scope.productList.length-1,1);
    }
  }
  $scope.next = function(){
    debugger;
    if ($scope.findAssistantForm.$valid){
      $state.go('assistantConfirm');
    } else if (!$scope.findAssistantForm.productName.$valid) {
      $scope.focusProductName = true;
    } else if (!$scope.findAssistantForm.forBrand.$valid) {
      $scope.focusForBrand = true;
    }
  }

/*    //找货助手的监视，每次改编都会执行
    $scope.takePhoto = function(index){
      console.log(productList[index].productImage);
    }

    //上传图片，并将返回的id传给接口方法
    $scope.onFileSelect = function (file) {
      //console.log(file);
      var uploadurl = cdfg.getImgUploader();
      file.upload = Upload.upload({
        url: uploadurl,
        method: 'POST',
        file: file,
        data: {
          'disableAutoPrefix': true
        }
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
          accountService.updatePhoto(response.data.rid)
            .success(function (rps) {
              if (rps.code == 1) {
                //如果上传成功
                $rootScope.$broadcast('loading:hide');
                $scope.localUser.headerPic = response.data.rid;
                userService.setUser($scope.localUser);
              } else {
                popupService.promptPopup('上传失败', 'error');
              }
            })
        });
      }, function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      });
    }*/


    //上传照片方法
    /*    var uploadPhoto = function (filePath) {
      CommonUtil.tip('上传图片中...');//'/upload'
      $cordovaFileTransfer.upload(cdfg.getImgUploader(), filePath)
        .then(function (result) {
          // Success!
          popupService.toastr('上传图片成功，正在更新头像');
          var temp = JSON.parse(result.response);//返回头像图片的名称
          //$scope.localUser.headerPic = CDFG_IP_IMAGE + temp.rid;
          $scope.localUser.headerPic = temp.rid;
          //开始上传图片
          accountService.updatePhoto($scope.localUser.headerPic)
            .success(function (response) {
              if (response.code == 1) {
                //如果上传成功
                $rootScope.$broadcast('loading:hide');
                $scope.localUser.headerPic = temp.rid;
                userService.setUser($scope.localUser);
              } else {
                popupService.toastr('更新头像失败' + JSON.stringify(response));
              }
            }).error(function (response) {
              popupService.toastr('error' + JSON.stringify(response));
            })

        }, function (err) {
          popupService.toastr('上传错误' + JSON.stringify(err));
          $rootScope.$broadcast('loading:hide');
          if (response.code / 100 == 5) {
            popupService.toastr('服务器错误,稍后再次尝试');
          } else {
            popupService.toastr('数据获取失败,网络请求失败');
          }
        }, function (progress) {
        }
      )
    }

    $scope.takePhoto = function () {
      $cordovaCamera.cleanup();
      var options = {
        quality: 100,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.FILE_URI,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 200,
        targetHeight: 200,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function (imageUrl) {

        uploadPhoto(imageUrl);
      }, function (err) {
        // An error occured. Show a message to the user
        //PopupService.alertPopup('获取照片失败！');
      });
    };*/

  $scope.confirmPulish = function(){
    var resposebody = {name: $scope.name,hospitalName: $scope.hospitalName,phone:$scope.phone,productList:$scope.productList};
    notepad.save(resposebody,function(rs){
      if(rs.code == 1){
        $ionicLoading.show({template:'发布成功,我们会在一小时内给您报价',noBackdrop:true,duration:2000});
      }
    });
  };


}]);

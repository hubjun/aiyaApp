var aiyaController = angular.module('starter.controllers', []);

/**
 * Created by xionghuilin on 2016/5/26.
 */
aiyaController.controller('addressController',[
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$ionicListDelegate',
  '$timeout',
  'userAddressService',
  'CommonUtil',
  '$ionicScrollDelegate',
  function($scope,$rootScope,$state,$stateParams,$ionicListDelegate,$timeout,userAddressService,CommonUtil, $ionicScrollDelegate){

    $scope.goBack = goBack;
    //返回上一页
    function goBack() {
      //todo 清空缓存
      //$ionicHistory.goBack();
      //判断wap是否能获取到上一页路由 没有则返回首页
      if (!$ionicHistory.backView()) {
        $state.go('home');
        return;
      }
      ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
    }


    //初始化方法
    $scope.init = function () {
      $scope.myaddress = $stateParams.myaddress//用于判断用户从订单确认或者个人信息进入收货地址
      $scope.selectedAddress = $stateParams.addrId//左侧checkbox选择框，带过来的以选择地址的id，用于控制左侧checkbox选择框的勾选
      $scope.selectedItem = $stateParams.addrId;//选择的数据信息，记录选择地址的ID，用于传给地址详情，从地址服务中获取详细信息。
      userAddressService.getList().then(function(data){
        $scope.addressList = data.list;
      },function(err){
        CommonUtil.tip(err);
      });
    };

    //进入页面，刷新页面。
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
      if($scope.myaddress!=""){
        $scope.addressSet = 0;
      }
    });

    //删除地址方法
    $scope.deleteAddressInfo = function (addressId) {
      if ($scope.hasShowedPopup) {
        return;
      }
      $scope.hasShowedPopup = true;
      $timeout(function () {
        $scope.hasShowedPopup = false;
      });

      $ionicListDelegate.closeOptionButtons();
      CommonUtil.confirm('信息删除后不可恢复',null,'确认','取消')
        .then(function (res) {
          if (res) {
            userAddressService.delete(addressId).then(function(data){
              $scope.init();
              if ($scope.selectedAddress == addressId) {
                $rootScope.$broadcast('SELECT_ADDRESS_DELETED', addressId);//通知其他页面，当前选中地址被删除
              }
              $ionicScrollDelegate.scrollTop();
            },function(err){
              CommonUtil.tip(err);
            });
          }
        });
    };

    //广播地址信息，广播出ID，需要的在自己页面接收。发送的是全部数据。
    $scope.selectAddressData = function (addr) {
      $scope.selectedAddress = addr.id;//勾选上当前地址信息
      $rootScope.$broadcast('SELECT_ADDRESS', addr);//广播出去
      $scope.$ionicGoBack();
    };

    //点击编辑按钮跳转逻辑
    $scope.editAddress = function (addr) {
      $rootScope.$broadcast('SELECT_ADDRESS', addr);
      if ($scope.selectedAddress == addr.id) {//如果没有地址信息，去补全地址，然后直接返回
        $state.go('addressDetail', {addressId: addr.id, isSelect: true});
      } else {
        $state.go('addressDetail', {addressId: addr.id});
      }
    };
    //设置默认地址方法
    $scope.setDefaultAddress = function (addressId) {
      $ionicListDelegate.closeOptionButtons();
      userAddressService.setDefault(addressId).then(function(){
        $scope.init();
      },function(err){
        CommonUtil.tip(err);
      });
    };


}]);

/**
 * Created by 熊辉林 on 2016/5/23.
 */
aiyaController.controller('addressDetailController',[
  '$scope',
  '$ionicListDelegate',
  '$rootScope',
  'CommonUtil',
  '$stateParams',
  '$timeout',
  'userAddressService',
  '$ionicHistory',
  function($scope,$ionicListDelegate,$rootScope,CommonUtil,$stateParams,$timeout,userAddressService,$ionicHistory){

    //初始化方法
    $scope.adrsId = $stateParams.addressId;
    $scope.init = function () {
      $scope.selectedAddress = $stateParams.addrId//左侧checkbox选择框，带过来的以选择地址的id，用于控制左侧checkbox选择框的勾选
      $scope.selectedItem = $stateParams.addrId;//选择的数据信息，记录选择地址的ID，用于传给地址详情，从地址服务中获取详细信息。
      userAddressService.getList().then(function(data){
        $scope.addressList = data.list;
      },function(err){
        CommonUtil.tip(err);
      });
    };
    $scope.back = function(){
        CommonUtil.confirm('要保存修改的收货地址吗？',null,'保存','取消').then(function(res){
          if(res){
            $scope.$broadcast('address-detail-submit');
          }else{
            $ionicHistory.goBack();
          }
        });
    }
    $scope.$on('$ionicView.enter', function () {
      if($scope.adrsId != null && $scope.adrsId != ""){
        $scope.addressEdit = true;
        $scope.addressIns = false;
      }else{
        $scope.addressIns = true;
        $scope.addressEdit = false;
      }
      $scope.$broadcast('address-detail');
    });
/*
    $scope.submitAddressb = function () {
      $scope.$broadcast('address-detail-submit');
    }*/

    //删除地址方法
    $scope.deleteAddressInfo = function (addressId) {
      if ($scope.hasShowedPopup) {
        return;
      }
      $scope.hasShowedPopup = true;
      $timeout(function () {
        $scope.hasShowedPopup = false;
      });

      $ionicListDelegate.closeOptionButtons();
      CommonUtil.confirm('提示', '信息删除后不可恢复', '确认')
        .then(function (res) {
          if (res) {
            userAddressService.delete(addressId).then(function(data){
              $scope.init();
              $scope.$ionicGoBack();
              if ($scope.selectedAddress == addressId) {
                $rootScope.$broadcast('SELECT_ADDRESS_DELETED', addressId);//通知其他页面，当前选中地址被删除
              }
            },function(err){
              CommonUtil.tip(err);
            });
          }
        });
    };
}]);


aiyaController.controller('addressDetailFormController',[
  '$scope',
  '$rootScope',
  '$stateParams',
  'userAddressService',
  'CommonUtil',
  '$timeout',
  '$ionicScrollDelegate',
  function($scope,$rootScope,$stateParams,userAddressService,CommonUtil,$timeout,$ionicScrollDelegate){
    //初始化开关：true的时候需要初始化。false时候不需要初始化
    $scope.initFlag = true;
    $scope.init = function () {

      $scope.validate = false;
      $scope.addressId = $stateParams.addressId;//获得传来的addressId，如果没有就是新建地址
      $scope.isSelect = $stateParams.isSelect;//true，编辑选中的条目/false，编辑非选中条目
      if ($scope.addressId) {
        //如果id存在，则从网上获取地址信息//实际上是从上一个页面带过来的 数据
        $scope.addressInfo = userAddressService.get($scope.addressId).then(function(data){
          $scope.addressInfo.id = data.receiver.id;
          $scope.addressInfo.receiver = data.receiver.consignee;
          $scope.addressInfo.mobile = data.receiver.phone;
          $scope.addressInfo.addr = data.receiver.address;
          $scope.addressInfo.areaId = data.receiver.id;
          $scope.addressInfo.areaName = data.receiver.areaName;
          $scope.addressInfo.passportNo = data.receiver.zipCode;
          $scope.addressInfo.isDefault = data.receiver.isDefault;
        },function(err){
          CommonUtil.tip(err);
        });
      } else {
        //如果id不存在，则为新增；
        //保存地址参数
        $scope.addressInfo = {
          id:'',
          receiver: '',
          mobile: '',
          addr: '',
          areaId:'',
          areaName:'',
          passportNo: '',
          isDefault:false
        };
      }
    };
    $scope.$on('address-detail', function () {
      if ($scope.initFlag) {
        $scope.init();
      } else {
        $scope.initFlag = true;
      }
    });

    $rootScope.$on('LOCATION', function (evt, data) {
      $scope.addressInfo.areaName = data.full_name;
      $scope.addressInfo.areaId = data.id;
    });

    //保存按钮
    $scope.submitAddress = function () {
      $scope.validate = true;
      if ($scope.addressDetailForm.$valid && $scope.addressInfo.areaId != '' && $scope.addressInfo.areaId != null) {
        if(/\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g.test($scope.addressInfo.receiver)){
          CommonUtil.tip('收货人姓名存在非法字符');
          $scope.focusReceiver = true;
          return;
        }else {
          //判断名字长度
          if (/[\u4e00-\u9fa5]/g.test($scope.addressInfo.receiver)) {
            if ($scope.addressInfo.receiver && $scope.addressInfo.receiver.length > 7) {
              CommonUtil.tip('收货人姓名长度过长');
              $scope.addressInfo.receiver = "";
              $scope.focusReceiver = true;
              return;
            } else {
              $scope.textErr = false;
            }
          }else{
            if($scope.addressInfo.receiver && $scope.addressInfo.receiver.length > 14){
              CommonUtil.tip('收货人姓名长度过长');
              $scope.addressInfo.receiver = "";
              $scope.focusReceiver = true;
              return;
            }else {
              if($scope.addressInfo.receiver != ""){
                $scope.textErr = false;
              }
            }
          };
        }
        if(/\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g.test($scope.addressInfo.addr)){
          CommonUtil.tip('详细地址存在非法字符');
          $scope.focusAddr = true;
          return;
        }
        var params = {
          id :$scope.addressInfo.id,
          consignee: $scope.addressInfo.receiver,
          phone:$scope.addressInfo.mobile,
          areaName:$scope.addressInfo.areaName,
          areaId: $scope.addressInfo.areaId,
          zipCode:$scope.addressInfo.passportNo,
          address:$scope.addressInfo.addr,
          isDefault: $scope.addressInfo.isDefault
        }
        userAddressService.save(params).then(function(){
          $scope.submiting = false;
          CommonUtil.tip("信息保存成功");
          $timeout(function () {
            if ($scope.isSelect) {
              $rootScope.$broadcast('SELECT_ADDRESS_CHANGED', params);//通知其他页面，当前选中地址被删除
              $scope.$ionicGoBack(-2);
            } else {
              $scope.$ionicGoBack();
            }
          }, 1000);
        },function(err){
          CommonUtil.tip(err);
        });
      } else if (!$scope.addressDetailForm.receiver.$valid) {
        $scope.focusReceiver = true;
      } else if ($scope.addressDetailForm.mobile.$error.required) {
        CommonUtil.tip('请填写正确的手机号');
        $scope.focusMobile = true;
      } else if (!$scope.addressDetailForm.mobile.$valid) {
        CommonUtil.tip('请填写正确的手机号');
        $scope.focusMobile = true;
      } else if($scope.addressDetailForm.passportNo.$error.required){
        $scope.focusPassportNo = true;
      } else if(!$scope.addressDetailForm.passportNo.$valid){
        CommonUtil.tip('请填写正确的邮政编码');
        $scope.focusPassportNo = true;
      } else if (!$scope.addressInfo.areaName) {
        CommonUtil.tip('请选择所在省市');
      } else if (!$scope.addressDetailForm.addr.$valid) {
        $scope.focusAddr = true;
      }
    };

    $scope.$on('address-detail-submit', $scope.submitAddress);

    //选择联系人(从手机选择联系人)
    $scope.selectContact = function () {
      $scope.initFlag = false;
      navigator.contacts.pickContact(function (contact) {
          $scope.$apply(function () {
            $scope.addressInfo.receiver = !!contact.displayName ? contact.displayName : contact.name.formatted;
            $scope.addressInfo.mobile = contact.phoneNumbers[0].value.replace(/-/g, '').replace(/ /g, "");

          });
        }, function (err) {
          alert('读取联系人失败');
        }
      );
    };

    //设置默认地址方法
    $scope.setDefaultAddress = function (addressId) {
      $ionicListDelegate.closeOptionButtons();
      userAddressService.setDefault(addressId).then(function(){
        $scope.init();
      },function(err){
        CommonUtil.tip(err);
      });
    };
}]);

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

aiyaController.controller('assistantConfirm',['$scope','$ionicHistory',function($scope,$ionicHistory){
  $scope.confirmPulish = function(){

  }
}]);

aiyaController.controller('brandController',[
  '$rootScope',
  '$scope',
  '$ionicPopover',
  'brandService',
  '$state',
  '$ionicLoading',
  '$timeout',
  '$ionicScrollDelegate',
  function($rootScope,$scope,$ionicPopover,brandService,$state,$ionicLoading,$timeout,$ionicScrollDelegate){
    $scope.tabNav={curNav:'brand'};
    $scope.searchParam = {
      id:'',            //商品分类id
      keyword: '',
      makeType: ''
    };
    $scope.tabShow = 'ALL';
    var page = {};
    $scope.init = init;

    $scope.$on('$ionicView.beforeEnter',function(){
      $scope.init();
    });

    function init(){
      brandService.search($scope.searchParam).get(function(resp){
        $scope.brandList = resp.data.list;
        $scope.errState = 200;
      },function(err){
        $scope.errState = 500;
      });
    }

    $scope.changeTab=function(val){
      $scope.tabShow = val;
      //回到顶部
      $ionicScrollDelegate.$getByHandle('brandHandle').scrollTop();
      //数据请求
      if(val == 'ALL'){
        $scope.searchParam.makeType = '';
      }else if(val == 'IMPORT'){
        $scope.searchParam.makeType = false;
      }else if(val == 'HOME'){
        $scope.searchParam.makeType = true;
      }
     /* $ionicLoading.show(angular.extend({
        noBackdrop  : true,
        hideOnStateChange : true
      }, {}));*/
      $timeout(function(){
        $scope.init();
        $ionicLoading.hide();
      },500);

    }

    $scope.jumpBrandCategory = function(bId){
      $state.go('filterList', {'brandId':bId});
      console.log('品牌id:'+bId);
    };
    //按品牌分类筛选按钮
    $scope.classifyName1 = function(classifyName){
      $scope.searchParam = {
        keyword: 'classifyName',
        makeType: ''
      };
      brandService.search($scope.searchParam).get(function(resp){
        $scope.brandList = resp.data.list;
        $scope.errState = 200;

      },function(err){
        $scope.errState = 500;
      });
    }
    /*加载更多*/
    $scope.loadMore = function(){
      if(page.hasNextPage){
        params.pageNumber++;
        init();
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    //下拉更新
    $scope.doRefresh=function(){
      $scope.init();
      $scope.$broadcast('scroll.refreshComplete');
    }
    /*监听关键字改变*/
    $scope.$watch('searchParam.keyword',function(newValue,oldValue){
      if(oldValue !== newValue){
        $scope.init();
      }
    })

    $scope.onFinish = function(){
      $scope.init();
      console.log($scope.searchParam.id);
    }
    $scope.hasMore = function(){
      return page.hasNextPage;
    }
    $scope.onContentScroll = function() {
      if (!$ionicScrollDelegate.$getByHandle('brandHandle')) {
        return;
      }
      $timeout(function () {
        var position = $ionicScrollDelegate.$getByHandle('brandHandle').getScrollPosition();//获取滚动位置
        if (position) {
          $scope.showToTopImage = position.top > $rootScope.deviceHeight / 3.0;//大于屏幕高度1/3时显示【返回顶部】
        }
      }, 1000);
    }
  }]);

/**
 * Created by chh on 2016/5/23.
 */
aiyaController.controller('commonSelectController',[
  '$rootScope',
  '$scope',
  'userAddressService',
  'CommonUtil',
  '$ionicScrollDelegate',
  function($rootScope,$scope,userAddressService,CommonUtil,$ionicScrollDelegate){
    var selectMode;
    var sourceData = [];//每一步的数据源
    var checkData = [];
    var step=0;
    function init(){
      selectMode = $scope.data.selectMode;//选择模式，根据不同的选择模式，绑定不同的数据

      userAddressService.getProvinceList().then(function(data){
        $scope.selectData = data.list;
      },function(err){
        CommonUtil.tip(err);
      });
      //初始化：根据选择类型来选择数据、设定标题
      $scope.title ='选择地区';
    }

    //前一步
    $scope.prevStep = function(){
      if(step==0){
        $rootScope.closeSelectModal();
      }else{
        step--;
        $scope.selectData = deepCopyForObj(sourceData[step]);
        $scope.title = deepCopyForObj(checkData[step]).title;
      }
    }

    //选择
    var isFlag = false; //防止多次点击
    $scope.selectItem = function (val) {
      if(isFlag)return false;
      isFlag = true;
      //保存当前步骤的数据源
      sourceData[step] = deepCopyForObj($scope.selectData);
      checkData[step] = deepCopyForObj({title:$scope.title})
      $scope.title = val.full_name;
      step++;
      //判断是否是连续选择 省市县联动
      var params = {
        id:val.id
      }
      userAddressService.getCityList(params).then(function(data){
        $ionicScrollDelegate.scrollTop();
        if(data.list != null && data.list !='') {
          $scope.selectData = data.list;
        }else{
          $rootScope.$broadcast(selectMode, val);
          $rootScope.closeSelectModal();
        }
      },function(err){
        CommonUtil.tip(err);
      });
      setTimeout(function(){
        isFlag = false;
      },500)
    };
    $scope.$on('commonSelect:show',function(e,o){
      step = 0;
      checkData=[];
      sourceData = [];
      $scope.data=o;
      init();
    });

    /**
     * 对象的深拷贝
     * @param source 传入的对象
     * @returns {{}}
     */
    function deepCopyForObj(source) {
      var result={};
      if(source instanceof Array){
        result=[];
      }
      for (var key in source) {
        if(source[key] == null){
          result[key] = null;
        }else{
          result[key] = typeof source[key] === "object"? deepCopyForObj(source[key]): source[key];
        }
      }
      return result;
    }
}]);


aiyaController.controller('favoriteController',[
  '$rootScope',
  '$scope',
  '$ionicHistory',
  'favoriteService',
  'userService',
  'ArrayUtil',
  'CommonUtil',
  '$state',
  'StringUtil',
  'Util',
  'ENV',
  function($rootScope,$scope,$ionicHistory,favoriteService,userService,ArrayUtil,CommonUtil,$state,StringUtil,Util,ENV){
    $scope.checkObj ={
      isAllSelected : false
    }
    var productList = [];
    var page = {};
    var params = {
      pageNumber: 1,
      pageSize: 10
    }
    $scope.canEdit = false;//默认不能编辑
    $scope.errState = false;

    $scope.init = init;

    /*判断是否需要刷新*/
    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      $scope.favoriteCache = v.direction != 'forward';
    });

    $scope.$on('$ionicView.enter',function(){
      if(!$scope.favoriteCache) {
          $scope.init(true);
          /*当前用户*/
          userService.getInfo()
            .then(function(data){
              $scope.currentUser = data;
            },function(err){
              //console.log(err);
              CommonUtil.tip(err);
            });
      }

    });
    /*初始化商品列表*/
    function init(isRefresh){
      favoriteService.getProducts(params)
        .then(function(data){
          if(isRefresh){
            $scope.products = data.list;
          }else{
            $scope.products = $scope.products.concat(data.list);
          }
          page = data.page;
          _.each($scope.products,function(p,index){
            p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);
            _.assignIn(p,{isSelected: $scope.checkObj.isAllSelected});
            //价格分为三种情况
            if(p.isMarketable) {
              if (p.isSectionPrice && p.isYcInquiry && $scope.currentUser.isAuthoriz) {
                _.assignIn(p, {priceType: 'more'}); //区间价
              } else if (p.isYcInquiry && !$scope.currentUser.isAuthoriz) {
                _.assignIn(p, {priceType: 'yc'});
              } else {
                _.assignIn(p, {priceType: 'normal'});
              }
            }
          });
          $scope.noData = !($scope.products.length > 0);
          $scope.errState = false;
        },function(err){
          $scope.errState = true;
          $rootScope.errState = 500;
          CommonUtil.tip(err);
        });
    }

    $scope.back = function(){
      //判断是否是跳页，只是样式改变的话，只要更改样式的显示与隐藏就好
      if($scope.canEdit==false){
        //state路由改变部分
        if($ionicHistory.backView){
          $ionicHistory.goBack();
        } else {
          $state.go('user');
        }
      }else{
        //样式改变部分
        $scope.canEdit = !$scope.canEdit;
      }
    };

    $scope.remove = function(product){
      favoriteService.removeProduct(product).then(function(){
          params.pageNumber = 1;
          params.pageSize = 10;
          $scope.init(true);
      },function(err){
        CommonUtil.tip(err);
      });
    };
    $scope.removeAll = function(){
      if(_.filter($scope.products,{isSelected:true}).length ==0){
        CommonUtil.tip('请选择删除的商品');
        return;
      }
      CommonUtil.confirm('确定取消收藏吗？',null,'确定','取消').then(function(res){
        if(res){
          if($scope.checkObj.isAllSelected){
            favoriteService.clear().then(function(){
              $scope.canEdit = false;
              params.pageNumber = 1;
              params.pageSize = 10;
              $scope.init(true);
            },function(err){
              CommonUtil.tip(err);
            });
          }else{
            favoriteService.removeProduct(_.filter($scope.products,{isSelected: true})).then(function(){
              params.pageNumber = 1;
              params.pageSize = 10;
              $scope.canEdit = false;
              $scope.init(true);
            },function(err){
              CommonUtil.tip(err);
            });
          }
        }
      });
    };

    /*编辑*/
    $scope.edit = function(){
      $scope.canEdit = !$scope.canEdit;
    }

    /*加载更多*/
    $scope.loadMore = function(){
      if(page.hasNextPage){
        params.pageNumber++;
        init(false);
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    /*刷新*/
    $scope.doRefresh = function(){
      $scope.$apply(function(){
        params.pageNumber = 1;
        favoriteService.getProducts(params)
          .then(function(data){
            if(!data.list.length){
              $scope.noData = true;
            }
            else {
              $scope.noData = false;
              _.each(data.list,function(p,index){
                p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg  : Util.getFullImg(p.image);
                _.assignIn(p,{isSelected: $scope.checkObj.isAllSelected});
                //价格分为三种情况
                if(p.isMarketable) {
                  if (p.isSectionPrice && p.isYcInquiry && $scope.currentUser.isAuthoriz) {
                    _.assignIn(p, {priceType: 'more'}); //区间价
                  } else if (p.isYcInquiry && !$scope.currentUser.isAuthoriz) {
                    _.assignIn(p, {priceType: 'yc'});
                  } else {
                    _.assignIn(p, {priceType: 'normal'});
                  }
                }
              });
              $scope.products = data.list;
              page = data.page;
              if(page.list == ''){
                $scope.noData = true;
              }
            }
          },function(err){
            CommonUtil.tip(err);
          })
          .finally(function(){
            $scope.$broadcast('scroll.refreshComplete');
          });
      });
    }

    $scope.toggleSelectAll = function(){
      _.each($scope.products,function(p,index){
        p.isSelected = $scope.checkObj.isAllSelected;
      });
    }

    $scope.toggleSelectOne = function(pro){
      $scope.hasChecked();
    };
    /*判断是否全选*/
    $scope.hasChecked = function(){
      if($scope.products.length === _.filter($scope.products,{isSelected:true}).length && $scope.products.length != 0){
        $scope.checkObj.isAllSelected = true;
      }else{
        $scope.checkObj.isAllSelected = false;
      }
    }

    $scope.hasMore = function(){
      return page.hasNextPage;
    }
  }]);

aiyaController.controller('filterListCtrl', [
  '$scope',
  '$rootScope',
  '$ionicLoading',
  'CommonUtil',
  '$q',
  '$timeout',
  'userService',
  '$stateParams',
  '$ionicScrollDelegate',
  'StringUtil',
  'filterProList',
  'ENV',
  'Util',
  function ($scope, $rootScope, $ionicLoading, CommonUtil, $q, $timeout, userService, $stateParams, $ionicScrollDelegate, StringUtil, filterProList, ENV, Util) {

    //页面激活时
    $scope.$on('$ionicView.beforeEnter', function () {
      data(true);
    });
    var timeout,
      categoryIds = '';

    if (StringUtil.isNotEmpty($stateParams.fristCategoryId)) {
      categoryIds = parseInt($stateParams.fristCategoryId);
    }
    if (StringUtil.isNotEmpty($stateParams.childrenlistId) ) {
      categoryIds = parseInt($stateParams.childrenlistId);
    }

    var keyword = $stateParams.keyword;
    var brandId = $stateParams.brandId;

    $scope.keyValue = keyword;
    $scope.toggleDisplay = true;
    $scope.isColumnHide = false;
    $scope.isRowlistHide = true;
    $scope.showToTopImage = false;

    $scope.noData = false;
    $scope.obj_datalist = new Array();
    $scope.paging_parameter = {
      markeType: '',
      brandIds: brandId,
      categoryIds: categoryIds,
      keyword: keyword,
      salesDesc: '',
      dateDesc: '',
      priceOrder: '',
      pageNumber: 1,
      pageSize: 20,

      //商品多条件筛选
      first:  isNaN(parseInt($stateParams.fristCategoryId)) ? null :parseInt($stateParams.fristCategoryId) ,     //一级目录
      second: isNaN(parseInt($stateParams.childrenlistId)) ? null :parseInt($stateParams.childrenlistId),     //二级目录
      area: '',         //是否为国产品牌
      brands: brandId        //品牌
    };
    var page = {};

    $scope.toggleList = function () {
      if ($scope.isRowlistHide == true) {
        $scope.isRowlistHide = false;
        $scope.isColumnHide = true;

        $scope.toggleDisplay = false;
      } else {
        $scope.isRowlistHide = true;
        $scope.isColumnHide = false;
        $scope.toggleDisplay = true;
      }
    };

    $scope.sortBy = function (val) {
      $scope.tabCur = val;
      if (val == 'sales') {
        $scope.paging_parameter.salesDesc = true;
        $scope.paging_parameter.dateDesc = '';
        $scope.paging_parameter.priceOrder = '';
      } else if (val == 'new') {
        $scope.paging_parameter.dateDesc = true;
        $scope.paging_parameter.salesDesc = '';
        $scope.paging_parameter.priceOrder = '';
      } else if (val == 'pri') {
        if ($scope.paging_parameter.priceOrder == 'desc') {
          $scope.arrows = 'up';
          $scope.paging_parameter.priceOrder = 'asc';
          $scope.paging_parameter.dateDesc = '';
          $scope.paging_parameter.salesDesc = '';
        } else {
          $scope.arrows = 'down';
          $scope.paging_parameter.priceOrder = 'desc';
          $scope.paging_parameter.dateDesc = '';
          $scope.paging_parameter.salesDesc = '';
        }
      }
      $scope.paging_parameter.pageNumber = 1;
      data(true);
      $ionicScrollDelegate.scrollTop();
    };

    //关键字搜索
    $scope.$watch('keyValue', function (newVal, oldVal) {
        if (timeout) {
          $timeout.cancel(timeout);
        }
        $scope.paging_parameter.keyword = $scope.keyValue;
        $scope.paging_parameter.pageNumber = 1;
        timeout = $timeout(function () {
          $ionicScrollDelegate.scrollTop();
          data(true);
        }, 500);
    });

    var data = function (type) {
      filterProList.getFilterList($scope.paging_parameter).then(function (rs) {
        $scope.isAuthoriz = rs.isAuthoriz;
        $scope.obj_datalist = type ? rs.list : $scope.obj_datalist.concat(rs.list);
        _.each(rs.list, function (p) {
          p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);        //具体单个商品图片
        })
        if ($scope.obj_datalist.length == 0) {
          $scope.noData = true;
        } else {
          $scope.noData = false;
        }
        page = rs.page;
      }, function (error) {
        CommonUtil.tip(error);
      });
    };

    $scope.BtnFilterOk = function () {
      $scope.paging_parameter.makeType = $scope.paging_parameter.area;
      $scope.paging_parameter.categoryIds = StringUtil.isNotEmpty($scope.paging_parameter.second) ? $scope.paging_parameter.second : $scope.paging_parameter.first;
      $scope.paging_parameter.brandIds = _.join($scope.paging_parameter.brands,',');
      $ionicScrollDelegate.scrollTop();
      $scope.paging_parameter.pageNumber = 1;
      data(true);
    };

    //下拉刷新
    $scope.doFilterFresh = function () {
      $scope.paging_parameter.pageNumber = 1;
      data(true);
      $scope.$broadcast("scroll.refreshComplete");
    };

    //上拉刷新
    $scope.loadMoreList = function () {
      $scope.paging_parameter.pageNumber++;
      if (page.hasNextPage) {
        data();
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    /*是否更多数据*/
    $scope.hasMore = function () {
      return page.hasNextPage;
    }

    /*列表滚动，判断是否显示返回顶部*/
    $scope.onContentScroll = function() {
      if (!$ionicScrollDelegate.$getByHandle('productListHandle')) {
        return;
      }
      $timeout(function () {
          var position = $ionicScrollDelegate.$getByHandle('productListHandle').getScrollPosition();//获取滚动位置
          if (position) {
            $scope.showToTopImage = position.top > $rootScope.deviceHeight / 3.0;//大于屏幕高度1/3时显示【返回顶部】
          }
        }, 1000//1秒后跳转回去
      );
    }
  }]);

/*采用这种注入编译后期js压缩*/
aiyaController.controller('HomeCtrl',[
  '$rootScope',
  '$scope',
  '$state',
  'index',
  'ENV',
  'CommonUtil',
  '$location',
  '$window',
  '$ionicSlideBoxDelegate',
  '$ionicScrollDelegate',
  '$timeout',
  '$ionicActionSheet',
  'Util',
  'StringUtil',
  '$cookies',
  function($rootScope,$scope,$state,index,ENV,CommonUtil,$location,$window,$ionicSlideBoxDelegate,$ionicScrollDelegate,$timeout,$ionicActionSheet,Util,StringUtil,$cookies){
  //页面激活时
  // $scope.isAuthoriz = null;
  $scope.tabNav={curNav:'home'};
    $scope.showToTopImage = false;
    $scope.$on('$ionicView.beforeEnter',function(){
      //购物车数量每次刷新
      getPurchaseCount();
    });
  $scope.$on('$ionicView.enter', function(){
    //console.log('view.enter');
    $ionicSlideBoxDelegate.update();
  });
  var loadData = function(){
    index.recommedproductlist().get(null,function(rs){
      if(rs.code == 1){
        $scope.recommedproductlist = rs.data.list;
       //图片显示
        _.each($scope.recommedproductlist,function(p){
          p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);        //具体单个商品图片
        });
        $scope.errState = 200;

        $scope.isAuthoriz = $rootScope.currentUserObj.isAuthoriz;
      } else {
        CommonUtil.tip(rs.msg);
        $scope.errState = 200;
      }
    }, function(err){
      CommonUtil.tip(err);
      $scope.errState = 500;
    });
    $scope.loadData = loadData;

    index.floorproductlist().get(null,function(rs){
      if(rs.code == 1){
        $scope.floorproductlist = rs.data.list;
        _.each($scope.floorproductlist,function(p){
          _.each(p.adPositionList,function(ad){
            //具体单个楼层轮播图图片
            ad.path = StringUtil.isEmpty(ad.path) ? ENV.defaultImg : Util.getFullImg(ad.path);
          })
          _.each(p.brandList,function(br){
            //具体单个品牌图片
            br.logo = StringUtil.isEmpty(br.logo) ? ENV.defaultImg : Util.getFullImg(br.logo);
          });
          _.each(p.productList,function(p){
            //具体单个商品图片
            p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);
          })
        });
        $scope.errState = 200;
      } else {
        CommonUtil.tip(rs.msg);
        $scope.errState = 200;
      }
    },function(err){
      CommonUtil.tip('网络错误');
      $scope.errState = 500;
    });
  }
  loadData();

  //轮播图
  var adlistOpt = {
    beginDate: '',
    endDate: '',
    positionId: 27
  };
  $scope.adList = null;
  index.getAdlist(adlistOpt)
    .then(function(ads){
      _.each(ads.list,function(p){
        p.path = StringUtil.isEmpty(p.path) ? ENV.defaultImg : Util.getFullImg(p.path);        //具体单个商品图片
      });
      $scope.adList = ads.list;
      $scope.errState = 200;
    },function(errMsg){
      CommonUtil.tip(errMsg);
    });

    /*获取购物车数量*/
    function getPurchaseCount(){
      index.purchaseCount().get(function(rs){
        if(rs.code === 1 ){
            $scope.purchaseCounts = rs.data;
        }else{
          $scope.purchaseCounts = '';
        }
      });
    }

  $scope.setFloorHeadStyle = function(floor){
    var floorStyle = '';
    switch (floor){
      case '1F':
        floorStyle = 'head1';
        break;
      case '2F':
        floorStyle = 'head2';
        break;
      case '3F':
        floorStyle = 'head3';
        break;
      case '4F':
        floorStyle = 'head4';
        break;
      case '5F':
        floorStyle = 'head5';
        break;
      case '6F':
        floorStyle = 'head6';
        break;
      case '7F':
        floorStyle = 'head7';
        break;
      case '8F':
        floorStyle = 'head8';
        break;
      default :
        floorStyle = 'head1';
    }
    return floorStyle;
  }

  $scope.doHomeRresh = function(){
    loadData();
    $scope.$broadcast("scroll.refreshComplete");
  };

  //搜索跳转
  $scope.jumpSearchPage = function(){
    $state.go('homeSearch');
  };

  $scope.jumpSearchById = function(brandId){
    $state.go('filterList', {brandId: brandId});
  };

  $scope.jumpCategoryByFloorId = function(floorId){
    $state.go('filterList', {fristCategoryId: floorId});
  };

  /*监听路由判断网路状态*/
  $rootScope.$on('$stateChangeStart',function(event){
    if (navigator.connection) {
      var networdType = navigator.connection.type;
      if (networdType.toUpperCase().indexOf('NONE') > -1 || networdType.toUpperCase().indexOf('UNKNOWN') > -1) {
        event.preventdefault();
        var oldUrl = $location.url();
        $location.url('/network');
        $location.replace();
      }
    }
  });

  $rootScope.linkHelp = function(){
    $ionicActionSheet.show({
      buttons: [
        { text: '拨打耗材客服电话' },
        { text: '拨打义齿加工客服电话' },
        { text: '耗材在线咨询',id:'1013'},
        { text: '义齿加工在线咨询',id:'1003'}
      ],
      titleText: '服务电话<br/>周一至周六09:00-18:00(法定节假日除外)',
      cancelText: '取消',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        switch(index){
          case 0:
            $window.location.href="tel://"+ENV.consumableTel;
            break;
          case 1:
            $window.location.href="tel://"+ENV.toothTel;
            break;
          case 2:
            $('#1013').click()
            break;
          case 3:
            $('#1003').click()
            break;
        }
        return true;
      }
    });
  };

  /*列表滚动，判断是否显示返回顶部*/
  $scope.onContentScroll = function() {
    if (!$ionicScrollDelegate.$getByHandle('homeHandle')) {
      return;
    }
    $timeout(function () {
        var position = $ionicScrollDelegate.$getByHandle('homeHandle').getScrollPosition();//获取滚动位置
        if (position) {
          $scope.showToTopImage = position.top > $rootScope.deviceHeight / 3.0;//大于屏幕高度1/3时显示【返回顶部】
        }
      }, 1000//1秒后跳转回去
    );
  }
}]);


aiyaController.controller('HomeSearchCtrl', [
  '$scope',
  '$timeout',
  '$state',
  '$ionicScrollDelegate',
  'userService',
  'homeSearch',
  function($scope, $timeout ,$state, $ionicScrollDelegate, userService, homeSearch){

  var timeout;
  $scope.keyword = '';
  $scope.dataList = '';
  $scope.noData = true;
  //$scope.homeHotKeyworld = homeSearch.homeHotKeyworld();
  init();
  $scope.$on('$ionicView.enter',function(){
    setTimeout(function(){
      // $scope.searchFocus = true;
      $('#keyword').focus();
      $ionicScrollDelegate.scrollTop();
    },1000);
    console.log('focus');
  });

  $scope.$watch('keyword', function(newVal,oldVal){
    //console.log('newVal'+ newVal + '  oldVal:'+oldVal);
    var searchOpt = {
      keyword: $scope.keyword,
      count: 10
    };
    if($scope.keyword){
      if(timeout){
        $timeout.cancel(timeout);
      }
      //alert('no timeout');
      timeout = $timeout(function(){
      // console.log(userService.isLogin);
        // if(userService.isLogin){
        //   homeSearch.hostorylist(searchOpt).then(function(rs){
        //     // console.log(rs);
        //     if(rs.data.list.length > 0){
        //       $scope.noData = true;
        //       $scope.dataList = rs.data.list;
        //     }else {
        //       $scope.noData = false;
        //       $scope.dataList = '';
        //     }
        //   }, function(error){
        //     // CommonUtil.tip(error);
        //   });
        // }else {
          //热门搜索列表
          homeSearch.fullsearchkeylist(searchOpt).then(function(rs){
            if(rs.list.length > 0){
              // $scope.noData = true;
              $scope.dataList = rs.list;
              console.log($scope.dataList);
            }else {
              $scope.noData = false;
              $scope.dataList = '';
            }
          }, function(error){
            CommonUtil.tip(error);
          });
        // }
      }, 300);
    }
  });

  $scope.jumpSearch = function(){
    console.log('关键字：'+$scope.keyword);
    $scope.homeInputFocus = false;
    $state.go('filterList', {keyword:$scope.keyword});
  };

  $scope.jumpHotSearch = function(key){
    console.log('热门关键字：'+ key);
    $state.go('filterList', {keyword:key});
  };

  $scope.junmpHotlistSearch = function(key){
    $state.go('filterList', {keyword:key});
  };

  //搜索框内容清除
  $scope.clearSearch = function(){
    $scope.keyword = '';
  };

  $scope.doHomeSearchRefresh = function(){
    init();
    $scope.$broadcast('scroll.refreshComplete');
  };

  function init(){
    homeSearch.homeHotKeyworld().get(null, function(rs){
      if(rs.code === 1){
        $scope.homeHotKeyworld = rs.data.list;
      }else{
        $ionicLoading.show({
          template: rs.msg,
          duration: 1500
        });
      }
    });
  };

}]);

aiyaController.controller('loginController', [
  '$scope',
  '$state',
  '$ionicLoading',
  'StringUtil',
  'userService',
  'index',
  function($scope, $state, $ionicLoading,StringUtil, userService,index){
    var userList = [{
      'name':'',
      'password':''
    }];
    $scope.userList = userList;
    var tip = function (msg) {
      $ionicLoading.show({
        template: msg,
        noBackdrop: true,
        duration: 1500
      });
    };
    $scope.login = function () {
      var isPass = true;
      var msg = '';
      for(var i = 0; i< $scope.userList.length; i++){
        var item = $scope.userList[i];
        if(StringUtil.isEmpty(item.name)){
          msg = '请输入用户名/手机号';
          isPass = false;
          break;
        }
        if(StringUtil.isEmpty(item.password)){
          msg = '请输入您的密码';
          isPass = false;
          break;
        }
      }
      if(isPass) {
        var opt = {
          username: $scope.userList[0].name,
          password: $scope.userList[0].password,
          usertype: 1
        };
        $ionicLoading.show({template: '<div>登录中<ion-spinner icon="dots" style="vertical-align: middle;display:inline-block;height: 28px;width: 28px;fill: #fff"></ion-spinner></div>'});
        $scope.$on('$destroy', function () {
          $ionicLoading.hide();
        });
        userService.login(opt)
          .then(function () {
            $ionicLoading.hide();
            tip('登录成功');
            /*广播采购单数量*/
            index.purchaseCount().get(function(rs){
              if(rs.code === 1 ){
                $scope.$emit('purchaseCounts',rs.data);
              }
            });
            setTimeout(function () {
              $scope.back();
            }, 1000);
          }, function (errorMsg) {
            $ionicLoading.hide();
            tip(errorMsg);
          });
      }else{
        $ionicLoading.show({template:msg,noBackDrop:true,duration:2000});
      }
    }
  }]);

aiyaController.controller('modifyPwdController', [
  '$scope',
  '$state',
  '$ionicLoading',
  'CommonUtil',
  'userService',
  function($scope,$state,$ionicLoading,CommonUtil,userService){
    $scope.modifyPwdSubmit = function(resetPwdForm){
      $scope.validate = true;
      var oldPwd='';
      var password = '';

      if(resetPwdForm.$valid){
        if($scope.oldPwd.indexOf(' ') >= 0){
          CommonUtil.tip('旧密码不能包含空格');
          return false;
        }
        if($scope.newPwd.indexOf(' ') >= 0){
          CommonUtil.tip('新密码不能包含空格');
          return false;
        }
        if($scope.newOkPwd.indexOf(' ') >= 0){
          CommonUtil.tip('密码确认不能包含空格');
          return false;
        }
        _.each(_.split($scope.oldPwd, ' '),function(data,index){
          oldPwd += data;
        });
        _.each(_.split($scope.newOkPwd, ' '),function(data,index){
          password += data;
        });
        var opt = {
          oldPwd:oldPwd,
          password:password
        };
        var newPwd = $scope.newPwd,
            pwdOk = $scope.newOkPwd;
        if(newPwd != pwdOk){
          CommonUtil.tip('密码确认和新密码不一致');
        }
        else {
          userService.modifyPwd(opt)
            .then(function(){
              CommonUtil.tip('密码修改成功');
              setTimeout(function(){
                $state.go('setting');
              }, 1500);
            }, function(error){
              CommonUtil.tip(error);
            })
        }
      }else if(resetPwdForm.oldPwd.$error.required){
        // CommonUtil.tip('请输入您的当前密码');
        resetPwdForm.oldPwdFocus = true;
      }else if(resetPwdForm.newPwd.$error.required){
        // CommonUtil.tip('请输入您的当前密码');
        resetPwdForm.newPwdFocus = true;
      }else if(resetPwdForm.newPwd.$error.maxlength){
        CommonUtil.tip('新密码不能超过18个字符哦');
        resetPwdForm.newPwdFocus = true;
      }else if(resetPwdForm.newPwd.$error.minlength){
        CommonUtil.tip('新密码最少6个字符哦');
        resetPwdForm.newPwdFocus = true;
      }else if(resetPwdForm.newOkPwd.$error.required){
        // CommonUtil.tip('请输入您的当前密码');
        resetPwdForm.newOkPwdFocus = true;
      }else if(resetPwdForm.newOkPwd.$error.maxlength){
        CommonUtil.tip('密码确认不能超过18个字符哦');
        resetPwdForm.newOkPwdFocus = true;
      }else if(resetPwdForm.newOkPwd.$error.minlength){
        CommonUtil.tip('密码确认最少6个字符哦');
        resetPwdForm.newOkPwdFocus = true;
      }
    }

  }
]);

aiyaController.controller('moreMRCtrl',['$scope','moreMR','ENV',function($scope,moreMR,ENV){

    $scope.imgurl = ENV.imgUrl;

    $scope.recommendMoreList = moreMR.recommendMoreList();
}]);

aiyaController.controller('mylogController', [
  '$scope',
  '$stateParams',
  'logisticService',
  'CommonUtil',
  'StringUtil',
  'ENV',
  'Util',
  function ($scope, $stateParams, logisticService, CommonUtil, StringUtil, ENV, Util) {

    var shippingStatusDesc = ['未发货','部分发货', '已发货', '部分退货', '已退货', '用户收货', '已收货(已签收)'];

    $scope.init = init;
    $scope.hasLogistics = false;

    $scope.$on('$ionicView.beforeEnter',function(){
      $scope.init();
    })

    //初始化
    function init(){
      logisticService.get($stateParams.sn).then(function (data) {
        $scope.expresssn = data.expresssn;
        $scope.logisticsList = data.logisticsList;
        if(data.logisticsList == '' || data.logisticsList == null){
          $scope.hasLogistics = true;
        }
        console.log($scope.hasLogistics);
        $scope.productList = data.productList;
        $scope.shippingMethodName = data.shippingMethodName;
        $scope.shippingStatus = shippingStatusDesc[data.shippingStatus];
        $scope.sn = data.sn;
        $scope.thumbnail = StringUtil.isEmpty(data.thumbnail) ? ENV.defaultImg : Util.getFullImg(data.thumbnail);
        _.each($scope.productList,function(p,index){
          p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg  : Util.getFullImg(p.image);
        });
      },function(err){
        CommonUtil.tip(err);
      });
    }
  }
]);

aiyaController.controller('myOrdersController', [
  '$scope',
  '$stateParams',
  '$timeout',
  'CommonUtil',
  'orderService',
  '$state',
  '$ionicScrollDelegate',
  'StringUtil',
  'ENV',
  'Util',
  '$ionicModal',
  function ($scope, $stateParams, $timeout, CommonUtil, orderService,$state,$ionicScrollDelegate,StringUtil,ENV,Util,$ionicModal) {
    $scope.networkError = false;
    var states = [
      {
        type: 'all',
        tabIndex: 0,
        pageNumber: 1,
        pageSize: 3,
        hasMore: true,
        orders: [],
        loadPending: false,
        initated: false
      },
      {
        type: 'wPay',
        tabIndex: 1,
        pageNumber: 1,
        pageSize: 3,
        hasMore: true,
        orders: [],
        loadPending: false,
        initated: false
      },
      {
        type: 'wDeliver',
        tabIndex: 2,
        pageNumber: 1,
        pageSize: 3,
        hasMore: true,
        orders: [],
        loadPending: false,
        initated: false
      },
      {
        type: 'wComfirm',
        tabIndex: 3,
        pageNumber: 1,
        pageSize: 3,
        hasMore: true,
        orders: [],
        loadPending: false,
        initated: false
      },
      {
        type: 'wComment',
        tabIndex: 4,
        pageNumber: 1,
        pageSize: 3,
        hasMore: true,
        orders: [],
        loadPending: false,
        initated: false
      }
    ];
    var page = {};
    var currentState = states[$stateParams.tab];
    //返回0,1,2,3分别代表全部，待付款，待发货...等等
    $scope.currentTab = currentState.tabIndex;
    //返回该states的状态
    $scope.getState = function (type) {
      return typeof type === 'string' ? _.find(states, {'type': type}) : _.find(states, {'tabIndex': type});
    };

    $scope.switchState = function (index) {
      currentState = states[index];
      $scope.currentTab = currentState.tabIndex;
      $scope.currentType = currentState.type;
      /*if (!currentState.orders.length) {
        loadMore(currentState);
      }*/
      resetState();
      loadMore(currentState);
    };

    //折叠展示商品
    $scope.show = function ($index, order) {
      return order.expanded || $index < 2;
    };
    $scope.showContentTxt;
    $scope.showHandle = function (order) {
      // return !order.expanded && order.productList.length > 2;
      if(order.productList.length > 2){
        return true;
      }
      return false;
    };

    //判断用户是第几次点击按钮，第一次状态为展开，第二次状态为收起
    $scope.showContentTxt = "查看全部";
    $scope.expand = function ($event,$index,order) {
      if(order.clickState==1){
        order.expanded = true;
        order.clickState = 2;
        $event.target.innerHTML = "收起";
        $ionicScrollDelegate.resize();
      }else{
        $ionicScrollDelegate.$getByHandle("myOrdersHandle").scrollTo(0,$event.target.parentElement.offsetTop);
        order.expanded = false;
        $scope.show($index,order);
        order.clickState = 1;
        $event.target.innerHTML = "查看全部";
      }
    };
    $scope.loadMore = loadMore;

    //init
    loadMore(currentState);

    function loadMore(state) {
      //loadPending是否加载
      if (state.loadPending) return;
      state.loadPending = true;
      loadOrders(state)
        .then(function (resp) {
          state.initated = state.initated ? state.initated : !state.initated;
          if (!resp.list.length) {
            // debugger
            //如果没有返回数据，则不需加载更多，意味着已经加载到最后一页
            state.hasMore = false;
            $scope.noData = true;
          }
          // else if(resp.list.length <= 0){
          //   $scope.noData = true;
          // }
          else {
            $scope.noData = false;
            _.each(resp.list, function (p) {
              if (p.specificationValuesName == '') {
                p.isHasSpecification = false;
              } else {
                p.isHasSpecification = true;
              }
              //每个订单默认图片
              p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);
              _.each(p.productList,function(p){
                //具体单个商品图片
                p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);
              });
            });
            // state.pageNumber++;
            page = resp.page;
            //当前订单为空Tips
            if(page == ''){
              $scope.noData = true;
            }
          }
          $scope.$broadcast("isImgTips", $scope.noData);
        },function(){
          $scope.networkError = true;
        })
        .finally(function () {
          state.loadPending = false;
          state.scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    //评价升级中
    $scope.orderEvaluation = function(){
      CommonUtil.alter('评价系统正在升级中，您可以先到爱牙库PC端评价，不便之处，敬请谅解！');
    };

    //$scope.cancelSingleOrder = function (sn, $index) {
      // var loadMore = (function () {
      //   var pending = false;
      //   return function () {
      //     if (pending) return;
      //     pending = true;
      //
      //     var loadMorePromise = getProductsPromise.then(function (products) {
      //         if (!products.length) {
      //           $scope.hasMore = false;
      //         } else {
      //           _.each(products, function (p, i) {
      //             console.log(products);
      //             if (p.specificationValuesName == '') {
      //               p.isHasSpecification = false;
      //             } else {
      //               p.isHasSpecification = true;
      //             }
      //             if (p.image == '') {
      //               p.isHasimage = false;
      //             } else {
      //               p.isHasimage = true;
      //             }
      //             $scope.purchaseProducts.push(p);
      //
      //             _.each($scope.purchaseProducts, function (p) {
      //               p.isSelected = true;
      //             });
      //           });
      //           checkIsAllSelected();
      //           pageNumber++;
      //         }
      //       })
      //       .finally(function () {
      //         pending = false;
      //       });
      //     loadMorePromise.abort = getProductsPromise.abort;
      //     return loadMorePromise;
      //   };
      // }());
      $scope.cancelSingleOrder = function (sn,$index) {
        CommonUtil.confirm('订单取消后，只能通过再次购买生成订单，您确定要取消吗', null, '确定', '取消').then(function (res) {
          if (res) {
            orderService.cancelOrder(sn)
              .then(function () {
                CommonUtil.tip('取消成功');

                var state;
                if ($scope.currentType == "wPay") {
                  state = $scope.getState('wPay');
                  state.orders.splice($index, 1);
                } else {
                  state = $scope.getState('all');
                  orderService.get(sn)
                    .then(function(order){
                      if($scope.$$destroyed) return $q.reject();
                      state.orders[$index].orderStatus = order.orderStatus;
                      state.orders[$index].orderStatusDesc = order.orderStatusDesc;
                    })
                }
                $scope.$broadcast("orderCancel", state);
                // console.log($scope.currentType);
              }, function () {
                CommonUtil.tip('取消订单失败');
              })
          }
        });
      };

      $scope.confirmSingleOrder = function (sn, $index) {
        CommonUtil.confirm('确认收货后，方可评价，确认要收货吗？', null, '确定', '取消').then(function (res) {
          if (res) {
            orderService.confirmOrder(sn)
              .then(function () {
                CommonUtil.tip('确认成功');
                var state = $scope.getState('wComfirm');
                state.orders.splice($index, 1);
              } , function(){
                CommonUtil.tip('确认失败');
              });
          }
        });
      };

      /*再次购买*/
      $scope.buyAgain = function (id) {
        var params = {
          id: id
        }
        orderService.buyAgain(params).then(function () {
          $state.go('purchaseOrderList');
        }, function (err) {
          CommonUtil.tip(err);
        });
      }

      function loadOrders(state) {
        var pn = state.pageNumber,
          ps = state.pageSize,
          ti = state.tabIndex;
        return orderService.getList(pn, ps, {'type': ti})
          .then(function (resp) {
            var _orders = state.orders;
            _.each(resp.list, function (order) {
              _.assignIn(order,{clickState:1});
              _orders.push(order);
            });

            // console.log('paymentStatus:'+_orders.paymentStatus+',orderStatus:'+_orders.orderStatus+',isExpire:'+_orders.isExpire);

            $scope.isMonthly = resp.isMonthly;
            return resp;
          });
      }
    //判断是否有数据
    //  $scope.isShowBg = function(length){
    //    if(length>0){
    //      return false;
    //    }else{
    //      return true;
    //    }
    //  }
    //重置初始状态
    function resetState (){
      currentState.pageNumber = 1;
      currentState.initated = false;
      currentState.loadPending = false;
      currentState.orders = [];
    }
    //下拉刷新列表
    $scope.doMyOrderListRefresh=function(){
      //重置初始状态
      resetState();
      loadMore(currentState);
      $scope.$broadcast('scroll.refreshComplete');
    }

    //上拉刷新
    $scope.loadMoreList = function (state) {
      state.pageNumber++;
      $scope.noData = false;
      if (page.hasNextPage) {
        loadMore(state);
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    /*订单搜索*/
    $ionicModal.fromTemplateUrl('templates/order/orderSearch.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
       $scope.orderSearchModal = modal;
     });

    $scope.openOrderSearch = function(){
      $scope.orderSearchModal.show();
    }

    $scope.closeOrderSearch = function(){
      $scope.orderSearchModal.hide();
    }
  }
])
.controller('myOrderAllController', ["$scope", function ($scope) {
  $scope.state = $scope.getState('all');
  $scope.state.scope = $scope;
  $scope.$on("orderCancel",function(e,data){
    $scope.state = data;
    console.log(data);
  });
  $scope.$on('isImgTips', function(e,data){
    $scope.noData = data;
  })
}])
.controller('myOrderWpayController', ["$scope", function ($scope) {
  $scope.state = $scope.getState('wPay');
  $scope.state.scope = $scope;
  $scope.$on("orderCancel",function(e,data){
    $scope.state = data;
  });
  $scope.$on('isImgTips', function(e,data){
    $scope.noData = data;
  })
}])
.controller('myOrderWdeliverController', ["$scope", function ($scope) {
  $scope.state = $scope.getState('wDeliver');
  $scope.state.scope = $scope;
  $scope.$on('isImgTips', function(e,data){
    $scope.noData = data;
  })
}])
.controller('myOrderWcomfirmController', ["$scope", function ($scope) {
  $scope.state = $scope.getState('wComfirm');
  $scope.state.scope = $scope;
  $scope.$on('isImgTips', function(e,data){
    $scope.noData = data;
  })
}])
.controller('myOrderWcommentController', ["$scope", function ($scope) {
  $scope.state = $scope.getState('wComment');
  $scope.state.scope = $scope;
  // $scope.$on('isImgTips', function(e,data){
  //   $scope.noData = data;
  // })
}]);

aiyaController.controller('networkCtrl',['$scope','$stateParams',function($scope,$stateParams){

}])

aiyaController.controller('waitPayCtrl', ['$scope', function($scope){

}])

aiyaController.controller('orderDetailController', [
  '$rootScope',
  '$scope',
  '$stateParams',
  'orderService',
  '$q',
  '$ionicHistory',
  '$timeout',
  '$ionicScrollDelegate',
  '$state',
  'StringUtil',
  'ENV',
  'Util',
  'CommonUtil',
  function($rootScope,$scope, $stateParams, orderService, $q, $ionicHistory,$timeout,$ionicScrollDelegate,$state,StringUtil,ENV,Util,CommonUtil) {
    var sn = $stateParams.sn;
    // $scope.paymentStatus = $stateParams.paymentStatus;
    // $scope.paymentStatusDesc = ENV.paymentStatusMap[$stateParams.paymentStatus];
    // $scope.shippingStatus = $stateParams.shippingStatus;
    // $scope.shippingStatusDesc = ENV.shippingStatusMap[$stateParams.shippingStatus];
    // $scope.orderStatus = $stateParams.orderStatus;
    // $scope.orderStatusdesc = ENV.orderStatusMap[$stateParams.orderStatus];
    $scope.isExpire = $stateParams.isExpire === 'true' ? true : false;
    console.log('isExpire:'+$scope.isExpire);
    // console.log('shippingStatus:'+$scope.shippingStatus);
    // console.log('paymentStatus:'+$scope.paymentStatus);
    console.log('sn:'+$stateParams.sn);
    //init
    getOrder(sn);
    function getOrder(sn){
      orderService.get(sn)
        .then(function (order) {
          if($scope.$$destroyed) return $q.reject();
          order.image = StringUtil.isEmpty(order.image) ? ENV.defaultImg : Util.getFullImg(order.image);
          _.each(order.productList,function(order){
            order.image = StringUtil.isEmpty(order.image) ? ENV.defaultImg : Util.getFullImg(order.image);        //具体单个商品图片
          });
          $scope.order = order;
          // console.log('isMonthly:'+$scope.order.isMonthly);
          console.log('isMonthly:'+order.isMonthly);
          // console.log('orderInfo-paymentStatus:'+order.paymentStatus);
          //折叠展示商品
          $scope.show = function ($index, order) {
            return order.expanded || $index < 2;
          };
          $scope.showHandle = function (order) {
            return !order.expanded
          };
          //发票信息
          console.log($scope.order.isInvoice);
          $scope.isInvoice = $scope.order.isInvoice;
          $scope.invoiceTitle = $scope.order.invoiceTitle;

          //订单列表显示与隐藏按钮
          $scope.orderDetailToggle = "查看全部";
          $scope.expand = function (order) {
            if($scope.orderDetailToggle == "查看全部"){
              $scope.orderDetailToggle = "收起";
              order.expanded = true;
              $ionicScrollDelegate.resize();
            }else{
              $scope.orderDetailToggle = "查看全部";
              order.expanded = false;
              //回到顶部
              $rootScope.scrollTop();
            }

          };
          var setRemainTime = function () {
            var expireTime = new Date(order.expire).getTime();
            var remianTime = expireTime - new Date().getTime(),
              dTime = remianTime / 1000 / (60 * 60 * 24),
              d = Math.floor(dTime),
              hTime = (dTime - d) * 24,
              h = Math.floor(hTime);
            order.rtime = {d: d, h: h};
          };

          if(!order.isMonthly && $scope.isExpire && $scope.paymentStatus == '0') {
            setRemainTime();
          }
        })
        .then(function (order) {
          console.log('查询物流');
          //查询物流
        })
    }


    //确认收货
    $scope.confirmSingleOrder = function (sn) {
      CommonUtil.confirm('确认收货后，方可评价，确认要收货吗？', null, '确定', '取消').then(function (res) {
        if (res) {
          orderService.confirmOrder(sn)
            .then(function () {
              CommonUtil.tip('确认成功');
            } , function(){
              CommonUtil.tip('确认失败');
            });
        }
      });
    };

    //取消订单
    $scope.cancelSingleOrder = function (sn) {
      CommonUtil.confirm('订单取消后，只能通过再次购买生成订单，您确定要取消吗', null, '确定', '取消').then(function (res) {
        if (res) {
          orderService.cancelOrder(sn)
            .then(function () {
              CommonUtil.tip('取消成功');
              getOrder(sn);
              // console.log($scope.currentType);
            }, function () {
              CommonUtil.tip('取消订单失败');
            })
        }
      });
    };

    /*再次购买*/
    $scope.buyAgain = function (id) {
      var params = {
        id: id
      }
      orderService.buyAgain(params).then(function () {
        $state.go('purchaseOrderList');
      }, function (err) {
        CommonUtil.tip(err);
      });
    };

    $scope.orderEvaluation = function(){
      CommonUtil.alter('评价系统正在升级中，您可以先到爱牙库PC端评价，不便之处，敬请谅解！');
    };

    /*返回上一页，订单详情页面需要特殊处理，复写父类方法*/
    $scope.back = function () {
      //$ionicHistory.goBack();
      $scope.showSwitch_s = false;
      $scope.networkError = false;
      if ($scope.hasClickedBack) {
        return;
      }
      $scope.hasClickedBack = true;
      $timeout(function () {
        $scope.hasClickedBack = false;
      }, 1000);
      if ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('orderPay') > 0) {
        $ionicHistory.goBack(-3);
      }
      else {
        //判断wap是否能获取到上一页路由 没有则返回首页
        if (!$ionicHistory.backView()) {
          $state.go('home');
          return;
        }
        ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
      }

    };
  }
]);

aiyaController.controller('orderListOk', [
  '$scope',
  '$rootScope',
  '$ionicScrollDelegate',
  'userAddressService',
  '$stateParams',
  'orderService',
  '$ionicLoading',
  '$state',
  'CommonUtil',
  '$ionicModal',
  function($scope,$rootScope,$ionicScrollDelegate,userAddressService,$stateParams,orderService,$ionicLoading,$state,CommonUtil,$ionicModal){

    $scope.orderInfo = {
      hasCoupon:false,        /*是否有优惠*/
      coupon : '',            /*优惠码*/
      isInvoice : false,     /*是否开具发票*/
      invoiceTitle : '',      /*发票抬头*/
      memo : ''              /*备注*/
    }
    $scope.defaultShippingMethod; //配送方式


    /*判断是否需要刷新*/
    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      $scope.orderOkCache = v.direction != 'forward';
    });
    $scope.$on('$ionicView.enter',function(){
      if(!$scope.orderOkCache){
        $scope.init();
        //界面方法绑定
        initPageFn();
      }
    });
    $scope.init = init;

    $scope.pushBill = {
        checked: false
    }

  $scope.toggleBillChange = function(){
    $scope.orderInfo.isInvoice = $scope.pushBill.checked;
  }

  $scope.scrollBottom = function(){
    $ionicScrollDelegate.scrollBottom();
  }

    function init(){
      orderService.directInfo().then(function(data){
        //参数初始化
        $scope.orderInfo = {
          hasCoupon:false,        /*是否有优惠*/
          coupon : '',            /*优惠码*/
          isInvoice : false,     /*是否开具发票*/
          invoiceTitle : '',      /*发票抬头*/
          memo : ''              /*备注*/
        }
        $scope.receiverInfo = data.receiverInfo;
        $scope.products = data.products;
        $scope.totalPrice = data.totalPrice;//应付总额
        $scope.totalQuantity = data.totalQuantity;
        //活动
        $scope.couponPrice = 0;
        $scope.promotionList = data.promotionList;
        //配送方式
        $scope.shippingMethodList = data.shippingMethodList;
        if($scope.shippingMethodList != null && $scope.shippingMethodList.length > 0){
          $scope.defaultShippingMethod = $scope.shippingMethodList[0];
          $scope.defaultShippingMethod.first_price = _.gt(parseFloat($scope.totalPrice),199) ? 0 : $scope.defaultShippingMethod.first_price;
        }
        //活动优惠金额
        $scope.promotionPrice = data.promotionPrice;

        $scope.allPrice = getAllPrice();
      },function(err){
        console.log(err);
      });
    }
    //优惠码确认
    $scope.couponSure = function(){
      if($scope.orderInfo.coupon == null || $scope.orderInfo.coupon == ''){
        return;
      }
      if($scope.promotionList.length > 0){
        CommonUtil.tip('有促销的商品不能使用优惠券');
        return;
      }
      var product = orderService.getOrderProList();
      var params = {
        code:$scope.orderInfo.coupon,
        directBuyIds:product.ids,
        directQuantitys:product.quantitys
      }
      orderService.couponInfo(params).then(function(data){
        $scope.orderInfo.hasCoupon = true;
        $scope.couponPrice = data.couponPrice;
        $scope.finalPrice = data.finalPrice;
        /*应付金额*/
        $scope.allPrice = getAllPrice();
      },function(err){
        CommonUtil.tip(err);
        console.log(err);
      });
    }

    /*优惠码取消*/
    $scope.couponCancel = function(){
      $scope.couponPrice = 0;
      $scope.allPrice = getAllPrice();
      $scope.orderInfo.hasCoupon = false;
    }

    /*订单提交*/
    $scope.createOrder = function(){
      if(hasYCProduct()){
        $scope.showYC();
        return;
      }
      confirmInfo();
    }
    //切换收货地址
    $rootScope.$on('SELECT_ADDRESS', function (event, data) {
        $scope.receiverInfo = data;
    });

    //选中的收货地址被删除
    $rootScope.$on('SELECT_ADDRESS_DELETED', function (event,data) {
      $scope.receiverInfo = data;

    });
    //选中的收货地址被修改
    $rootScope.$on('SELECT_ADDRESS_CHANGED', function (event, data) {
      $scope.receiverInfo = data;

    });

    function initPageFn(){
      //显示快递配送方式
      $ionicModal.fromTemplateUrl('modal-shipping.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.shippingModal = modal;
        });

      //显示详细活动
      $ionicModal.fromTemplateUrl('modal-promotion.html',{
          scope:$scope
        }).then(function(modal){
          $scope.promotionModal = modal;
        });

      //显示义齿加工详细信息
      $ionicModal.fromTemplateUrl('modal-YC.html',{
        scope:$scope
      }).then(function(modal){
        $scope.YCModal = modal;
      });
      }
    //
    $scope.showShippingMethod = function(){
      $scope.shippingModal.show();
    }

    $scope.shippingMethodConfirm = function(){
      $scope.shippingModal.hide();
    }

    $scope.selectShippingMethod = function(shippingMethod){
      $scope.defaultShippingMethod = shippingMethod;
      $scope.defaultShippingMethod.first_price = _.gt(parseFloat($scope.totalPrice),199) ? 0 : $scope.defaultShippingMethod.first_price;
      $scope.allPrice = getAllPrice();
    }

    $scope.showPromotion = function(){
      $scope.promotionModal.show();
    }

    $scope.closePromotion = function(){
      $scope.promotionModal.hide();
    }

    $scope.showYC = function(){
      $scope.YCModal.show();
    }

    $scope.YCConfirm = function(){
      $scope.YCModal.hide().then(function(){
        confirmInfo();
      });
    }

    $scope.$on('$destroy',function(){
      /*当模型消除时候，清除*/
      $scope.shippingModal.remove();
      $scope.promotionModal.remove();
      $scope.YCModal.remove();
    });

    //订单中是否有义齿加工类商品
    function hasYCProduct(){
      return _.filter($scope.products,{isYcInquiry:true}).length > 0 ? true : false
    }

    //具体提交订单确认信息
    function confirmInfo(){
      var productList = new Array();
      var product = orderService.getOrderProList();
      if( product!= null && product !=''){
        var ids = (product.ids+"").split(',');
        var quantitys = product.quantitys.toString().split(',');
        for(var i = 0; i < ids.length; i++){
          var tempProduct = {
            productId:'',
            quantity:''
          }
          tempProduct.productId = ids[i];
          tempProduct.quantity = quantitys[i];
          productList.push(tempProduct);
        }
      }
      var params = {
        receiverId : $scope.receiverInfo.id,
        memo: $scope.orderInfo.memo,
        isInvoice: $scope.orderInfo.isInvoice,
        couponCode: $scope.orderInfo.hasCoupon ? $scope.orderInfo.coupon : '',
        invoiceTitle: $scope.orderInfo.invoiceTitle,
        shippingMethod: $scope.defaultShippingMethod.id,
        productList:productList
      }
      orderService.create(params).then(function(data){
        if(data.isMonthly){
          $state.go('paySuccess',{sn:data.sn});
        }else{
          $state.go('orderPay',{sn:data.sn});
        }
      },function(err){
        CommonUtil.tip(err);
      });
    }

    //计算商品总价
    function getAllPrice(){
      return _.gt(parseFloat($scope.totalPrice),199) ? $scope.totalPrice - parseFloat($scope.promotionPrice) - parseFloat($scope.couponPrice) : _.add($scope.totalPrice,$scope.defaultShippingMethod.first_price) - parseFloat($scope.promotionPrice) - parseFloat($scope.couponPrice);
    }
}]);

aiyaController.controller('orderListPay', [
  '$scope',
  '$state',
  '$stateParams',
  '$q',
  'orderService',
  'CommonUtil',
  'ENV',
  '$ionicHistory',
  'StringUtil',
  function($scope,$state,$stateParams,$q,orderService,CommonUtil,ENV,$ionicHistory,StringUtil){
    //重写back
    $scope.back = function(){
      CommonUtil.confirm('下单后24小时内未支付成功，订单将被取消，请尽快完成支付。',null,'确认离开','继续支付').then(function(res){
        if(res){
            if($ionicHistory.backView()){
              if($ionicHistory.backView().url.indexOf('orderOk') > 0){
                $state.go('orderDetail',{sn:$scope.sn});
              }else{
                //正常原路返回
                $ionicHistory.goBack();
              }
            }else{
              $state.go('orderDetail',{'sn':$scope.sn});
            }
        }
      });
    }
    //console.log('支付页面:'+$stateParams.sn);
    var params={
      sn: $stateParams.sn
    }
    orderService.payInfo(params).then(function(data){
      $scope.sn = data.payInfo.sn;
      $scope.amountPrice = data.payInfo.amountPrice;
      $scope.shippingMethodName = data.payInfo.shippingMethodName;
      $scope.paymentMethodName = data.payInfo.paymentMethodName;
      $scope.endtime = data.payInfo.endTime;
    },function(err){
      CommonUtil.tip(err);
    });

  $scope.$on('$ionicView.enter', function(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
      $scope.payShowWx = true;
      $scope.payShowAli = false;
    }else{
      $scope.payShowWx = false
      $scope.payShowAli = true;
    }

    //支付宝支付调起
    $scope.alipay = function(sn){
      //根据订单编号获取订单支付信息
      if(StringUtil.isEmpty(sn)){
        return;
      }
      $.ajax({
        url:ENV.siteUrl+"order/payInfo",
        method:"post",
        data:{sn:sn,token:orderService.getToken},
        success:function(result){
          if(result.code == 1){
            var data = {
              sn:result.data.payInfo.sn,
              name:result.data.payInfo.subject,
              price:result.data.payInfo.amountPrice,
              body:orderService.getToken
            }
            //data.price = "0.01";//测试价格
            $.ajax({
              url:ENV.siteUrl+"order/alipayparam",
              method:"post",
              data:data,
              success:function(result){
                result = JSON.stringify(result.data);
                var results  = result.split(',');
                for(var index in results){
                  var eachStr = results[index];
                  while(eachStr.indexOf("\"") != -1){
                    eachStr = eachStr.replace("\"","");
                  }
                  eachStr = eachStr.replace("{","");
                  eachStr = eachStr.replace("}","");
                  var key = eachStr.substring(0,eachStr.indexOf(':'));
                  var value = eachStr.substring(eachStr.indexOf(':')+1,eachStr.length);
                  $("#alipaysubmit").html( $("#alipaysubmit").html() + "<input type=\"hidden\" name=\"" + key + "\" value=\"" + value + "\"/>");
                }
                document.forms['alipaysubmit'].submit();
          //alert("success");
              },
              error:function(){
                alert("error");
              }
            });
          }
        },
        error:function(){
          alert("error");
        }
      });
    }

    //微信支付调起
    $scope.wxpay = function(sn){
      if(StringUtil.isEmpty(sn)){
        return;
      }
      $.ajax({
        url:ENV.siteUrl+"order/wxcodeparam",
        method:"post",
        success:function(result){
          location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+result.data.appid+"&redirect_uri="+result.data.redirect_uri+"&response_type="+result.data.response_type+"&scope="+result.data.scope+"&state="+sn+"#wechat_redirect";
        },
        error:function(){
          alert("error");
        }
    });
}
  })
}]);

aiyaController.controller('paySuccessController', [
  '$scope',
  '$ionicLoading',
  '$stateParams',
  'orderService',
  'CommonUtil',
  'productService',
  'StringUtil',
  'Util',
  'ENV',
  function($scope,$ionicLoading,$stateParams,orderService,CommonUtil,productService,StringUtil,Util,ENV){

    console.log('sn' + $stateParams.sn);
    var params = {
      sn : $stateParams.sn
    }

    $scope.init = init;

    $scope.$on('$ionicView.beforeEnter',function(){
      $scope.init();
    });
    function init(){
      orderService.info(params).then(function(data){
        $scope.amount = data.amount;
        $scope.consignee = data.consignee;
        $scope.area= data.area;
        $scope.address = data.address;
        $scope.areaName = data.areaName;
        $scope.phone = data.phone;
        $scope.sn = data.sn;
        $scope.isMonthly = data.isMonthly;
        if(data.orderStatus != 4){
          $scope.isMonthly = false;
        }

        $scope.viewTitle = $scope.isMonthly ? '下单成功' : '支付成功';
        window.document.title = $scope.isMonthly ? '下单成功': '支付成功';
      },function(err){
        CommonUtil.tip(err);
      });
      /*猜你喜欢*/
      var recommendParams = {count:2};
      productService.getRecommendProductc(recommendParams).then(function(data){
        $scope.productList = data.list;
        _.each($scope.productList,function(p,index){
          p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);
        });
      },function(err){

      });
    }
  }]);

aiyaController.controller('productCategoryController', [
  '$rootScope',
  '$scope',
  '$ionicLoading',
  '$state',
  '$ionicSlideBoxDelegate',
  'categoryService',
  'StringUtil',
  'ENV',
  'Util',
  function($rootScope,$scope, $ionicLoading, $state, $ionicSlideBoxDelegate, categoryService, StringUtil,ENV,Util){

    //页面激活时
    $scope.$on('$ionicView.enter', function(){
      getNavCategory();
    });
    $scope.secondID = null;
    $scope.allCategory = null;
    $scope.obj_imgList = null;
    //二级图片分组
    $scope.obj_imgSliders = null;
    $scope.is_categoryAll = true;
    //一级分类name,id
    $scope.firstNavName = null;
    $scope.firstNavId = null;
    $scope.obj_thirdList = new Array();

    $scope.allCategory_paging = {
      pageNumber: 1,
      pageSize: ''
    };

    //全部商品
    $scope.allCategory_paging.pageNumber = 1;
    $scope.allCategory_paging.pageSize = 20;
    categoryService.getAllHotCategory($scope.allCategory_paging)
      .then(function(rs){
        $scope.allCategory = rs;
        _.each(rs,function(p){
          p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);        //具体单个商品图片
        })
        $rootScope.errState = 200;
      },function(errormsg){
        $ionicLoading.show({
          template: errormsg,
          duration: 1500
        });
        $rootScope.errState = 500;
      })

    //一级分类菜单列表
    function getNavCategory(){
      categoryService.navCategory().get('null', function(rs){
        if(rs.code ===1){
          $scope.obj_navCategory = rs.data.list;
          if(rs.data.list.length > 0){
            $scope.getSecondCategory(rs.data.list[0].id);
          }
          $rootScope.errState = 200;
        }else{
          $ionicLoading.show({
            template: rs.msg
          });
        }
        $rootScope.errState = 200;
      })
      //$scope.categoryService = categoryService.navCategory();
    };

    //二级类别列表
    $scope.getSecondCategory = function(typeNum){
      console.log('一级id,'+typeNum);
      categoryService.imgSecondCategory().get({id: typeNum}, function(rs){
        if(rs.code === 1){
          $scope.isAuthoriz = rs.data.isAuthoriz;
          $scope.obj_imgList = rs.data.list;
          $scope.obj_imgSliders = _.chunk($scope.obj_imgList, 2);
          _.each( $scope.obj_imgSliders,function(p){
            _.each(p,function(img){
              img.image = StringUtil.isEmpty(img.image) ? ENV.defaultImg : Util.getFullImg(img.image);        //具体单个商品图片
            })
          })
          //var sliders = JSON.stringify($scope.obj_imgSliders);
          //console.log($scope.obj_imgSliders);
        }else{
          $ionicLoading.show({
            template: rs.msg,
            duration: 1500
          });
        }
      })
      $scope.$watchCollection('obj_imgList ', function () {
        $ionicSlideBoxDelegate.update();
      })

      categoryService.secondCategoryName().get({id: typeNum}, function(rs){
        if(rs.code === 1){
          $scope.obj_sencondCategoryName = rs.data.list;
          //debugger
          for(var i = 0;i < rs.data.list.length;i++){
            getThirdCategory(i,rs.data.list[i].id);
          }
        }else{
          $ionicLoading.show({
            template: rs.msg,
            duration: 1500
          });
        }
      })

      //console.log('二级id,'+$scope.secondID);
    };

    var getThirdCategory = function(index,id){
      categoryService.thirdCategoryList().get({id:id}, function(rs){
        if(rs.code === 1){
          //debugger
          $scope.obj_thirdList[index] = rs.data.list;
        }else{
          $ionicLoading.show({
            template: rs.msg,
            duration: 1500
          });
        }
      });
    };

    $scope.selectTab = function(e,id,name){
      console.log('e.target.id'+e.target.id);
      e.target.className = 'li button button-clear category-select';
      $(e.target).siblings().removeClass().addClass('li button button-clear tab-onblur');
      if(e.target.id != undefined && e.target.id != 'undefined' && e.target.id == 'category-all'){
        $scope.is_categoryAll = true;
      }
      // else if(e.target.id == ''){
      //   $scope.is_categoryAll = true;
      // }
      else {
        $scope.is_categoryAll = false;
        $scope.getSecondCategory(id);

        $scope.firstNavId = id;
        $scope.firstNavName = name;
      }
    };

    $scope.jumpCategoryById = function(navId, navName){
      if(StringUtil.isNotEmpty(navName) && navName.indexOf('义齿') !== -1){
        $state.go('toothOp');
      }else{
        $state.go('filterList',{fristCategoryId:navId});
      }
    };

    $scope.jumpChildrenCategory = function(childrenId){
      if(StringUtil.isNotEmpty($scope.firstNavName) && $scope.firstNavName.indexOf('义齿') !== -1){
        $state.go('toothOp',{categoryId:childrenId});
      } else {
        /*传一级分类ID*/
        $state.go('filterList', {childrenlistId: childrenId, fristCategoryId:$scope.firstNavId});
      }
    };
    //搜索跳转
    $scope.jumpSearchPage = function(){
      $state.go('homeSearch');
    };

  }]);

aiyaController.controller('productInfoCtrl',[
  '$scope',
  '$rootScope',
  '$ionicSlideBoxDelegate',
  '$ionicNavBarDelegate',
  '$stateParams',
  'productService',
  '$state',
  'userService',
  'favoriteService',
  'CommonUtil',
  '$ionicScrollDelegate',
  '$timeout',
  'ENV',
  'StringUtil',
  'Util',
  function($scope,$rootScope,$ionicSlideBoxDelegate,$ionicNavBarDelegate,$stateParams,productService,$state,userService,favoriteService,CommonUtil,$ionicScrollDelegate,$timeout, ENV, StringUtil,Util){
    $scope.showToTopImage = false;
    $scope.networkError = false;
    $scope.product = {
      id:$stateParams.id
    };
    $scope.init = init;

    $scope.$on('$ionicView.beforeEnter',function(){
      $scope.init();

      /*刷新购物车数量*/
      getPurchaseCount();
    });
    function init(){
      /*加载商品详情*/
        productService.getInfo($scope.product.id).then(function(data){
          console.log(data);
          $scope.networkError = false;
          $scope.productInfo = data.product.productInfo;//商品详情
          $scope.totalAvailabeStock = data.product.totalAvailabeStock;//所有可用库存
          _.assignIn($scope.productInfo,{logisticsImg:$scope.productInfo.isYcInquiry ? ENV.ycImg : ENV.consumableImg});
          _.assignIn($scope.productInfo,{stockTip:Util.getStockTip($scope.totalAvailabeStock)});
          $scope.reviewCount = data.product.reviewCount;//评价个数
          $scope.promotions =  data.product.promotions;//促销活动
          $scope.seoDescription = data.product.seoDescription;//商品详情
          $scope.specification = data.product.specification;//商品规格详细信息
          $scope.productImages =data.product.productImages;//商品轮播图片
          if($scope.productImages == null || $scope.productImages == ''){
            $scope.productImages = [{medium:null}];
          }
          _.each($scope.productImages,function(image,index){
              image.medium = StringUtil.isEmpty(image.medium) ? ENV.defaultImg : Util.getFullImg(image.medium);
          });
          $scope.memberPrice = data.product.memberPrice;//会员价格
          $scope.isAuthoriz = data.product.isAuthoriz;//是否有齿研社价格查看权限
          $scope.isBuyNotPutaway = data.product.isBuyNotPutaway;//是否可以购买下架商品
          if(!!$scope.productInfo.introduction){
              $scope.productInfo.introduction = $scope.productInfo.introduction.replace(new RegExp('src="/upload',"gm"),'src="' + $rootScope.imgUrl + '/upload');
          }
          //标题显示
          window.document.title = $scope.productInfo.name;
          //按钮类型
          if(!$scope.productInfo.isYcInquiry || $scope.isAuthoriz){
            if(!($scope.productInfo.isMarketable || $scope.isBuyNotPutaway)){
              $scope.buttonType = 4;  //商品已下架
            }else if($scope.totalAvailabeStock === 0){
              $scope.buttonType = 3; //售罄
            }else{
              $scope.buttonType = 1; //正常显示
            }
          } else {
            $scope.buttonType = 2;    //变灰
          }
        },function(err){
          $scope.networkError = true;
        }).finally(function(){{
          $ionicSlideBoxDelegate.update();
        }});

        /*猜您喜欢*/
        productService.getRecommendProductc().then(function(data){
          $scope.getrecommendproductc = data.list;
          _.each(data.list,function(p){
            p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);
          })
        },function(err){
        });
    }



  //收藏
  $scope.collectProduct = function(){
    var product ={'id': $stateParams.id};
    //收藏之前必须先登录
    if (userService.isLogin()){
      favoriteService.addProduct(product).then(function(){
        $scope.productInfo.favoriteFlag = true;
        CommonUtil.tip('收藏成功');
      },function(err){
        CommonUtil.tip(err);
      });
    } else {
      $state.go('login');
    }
  };
    /*获取购物车数量*/
    function getPurchaseCount(){
      productService.purchaseCount().then(function(data){
        $rootScope.purchaseCounts = data.cartquantity;
      });
    }

    //分享
    // 分享modal
    $scope.share = function ($event) {
      shareFn();
      $event.stopPropagation();
    };
    function shareFn(scName) {
      var scName = scName || '';
      console.log($scope.data);
      var title = $scope.data.prodInfo.brandName + ' ' + scName + '仅售' + $scope.data.selectSku.price + '元，赶紧来看看吧',
        content = '仅售' + $scope.data.selectSku.price + '！' + $scope.data.prodInfo.name + '-中免商城 ',
        pic = cdfg.getImgGetPrefix() + $scope.data.selectSpu.spuImgs[0] + '&op=s1_w200_h200_e1-c0_x0_y0_w200_h200',
        url = cdfg.getWapPrefix() + 'product/' + $stateParams.type + '/' + $stateParams.id + '/detail';

      if (window.umeng) {
        window.umeng.share(title, content, pic, url);
      }
    }

    /*列表滚动，判断是否显示返回顶部*/
    $scope.onContentScroll = function() {
      if (!$ionicScrollDelegate.$getByHandle('productInfoHandle')) {
        return;
      }
      $timeout(function () {
          var position = $ionicScrollDelegate.$getByHandle('productInfoHandle').getScrollPosition();//获取滚动位置
          if (position) {
            $scope.showToTopImage = position.top > $rootScope.deviceHeight / 3.0;//大于屏幕高度1/3时显示【返回顶部】
          }
        }, 1000//1秒后跳转回去
      );
    }
}]);

aiyaController.controller('purchaseOrderController', [
  '$rootScope',
  '$scope',
  '$ionicLoading',
  '$ionicScrollDelegate',
  'CommonUtil',
  'StringUtil',
  'Util',
  'favoriteService',
  'orderService',
  'purchaseOrderService',
  '$state',
  '$ionicHistory',
  '$timeout',
  function($rootScope,$scope,$ionicLoading, $ionicScrollDelegate, CommonUtil, StringUtil, Util,favoriteService, orderService, purchaseOrderService, $state,$ionicHistory,$timeout) {
    $scope.networkError = false;
    $scope.order = "canClick";
    //过滤条件
    $scope.filter = {
      isOutStock: false,
      keyword: '',
      makeType:'',      //是否国产
      categoryIds:'',
      brandIds:'',
      first:null,        //一级目录
      second:null,      //二级目录
      area:'',        //是否为国产品牌
      brands:'',
      //需要隐藏的筛选项目
      hidden:{
        area:true,
        brands:true
      }
    };

    $scope.purchaseProducts = [];
    $scope.item = {};
    $scope.init = function(){
      purchaseOrderService.clearState();
      $scope.state = purchaseOrderService.getState();
      var pending = false;
      if(pending) return;
      pending = true;
      var getProductsPromise = purchaseOrderService.getProducts( $scope.filter);
      var loadMorePromise = getProductsPromise.then(function (products) {
        $rootScope.errState = 200;
        $scope.purchaseProducts = products;
        checkIsAllSelected();
        console.log($scope.purchaseProducts);
        purchaseOrderService.select($scope.purchaseProducts);
      },function(){
        $rootScope.errState = 500;
      })
        .finally(function () {
          pending = false;
        });
      loadMorePromise.abort = getProductsPromise.abort;
    };

    var checkIsAllSelected = function () {
      $scope.isAllSelected = _.filter($scope.purchaseProducts,{canClick: true}).length === _.filter($scope.purchaseProducts, {isSelected: true}).length &&  _.filter($scope.purchaseProducts,{canClick:true}).length != 0;
    };

    //全选
    $scope.toggleSelectAll = function () {
      if($scope.isAllSelected) {
        _.each(_.filter($scope.purchaseProducts,{canClick:true}), function (p) {
          p.isSelected = true;
        });
        purchaseOrderService.select($scope.purchaseProducts);
      } else {
        _.each($scope.purchaseProducts, function (p) {
          p.isSelected = false;
        });
        purchaseOrderService.unselect();
      }
    };

    //单选
    $scope.toggleSelectOne = function (product) {
      if(product.isSelected) {
        purchaseOrderService.select(product);
      } else {
        purchaseOrderService.unselect(product);
      }
      checkIsAllSelected();
    };

    //编辑数量
    $scope.changeNumber = function (product) {
      var product = {'productList':[{'productId': product.id,'quantity':product.quantity }]};
      purchaseOrderService.setQuantity(product).then(function(data){
        if(data.errMsg!=null){
          CommonUtil.tip(data.errMsg);
        }
      });
    };

    //删除
    $scope.deleteProduct = function (products) {
      var selectedProducts = _.filter($scope.purchaseProducts, {isSelected: true});
      if(selectedProducts.length) {
        CommonUtil.confirm('确定要删除商品吗？',null,'确定','取消').then(function(res){
          if(res) {
            purchaseOrderService.removeProduct(selectedProducts)
              .then(function () {
                _.pullAllWith(products, selectedProducts, function (p1, p2) {
                  return p1.id === p2.id;
                });
                purchaseOrderService.unselect(selectedProducts);
                checkIsAllSelected();
                $scope.purchaseProducts = _.filter($scope.purchaseProducts, {isSelected: false});
                CommonUtil.tip('删除成功');
                if($scope.purchaseProducts.length == 0){
                  purchaseOrderService.changeEditStatus();
                  $state.go('purchaseOrderList');
                }
              })
          }else{
            $scope.init();
          }
        });
      }else {
        CommonUtil.tip('请选择要删除的商品');
      }
    };

    $scope.singleDelete = function(id){
      //console.log(id);
      purchaseOrderService.removeSingle(id)
        .then(function(){
          $scope.init();
          CommonUtil.tip('删除成功');
          $ionicScrollDelegate.resize();
          $timeout(function(){
            $ionicScrollDelegate.scrollBy(0,1);
          },100);
        },function(errMsg){
          CommonUtil.tip(errMsg);
        });
    };
    //结算
    $scope.goOrderProcess = function(){
      var selectedProducts = _.filter($scope.purchaseProducts, {isSelected: true});
      if(selectedProducts.length){
        /*检测购买商品是否存在错误商品*/
        if(_.filter(selectedProducts,{hasErr: true}).length > 0){
          CommonUtil.tip('结算商品列表存在问题，请检查');
          return;
        }
        var ids, quantitys;
        if(!angular.isArray(selectedProducts)){
          ids = [selectedProducts.id];
          quantitys = [selectedProducts.quantity];
        }else {
          ids = _.map(selectedProducts, 'id');
          quantitys = _.map(selectedProducts, 'quantity');
          ids = ids.join(',');
          quantitys = quantitys.join(',');
        }
        var product = {
          ids: ids,
          quantitys: quantitys
        };
        orderService.setOrderProList(product);
        $state.go('orderOk');
      }else{
        CommonUtil.tip('请选择需要结算的商品');
      }

    };
    //库存检测
    var directBuyPrecheck = function(){
      var selectedProducts = _.filter($scope.purchaseProducts, {isSelected: true});
      var opt = {
        id: selectedProducts.id,
        directQuantity: selectedProducts.quantity
      }
      return orderService.directBuyPrecheck(opt);
    };

    $scope.collectProduct = function(products){
      var selectedProducts = _.filter($scope.purchaseProducts, {isSelected: true});
      if(selectedProducts.length){
        favoriteService.addProduct(selectedProducts)
          .then(function(){
            _.pullAllWith(products, selectedProducts, function (p1, p2) {
              return p1.id === p2.id;
            });
            purchaseOrderService.unselect(selectedProducts);
            checkIsAllSelected();

            CommonUtil.tip('收藏成功');
          }, function(err){
            CommonUtil.tip(err);
          })
      }else {
        CommonUtil.tip('请选择要收藏的商品');
      }

    };

    //监听过滤条件
    $scope.$watch('filter.isOutStock', function (newValue, oldValue) {
      if(newValue !== oldValue) {
        $scope.init();
        $ionicScrollDelegate.scrollTop();
      }
    });
    $scope.$watch('filter.keyword', function (newValue, oldValue) {
      if(newValue !== oldValue) {
        $scope.keyword = newValue;
        $scope.init();
        $ionicScrollDelegate.scrollTop();
      }
    });

    $scope.purchaseSearch = function(){
      if(!$scope.filter.keyword == '') {
        $scope.init();
        $ionicScrollDelegate.scrollTop();
      }else {
        CommonUtil.tip('请输入您要搜索的关键字');
      }
    };

    $scope.$on('$ionicView.enter',function(){
      $scope.init();
    });

    $scope.onFinish = function(){
        $scope.filter.makeType = $scope.filter.area;
        $scope.filter.categoryIds = StringUtil.isNotEmpty($scope.filter.second) ? $scope.filter.second : $scope.filter.first;
        $scope.filter.brandIds = _.join($scope.filter.brands,',');
        $scope.init();
      }

    //完成
    $scope.complete = function(){
      purchaseOrderService.changeEditStatus(false);
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack()
      }else{
        $state.go('purchaseOrderList');
      }
    }

    /**
     * 编辑页面跳转
     */
    $scope.toEditPage = function(){
      purchaseOrderService.changeEditStatus(true);
      $state.go('purchaseOrderEdit');
    }
  }
]);


aiyaController.controller('rapidListController', [
  '$rootScope',
  '$scope',
  'index',
  'productService',
  'userService',
  'StringUtil',
  'ENV',
  'Util',
  '$timeout',
  '$ionicScrollDelegate',
  function($rootScope,$scope,index,productService,userService,StringUtil,ENV,Util,$timeout,$ionicScrollDelegate){
    var params = {
      makeType:'',        //是否为国产品牌 0-国产  1 - 进口
      brandIds:'',        //品牌
      categoryIds:'',     //分类ID
      keyword:'',
      pageNumber : 1,
      pageSize : 20
    }
    $scope.filter = {
      first:null,        //一级目录
      second:null,      //二级目录
      area:'',        //是否为国产品牌
      brands:''
    }
    $scope.showToTopImage = false;
    $scope.productList = [];
    $scope.$on('$ionicView.beforeEnter',function(){
      /*每次都会刷新购物车数量*/
      getPurchaseCount();
    });
    //获取购物车数量
    function getPurchaseCount(){
      index.purchaseCount().get(function(rs){
        if(rs.code === 1 ){
          $rootScope.purchaseCounts = rs.data.cartquantity;
        }else{
          $rootScope.purchaseCounts = '';
        }
      });
    }
    var page = {};

    var init = function(){
      productService.getList(params).then(function(data){
        if(params.pageNumber == 1){
          $scope.productList = data.list;
          _.each(data.list,function(p){
            p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);        //具体单个商品图片
          })
        }else{
          _.each(data.list,function(p){
            p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);
          })
          $scope.productList = $scope.productList.concat(data.list);
        }
        page = data.page;
        $rootScope.errState = 200;
      },function(err){
        console.log(err);
        $rootScope.errState = 500;
      });
    }
    init();
    $scope.init=init;
    /*当前用户*/
    userService.getInfo()
      .then(function(data){
        $scope.currentUser = data;
      },function(err){
        console.log(err);
      });

    /*加载更多*/
    $scope.loadMore = function(){
      if(page.hasNextPage){
        params.pageNumber++;
        init();
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    /*刷新*/
    $scope.doRefresh = function(){
      params.pageNumber = 1;
      init();
      $scope.$broadcast('scroll.refreshComplete');
    }

    /*搜索*/
    $scope.search = function(keyword){
      params.pageNumber = 1;
      params.keyword = keyword;
      init();
    }

    /*筛选*/
    $scope.finish = function(){
      params.makeType = $scope.filter.area;
      params.categoryIds = StringUtil.isNotEmpty($scope.filter.second) ? $scope.filter.second : $scope.filter.first;
      params.brandIds = _.join($scope.filter.brands,',');
      params.pageNumber = 1;
      $ionicScrollDelegate.scrollTop();
      init();
    }

    $scope.hasMore = function(){
      return page.hasNextPage;
    }

    /*列表滚动，判断是否显示返回顶部*/
    $scope.onContentScroll = function() {
      if (!$ionicScrollDelegate.$getByHandle('rapidListHandle')) {
        return;
      }
      $timeout(function () {
          var position = $ionicScrollDelegate.$getByHandle('rapidListHandle').getScrollPosition();//获取滚动位置
          if (position) {
            $scope.showToTopImage = position.top > $rootScope.deviceHeight / 4.0;//大于屏幕高度1/3时显示【返回顶部】
          }
        }, 1000);
    }
}]);

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

aiyaController.controller('toothOpCtrl',[
  '$scope',
  '$rootScope',
  '$ionicLoading',
  '$ionicPopover',
  '$location',
  '$state',
  '$ionicSlideBoxDelegate',
  '$ionicScrollDelegate',
  '$timeout',
  'toothOplist',
  'StringUtil',
  'ENV',
  'Util',
  '$stateParams',
  function($scope,$rootScope,$ionicLoading,$ionicPopover,$location,$state,$ionicSlideBoxDelegate,$ionicScrollDelegate,$timeout,toothOplist,StringUtil,ENV,Util,$stateParams){
  $scope.tabNav={curNav:'toothOp'};
  //$scope.toothIMG = null;
  $scope.toothMoredata = true;
  $scope.obj_toothlist = new Array();
  // $scope.toothSlider = null;

  $scope.$on('$ionicView.enter', function(){
    data(true);
     $ionicSlideBoxDelegate.update();
    // $scope.myOrderChoose = false;
  });
  //若果获取返回的是error，则显示tis提示信息
  var tip = function(msg){
    $ionicLoading.show({
    template: msg,
    duration: 1500
    });
  };
  var timeout,
      page = {};

  $scope.toothPageParame = {
      keyword: '',
      salesDesc: '',
      pageNumber: 1,
      pageSize: 6,
      categoryIds: $stateParams.categoryId
  };

  $scope.toothDisplay = true;
  $scope.isToothRowlistHide = true;
  $scope.isToothRowColumnHide = false;

  $scope.toothToggle = function(){
    if($scope.isToothRowlistHide == true){
      $scope.isToothRowlistHide = false;
      $scope.isToothRowColumnHide = true;

      $scope.toothDisplay = false;
    }else{
      $scope.isToothRowlistHide = true;
      $scope.isToothRowColumnHide = false;

      $scope.toothDisplay = true;
    }
  };

  //图片广告列表，和获取商品信息列表不同
  var opt = {
    beginDate: '',
    endDate: '',
    positionId: 41
  };
    //去后台获取接口信息rs为返回的数据，errMsg是返回的错误信息，然后tip显示提示
  toothOplist.getBannerlist(opt)
  .then(function(rs){
    _.each(rs.list,function(p){
      p.path = StringUtil.isEmpty(p.path) ? ENV.defaultImg : Util.getFullImg(p.path);        //具体单个商品图片
    });
    $scope.toothSlider = rs.list;

    $ionicSlideBoxDelegate.$getByHandle('image-viewer').currentIndex();

    $rootScope.errState = 200;
  },function(errMsg){
    tip(errMsg);
    $rootScope.errState = 500;
  });

  // toothOplist.toothIMGlist().get(null, function(rs){
  //     if(rs.code === 1 ){
  //         $scope.toothIMG = rs.data.list;
  //     }else{
  //         tip(rs.msg);
  //     }
  // });

  //关键字搜索
  $scope.$watch('keyValue', function (newVal, oldVal) {
    if(newVal === oldVal){
      return;
    }
    if (timeout) {
      $timeout.cancel(timeout);
    }
    $scope.toothPageParame.keyword = $scope.keyValue;
    $scope.toothPageParame.pageNumber = 1;
    timeout = $timeout(function () {
      $ionicScrollDelegate.scrollTop();
      data(true);
    }, 500);
  });

  //询价提交
  $scope.enquirySubmit = function(form){
    // console.log(form);
    console.log(form.phone);
    $scope.validate = true;
    if(form.$valid){
      var submitOpt = {
        contactName: $scope.enquiryList.customerName,
        phone: $scope.enquiryList.phone,
        hospitalName: $scope.enquiryList.toothName,
        mobile: $scope.enquiryList.cellPhone
      };
      toothOplist.ycSave(submitOpt)
        .then(function(){
          // debugger
          tip('提交成功，请等待客服为您提供详细报价');
        },function(msg){
          tip(msg);
        });
    }else if(!form.toothName.$valid){
      form.focusToothName = true;
    }else if(!form.customerName.$valid){
      form.focusCustomerName = true;
    }
    // else if(form.customerName.$error.maxlength){
    //   tip('姓名不能超过10个字符');
    //   form.focusCustomerName = true;
    // }
    else if(!form.cellPhone.$valid){
      tip('请填写正确的手机号码');
      form.focusCellPhone = true;
    }else if(!form.phone.$valid) {
      tip('请输入正确的固定电话号码');
      form.focusPhone = true;
    }
  };

  var data = function(other){
      toothOplist.toothList().get($scope.toothPageParame, function(rs){
        if(rs.code === 1){
          if(rs.data.list.length > 0){
            //判断是否刷新
            if(other){
              $scope.obj_toothlist = rs.data.list;
            }else{
              //如果不是第一页，则将获取的数据加到obj_toothlist；
             $scope.obj_toothlist = $scope.obj_toothlist.concat(rs.data.list);
            }
            _.each( $scope.obj_toothlist,function(p){
              //具体单个商品图片
              p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);
            });
            // 是否可查看义齿价格true or false
            $scope.isAuthoriz = rs.data.isAuthoriz;
          }else if(rs.data.list.length == '0' && rs.data.list.length == ''){
            $scope.obj_toothlist.length = 0;
          }else{
            $scope.toothMoredata = false;
            $scope.obj_toothlist = rs.data.list;
          };
          //记录页数
          page = rs.data.page;
          $rootScope.errState = 200;
          }else{
            //获取不到信息，提示
            tip(rs.msg);
            $rootScope.errState = 500;
          }
      })
  };

  $scope.filterOk = function(){
    $scope.toothPageParame.pageNumber = 1;
    data(true);
    $ionicScrollDelegate.scrollTop();
  };

//下拉刷新
  $scope.doToothFresh = function(){
      $scope.toothPageParame.pageNumber = 1;
      data(true);
      $scope.$broadcast("scroll.refreshComplete");
  };

  $scope.toothLoadMore = function(){
    $scope.toothPageParame.pageNumber++;
    if(page.hasNextPage && page.hasNextPage != '' && page.hasNextPage != 'undefined'){
        data();
    }
    $scope.$broadcast("scroll.infiniteScrollComplete");
  };

  $scope.hasMore = function(){
    return page.hasNextPage;
  };

  $scope.onToothOpContentScroll = function(){
    //搜索条到一定位置固定在顶部
    var position = $ionicScrollDelegate.$getByHandle('toothOpHandle').getScrollPosition();//获取滚动位置
    var toogleTabDom = document.getElementsByClassName("toogle-bar-wrap")[0];
    var toogleTabDom2 = document.getElementsByClassName("toogle-bar-wrap")[1];
    var height = toogleTabDom2.offsetTop;
    if(position.top > height){
      toogleTabDom.style.display="block";
      toogleTabDom2.style.display="none";
    }else if(position.top < height){
      toogleTabDom.style.display="none";
      toogleTabDom2.style.display="block";
    }
    else{
      toogleTabDom.style.display="block";
      toogleTabDom2.style.display="none";
    }
    /*列表滚动，判断是否显示返回顶部*/
    if (!$ionicScrollDelegate.$getByHandle('toothOpHandle')) {
      return;
    }
    $timeout(function () {
        var position = $ionicScrollDelegate.$getByHandle('toothOpHandle').getScrollPosition();//获取滚动位置
        if (position) {
          $scope.showToTopImage = position.top > $rootScope.deviceHeight / 3.0;//大于屏幕高度1/3时显示【返回顶部】
        }
      }, 1000//1秒后跳转回去
    );
  };

  $scope.listBySale = function(){
    $scope.opNav = 1;
    $scope.toothPageParame.salesDesc = true;
    $scope.toothPageParame.dateDesc = false;
    $scope.toothPageParame.priceOrder = '';
    $scope.toothPageParame.pageNumber = 1;
    data(true);
  };

  $scope.listByDate = function(){
    $scope.opNav = 2;
    $scope.toothPageParame.dateDesc = true;
    $scope.toothPageParame.salesDesc = false;
    $scope.toothPageParame.priceOrder = '';
    $scope.toothPageParame.pageNumber = 1;
    data(true);
  };

  $scope.listByPrice = function(priceOrder){
    $scope.opNav = 3;
    $scope.toothPageParame.dateDesc = false;
    $scope.toothPageParame.salesDesc = false;
    $scope.toothPageParame.priceOrder = priceOrder;
    $scope.toothPageParame.pageNumber = 1;
    data(true);
  };
  //判断价格排序状态
  $scope.clickStatus = 1;
  $scope.priStatus =function(){
    if($scope.clickStatus==1){
      $scope.listByPrice("asc");
      $scope.clickStatus = 2;
    }else{
      $scope.listByPrice("desc");
      $scope.clickStatus = 1;
    }
  };

}]);

aiyaController.controller('toothOpEnquiryCtrl', [
  '$scope',
  '$ionicLoading',
  '$state',
  'StringUtil',
  'toothOplist',
  function($scope,$ionicLoading,$state,StringUtil,toothOplist){

    $scope.enquiryList = [{
      'toothName': '',
      'customerName': '',
      'cellPhone': '',
      'phone': ''
    }]

    //立即询价-提交
    $scope.enquirySubmit = function(){
      console.log("验证已通过~")
      //var pass = true, msg = '';
      //for(i = 0;i<$scope.enquiryList.length; i++){
      //  var item = $scope.enquiryList[i];
      //
      //  if(StringUtil.isEmpty(item.toothName)){
      //    msg = '请输入牙科名称';
      //    console.log('请输入牙科名称');
      //    pass = false;
      //    break;
      //  }
      //  if(StringUtil.isEmpty(item.customerName)){
      //    msg = '请输入您的姓名';
      //    pass = false;
      //    break;
      //  }
      //  if(StringUtil.isEmpty(item.cellPhone)){
      //    msg = '请输入您的手机号码';
      //    pass = false;
      //    break;
      //  }
      //  if(StringUtil.isEmpty(item.phone)){
      //    msg = '请输入您的固定电话';
      //    pass = false;
      //    break;
      //  }
      //  if(pass){
      //    msg = 'pass';
      //  }else{
      //    $ionicLoading.show({template:msg,noBackdrop:true,duration:1500});
      //  }
      //}
    }

}]);

aiyaController.controller('userController',[
  '$scope',
  '$state',
  '$timeout',
  '$ionicLoading',
  '$location',
  'userService',
  'logisticService',
  'StringUtil',
  'ENV',
  'Util',
  'CommonUtil',
  'orderService',
  function($scope, $state, $timeout, $ionicLoading,$location, userService, logisticService, StringUtil, ENV, Util, CommonUtil, orderService){
    $scope.tabNav={curNav:'user'};
    var userInfoPromise;
    /*我的物流详情*/
    $scope.init = init;
    //确认收货
    $scope.confirmSingleOrder = confirmSingleOrder;

    function confirmSingleOrder(sn,$event) {
      $event.stopPropagation();//防止冒泡事件
      CommonUtil.confirm('确认收货后，方可评价，确认要收货吗？', null, '确定', '取消').then(function (res) {
        if (res) {
          orderService.confirmOrder(sn)
            .then(function () {
              $scope.init();
            } , function(){
              CommonUtil.tip('确认失败');
            });
        }
      });
    };

    function init(){
      /*获取订单物流信息*/
      logisticService.getAll().then(function(data){
        $scope.logisticsList = data.list;
        _.each($scope.logisticsList,function(logistics,index){
          logistics.thumbnail =  StringUtil.isEmpty(logistics.thumbnail) ? ENV.defaultImg  : Util.getFullImg(logistics.thumbnail);
          logistics.desc = StringUtil.isEmpty(logistics.desc) ? '暂无物流信息' : logistics.desc;
        })
      },function(err){
      });

      /*获取用户信息*/
      userInfoPromise = userService.getInfo();
      $ionicLoading.show();
      userInfoPromise.then(function (user) {
        $scope.user = user;
        if(StringUtil.isEmpty($scope.user.photo)){
          $scope.user.photo = './img/myaiyaku/tou_icon.png';
        }else{
          $scope.user.photo = Util.getFullImg($scope.user.photo);
        }
        $ionicLoading.hide();
      }, function () {
        $ionicLoading.hide();
        $state.go('login');
      });
    }

    $scope.init = init;
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.init();
    });
    $scope.$on('$destroy', function () {
      if(userInfoPromise.abort) {
        userInfoPromise.abort();
      }
      $ionicLoading.hide();
    });

}]);

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

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

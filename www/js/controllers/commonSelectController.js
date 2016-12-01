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


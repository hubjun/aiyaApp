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

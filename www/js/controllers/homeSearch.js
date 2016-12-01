
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

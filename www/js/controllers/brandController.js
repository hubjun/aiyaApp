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

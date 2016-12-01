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

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

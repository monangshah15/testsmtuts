'use strict';

app.controller('UsersDashboardController', function($rootScope, $scope, $http, $timeout,GLOBAL) {
    
    $scope.$on('$viewContentLoaded', function() { 
        var responsePromise = $http.post(GLOBAL.API_USER_URL+"dashboard-count");
        responsePromise.success(function(data, status1, headers, config) 
        {
            $scope.items = data.items;
        });
        //console.log($rootScope.item);
        // initialize core components
        Metronic.initAjax(); 
          
    }); 
    // set sidebar closed and body solid layout mode
    //$rootScope.settings.layout.pageBodySolid = true;
    //$rootScope.settings.layout.pageSidebarClosed = false;
});
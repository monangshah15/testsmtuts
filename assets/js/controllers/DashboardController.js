'use strict';

app.controller('DashboardController', function($rootScope, $scope, $http, $timeout,GLOBAL) {
    
    
    $scope.$on('$viewContentLoaded', function() {   
        var responsePromise = $http.post(GLOBAL.API_URL+"dashboard-count");
        responsePromise.success(function(data, status1, headers, config) 
        {
            $scope.items = data.items;
        });
        // initialize core components
        Metronic.initAjax();        
    });    
    // set sidebar closed and body solid layout mode
    //$rootScope.settings.layout.pageBodySolid = true;
    //$rootScope.settings.layout.pageSidebarClosed = false;
});
'use strict';

app.controller('LoginController',['$rootScope', '$scope', '$http', '$timeout','GLOBAL','$state','$cookieStore','$location', function($rootScope, $scope, $http, $timeout,GLOBAL,$state,$cookieStore,$location) 
{
	$scope.v_username = "";
	$scope.v_password = "";
	$scope.remember = "";
	$scope.email = "";
	$scope.currentYear = new Date().getFullYear();

    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax(); 
        angular.element('.login-form').show();
    	angular.element('.forget-form').hide(); 

    	if($location.absUrl().indexOf('reset-password') != -1)
    	{
    		var responsePromise = $http.post(GLOBAL.API_URL+'reset-password-status/'+$state.params.access_code);
			responsePromise.success(function(data, status1, headers, config) 
			{
				data = $.trim(data);
				if(data == 0 || data == '0')
				{
					$state.go('/'); // go to login
				}
			});
    	}      
    });    

    $rootScope.loadForgotPassword = function()
    {
    	angular.element('.login-form').hide();
    	angular.element('.forget-form').show();
    }

    $rootScope.loadLogin = function()
    {
    	angular.element('.login-form').show();
    	angular.element('.forget-form').hide();
    }

    $rootScope.submitLogin = function()
    {
		$(".alert").hide();
        if(form_valid("#login-form")) 
        {
            var responsePromise = $http.post(GLOBAL.API_URL+'check-login-status',{'v_username':$scope.v_username,'v_password':$scope.v_password,'remember':angular.element('.remember').attr('checked')});
            responsePromise.success(function(data, status1, headers, config) 
			{
			     	if(data == "0" || data == 0)
					{
					    angular.element("#login-form .alert-danger").html("Invalid username and password.").show();
					}
					else
					{
                        $v_name = data.v_name;
						$cookieStore.put('isLogged',$.trim(data.login_status));
						GLOBAL.checkId = true;
						$state.go('/dashboard'); // go to login
					}
			});
        } else {
           angular.element("#login-form .alert-danger").html("Please enter username and password.").show(); 
        }
        return false;
    }

    $rootScope.submitForgotPassword = function()
    {
		$(".alert").hide();
        if(form_valid("#forget-form")) 
        {
			var responsePromise = $http.post(GLOBAL.API_URL+'send-forgot-password',{'email':$scope.email});
			responsePromise.success(function(data, status1, headers, config) 
			{
					if(data == "0" || data == 0)
					{
						angular.element("#forget-form .alert-danger").show();
					}
					else
					{
						angular.element('.login-form').show();
    					angular.element('.forget-form').hide();
						angular.element("#login-form .alert-success").show();
					}
			});
        }
        return false;
    }

    $rootScope.submitResetPassword = function()
    {
		$(".alert").hide();
        if(form_valid("#reset-form")) 
        {
			var responsePromise = $http.post(GLOBAL.API_URL+'reset-password/'+$state.params.access_code,{'password':$scope.v_password});
			responsePromise.success(function(data, status1, headers, config) 
			{
					if(data == "0" || data == 0)
					{
						angular.element("#login-form .alert-danger").show();
					}
					else
					{
						$timeout(function()
						{
							$state.go('/'); // go to login
						},2000);
						angular.element("#reset-form .alert-success").show();
					}
			});
        }
        return false;
    }
}]);
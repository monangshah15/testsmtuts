'use strict';

app.controller('UsersLoginController',['$rootScope', '$scope', '$http', '$timeout','GLOBAL','$state','$cookieStore', '$location','GlobalVariables', function($rootScope, $scope, $http, $timeout,GLOBAL,$state,$cookieStore, $location,GlobalVariables) 
{
	$scope.v_username = "";
	$scope.v_password = "";
    $scope.v_company_alias = "";
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
    		var responsePromise = $http.post(GLOBAL.API_USER_URL+'reset-password-status/'+$state.params.access_code);
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
    	angular.element('.security-form').hide();
    }

    $rootScope.loadLogin = function()
    {
    	angular.element('.login-form').show();
    	angular.element('.forget-form').hide();
    	angular.element('.security-form').hide();
    }

    $rootScope.submitLogin = function()
    {
		$(".alert").hide();
        if(form_valid("#login-form")) 
        {
			var responsePromise = $http.post(GLOBAL.API_USER_URL+'check-login-status',{'v_username':$scope.v_username,'v_password':$scope.v_password,'v_company_alias':$scope.v_company_alias,'remember':angular.element('.remember').attr('checked')});
            responsePromise.success(function(data, status1, headers, config) 
			{
					if(data == "0" || data == 0)
					{
						angular.element("#login-form .alert-danger").html("Invalid username and password.").show();
					}
                    else if(data == "2" || data == 2)
                    {
                        $("#login-form .alert-danger").html("Invalid company alias.").show();
                    }
                    else if(data == "3" || data == 3)
                    {
                        $("#login-form .alert-danger").html("Your account is not active.").show();
                    }
					else
					{
    				    $v_name = data.v_name;
                        $v_image = data.v_image;
    					$cookieStore.put('isUserLogged',$.trim(data.login_status));
    					GLOBAL.checkUserId = true;
    					if(GlobalVariables.intended_url != ''){
                            if(GlobalVariables.intended_url == '/'){
                                $state.go('/dashboard');
                            } else {
                                $location.path(GlobalVariables.intended_url);
                            }
                            GlobalVariables.intended_url = '';
                        } else {
    					    $state.go('/dashboard'); // go to login
                        }
					}
			});
        } else {
           angular.element("#login-form .alert-danger").html("Please enter all information correctly.").show(); 
        }
        return false;
    }

    $rootScope.submitForgotPassword = function()
    {
		$(".alert").hide();
        if(form_valid("#forget-form")) 
        {
			var responsePromise = $http.post(GLOBAL.API_USER_URL+'send-forgot-password',{'email':$scope.email});
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

    $rootScope.submitSecurity = function()
    {
		$(".alert").hide();
        if(form_valid("#security-form")) 
        {
			var responsePromise = $http.post(GLOBAL.API_USER_URL+'send-security-check',{'email':$scope.email,'security_answer':$scope.v_security_answer});
			responsePromise.success(function(data, status1, headers, config) 
			{
					if(data == "0" || data == 0)
					{
						angular.element("#security-form .alert-danger").show();
					}
					else
					{
						angular.element('.login-form').show();
						angular.element('.security-form').hide();
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
			var responsePromise = $http.post(GLOBAL.API_USER_URL+'reset-password/'+$state.params.access_code,{'password':$scope.v_password});
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
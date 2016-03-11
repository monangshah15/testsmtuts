var timeOut;
/* Admin App */
var app = angular.module("app", [
    "ui.router", 
    'ngResource',
    "ui.bootstrap",
    "ngSanitize",
    "ngCookies",
    "ngImgCrop"
]);

app.directive('customDatepicker',function($compile)
{
    return {
        replace:true,
        link: function($scope, $element, $attrs, $controller)
        {
            default_value = $element.val();
            $element.on('focus', function()
            {
                default_value = $element.val();
            });
            $element.on('blur', function()
            {
                $element.val(default_value);
            });
        }    
    };
});

/* For share variables between controllers */
app.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    sharedService.message = '';
    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };
    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };
    return sharedService;
});

app.directive('fancybox',function($compile, $timeout){
    return {
        link: function($scope, element, attrs) {
            element.fancybox({
                hideOnOverlayClick:false,
                hideOnContentClick:false,
                enableEscapeButton:false,
                showNavArrows:false,
                onComplete: function(){
                    $timeout(function(){
                        $compile($("#fancybox-content"))($scope);
                        $scope.$apply();
                        $.fancybox.resize();
                    })
                }
            });
        }
    }
});

app.constant("GLOBAL", objConstant) 

/* Setup global settings */
app.factory('settings', ['$rootScope','GLOBAL', '$cookieStore', function($rootScope, GLOBAL, $cookieStore) {
    // supported languages   
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: true, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'img/',
        layoutCssPath: Metronic.getAssetsPath() + 'css/',
    };
    if(GLOBAL.checkId == "" || GLOBAL.checkId == undefined)
    {
        GLOBAL.checkId = false;
    }
    tmpCheck = $cookieStore.get('isLogged');  
    //console.log($cookieStore);
    if(tmpCheck != undefined && tmpCheck != "")
    {
        generatedCode = (tmpCheck - GLOBAL.CIPHER_KEY) / GLOBAL.CIPHER_KEY;
        roundFigure = Math.ceil(generatedCode);
        if(roundFigure == generatedCode)
        {
            GLOBAL.checkId = true;
        }
    }
    $rootScope.settings = settings;
    $rootScope.GLOBAL = GLOBAL;
    return settings;
}]);

/* For share variables between controllers */
app.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    sharedService.message = '';
    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };
    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };
    return sharedService;
});

/* Setup App Main Controller */
app.controller('AppController', ['$scope', '$rootScope', '$http','GLOBAL', function($scope, $rootScope, $http,GLOBAL) {
    $headerData = $http.defaults.headers.post['Content-Type'];
    $rootScope.user_permission = '';
    $scope.$on('$viewContentLoaded', function() {
        
        setTimeout(function()
        {
             /*if(!$('.sub-menu').parent().hasClass('open'))
                {
                    $(this).removeClass('open');
                    $(this).find('.arrow').removeClass('open');
                    $(this).find('.sub-menu').slideUp();
                }else
                {
                    $('.has-submenu').find('.arrow').addClass('open');
                }*/
            Metronic.init(); // Run metronic theme
            //Layout.init(); // init current layout
            QuickSidebar.init(); // init quick sidebar
            Demo.init(); // init demo features      
            FormValidation.init(); 
            Metronic.initComponents(); // init core components      
            Custom.init(); // for Custome script fumction
            ComponentsPickers.init();
            Index.initDashboardDaterange();
        },1000);
        $rootScope.rec_per_page = GLOBAL.REC_PER_PAGE;
    });
    
    /*var responsePromise = $http.post(GLOBAL.API_URL+"users/check-auth-permission");
    responsePromise.success(function(data, status1, headers, config) 
    {
        if(data == "" || data == undefined)
        {
            GLOBAL.checkId = false;
            GLOBAL.checkUserId = false;
            //$state.go('/');
        }
        $rootScope.user_permission = data.e_permission_type;
        console.log($rootScope.user_permission);
    });*/
    
    
    $rootScope.toJsDate = function(str){
        if(!str)return null;
        var t = str.split(/[- :]/);
        var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
        return d;
    }
    /*$rootScope.get_all_status_list = function(){        
        var responsePromise = $http.post(GLOBAL.API_URL+"get_status_list");
        responsePromise.success(function(data, status1, headers, config) 
        {
            if(data == "" || data == undefined)
            {
                GLOBAL.checkId = false;
                GLOBAL.checkUserId = false;
                $state.go('/');
            } else {
                $rootScope.all_status_list = data;
            }
        });
    } */
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
app.controller('HeaderController', ['$scope', '$rootScope', '$cookieStore','GLOBAL','$timeout', function($scope, $rootScope, $cookieStore,GLOBAL,$timeout) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
    $timeout(function()
    {
        $rootScope.v_name = $v_name;
        $rootScope.$apply();
    },10);
    $scope.logout = function() 
    {
        GLOBAL.checkId = false;      
        $cookieStore.remove('isLogged');
        window.location.href= GLOBAL.ADMIN_URL+"logout";
    };
}]);

/* Setup Layout Part - Sidebar */
app.controller('SidebarController', ['$scope', '$rootScope','GLOBAL','$cookieStore', function($scope, $rootScope, GLOBAL,$cookieStore) {
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function(){
             Layout.initSidebar(); // init sidebar        
        }, 2000)
    });
    $scope.logout = function() 
    {
        GLOBAL.checkId = false;      
        $cookieStore.remove('isLogged');
        window.location.href= GLOBAL.ADMIN_URL+"logout";
    };
}]);

/* Setup Layout Part - Quick Sidebar */
app.controller('QuickSidebarController', ['$scope', '$rootScope', function($scope, $rootScope) {    
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Page Head (Breadcrumbs) */
app.controller('PageHeadController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$includeContentLoaded', function() {
        
    });
}]);

/* Setup Layout Part - Footer */
app.controller('FooterController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$interpolateProvider','GLOBAL', function($stateProvider, $urlRouterProvider, $locationProvider,$interpolateProvider, GLOBAL) {
    
    $urlRouterProvider.when('', '/');
    
    // Redirect any unmatched url    
    $urlRouterProvider.otherwise("/"); 

    if (!jQuery.browser.msie || jQuery.browser.version != '9.0') {
        $locationProvider.html5Mode(true);
    }
    $stateProvider
        //Dashboard
        .state('/', {
            url: "/",
            templateUrl: ADMIN_ASSET_URL+"templates/login.html",
            data: {setLoginClass: true, pageTitle: 'Login', pageHead: 'Login', currTab: 'login'},
            controller: "LoginController",
            onEnter: function($state)
            {
                if(GLOBAL.checkId.toString() == 'true')
                {
                    $state.go('/dashboard');
                }
            }
        })
        .state('/reset-password', {
            url: "/reset-password/:access_code",
            templateUrl: ADMIN_ASSET_URL+"templates/reset_password.html",
            data: {setLoginClass: true, pageTitle: 'Reset Password', pageHead: 'Reset Password', currTab: 'reset-password'},
            controller: "LoginController",
            onEnter: function($state,$location)
            {
                if(GLOBAL.checkId.toString() == 'true') {
                    
                    $state.go('/dashboard');
                }
            }
        })
        .state('/dashboard', {
            url: "/dashboard",
            templateUrl: ADMIN_ASSET_URL+"templates/dashboard.html",
            data: {pageTitle: 'Dashboard', pageHead: 'Dashboard Section', currTab: 'dashboard'},
            controller: "DashboardController",
            onEnter: function($state)
            {
                if(GLOBAL.checkId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/users', {
            url: "/users",
            templateUrl: ADMIN_ASSET_URL+"templates/users.html",
            data: { pageTitle: 'Users', pageHead: 'Users', currTab: 'users'},
            controller: "UsersController",
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/users-add', {
            url: "/users/add",
            templateUrl: ADMIN_ASSET_URL+"templates/users-add.html",
            data: { pageTitle: 'Add User', pageHead: 'Add User', currTab: 'users'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/users-edit', {
            url: "/users/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/users-edit.html",
            data: { pageTitle: 'Edit User', pageHead: 'Edit User', currTab: 'users'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/account_setting', {
            url: "/account_setting",
            templateUrl: ADMIN_ASSET_URL+"templates/account_setting.html",
            data: { pageTitle: 'Account Setting', pageHead: 'Account Setting', currTab: 'account_setting'},
            controller: "AccountSettingController",
            onEnter: function($state)
            {
                if(GLOBAL.checkId.toString() == 'false')
                {
                    $state.go('/');
                }
            }
        })
        .state('/consignment_enquiry', {
            url: "/consignment_enquiry",
            templateUrl: ADMIN_ASSET_URL+"templates/consignment_enquiry.html",
            data: { pageTitle: 'Consignment Enquiry', pageHead: 'Consignment Enquiry', currTab: 'consignment_enquiry'},
            controller: "ConsignmentEnquiryController",
            onEnter: function($state)
            {
                if(GLOBAL.checkId.toString() == 'false')
                {
                    $state.go('/');
                }
                else {
                    //GlobalVariables.intended_url = $location.path(); 
                }
            }
        })
        .state('/setting', {
            url: "/setting",
            templateUrl: ADMIN_ASSET_URL+"templates/setting.html",
            data: { pageTitle: 'Setting', pageHead: 'Setting', currTab: 'setting'},
            controller: "SettingController",
            onEnter: function($state)
            {
                if(GLOBAL.checkId.toString() == 'false')
                {
                    $state.go('/');
                }
            }
        })
}]);
/* Init global settings and run the app */

app.run(["$rootScope", "settings", "$state",'GLOBAL','$stateParams','mySharedService', function($rootScope, settings, $state,GLOBAL,$stateParams, mySharedService) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams)
    {

    });
    
}]);

app.directive('bootstrapSwitch', ['PaginationService','$timeout' ,function(PaginationService,$timeout) 
{
    return{
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) 
        {
            element.bootstrapSwitch();
            element.on('switchChange.bootstrapSwitch', function(event, state) 
            {
                if(state)
                {
                    PaginationService.change_active_inactive(attrs.url, attrs.rowkey, 'Inactive');
                }
                else
                {
                    PaginationService.change_active_inactive(attrs.url, attrs.rowkey, 'Active');   
                }

                if (ngModel) 
                {
                    scope.$apply(function() 
                    {
                        ngModel.$setViewValue(state);
                    });
                }
            });
             
            scope.$watch(attrs.ngModel, function(newValue, oldValue) 
            {
                if (newValue) 
                {
                    //element.bootstrapSwitch('state', true, true);
                } 
                else 
                {
                    //element.bootstrapSwitch('state', false, true);
                }
            });
        }
    };
}]);

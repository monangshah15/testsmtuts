var timeOut;
/* Admin App */
var app = angular.module("app-user", [
    "ui.router", 
    'ngResource',
    "ui.bootstrap", 
    "ngSanitize",
    "ngCookies",
    "oc.lazyLoad",
    "ngImgCrop"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
app.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);

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

app.factory('GlobalVariables', function() {
    return {
        intended_url:'',
    }
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

app.constant("GLOBAL", objConstant); 

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
    
    if(GLOBAL.checkUserId == "" || GLOBAL.checkUserId == undefined)
    {
        GLOBAL.checkUserId = false;
    }
    tmpCheck = $cookieStore.get('isUserLogged'); 
    //console.log($cookieStore);
    if(tmpCheck != undefined && tmpCheck != "")
    {
        generatedCode = (tmpCheck - GLOBAL.CIPHER_KEY) / GLOBAL.CIPHER_KEY;
        roundFigure = Math.ceil(generatedCode);
        if(roundFigure == generatedCode)
        {
            GLOBAL.checkUserId = true;
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
app.controller('AppUserController', ['$scope', '$rootScope', '$http','GLOBAL', '$timeout', function($scope, $rootScope, $http,GLOBAL,$timeout) {
    $headerData = $http.defaults.headers.post['Content-Type'];
    
    $scope.$on('$viewContentLoaded', function() {
         
        setTimeout(function(){
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
            //FormDropzone.init();
            $rootScope.rec_per_page = GLOBAL.REC_PER_PAGE;
    
            //Portfolio.init();
        },1000);
       

    });
    
    $rootScope.toJsDate = function(str){
        if(!str)return null;
        var t = str.split(/[- :]/);
        var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
        return d;
    }
    
    $rootScope.currentDate = function(){
        $scope.date = new Date();
        return $scope.date;
    }
    
    $rootScope.get_all_common_list = function($sectionName){        
        var responsePromise = $http.post(GLOBAL.API_USER_URL+"get_all_lists/"+$sectionName);
        responsePromise.success(function(data, status1, headers, config) 
        {
            if(data == "" || data == undefined)
            {
                GLOBAL.checkId = false;
                GLOBAL.checkUserId = false;
                $state.go('/');
            } else {
                $rootScope.all_common_list_data = data;
            }
        });
    } 
                
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
app.controller('HeaderController', ['$scope', '$rootScope', 'GLOBAL', '$cookieStore','$timeout', function($scope, $rootScope, GLOBAL, $cookieStore,$timeout) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
    $timeout(function()
    {
        $rootScope.v_name = $v_name;
        $rootScope.v_image = $v_image;
        $rootScope.$apply();
    },10);
    $scope.logout = function() 
    {
        GLOBAL.checkUserId = false;      
        $cookieStore.remove('isUserLogged');
        window.location.href= GLOBAL.SITE_URL+"logout";
    };
}]);

/* Setup Layout Part - Sidebar */
app.controller('SidebarController', ['$scope', 'GLOBAL', '$rootScope','$timeout', '$cookieStore', function($scope, GLOBAL, $rootScope ,$timeout , $cookieStore) {
    
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function(){
             Layout.initSidebar(); // init sidebar        
        }, 2000)
    });
    
    $scope.logout = function() 
    {
        GLOBAL.checkUserId = false;      
        $cookieStore.remove('isUserLogged');
        window.location.href= GLOBAL.SITE_URL+"logout";
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
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$interpolateProvider','GLOBAL','$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider,$interpolateProvider,GLOBAL,$httpProvider) {
    
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
            templateUrl: ADMIN_ASSET_URL+"templates/user/login.html",
            data: {setLoginClass: true, pageTitle: 'Login', pageHead: 'Login', currTab: 'login'},
            controller: "UsersLoginController",
            onEnter: function($state, GlobalVariables, $location)
            {
                if(GLOBAL.checkUserId.toString() == 'true')
                {
                    $state.go('/dashboard');
                }
                else {
                    //GlobalVariables.intended_url = $location.path(); 
                }
            }
        })
        .state('/reset-password', {
            url: "/reset-password/:access_code",
            templateUrl: ADMIN_ASSET_URL+"templates/user/reset_password.html",
            data: {setLoginClass: true, pageTitle: 'Reset Password', pageHead: 'Reset Password', currTab: 'reset-password'},
            controller: "UsersLoginController",
            onEnter: function($state, GlobalVariables, $location)
            {
                if(GLOBAL.checkUserId.toString() == 'true')
                {
                    $state.go('/');
                }
            }
        })
        .state('/dashboard', {
            url: "/dashboard",
            templateUrl: ADMIN_ASSET_URL+"templates/user/dashboard.html",
            data: {pageTitle: 'Dashboard', pageHead: 'Dashboard Section', currTab: 'dashboard'},
            controller: "UsersDashboardController",
            onEnter: function($state, GlobalVariables, $location)
            {
                if(GLOBAL.checkUserId.toString() == 'false')
                {
                    $state.go('/');
                }
                else {
                    //GlobalVariables.intended_url = $location.path(); 
                }
            }
            
        }).state('/account_setting', {
            url: "/account_setting",
            templateUrl: ADMIN_ASSET_URL+"templates/user/account_setting.html",
            data: { pageTitle: 'Account Setting', pageHead: 'Account Setting', currTab: 'account_setting'},
            controller: "UsersAccountSettingController",
            onEnter: function($state, GlobalVariables, $location)
            {
                if(GLOBAL.checkUserId.toString() == 'false')
                {
                    $state.go('/');
                }
                else {
                    //GlobalVariables.intended_url = $location.path(); 
                }
            }
        })
        .state('/schools', {
            url: "/schools",
            templateUrl: ADMIN_ASSET_URL+"templates/user/schools.html",
            data: { pageTitle: 'Schools', pageHead: 'Schools', currTab: 'schools'},
            controller: "SchoolsController",
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/schools-add', {
            url: "/schools/add",
            templateUrl: ADMIN_ASSET_URL+"templates/user/schools-add.html",
            data: { pageTitle: 'Add School', pageHead: 'Add School', currTab: 'schools'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/schools-edit', {
            url: "/schools/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/user/schools-edit.html",
            data: { pageTitle: 'Edit School', pageHead: 'Edit School', currTab: 'schools'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/batches', {
            url: "/batches",
            templateUrl: ADMIN_ASSET_URL+"templates/user/batches.html",
            data: { pageTitle: 'Batches', pageHead: 'Batches', currTab: 'batches'},
            controller: "BatchesController",
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/batches-add', {
            url: "/batches/add",
            templateUrl: ADMIN_ASSET_URL+"templates/user/batches-add.html",
            data: { pageTitle: 'Add Batch', pageHead: 'Add Batch', currTab: 'batches'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/batches-edit', {
            url: "/batches/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/user/batches-edit.html",
            data: { pageTitle: 'Edit Batch', pageHead: 'Edit Batch', currTab: 'batches'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/subjects', {
            url: "/subjects",
            templateUrl: ADMIN_ASSET_URL+"templates/user/subjects.html",
            data: { pageTitle: 'Subjects', pageHead: 'Subjects', currTab: 'subjects'},
            controller: "SubjectsController",
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/subjects-add', {
            url: "/subjects/add",
            templateUrl: ADMIN_ASSET_URL+"templates/user/subjects-add.html",
            data: { pageTitle: 'Add Subject', pageHead: 'Add Subject', currTab: 'subjects'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/subjects-edit', {
            url: "/subjects/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/user/subjects-edit.html",
            data: { pageTitle: 'Edit Subject', pageHead: 'Edit Subject', currTab: 'subjects'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/students', {
            url: "/students",
            templateUrl: ADMIN_ASSET_URL+"templates/user/students.html",
            data: { pageTitle: 'Students', pageHead: 'Students', currTab: 'students'},
            controller: "StudentsController",
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/students-add', {
            url: "/students/add",
            templateUrl: ADMIN_ASSET_URL+"templates/user/students-add.html",
            data: { pageTitle: 'Add Student', pageHead: 'Add Student', currTab: 'students'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/students-edit', {
            url: "/students/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/user/students-edit.html",
            data: { pageTitle: 'Edit Student', pageHead: 'Edit Student', currTab: 'students'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/exams', {
            url: "/exams",
            templateUrl: ADMIN_ASSET_URL+"templates/user/exams.html",
            data: { pageTitle: 'Exams', pageHead: 'Exams', currTab: 'exams'},
            controller: "ExamsController",
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/exams-add', {
            url: "/exams/add",
            templateUrl: ADMIN_ASSET_URL+"templates/user/exams-add.html",
            data: { pageTitle: 'Add Exam', pageHead: 'Add Exam', currTab: 'exams'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/exams-edit', {
            url: "/exams/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/user/exams-edit.html",
            data: { pageTitle: 'Edit Exam', pageHead: 'Edit Exam', currTab: 'exams'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/attendances', {
            url: "/attendances",
            templateUrl: ADMIN_ASSET_URL+"templates/user/attendances.html",
            data: { pageTitle: 'Attendances', pageHead: 'Attendances', currTab: 'attendances'},
            controller: "AttendancesController",
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/attendances-add', {
            url: "/attendances/add",
            templateUrl: ADMIN_ASSET_URL+"templates/user/attendances-add.html",
            data: { pageTitle: 'Add Attendance', pageHead: 'Add Attendance', currTab: 'attendances'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/attendances-edit', {
            url: "/attendances/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/user/attendances-edit.html",
            data: { pageTitle: 'Edit Attendance', pageHead: 'Edit Attendance', currTab: 'attendances'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/news', {
            url: "/news",
            templateUrl: ADMIN_ASSET_URL+"templates/user/news.html",
            data: { pageTitle: 'News', pageHead: 'News', currTab: 'News'},
            controller: "NewsController",
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/news-add', {
            url: "/news/add",
            templateUrl: ADMIN_ASSET_URL+"templates/user/news-add.html",
            data: { pageTitle: 'Add News', pageHead: 'Add News', currTab: 'news'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/news-edit', {
            url: "/news/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/user/news-edit.html",
            data: { pageTitle: 'Edit News', pageHead: 'Edit News', currTab: 'news'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/marks', {
            url: "/marks",
            templateUrl: ADMIN_ASSET_URL+"templates/user/marks.html",
            data: { pageTitle: 'Marks', pageHead: 'Marks', currTab: 'marks'},
            controller: "MarksController",
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/marks-add', {
            url: "/marks/add",
            templateUrl: ADMIN_ASSET_URL+"templates/user/marks-add.html",
            data: { pageTitle: 'Add Marks', pageHead: 'Add Marks', currTab: 'marks'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/marks-edit', {
            url: "/marks/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/user/marks-edit.html",
            data: { pageTitle: 'Edit Marks', pageHead: 'Edit Marks', currTab: 'marks'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/fees', {
            url: "/fees",
            templateUrl: ADMIN_ASSET_URL+"templates/user/fees.html",
            data: { pageTitle: 'Fees', pageHead: 'Fees', currTab: 'marks'},
            controller: "FeesController",
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/fees-add', {
            url: "/fees/add",
            templateUrl: ADMIN_ASSET_URL+"templates/user/fees-add.html",
            data: { pageTitle: 'Add Fees', pageHead: 'Add Fees', currTab: 'fees'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
        .state('/fees-edit', {
            url: "/fees/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/user/fees-edit.html",
            data: { pageTitle: 'Edit Fees', pageHead: 'Edit Fees', currTab: 'fees'},
            onEnter: function($state, $stateParams)
            {
                if(GLOBAL.checkUserId.toString() == 'false'){ 
                    $state.go('/'); 
                }
            }
        })
}]);

/* Init global settings and run the app */
app.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state, mySharedService) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        $rootScope  = $rootScope.$new();
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

/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize"
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'img/',
        layoutCssPath: Metronic.getAssetsPath() + 'css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $locationProvider.html5Mode(true);

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard.html");  
    
    $stateProvider

        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../plugins/morris/morris.css',
                            '../css/tasks.css',
                            
                            '../plugins/morris/morris.min.js',
                            '../plugins/morris/raphael-min.js',
                            '../plugins/jquery.sparkline.min.js',

                            '../scripts/index3.js',
                            '../scripts/tasks.js',

                             'js/controllers/DashboardController.js'
                        ] 
                    });
                }]
            }
        })

        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../plugins/angularjs/../plugins/angular-file-upload/angular-file-upload.min.js',
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        files: [
                            '../plugins/angularjs/../plugins/ui-select/select.min.css',
                            '../plugins/angularjs/../plugins/ui-select/select.min.js'
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/UISelectController.js'
                        ] 
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../plugins/jstree/dist/themes/default/style.min.css',

                            '../plugins/jstree/dist/jstree.min.js',
                            '../scripts/ui-tree.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })     

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../plugins/jquery-tags-input/jquery.tagsinput.css',
                            '../plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../plugins/typeahead/typeahead.css',

                            '../plugins/fuelux/js/spinner.min.js',
                            '../plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '../plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../plugins/typeahead/handlebars.min.js',
                            '../plugins/typeahead/typeahead.bundle.min.js',
                            '../scripts/components-form-tools.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })        

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../plugins/clockface/css/clockface.css',
                            '../plugins/bootstrap-datepicker/css/datepicker3.css',
                            '../plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            '../plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../plugins/clockface/js/clockface.js',
                            '../plugins/bootstrap-daterangepicker/moment.min.js',
                            '../plugins/bootstrap-daterangepicker/daterangepicker.js',
                            '../plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../scripts/components-pickers.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../plugins/bootstrap-select/bootstrap-select.min.css',
                            '../plugins/select2/select2.css',
                            '../plugins/jquery-multi-select/css/multi-select.css',

                            '../plugins/bootstrap-select/bootstrap-select.min.js',
                            '../plugins/select2/select2.min.js',
                            '../plugins/jquery-multi-select/js/jquery.multi-select.js',

                            '../scripts/components-dropdowns.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        }) 

        // Advanced Datatables
        .state('datatablesAdvanced', {
            url: "/datatables/advanced.html",
            templateUrl: "views/datatables/advanced.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../plugins/select2/select2.css',                             
                            '../plugins/datatables/../plugins/bootstrap/dataTables.bootstrap.css', 
                            '../plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            '../plugins/select2/select2.min.js',
                            '../plugins/datatables/all.min.js',
                            'js/scripts/table-advanced.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesAjax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../plugins/select2/select2.css',                             
                            '../plugins/bootstrap-datepicker/css/datepicker.css',
                            '../plugins/datatables/../plugins/bootstrap/dataTables.bootstrap.css',

                            '../plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../plugins/select2/select2.min.js',
                            '../plugins/datatables/all.min.js',

                            '../scripts/datatable.js',
                            'js/scripts/table-ajax.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',  
                        files: [
                            '../plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../css/profile.css',
                            '../css/tasks.css',
                            
                            '../plugins/jquery.sparkline.min.js',
                            '../plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../scripts/profile.js',

                            'js/controllers/UserProfileController.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}      
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        files: [
                            '../plugins/bootstrap-datepicker/css/datepicker3.css',
                            '../plugins/select2/select2.css',
                            '../css/todo.css',
                            
                            '../plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../plugins/select2/select2.min.js',

                            '../scripts/todo.js',

                            'js/controllers/TodoController.js'  
                        ]                    
                    });
                }]
            }
        })

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
}]);
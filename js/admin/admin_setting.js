var timeOut;
var MESSAGE_TIMOUT = '5000';

var app = angular.module('adminGridApp', ['ngSanitize'])
.directive('dynamic', function ($compile) { //directive to convert text into html
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
})
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})
.controller('PaginationCtrl', function($scope, $http, $timeout) {
    $scope.page_load_url = '';
    $scope.edit_url = '';
    $scope.record = '';
    $scope.list_ajax_url = '';
    $scope.email_input = false;
    
    $scope.init = function(event){
        if(event=='load_data') {
            $scope.load_data();
        }
    }
    
    $scope.set_section = function(section_name,list_ajax_url ,edit_url){
        $scope.page_load_url = section_name;
        $scope.edit_url = edit_url;
        $scope.list_ajax_url = ADMIN_PATH+'/'+list_ajax_url;
    }
    $scope.load_data = function() {
        clearTimeout(timeOut);
        timeOut = setTimeout(function() {
            var responsePromise = $http.post($scope.list_ajax_url);
            responsePromise.success(function(data, status, headers, config) {
                $scope.record = data['page_data']; 
                $scope.email_templet = data['email_templet'];                  
            });
            responsePromise.error(function(data, status, headers, config) {
                //alert("AJAX failed!");
            }); 
        }, 10);
    }
    $scope.editFrm = function(form_id){
        var data = $('#frmEdit').serialize(); 
        oldHeader = $http.defaults.headers.post['Content-Type'];
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        if(form_valid('#frmEdit')){
        clearTimeout(timeOut);
                timeOut = setTimeout(function() 
                {
                    var url = ADMIN_PATH+'/'+$('#frmEdit').attr('action');
                    var responsePromise = $http.post(url, data);
                        responsePromise.success(function(data, status1, headers, config) {
                            if(data == 'Email id already exists'){
                                 $('.duplicate_email_error').html('<label class="error-inner">'+data+'.</label>');
                                 scroll_up_to('.duplicate_email_error');
                            }
                            else if(data == 'Name already exists'){
                                 $('.duplicate_name_error').html('<label class="error-inner">'+data+'.</label>');
                                 scroll_up_to('.duplicate_name_error');
                            }
                            else
                            {
                                $('.flash-msg').show();
                                $scope.html = 'Record updated successfully.';
                                setTimeout(function(){ $(".flash-msg").fadeOut('slow');$scope.html = "";  },MESSAGE_TIMOUT); // hidding message after n seconds
                            }
                   });  
                }, 500);
        }else{
            return false;
        }
    }   
    
    $scope.back_listing = function($id) {
        window.location = ADMIN_URL+"dashboard";
    }
    
     function scroll_up_to(selector){
    $('html, body').animate({
        scrollTop: (parseInt($(selector).offset().top,10) - 200)
    }, 500);
    }
    
});
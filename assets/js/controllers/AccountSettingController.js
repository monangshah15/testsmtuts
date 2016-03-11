'use strict';
app.controller('AccountSettingController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter) {
    /* Begin add form */
    $rootScope.filename = '';
    $rootScope.parent_items = {};
    $rootScope.add_fields = {};
    $rootScope.edit_fields = {};
    $rootScope.view_data = {};
    $rootScope.search_fields = {};
    $rootScope.selected_record = {};
    $rootScope.prev_record = false;   
    $rootScope.nexts_record = false;

    $rootScope.submit_frm_edit = function(items){
        if(form_valid('#frmEdit',"help-block")){
            //Call submit data services            
            PaginationService.submit_edit_form_data(GLOBAL.API_URL+"update_account_setting", items);
            $rootScope.success_msg = 'Updated successfully';
            // To clear form elements
            setTimeout(function(){
                $rootScope.v_name = items['v_name'];
                angular.element('.alert-success').fadeIn(1000);
                angular.element('.alert-success').fadeOut(2000);
                //angular.element('.alert').hide();
            },500);
        }               
    }
    $scope.$on('$viewContentLoaded', function() 
    {
        $http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        PaginationService.loading(GLOBAL.API_URL+"account_setting","v_title");
    });
    
});
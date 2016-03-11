'use strict';
app.controller('HomePageSettingsController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter) {
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

    $rootScope.submit_frm_edit = function(edit_fields){
        /* For uplod image */
        edit_fields['h_v_img'] = angular.element('#h_v_img').val();
        edit_fields['v_img_values'] = angular.element('#frmEdit .final').val();
        if(form_valid('#frmEdit',"help-block"))
        {
            //Call submit data services
            $("html, body").animate({ scrollTop: 0 }, "slow");
            PaginationService.submit_edit_form_data(GLOBAL.API_URL+"home_page_settings/add-information-boxes", edit_fields);
            // To clear form elements
            $timeout(function()
            {
                angular.element('.alert-success').show();
            },500);
        }                

    }
    $scope.$on('$viewContentLoaded', function() 
    {
        $http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        $('.dropzone').show();
        PaginationService.loading(GLOBAL.API_URL+"home_page_settings","v_label1");   
         
    });
    
});
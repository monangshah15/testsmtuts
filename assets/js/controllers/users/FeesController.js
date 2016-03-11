'use strict';
app.controller('FeesController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    
    /* Begin add form */
    $rootScope.filename = '';
    $rootScope.parent_items = {};
    $rootScope.add_fields = {};
    $rootScope.edit_fields = {};
    $rootScope.view_data = {};
    $rootScope.selected_record = {};
    $rootScope.prev_record = false;   
    $rootScope.nexts_record = false;
    $rootScope.valid_img = 0;
    $rootScope.current_page = 1;
    $rootScope.page = 1;
    $rootScope.edit_original_data = {};
    $rootScope.all_common_list_data = {};
    $scope.sectionName = 'fees';
    
    if($stateParams.id != "" && $stateParams.id != undefined)
    {
        if(mySharedService.edit_fields != undefined) {
            $rootScope.frm_edit_open(mySharedService.edit_fields);
        } else {
            var responsePromise = $http.post(GLOBAL.API_USER_URL+"fees/data/"+$stateParams.id);
            responsePromise.success(function(data, status1, headers, config) 
            {
                if(data.items != "" && data.items != undefined)
                {
                    $timeout(function()
                    {
                        $rootScope.items = data.items;
                        $rootScope.edit_fields = angular.fromJson($rootScope.items);
                        $rootScope.batch_list = data.batch_list;
                        $rootScope.subject_list = data.subject_list;
                        $rootScope.frm_edit_open(data.items);
                    });
                } else {
                    $state.go('/fees');  
                }
            });
        }
    }
    
    $rootScope.export_to_excel = function(fields){
        if(fields != undefined)
        {
            $rootScope.search_fields = fields;
            $rootScope.search_fields['order_field'] = $rootScope.order_field;
            $rootScope.search_fields['sort_order'] = $rootScope.sort_order;
        }
        
        if($rootScope.search_fields == undefined){
            $scope.someModelSerialized = '[]'; 
        } else {
            $scope.someModelSerialized = angular.toJson($rootScope.search_fields); 
        }
        window.location.href = GLOBAL.API_USER_URL+'fees/export/'+$scope.someModelSerialized;
    }
    
    $rootScope.frm_add_open = function(parent_items){
        angular.element('.alert').hide();
        $("#frmAdd .form-group").removeClass('has-error');
        $("#frmAdd .required").removeAttr('style');
        $("#frmAdd .help-block-error").remove();
        //angular.element('.add_e_status').val('Active');
        $('.dropzone').show();
        loadSingleDatePicker('frmAdd');
    }
    
    $rootScope.submit_frm_add = function(add_fields, button_pressed){
        
        if(form_valid('#frmAdd',"help-block")){
            //Call submit data services
            if(button_pressed == 'New'){
                PaginationService.submit_add_form_data(GLOBAL.API_USER_URL+"fees/add", add_fields);
            } else {
                PaginationService.submit_add_form_data(GLOBAL.API_USER_URL+"fees/add", add_fields, '/fees');
            }
            
           $rootScope.success_msg = 'Record Added successfully';
            // To clear form elements
            setTimeout(function(){
                angular.element('.alert-success').fadeIn(1000);
                angular.element('.alert-success').fadeOut(2000);
                angular.element('.select2me').select2('val', '');
                angular.element('#cpassword').val('');
                angular.element('.alert').hide();
            },500);
        } else {           
            return false;
        }                
    }
    /* End add form */
    
    /* Begin edit form */
    $rootScope.loadEditData = function(item){
        $rootScope.edit_fields = item;
        mySharedService.edit_fields = $rootScope.edit_fields; 
        //$rootScope.$broadcast($rootScope.edit_fields1);
        $state.go('/fees-edit',{id: item.id , edit_fields: item});
    }
    
    /* Begin edit form */
    $rootScope.frm_edit_open = function(item)
    {
        angular.element('.alert').hide();
        $rootScope.edit_fields = item;
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();
        $rootScope.get_all_common_list($scope.sectionName); 
        $scope.edit_fields.e_status = item.e_status;
    }
    
    $rootScope.submit_frm_edit = function(edit_fields)
    {
        if(form_valid('#frmEdit',"help-block")){
            
            //Call submit data services            
            PaginationService.submit_edit_form_data(GLOBAL.API_USER_URL+"fees/edit", edit_fields, '/fees');
            $rootScope.success_msg = 'Record Updated successfully';
            // To clear form elements
            setTimeout(function(){
                //angular.copy({}, edit_fields);
                //$rootScope.$apply();
                angular.element('.alert-success').fadeIn(1000);
                angular.element('.alert-success').fadeOut(2000);
                angular.element('.alert').hide();
            },500);
        }                
    }
    /* End edit form */
    
    $rootScope.data_active_inactive = function(item){
        $timeout(function() {
            PaginationService.change_active_inactive(GLOBAL.API_USER_URL+"fees/change-status", item.id, item.e_status);
            if(item.e_status == 'Active'){
                item.e_status = 'Inactive';
            } else {
                item.e_status = 'Active';
            }
        }, 500);
    }
    
    $scope.enable_button = function(){
        $timeout(function () //setting timeout for update of element scope
       {   
           $scope.checkAll = false;
           $scope.check_count = 0;
           $scope.ids = [];
           
           angular.forEach($scope.selected_record, function(index,val){ // selected_record is ng-model name of checkbok

                if(index){
                    if(val == '0' )
                    {
                        $scope.selected_record[0] = false;
                    }
                    else // counting checked checkbox
                    {
                        $scope.ids.push(val);
                        $scope.check_count++;
                    }
                }
           });

           if($scope.check_count == $scope.items.length)
           {
                $scope.selected_record[0] = true;
           }  
           if($scope.check_count == 0)
           {
                $scope.button_show = false;
           }
           else
           {
                $scope.button_show = true;
            }
        }); 
    }
    $scope.check_all = function(checkAll,parent) { 
      
        $timeout(function(){ 
            angular.forEach($scope.items , function(data){
                $scope.selected_record[data.id] = checkAll; 
            }); 
            if(parent){
                $scope.selected_record[0] = false;
            }
        }, 1000);
    }
    $scope.enable_button = function(){
        $timeout(function () //setting timeout for update of element scope
       {   
           $scope.checkAll = false;
           $scope.check_count = 0;
           $scope.ids = [];
           
           angular.forEach($scope.selected_record, function(index,val){ // selected_record is ng-model name of checkbok
                if(index){
                    if(val == '0' )
                    {
                        $scope.selected_record[0] = false;
                    }
                    else // counting checked checkbox
                    {
                        $scope.ids.push(val);
                        $scope.check_count++;
                    }
                }
           });
           if($scope.check_count == $rootScope.items.length)
           {
                angular.element(".group-checkable").parent("span").addClass("checked");
                $scope.selected_record[0] = true;
           }
           else
           {
                angular.element(".group-checkable").parent("span").removeClass("checked");
                $scope.selected_record[0] = false;
           }  
           
        }); 
    }
    
    $rootScope.bulk_actions_change = function($status) {
       if($status == null ||  $status == '' || $status == undefined) /// if no action is selected then do nothing
       {
            return false;
       }
       var massage = '';
       var status = '';
       $timeout(function () //setting timeout for update of element scope
       {   
           $rootScope.checkAll = false;
           $rootScope.check_count = 0;
           $rootScope.ids = [];
           
           angular.forEach($rootScope.selected_record, function(index,val){ // selected_record is ng-model name of checkbok
                if(index) // counting checked checkbox
                {
                    //$scope.ids[val] = val;
                    $rootScope.ids.push(val);
                    $rootScope.check_count++;
                }
           });  
           
           if($rootScope.check_count == 0)
           {
                bootbox.alert("Please select checkbox(s).", function() {
                });
                $scope.bulk_actions = '';
                return false;
           }
           else
           {
                
               if($status =='act')
               {
                    massage = 'active';
                    status = '0';
               }
               if($status =='inact')
               {
                    massage = 'inactive';
                    status = '1';
               }
               if($status =='del')
               {
                    status = 'deleted';
                    massage = 'delete';
               }
               
               var row_count = 0;
               bootbox.confirm("Are you sure you want to "+ massage+" selected record?", function(result) {
                if(result == true)
                {
                    angular.forEach($rootScope.ids, function(val){
                        if(massage == 'inactive')
                        {
                            angular.element('#tablerow'+val).find('.bootstrap-switch-wrapper').removeClass('bootstrap-switch-on');
                            angular.element('#tablerow'+val).find('.bootstrap-switch-wrapper').addClass('bootstrap-switch-off');
                        }
                         if(massage == 'active')
                        {
                            angular.element('#tablerow'+val).find('.bootstrap-switch-wrapper').removeClass('bootstrap-switch-off');
                            angular.element('#tablerow'+val).find('.bootstrap-switch-wrapper').addClass('bootstrap-switch-on');
                        }
                        if(massage == 'delete')
                        {
                            angular.element('#tablerow'+val).fadeOut('2000');
                        }
                    });
                  var responsePromise = $http.post(GLOBAL.API_USER_URL+'fees/bulk-actions',{'id':$rootScope.ids,'action':status});
                   responsePromise.success(function(data, status1, headers, config) {
                        angular.forEach($rootScope.items, function(val){ // selected_record is ng-model name of checkbok
                         if($rootScope.selected_record[val.id] == true)
                                {
                                    row_count = parseInt(row_count) + 1;
                                    val.i_status = $.trim(data);
                                    if(status =='deleted') // 
                                    {
                                       // $rootScope.ApplicantRow[val.id] = true;
                                    }
                                    $rootScope.selected_record[val.id] = false;
                                }
                        }); 
                        $scope.bulk_actions = '';
                        if($status =='del')
                        {
                            PaginationService.loading(GLOBAL.API_USER_URL+"fees","d_due_date"); 
                            $rootScope.success_msg = 'Record Deleted successfully';
                            angular.element('.alert-success').fadeIn(1000);
                            angular.element('.alert-success').fadeOut(2000);
                        }
                        if($status =='act')
                        {
                           // PaginationService.loading(GLOBAL.API_USER_URL+"faqs","v_title"); 
                           $rootScope.success_msg = 'Record Activated successfully';
                            setTimeout(function(){
                                $rootScope.$apply();
                                angular.element('.alert-success').fadeIn(1000);
                                angular.element('.alert-success').fadeOut(2000);
                            },500);
                            $("html, body").animate({ scrollTop: 0 }, "slow");
                        }
                        if($status =='inact')
                        {
                           // PaginationService.loading(GLOBAL.API_USER_URL+"faqs","v_title"); 
                           $rootScope.success_msg = 'Record Inactivated successfully';
                            setTimeout(function(){
                                $rootScope.$apply();
                                angular.element('.alert-success').fadeIn(1000);
                                angular.element('.alert-success').fadeOut(2000);
                            },500);
                            $("html, body").animate({ scrollTop: 0 }, "slow");
                        }
                        $rootScope.check_count = 0;
                        $scope.check_all(false,true);
                        angular.element('.checker').find('.checked').removeClass('checked');
                        
                   });
               }else
               {
                    $rootScope.check_count = 0;
                    $scope.check_all(false,true);
                    angular.element('.checker').find('.checked').removeClass('checked');
                    $rootScope.bulk_actions = '';
                    $scope.bulk_actions = '';
               }
           });
            }
        });
    }
    
    /* Delete User */
    $rootScope.delete_btn = function(id)
    {
        bootbox.confirm("Are you sure you want to delete this record?", function(result) {
            if(result == true)
            {
                PaginationService.delete_data(GLOBAL.API_USER_URL+"fees/fees-delete",id);
                angular.element('#tablerow'+id).fadeOut('2000');
                $rootScope.success_msg = 'Deleted successfully';
                setTimeout(function(){
                    $rootScope.$apply();
                    angular.element('.alert-success').fadeIn(1000);
                    angular.element('.alert-success').fadeOut(2000);
                },500);
                //alert($rootScope.total);
            }
        }); 
    }
    //function to show previous record on view record detail block
    $rootScope.previous_record = function(view_data) {
        var index = ( parseInt($rootScope.items.indexOf(view_data)) - 1); // getting current index from json array
        
        if(index >= 0)
        {
            angular.forEach($rootScope.items, function(value, key) {
                if(key == index)
                {
                    $rootScope.view_data = value;
                }
            });   
            if(index == 0) // if on first record hidding previous button
            {
                $rootScope.prev_record = true;
                $rootScope.nexts_record = false; 
            }
            else
            {
                $rootScope.prev_record = false;   
                $rootScope.nexts_record = false; 
            }
        }
    }
    //function to show next record on view record detail block
    $rootScope.next_record = function(view_data) {
        var index = ( parseInt($rootScope.items.indexOf(view_data)) + 1); // getting current index from json array
        
        if(index <= ($rootScope.items.length-1))
        {
            angular.forEach($rootScope.items, function(value, key) {
                if(key == index)
                {
                    $rootScope.view_data = value;
                }
            });   
            if(index == ($rootScope.items.length-1)) // if on last record hidding previous button
            {
                $rootScope.nexts_record = true;
                $rootScope.prev_record = false;   
            }
            else
            {
                $rootScope.nexts_record = false;  
                $rootScope.prev_record = false;    
            }
        } 
        
    }
    /* End view form */
    
    /* Clear form data */
    $rootScope.clearFormData = function(){
        $state.go('/fees');
    };
    
    $scope.$on('$viewContentLoaded', function() {
        $http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        PaginationService.loading(GLOBAL.API_USER_URL+"fees","d_due_date");
        $rootScope.get_all_common_list($scope.sectionName); 
        //$rootScope.items =  $rootScope.items;
    });
});

'use strict';
app.controller('AddFeesController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    $rootScope.add_fields = {};
    $rootScope.batches_list = {};
    $rootScope.templates_list = {};
    $rootScope.students_list = {};
    $rootScope.i_student_ids = '';
    $scope.student_id = [];   
    $scope.selectedAll = ''; 
    $scope.active_chk = '';
    $scope.sectionName = 'fees';
    var responsePromise = $http.post(GLOBAL.API_USER_URL+"get_all_lists/"+$scope.sectionName);
    responsePromise.success(function(data, status1, headers, config) 
    {
        if(data == "" || data == undefined)
        {
            GLOBAL.checkId = false;
            GLOBAL.checkUserId = false;
            $state.go('/');
        }
        $rootScope.batches_list = data.batches_list;
        $rootScope.templates_list = data.templates_list;
        $rootScope.students_list = data.students_list;
    });
    
    $scope.selectStudent = function(student_id,active){
        if(active){
            $scope.student_id.push(student_id);    
        } else {
            $scope.student_id.splice($scope.student_id.indexOf(student_id), 1);
        }
        console.log($scope.student_id);
    };
    
    $scope.select_all_user = function() {
        if($rootScope.add_fields.i_batch_id!='' && $rootScope.add_fields.i_batch_id != undefined)
        {
            $timeout(function(){
                $scope.student_id = []; 
                $scope.students_list = $filter('filter')($rootScope.students_list, {i_batch_id:$rootScope.add_fields.i_batch_id});
                if ($scope.selectedAll) {
                    $scope.selectedAll = true;
                    angular.forEach($scope.students_list, function (student) {
                        $scope.active_chk = $scope.selectedAll;
                        $scope.student_id.push(student.id); 
                    });
                } else {
                    $scope.selectedAll = false;
                    $scope.student_id.length = 0;
                    $scope.active_chk = ''; 
                }
                console.log($scope.student_id);
            },100);
        }
    };
    
    
    $rootScope.submit_frm_add = function(add_fields, button_pressed){
        
        if(form_valid('#frmAdd',"help-block")){
            $rootScope.add_fields.i_student_ids = $scope.student_id;
            if(button_pressed == 'New'){
                PaginationService.submit_add_form_data(GLOBAL.API_USER_URL+"fees/add", add_fields);
            } else {
                PaginationService.submit_add_form_data(GLOBAL.API_USER_URL+"fees/add", add_fields, '/fees');
            }
            $rootScope.success_msg = 'Record Added successfully';
            // To clear form elements
            setTimeout(function(){
                angular.element('.alert-success').fadeIn(1000);
                angular.element('.alert-success').fadeOut(2000);
                angular.element('.select2me').select2('val', '');
                angular.element('#cpassword').val('');
                angular.element('.alert').hide();
            },500);
        } else {           
            return false;
        }                
    }
    
    $scope.getTemplateContent = function(id){
        if(id != '' && id !== undefined)
        {
            var activityObj = $filter('filter')($rootScope.templates_list, function (d) {
                return d.id == id;
            })[0];
            $rootScope.add_fields.v_template_content = activityObj.v_template_content;   
        } else {
            $rootScope.add_fields.v_template_content = ''; 
        }
    }
    /* End add form */
    
});   
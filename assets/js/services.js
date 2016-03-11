var timeoutID;
app.factory('sessionService',['$http',function($http){
    return{
        set:function(key,value){
            return sessionStorage.setItem(key,value)
        },
        get:function(key){
            return sessionStorage.getItem(key)
        },
        destroy:function(key){
            return sessionStorage.removeItem(key);
        }
    }
}]);
/* End login services */

/* Begin pagination services */
app.service('PaginationService', function ($http, $rootScope, $location, $timeout, GLOBAL, mySharedService,$state, $cookieStore) {     
    $rootScope.url = '';
    $rootScope._meta = [];
    $rootScope.records = {};
    $rootScope.current_page = 1;
    //$rootScope.rec_per_page = GLOBAL.REC_PER_PAGE;
    $rootScope.rec_per_page = 5;
    $rootScope.last_page = '';
    $rootScope.order_field = '';
    $rootScope.sort_order = 'asc';
    $rootScope.search_fields = {};  
    $rootScope.data_loading = true;
    $rootScope.parent_items = {};
    $rootScope.updated_status = '';
    $rootScope.fields_reset = 0;
    $rootScope.reset_btn = false;
    $rootScope.user_permission = '';
    $rootScope.user_list = '';
    $rootScope.consignment_of_user = 'All User';
    $rootScope.batches_list = {};
    $rootScope.subjects_list = {};
    $rootScope.template_list = {};
    $rootScope.student_list = {};
    $rootScope.schools_list = {};
    
    //$rootScope.pageRefreshFlag = 1;

    this.loading = function(url, order_field, sort_order) { 
        $rootScope.url = url;
        $rootScope.order_field = order_field;
        if(sort_order !== undefined){
            $rootScope.sort_order = sort_order;
        } else {
            $rootScope.sort_order = 'asc';
        }
        $rootScope.fields = ''; // reset search field
        var currentUrl = $state.current.name; 
        if(currentUrl == '/consignments-new'){
            $rootScope.fields = $rootScope.search_fields;   
        }
        load_data();        
    };   
       
    var load_data = function() {
        $rootScope.data_loading = true; 
        clearTimeout(timeOut);
        timeOut = setTimeout(function() {
            var responsePromise = $http.post($rootScope.url,{'page':$rootScope.current_page,'rec_per_page':$rootScope.rec_per_page,'order_field':$rootScope.order_field,'sort_order':$rootScope.sort_order,'search_fields':$rootScope.fields});
            responsePromise.then(function(results){
                if(results.data == "" || results.data == undefined)
                {
                    GLOBAL.checkId = false;
                    GLOBAL.checkUserId = false;
                    $cookieStore.remove('isLogged');
                    $cookieStore.remove('isUserLogged');
                    $state.go('/');
                }
                $rootScope.items = results.data.items;
                $rootScope.data_items = results.data.items;
                $rootScope.parent_items = results.data.parent_items; 
                if($state.current.data.currTab == 'information_boxes')
                {
                     CKEDITOR.instances = { };
                    if($("#cke_faq_content_editor_edit").length > 0)
                        $("#cke_faq_content_editor_edit").remove();
                    CKEDITOR.replace('projectagram_content_editor_add');
                    CKEDITOR.replace('projectagram_work_content_editor_add');
                    
                    $('#img_preview').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_image1);
                    $('#img_preview1').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_image2);
                    $('#img_preview2').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_image3);
                }
                if($state.current.data.currTab == 'banner_settings')
                {
                    $('#img_preview').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_b_image);
                    $('#img_preview1').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_p_image);
                }
                if($state.current.data.currTab == 'general_settings')
                {
                    $('#img_preview').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_logo);
                   
                }
                if(results.data.access_page != undefined)
                {
                    angular.element(".dropzone .tools .btn-cancel").trigger("click");
                    angular.element('.dropzone').html5imageupload( { image: GLOBAL.SITE_URL+'images/'+$rootScope.items.v_image, height: '272px', width: '300px', editstart: true } );
                    angular.element("#h_v_img").val($rootScope.items.v_image); 
                    angular.element("#frm_v_img").prependTo("#upload_background_image_edit"); 
                }
                if(results.data.batches_list !== undefined)
                {
                    $rootScope.batches_list = results.data.batches_list;
                }
                if(results.data.subjects_list !== undefined)
                {
                    $rootScope.subjects_list = results.data.subjects_list;
                }
                if(results.data.template_list !== undefined)
                {
                    $rootScope.template_list = results.data.template_list;
                } 
                if(results.data.student_list !== undefined)
                {
                    $rootScope.student_list = results.data.student_list;
                }
                if(results.data.schools_list !== undefined)
                {
                    $rootScope.schools_list = results.data.schools_list;
                } 
               
                if(results.data._meta != undefined)
                {
                    $rootScope._meta = results.data._meta;
                    $rootScope.total = $rootScope._meta.total;
                    $rootScope.last_page = $rootScope._meta.last_page;
                    $rootScope.current_page = $rootScope._meta.current;
                    $rootScope.rpp = $rootScope._meta.rpp;         
                    $rootScope.count_from = parseInt($rootScope.rpp*($rootScope.current_page-1))+1;
                    $rootScope.count_to = (parseInt($rootScope.count_from)+$rootScope.rpp)-1;
                    //$rootScope.rec_per_page = 10;   
                    if(!$rootScope.$$phase) {
                      $rootScope.$apply(); 
                    }

                }
                $rootScope.data_loading = false;
                
                if($rootScope.count_to > $rootScope.total){
                    $rootScope.count_to = $rootScope.total;
                }  
                if( $rootScope.pageRefreshFlag == 1) {                    
                    $timeout(function() { angular.element('#reset-paging').trigger('click'); $rootScope.pageRefreshFlag = 0; }, 1);
                }
                
                //angular.element("a#reset-paging").click();
                setTimeout(function(){
                Metronic.init(); // Run metronic theme
                //Layout.init(); // init current layout
                QuickSidebar.init(); // init quick sidebar
                Demo.init(); // init demo features      
                FormValidation.init(); 
                Metronic.initComponents(); // init core components      
                Custom.init(); // for Custome script fumction
                ComponentsPickers.init();
                },100);
                                                                                     
            }, function(results){
                console.log("Error: " + results.data + "; " + results.status);                      
            });
        },500);
    }

    $rootScope.DoCtrlPagingAct = function(text, page){
        $rootScope.set_current_page(page);
        $rootScope.pageRefreshFlag = 0;
    };
    $rootScope.set_current_page = function($page) {
        $rootScope.current_page = $page;
        load_data();
    }
    $rootScope.order_by_name = function($order_field) {
        $rootScope.sort_order = $rootScope.sort_order === 'asc' ? 'desc' : 'asc';
        $rootScope.order_field = $order_field;        
        load_data();        
    }
    $rootScope.filter_data = function(fields) {
        
        if(fields != undefined )
        {
            
            /* angular.forEach(fields, function(value,key){
                if (value === "" || value === null){
                    delete fields[key];
                }
            });*/
             
             if( $.isEmptyObject(fields) != true || $rootScope.reset_btn == true)
            {
                $rootScope.current_page = 1;
                $rootScope.fields = fields;
                $rootScope.pageRefreshFlag = 1;
                $rootScope.fields_reset = 1; 
                $rootScope.reset_btn = false;
                load_data();
            }
        }
         
    } 
    $rootScope.change_record_size = function($page_size) {
        $rootScope.rec_per_page = $page_size;
        $rootScope.page = 1;
        $rootScope.current_page = 1;
        //$rootScope.check_all(false,false);
        load_data();
    }
    
    $rootScope.filterClear = function() {

        if($rootScope.fields_reset == 1 )
        {
            $rootScope.reset_btn = true;
            angular.copy({},$rootScope.fields);
            $rootScope.filter_data($rootScope.fields);
            $rootScope.fields_reset = 0;
           
        }
    }     
    
    this.submit_add_form_data = function(url, serial_data, redirect_state) 
    {
        $("#validation_error").html('');
        $(".duplicate_error").hide();
        $http.post(url, serial_data).success(function(data, status, headers, config) {
            if(angular.element.trim(data) == 'TRUE'){
                angular.copy({}, $rootScope.add_fields);
                angular.element('.alert-success').show();
                 $rootScope.success_msg = 'Added successfully';
                if(redirect_state != "" && redirect_state != undefined){
                    $("#frm_add_msg").hide();
                    $state.go(redirect_state);
                    $timeout(function(){
                        angular.element('.alert-success').fadeIn(1000);
                        angular.element('.alert-success').fadeOut(2000);
                        angular.element('.alert').hide();
                    },500);
                } else {
                    load_data("created_at");
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    // To clear form elements
                    setTimeout(function(){
                        //$rootScope.$apply();
                        angular.element('#cpassword').val('');
                        angular.element('.alert-success').fadeIn(1000);
                        angular.element('.alert-success').fadeOut(2000);
                        angular.element('.alert').hide();
                    },500); 
                }
                angular.element('#addModal').modal('hide');       
            } 
            else 
            {
                setTimeout(function()
                {
                    if(data == "" || data == undefined)
                    {
                        GLOBAL.checkId = false;
                        GLOBAL.checkUserId = false;
                        $cookieStore.remove('isLogged');
                        $cookieStore.remove('isUserLogged');
                        $state.go('/');
                    }
                    if(angular.element.trim(data) != 'FALSE') {
                        angular.element("#validation_error").html('You have some form errors. Please check below.');
                        angular.forEach(data, function (value, key) {
                            console.log("#"+key+"_duplicate_error");
                            console.log(angular.element("#"+key+"_duplicate_error").parents('.form-group'));
                            angular.element("#"+key+"_duplicate_error").parents('.form-group').addClass('has-error');
                            angular.element("#"+key+"_duplicate_error").show();    
                        });
                    } else {
                        angular.element("#validation_error").html('You have some form errors. Please check below.');   
                    }
                    if($("#submit_loader").length > 0) {
                        $("#submit_loader").hide();
                    }
                    $("html, body").animate({ scrollTop: 0 }, "slow"); 
                    angular.element('.alert-danger').show();
                    angular.element('.alert-success').hide();
                },500);
            }
        });
    }
    
    this.submit_edit_form_data = function(url, serial_data, redirect_state) {
        $http.post(url, serial_data).success(function(data, status, headers, config) {
            //console.log(angular.element.trim(data));
            if(angular.element.trim(data) == 'TRUE'){
                angular.copy({}, $rootScope.edit_fields);
                angular.element('.alert-success').show();
                if(redirect_state != "" && redirect_state != undefined)
                {
                    $state.go(redirect_state);
                }
                else
                {
                    load_data(); 
                }
                angular.element('#editModal').modal('hide');       
            } else 
            {
                setTimeout(function()
                {
                    if(data == "" || data == undefined)
                    {
                        GLOBAL.checkId = false;
                        GLOBAL.checkUserId = false;
                        $cookieStore.remove('isLogged');
                        $cookieStore.remove('isUserLogged');
                        $state.go('/');
                    }
                    if($(angular.element.trim(data) != 'FALSE'))
                    {
                        angular.element("#validation_error").show();
                        angular.element("#validation_error").html('You have some form errors. Please check below.');
                        angular.forEach(data, function (value, key) {
                            console.log("#"+key+"_duplicate_error");
                            console.log(angular.element("#"+key+"_duplicate_error").parents('.form-group'));
                            angular.element("#"+key+"_duplicate_error").parents('.form-group').addClass('has-error');
                            angular.element("#"+key+"_duplicate_error").show();    
                        });
                    }
                    else
                    {
                        $("#validation_error").html('You have some form errors. Please check below.');   
                    }
                    if($("#submit_loader").length > 0)
                    {
                        $("#submit_loader").hide();
                    }
                },500);
            }
        });
    }
    this.delete_data = function(url, id)
    {
        $http.post(url, {id:id}).success(function(data, status, headers, config) {
            if(angular.element.trim(data) == 'TRUE'){
                if($rootScope.total > $rootScope.rpp)
                {
                    load_data();   
                } 
            } else {
                load_data();
                angular.element('.alert-success').hide();
            }
        });
    }
    
    this.change_active_inactive = function(url, id, status) {
        clearTimeout(timeoutID);
		timeoutID = setTimeout(function() {
            if(status == 'Active'){
                $rootScope.updated_status = 'Inactive';
            } else {
                $rootScope.updated_status = 'Active';
            }
            $http.post(url, { 'id': id, 'status': $rootScope.updated_status }).success(function(data, status, headers, config) {
                if(angular.element.trim(data) == 'TRUE'){
                    if($rootScope.updated_status == 'Active'){
                        angular.element("tr#tablerow" + id).effect("highlight", {
        					color: '#E5FFCE'
        				}, 2000);
                     $rootScope.success_msg = 'Record Activated successfully';   
                    setTimeout(function(){
                        $rootScope.$apply();
                        angular.element('.alert-success').fadeIn(500);
                        angular.element('.alert-success').fadeOut(3000);
                    },500);
                    } else {
                        angular.element("tr#tablerow" + id).effect("highlight", {
        					color: '#FFE0E0'
        				}, 2000);
                        $rootScope.success_msg = 'Record Inactivated successfully';
                        setTimeout(function(){
                            $rootScope.$apply();
                            angular.element('.alert-success').fadeIn(500);
                            angular.element('.alert-success').fadeOut(3000);
                        },500);
                    }
                }
            });
        }, 1000);
    }
    
    this.change_yes_no = function(url, id, status) {
        if(status == 'Yes'){
            $rootScope.updated_status = 'No';
        } else {
            $rootScope.updated_status = 'Yes';
        }
        $http.post(url, { 'id': id, 'status': $rootScope.updated_status }).success(function(data, status, headers, config) {
            if(angular.element.trim(data) == 'TRUE'){
                if($rootScope.updated_status == 'Yes'){
                    angular.element("tr#tablerow" + id).effect("highlight", {
    					color: '#E5FFCE'
    				}, 2000);
                } else {
                    angular.element("tr#tablerow" + id).effect("highlight", {
    					color: '#FFE0E0'
    				}, 2000);
                }
            }
        });
    }
    
});
 
function parseVideo(url) {
    // - Supported YouTube URL formats:
    //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
    //   - http://youtu.be/My2FRPA3Gf8
    //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
    // - Supported Vimeo URL formats:
    //   - http://vimeo.com/25451551
    //   - http://player.vimeo.com/video/25451551
    // - Also supports relative URLs:
    //   - //player.vimeo.com/video/25451551

    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

    if (RegExp.$3.indexOf('youtu') > -1) {
        var type = 'youtube';
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
        var type = 'vimeo';
    }
    
    if(type == 'youtube')
    {
        return {
            type: type,
            id: RegExp.$6
        };
    }
    else
    {
        url.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);

        return {
            type: type,
            id: RegExp.$3
        };
    }
}
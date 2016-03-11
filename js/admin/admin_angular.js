var timeOut;
var addNew = false;
var MESSAGE_TIMOUT = '5000';
var $cms_pages = '';
var $simple_users = '';

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
.directive('url', function ($compile) { //directive to convert text into html
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.url, function(url_data) {
        ele.html(url_data);
        $compile(ele.contents())(scope);
      });
    }
  };
})
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$eval(attrs.ngEnter);
                event.preventDefault();
            }
        });
    };
})
.directive('compile', ['$compile', function ($compile) {
  return function(scope, element, attrs) {
    scope.$watch(
      function(scope) {
        return scope.$eval(attrs.compile);
      },
      function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      }
   )};
  }])
  .factory('filerAPI', function() {
    return {
        status: null,
        message: null,
        filter_data: function() {
        }
    }
})
.filter('split', function() {
  return function(input, delimiter) {
    if(input){
    delimiter = delimiter || ','
    return input.split(delimiter);
    }
  }
})
.controller('PaginationCtrl', function($scope, $http, $timeout, filerAPI , $sce) {
    $scope.currency = "R";
    $scope.records = {};
    $scope.email_templet = {};
    $scope.customer_list = {};
    $scope.current_page = 1;
    $scope.per_page = 10;
    $scope.order_field = '';
    $scope.sort_order = 'asc';
    $scope.page_load_url = '';
    $scope.delete_url = '';
    $scope.edit_data = '';
    $scope.ApplicantRow = {};
    $scope.search_fields = {};
    $scope.select = {};
    $scope.master = {};
    $scope.selection = 'home';
    $scope.button_show = false; 
    $scope.htmlString = '';    
    $scope.arr_record_status = [
      {opt_val:'act', show_val:'Active Selected'},
      {opt_val:'inact', show_val:'Inactive Selected'},
      {opt_val:'del', show_val:'Delete Selected'}
    ];
    $scope.arr_record_status1 = [
      {opt_val:'del', show_val:'Delete Selected'}
    ];
    $scope.selected_record = {};
    $scope.checkAll = {};
    $scope.htmlStringEmail = '';
    $scope.email_ids = [];
    $scope.page_load_data = true; // hidding table block
    $scope.page_add_data = true;  // hidding add block
    $scope.page_edit_data = true; // hidding edit block
    $scope.page_view_data = true; // hidding view detail block
    $scope.page_loading_bar = false;
    $scope.search_form = false;
    $scope.toTime = toTime;
    $scope.date = new Date();
    $scope.return_cms_id = 0;
    $scope.cms_pages = $cms_pages;
    $scope.simple_users = $simple_users;
    $scope.sub_continue = 0;
    $scope.total_amount_received = 0;
    $scope.total_kzn_paid = 0;
    
    $scope.DoCtrlPagingAct = function(text, page){
        $scope.set_current_page(page);
    };

    $scope.init = function(event){
        if(event=='load_data') {
            $scope.load_data();
        }
    }
    $scope.toggle_logon_form = function(selection){
        alert(selection);
        $scope.selection = selection;
    }
    $timeout(function(){
        $scope.login_inner_error = false;
        $('.flash-inner-error').remove();
    }, 4000);
    $scope.load_data = function() {
        oldHeader = $http.defaults.headers.post['Content-Type'];
        $http.defaults.headers.post['Content-Type'] = 'application/json';
        clearTimeout(timeOut);
        timeOut = setTimeout(function() {
            var responsePromise = $http.post($scope.page_load_url+'/list-ajax',{'page':$scope.current_page,'rec_per_page':$scope.per_page,'order_field':$scope.order_field,'sort_order':$scope.sort_order,'search_fields':$scope.fields});
            responsePromise.success(function(data, status, headers, config) {
                if($scope.refresh_pagination == 1){
                    $timeout(function(){
                        $("#reset_pagination").trigger('click');    
                    },1); 
                }
                if(data['amountReceivedTotal'] !== undefined && data['kznPaidTotal'] !== undefined){
                    $scope.amountReceivedTotal = data['amountReceivedTotal'];
                    $scope.kznPaidTotal = data['kznPaidTotal'];
                }
                
                if(data['total_amount_received'] !== undefined){
                    $scope.total_amount_received = data['total_amount_received'];
                }
                if(data['total_kzn_paid'] !== undefined){
                    $scope.total_kzn_paid = data['total_kzn_paid'];
                }
                $scope.bigCurrentPage = 1;
                $scope.records = data['page_data'];
                $scope.customer_list = data['customer_list'];
                $scope.package_list = data['package_list'];
                $scope.email_templet = data['email_templet'];
                $scope.total = data['pagination']['total'];
                $scope.from_page = data['pagination']['from'];
                $scope.to_page = data['pagination']['to'];
                $scope.current_page = data['pagination']['current_page'];
                $scope.page_size = data['pagination']['per_page'];
                $scope.maxSize = SHOW_NUM_PAGE_LINK;
                $scope.bigCurrentPage = data['pagination']['current_page'];                                
                $scope.refresh_pagination = 0;
                $scope.page_add_data = true; 
                $scope.search_form = false;
                $scope.page_load_data = false; // showing page data block
                $scope.page_edit_data = true; // hidding edit block
                $scope.page_view_data = true; // hidding view record detail
                $scope.page_loading_bar = true; // hidding loading bar block
                $scope.html_entity = '&quot;12.10 On-Going Submission of &quot;&quot;Made Up&quot;&quot; Samples.&quot;';
                $timeout(function () { 
                            $("body input[type='radio']").uniform();
                        },200);  
                $scope.reset = function() {
                    $scope.test = "";
                    $timeout(jQuery.uniform.update, 0);
                  };
                  $scope.check_all(false,true);
                  $scope.sub_continue = 0;             
                               
            });
            responsePromise.error(function(data, status, headers, config) {
                //alert("AJAX failed!");
            }); 
        }, 500);
    }
    $scope.set_section = function(section_name,add_url,delete_url,edit_url,view_url,change_record_status_url,bulk_action_url,order_field){
        $scope.order_field = order_field;
        $scope.page_load_url = ADMIN_URL+section_name;
        $scope.add_record = ADMIN_URL+add_url;
        $scope.delete_record = ADMIN_URL+delete_url;
        $scope.change_record_status_url = ADMIN_URL+change_record_status_url;
        $scope.bulk_action_url = ADMIN_URL+bulk_action_url;
        $scope.edit_url = ADMIN_URL+edit_url;
        $scope.view_url = ADMIN_URL+view_url;
    }
    $scope.order_by_name = function($order_field) {
        oldHeader = $http.defaults.headers.post['Content-Type'];
        $http.defaults.headers.post['Content-Type'] = 'application/json';
        $scope.sort_order = $scope.sort_order === 'asc' ? 'desc' : 'asc';
        $scope.order_field = $order_field;
        $scope.load_data();
    }
    $scope.change_record_size = function($page_size) {
        $scope.per_page = $page_size;
        $scope.page = 1;// $scope.current_page;
        $scope.bigCurrentPage = 1;
        $scope.current_page = 1;
        $scope.check_all(false,false);
        $scope.load_data();
    }
    $scope.filter_data = function() {
        $scope.refresh_pagination = 1;
        //filerAPI.filter_data();
        $scope.page = 1;                        
        $scope.current_page = 1;
        $scope.page = 1;
        $scope.bigCurrentPage = 1;
        $scope.load_data();
    }
    $scope.show_all_data = function() {
        $scope.refresh_pagination = 1;
        $scope.fields = {}; // clearing textbox values or selection 
        $scope.load_data();
    }
    $scope.show_all_data_subscription = function() {
        $scope.refresh_pagination = 1;
        angular.forEach($scope.fields , function(value,key){
            if(key != "d_start_date" && key != "d_expiry_date")
            {
                var yis = "ok";                
            }
            if(yis == "ok")
            {
                $scope.fields = {}; // clearing textbox values or selection 
            }
            if(key == "d_start_date" || key == "d_expiry_date")
            {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!
            
                var yyyy = today.getFullYear();
                if(dd<10){
                    dd='0'+dd
                } 
                if(mm<10){
                    mm='0'+mm
                } 
                var today = dd+'-'+mm+'-'+yyyy;
                $("#d_expiry_date_search").val(today);
                $("#d_start_date_search").val(today);
            }
        });
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
    
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var today = dd+'-'+mm+'-'+yyyy;
        if($scope.fields)
        {
            /*if($scope.fields.d_start_date === undefined)
            {*/
                $scope.fields.d_start_date = today;
                $scope.fields.d_expiry_date = today;
            //}
        }
        $scope.load_data();
    }
    $scope.set_current_page = function($page) {
        $scope.current_page = $page;
        $scope.load_data();
    }
    
    $scope.addFrm = function(form_id){
        
        if($('#CkEditor').length > 0 ){ CKEDITOR.instances.CkEditor.updateElement(); }
        if($('#CkEditor2').length > 0 ){ CKEDITOR.instances.CkEditor2.updateElement(); }
        $scope.checked = false;
        oldHeader = $http.defaults.headers.post['Content-Type'];
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        
        serial_data = $('#'+form_id).serialize(); 
      
        var url = ADMIN_URL+$('#'+form_id).attr('action');  
        if(form_valid('#'+form_id)){
            $http.post(url, serial_data).success(function(data, status, headers, config) {
                $timeout(function(){
                    angular.element("input[type='radio']").uniform();
                    angular.element("input[type='checkbox']").uniform();
                    $('#u_date').datepicker({ dateFormat: 'dd-mm-yy' }).val();
                },500); 
                if($.trim(data) == ""){
                    $("a#upload_img_url1").parent().hide();
                    $("a#upload_img_url1 img").attr('src' , '');
                    $('#'+form_id).each (function(){
                        this.reset();
                    });
                    if(addNew){
                        $('#'+form_id).each (function(){this.reset(); });
                        scroll_up_to('body');
                        addNew = false;
                    }else{
                        $http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
                        $scope.load_data();
                    }
                        $('.flash-msg').show();
                    
                        $scope.html = ADD_SUCCESS;
                        if($('#CkEditor').length > 0 ){ CKEDITOR.instances.CkEditor.setData(''); } 
                        if($('#CkEditor2').length > 0 ){ CKEDITOR.instances.CkEditor2.setData(''); } 
                    
                    setTimeout(function(){ $(".flash-msg").fadeOut('slow');},MESSAGE_TIMOUT); // hidding message after n seconds
                }else{
                    if(data == 'Name Already Exists.'){
                         $('.duplicate_name_error').html('<label class="error-inner">'+data+'.</label>');
                         scroll_up_to('.duplicate_name_error');
                    }
                    else if(data == 'Link Already Exists.'){
                        $('.duplicate_link_error').html('<label class="error-inner">'+data+'.</label>');
                         scroll_up_to('.duplicate_link_error');
                    }
                    else if(data == 'Email id already exists'){
                        $('.duplicate_email_error').html('<label class="error-inner">'+data+'.</label>');
                         scroll_up_to('.duplicate_email_error');
                    }
                    else if(data == 'Customer Number already exists'){
                        $('.duplicate_number_error').html('<label class="error-inner">'+data+'.</label>');
                         scroll_up_to('.duplicate_number_error');
                         return false;
                    }
                    else if(data == 'Banner for this cms page already exists'){
                        $('.duplicate_name_error').html('<label class="error-inner">'+data+'.</label>');
                         scroll_up_to('.duplicate_name_error');
                         return false;
                    }
                    else if(data == 'Invalid Smartcard number'){
                        $('.invalid_smartcard_error').html('<label class="error-inner">'+data+'.</label>');
                         scroll_up_to('.invalid_smartcard_error');
                         return false;
                    }
                    else if(data == 'Invalid Serial number'){
                        $('.invalid_serial_error').html('<label class="error-inner">'+data+'.</label>');
                         scroll_up_to('.invalid_serial_error');
                         return false;
                    }
                    else if(data == 'Please enter any one field'){
                        $('.invalid_serial_error').html('<label class="error-inner">'+data+'.</label>');
                         scroll_up_to('.invalid_serial_error');
                         return false;
                    }
                    else if(data == 'Invalid Smartcard and Serial number'){
                        $('.invalid_serial_error').html('<label class="error-inner">'+data+'.</label>');
                         scroll_up_to('.invalid_serial_error');
                         return false;
                    }
                    else if(data == 'Insufficient balance'){
                        $('.amount_remainig_error').html('<label class="error-inner">'+data+'.</label>');
                         scroll_up_to('.amount_remainig_error');
                         return false;
                    }
                    else if(data == 'open_popup'){
                        $scope.sub_continue = 1;
                        $scope.sub_smart_data = 0;
                        $('#'+form_id+" .sub_continue").each (function(){this.reset(); }); 
                    }
                }
            });               
        } else {
            return false;
        }
    }
    
    $scope.addNewFrm = function(form_id){
        addNew = true;
        $scope.addFrm(form_id);
    }     
    
    $scope.edit_record = function($data) 
    {
        $scope.url_data = $data['v_url'];
        $.getScript( ASSET_URL+'js/admin/upload_script.js', function() { });
        $("a#upload_img_url1 img").attr('src' , SITE_URL+"files/banner/"+$data['v_image']);
        
        if($('#v_cms_content').length > 0 ){CKEDITOR.instances.v_cms_content.updateElement(); CKEDITOR.instances.v_cms_content.setData($data['v_cms_content']);}  
        
        if($data['v_answer'])
        {
          if($('#CkEditor').length > 0 ){CKEDITOR.instances.CkEditor.updateElement(); CKEDITOR.instances.CkEditor.setData($data['v_answer']);}  
        } 
        if($('#CkEditor2').length > 0 ){CKEDITOR.instances.CkEditor2.updateElement(); CKEDITOR.instances.CkEditor2.setData($data['v_news_content']);}
        $scope.edit_value= $data;
        $scope.return_cms_id = $data['i_cms_id'];
        $scope.page_load_data = true; // hdding page data block
        $scope.page_edit_data = false; // showing edit block
        $scope.page_view_data = true; // hidding view record detail
        $scope.search_form = true;     
    }
    
    /*$scope.editFrm = function(form_id){
        $scope.addFrm(form_id);
        if($('#vCkEditor').length > 0 ){ CKEDITOR.instances.vCkEditor.updateElement(); }
        if($('#vCkEditor2').length > 0 ){ CKEDITOR.instances.vCkEditor2.updateElement(); }
    }*/
    
     $scope.editFrm = function(form_id){
        $scope.checked = false;
        if($('#CkEditor').length > 0 ){ CKEDITOR.instances.CkEditor.updateElement(); }
        if($('#CkEditor2').length > 0 ){ CKEDITOR.instances.CkEditor2.updateElement(); }
        var data = $('#frmEdit').serialize(); 
        var array = [];
        oldHeader = $http.defaults.headers.post['Content-Type'];
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        if(form_valid('#frmEdit')){
        clearTimeout(timeOut);
                timeOut = setTimeout(function() 
                {
                    var url = ADMIN_URL+$('#frmEdit').attr('action');
                    var responsePromise = $http.post(url, data);
                        responsePromise.success(function(data, status1, headers, config) {
                            if($.trim(data) == ''){
                                $('#frmEdit').each (function(){
                                    this.reset();
                                    $(".error-inner").html('');
                                });
                                $timeout(function () { 
                                    $("body input[type='radio']").uniform();
                                }, 2000);
                                
                                   $scope.load_data();
                                   $('.flash-msg').show();
                                   $scope.html = 'Record updated successfully.';
                                   setTimeout(function(){ $(".flash-msg").fadeOut('slow');$scope.html = "";  },MESSAGE_TIMOUT); // hidding message after n seconds    
                            }
                            else{
                                if(data == 'Name Already Exists.'){
                                     $('.duplicate_name_error').html('<label class="error-inner">'+data+'.</label>');
                                     scroll_up_to('.duplicate_name_error');
                                }
                                if(data == 'Cms Title already exists'){
                                     $('.duplicate_name_error').html('<label class="error-inner">'+data+'.</label>');
                                     scroll_up_to('.duplicate_name_error');
                                }
                                else if(data == 'Url Already Exists'){
                                    $('.duplicate_link_error').html('<label class="error-inner">'+data+'.</label>');
                                     scroll_up_to('.duplicate_link_error');
                                }
                                else if(data == 'Email id already exists'){
                                    $('.duplicate_email_error').html('<label class="error-inner">'+data+'.</label>');
                                     scroll_up_to('.duplicate_email_error');
                                     return false;
                                }
                                else if(data == 'Customer Number already exists'){
                                    $('.duplicate_number_error').html('<label class="error-inner">'+data+'.</label>');
                                     scroll_up_to('.duplicate_number_error');
                                     return false;
                                }
                                else if(data == 'Banner for this cms page already exists'){
                                    $('.duplicate_name_error').html('<label class="error-inner">'+data+'.</label>');
                                     scroll_up_to('.duplicate_name_error');
                                     return false;
                                }             
                           }
                    });
                }, 500);
        }else{
            return false;
        }
    }   
    $scope.delete_records = function($id, $cur_record_data ,$banner) { // function to delete record
        oldHeader = $http.defaults.headers.post['Content-Type'];
        $http.defaults.headers.post['Content-Type'] = 'application/json';
       if($id != '')
        {
            clearTimeout(timeOut);
                timeOut = setTimeout(function() 
                {
                    if(confirm("Are you sure you want to delete this record?")) 
                    {
                        var responsePromise = $http.post($scope.delete_record,{'id':$id});
                        responsePromise.success(function(data, status, headers, config) {
                            var index = $scope.records.indexOf($cur_record_data);
                            $scope.records.splice(index,1);  // removing current object from json array
                            $scope.amountTotal = 0;
                            $scope.kznTotal = 0;
                            $($scope.records).each(function(index, value) {
                                $scope.amountTotal = parseFloat($scope.amountTotal) + parseFloat(value['f_amount_received']);
                                $scope.kznTotal = parseFloat($scope.kznTotal) + parseFloat(value['f_kzn_paid']);
                            });
                            $scope.amountReceivedTotal = $scope.amountTotal;
                            $scope.kznPaidTotal = $scope.kznTotal;
                            $timeout(function() {
                                $scope.ApplicantRow[$id] = true;
                            }); // Can customise time   
                            $('.flash-msg').show();
                            $scope.html  = 'Record deleted successfully.';
                            $scope.bigCurrentPage = 1;
                            $scope.refresh_pagination = 1;
                            setTimeout(function(){ $(".flash-msg").fadeOut('slow');$scope.html = "";  },MESSAGE_TIMOUT);  // hidding message after n seconds
                            if($scope.records.length ==0 || $banner) // if last record then loading data again
                            {
                                $scope.load_data();    
                            } 
                        });
                    }
            }, 500);
        }
    }
    
    
    $scope.back_listing = function($id) {
        //console.log("hi");
        if($scope.page_edit_data == false) // if user is currently on edit block then show the warning message
        {
            if(!confirm('Updated information will discarded. Are you sure you want to continue?')) {
                return false;
            }
            else {
                $("#frmEdit").each(function(){
                this.reset();
                $(".error-inner").html('');
            });  
            }
        }
        $scope.page_load_data = false; 
        $scope.page_edit_data = true; // hidding edit block
        $scope.page_view_data = true; // hidding view detail block
        $scope.search_form = false;
        $scope.page_add_data = true;
        
        if($("#frmAdd").length > 0)
        {
            $("#frmAdd").each(function(){
                this.reset();
                $(".error-inner").html('');
            });
            $(".dropzone .tools .btn-cancel").trigger("click"); // reseting the uploaded image
            $scope.url_data = ''; //making url field null
            $("a#upload_img_url1").parent().hide();
            $("a#upload_img_url1 img").attr('src' , '');
        }
        $scope.load_data();
    }
    
    $scope.view_records = function(data) {
        var index = $scope.records.indexOf(data); // getting current index from json array
        $scope.view_data = data;
        $scope.page_load_data = true; // hdding page data block
        $scope.page_edit_data = true; // showing edit block
        $scope.page_view_data = false; // hidding view record detail
        $scope.prev_record = false;   
        $scope.nexts_record = false;
        $scope.search_form = true;
        $scope.html_entity = '&quot;12.10 On-Going Submission of &quot;&quot;Made Up&quot;&quot; Samples.&quot;';

        if($scope.records.length == 1) // record per page is 1 then hidding next and previous buttons
        {
            $scope.prev_record = true;   
            $scope.nexts_record = true;
        }
        if(index ==0) // if user on first record hidding the previous button
        {
            $scope.prev_record = true;   
        }
        if((index+1) == $scope.records.length) // if user on last record hidding next button
        {
            $scope.nexts_record = true;
        }
    }
    
   //function to show previous record on view record detail block
    $scope.previous_record = function(view_data) {
        var index = ( parseInt($scope.records.indexOf(view_data)) - 1); // getting current index from json array
        
        if(index >= 0)
        {
            angular.forEach($scope.records, function(value, key) {
                if(key == index)
                {
                    $scope.view_data = value;
                }
            });   
            if(index == 0) // if on first record hidding previous button
            {
                $scope.prev_record = true;
                $scope.nexts_record = false; 
            }
            else
            {
                $scope.prev_record = false;   
                $scope.nexts_record = false; 
            }
        }
    }
    //function to show next record on view record detail block
    $scope.next_record = function(view_data) {
        var index = ( parseInt($scope.records.indexOf(view_data)) + 1); // getting current index from json array
        
        if(index <= ($scope.records.length-1))
        {
            angular.forEach($scope.records, function(value, key) {
                if(key == index)
                {
                    $scope.view_data = value;
                }
            });   
            if(index == ($scope.records.length-1)) // if on last record hidding previous button
            {
                $scope.nexts_record = true;
                $scope.prev_record = false;   
            }
            else
            {
                $scope.nexts_record = false;  
                $scope.prev_record = false;    
            }
        } 
        
    }
    
    $scope.change_status = function($id,$status) {
        oldHeader = $http.defaults.headers.post['Content-Type'];
        $http.defaults.headers.post['Content-Type'] = 'application/json';
        if($id !='')
        {   
            if($status == 'Open'){
                message = 'open';
            } else if($status == 'Closed'){
                message = 'close';
            }
            else if($status == 'Active'){
                message = 'active';
            }
            else if($status == 'overdue'){
                message = 'close';
            }
            else{
                message = 'inactive';
            }
            clearTimeout(timeOut);
            timeOut = setTimeout(function() 
            {
                if(confirm("Are you sure that you want to "+message+" this record?")) 
                {
                        var change_record_status_url = $scope.change_record_status_url;
                        var responsePromise = $http.post(change_record_status_url,{'id':$id,'e_status':$status});
                            responsePromise.success(function(data, status1, headers, config) {
                                angular.forEach($scope.records, function(item){
                                    if(item.id == $id)
                                    {
                                        item.e_status = $.trim(data);
                                    }
                               });
                               $('.flash-msg').show();
                               $scope.html = 'Record '+message+' successfully.';
                               setTimeout(function(){ $(".flash-msg").fadeOut('slow');$scope.html = "";  },MESSAGE_TIMOUT); // hidding message after n seconds
                               if($status == 'overdue'){
                                    $scope.load_data();
                               }
                        });
                    }
            }, 100);
        }
    }
    
    $scope.bulk_actions_change = function($status) {
        oldHeader = $http.defaults.headers.post['Content-Type'];
        $http.defaults.headers.post['Content-Type'] = 'application/json';
       if($status == null ||  $status == '' || $status == undefined) /// if no action is selected then do nothing
       {
            return false;
       }
       $timeout(function () //setting timeout for update of element scope
       {   
           $scope.checkAll = false;
           $scope.check_count = 0;
           $scope.ids = [];
           angular.forEach($scope.selected_record, function(index,val){ // selected_record is ng-model name of checkbok
                if(index) // counting checked checkbox
                {
                    //$scope.ids[val] = val;
                    $scope.ids.push(val);
                    $scope.check_count++;
                }
           });  
           if($scope.check_count == 0)
           {
                alert("Please select checkbox(s).");
                angular.element(".bulk_actions").val('');
                return false;
           }
           else
           {
               if($status['opt_val'] =='act')
               {
                    massage = 'active';
                    status = 'Inactive';
               }
               if($status['opt_val'] =='inact')
               {
                    massage = 'inactive';
                    status = 'Active';
               }
               if($status['opt_val'] =='del')
               {
                    status = 'deleted';
                    massage = 'delete';
               }
               var row_count = 0;
               if(confirm('Are you sure you want to '+massage+' selected record(s)?')) {
                  var responsePromise = $http.post($scope.bulk_action_url,{'id':$scope.ids,'action':$status['opt_val']});
                   responsePromise.success(function(data, status1, headers, config) {
                        angular.forEach($scope.records, function(val){ // selected_record is ng-model name of checkbok
                                if($scope.selected_record[val.id] == true)
                                {
                                    row_count = parseInt(row_count) + 1;
                                    val.e_status = $.trim(data);
                                    if(status =='deleted') // user choose action delete at that time hidding that rows from table
                                    {
                                        $scope.ApplicantRow[val.id] = true;
                                    }
                                    $scope.selected_record[val.id] = false;
                                }
                        });
                        $scope.refresh_pagination = 1;
                        if($status['opt_val'] =='del')
                        {       
                            $scope.load_data();
                        }
                        $scope.check_all(false,true);
                        $('.flash-msg').show();
                        $scope.html = 'Record(s) '+massage+' successfully.';
                        $timeout(function () { $scope.html = "";  }, MESSAGE_TIMOUT); // hidding message after n seconds
                        
                        $('#recordListForm').each (function(){this.reset(); });
                   });
               }
               else
               {
                    angular.element(".bulk_actions").val('');
                    $scope.check_all(false,true);
               }
            }
        });
    }
    
    $scope.check_all = function(checkAll,parent) { 
        $timeout(function () { 
            angular.forEach($scope.records , function(data){
                $scope.selected_record[data.id] = checkAll; 
            });
            $scope.button_show = checkAll; 
            if(parent){
                $scope.selected_record[0] = false;
            }
        }, 10);
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
           if($scope.check_count == $scope.records.length)
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
  
    $scope.show_add_form = function() {
        setTimeout(function(){
            angular.element("body input[type='radio']").uniform();
            //intialise_datepicker();
        },1000);
        $scope.return_cms_id = 0;
        $scope.page_add_data = false;
        $scope.page_load_data = true; // hdding page data block
        $scope.page_edit_data = true; // showing edit block
        $scope.page_view_data = true; // hidding view record detail
        $scope.search_form = true;
        $("#frmAdd").length = 2;
        $scope.url_data = '';
        $scope.sub_smart_data = 1;
    }
    
    $scope.export_to_excel = function(url) {
        window.location.href = url+'?'+$("#frmSearchForm").serialize();
        return false;
    }
    
    $scope.close_popup = function() {
        $scope.check_all(false,true);
        $('#MailpopUpfrm').each (function(){
            this.reset();
            $("#chk_upgrade").prop('checked', false); 
            //$("#chk_upgrade").parent('span').removeClass('checked');
            //$(".subscription_date").hide();       
        });
        $('#recordListForm').each (function(){
            this.reset();         
        });
        $(".error-inner").html('');
        $('#myModal5').modal('hide');
    }
    
    function toTime(timeString){
        var timeTokens = timeString.split(':');
        return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
    }
    
    $scope.open_comment = function($data) {
        $("#myModal").css("display" , "block");
        $scope.record = $data;
    }
    
    $scope.close_comment = function() {
        $('#myModal').modal('hide');
    }
    
    $scope.submitMailPopUpfrm = function() {
        oldHeader = $http.defaults.headers.post['Content-Type'];
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        var data = $('#MailpopUpfrm').serialize();  
        var url = $('#MailpopUpfrm').attr('action');
        var f_amount_received = $('#f_amount_received').val();
        var f_kzn_paid = $('#f_kzn_paid').val();  
        var paidAmount = parseFloat(f_amount_received) + parseFloat(f_kzn_paid);
        var f_amount_remaining = parseFloat($('#f_kazang_amount').val()).toFixed(2) -  paidAmount.toFixed(2);
        var upgrade_section = $("#f_amount_due").length; // Popup Of Upgrade Amount Due
        if(form_valid('#MailpopUpfrm')){
            if(parseFloat(f_amount_remaining).toFixed(2) >= 0 || upgrade_section > 0)
            {
                clearTimeout(timeOut);
                timeOut = setTimeout(function() 
                {
                    var responsePromise = $http.post(url, data);
                    responsePromise.success(function(data, status1, headers, config) {
                    if($.trim(data) == ""){
                        $('#MailpopUpfrm').each (function(){
                            this.reset();
                        });
                        $scope.close_popup();
                        $scope.page_load_data = false;  
                        $scope.load_data();                                                                                              
                        $('.flash-msg').show();
                        $scope.html = 'Record Updated successfully.';
                        setTimeout(function(){ $(".flash-msg").fadeOut('slow');$scope.html = "";  },MESSAGE_TIMOUT); // hidding message after n seconds      
                       }
                    });
                }, 500);
            } else {
                $('.amount_remainig_error').html('<label class="error-inner">Insufficient balance.</label>');
                scroll_up_to('.amount_remainig_error');
                return false;
            }
        } else {
            return false;
        }
    }
    
    
    
    $scope.get_cms_page_url = function(){
        var url = $("#frmEdit #v_cms_title").val().toLocaleLowerCase().replace(/[^a-zA-Z0-9-_]/g,"-");
        $scope.url_data = url;
    }
    
    
    $scope.get_cms_page_url_2 = function(){
        var url = $("#frmEdit #v_url").val().toLocaleLowerCase().replace(/[^a-zA-Z0-9-_]/g,"-");
        $scope.url_data = url;
    }
    
    $scope.getCmsId = function(id){
        $(".error-inner").html('');
        $("#image_name4").val('');
        $scope.return_cms_id = id;
        if(id == 3)
        {
            
        }
        $.getScript( ASSET_URL+'js/admin/upload_script.js', function() { });
    }
    
    $scope.open_popup = function($data) {
    
        $scope.record = $data;
        $scope.checked = false;
        
        $("#city_state_hval").val($data['e_payment_method']);
        $("#city_state_val").val($data['i_package_id']);
        //$("#edit_u_date").datepicker();
        intialise_datepicker();
        $("#f_amount_remaining_hidden").val($data['f_amount_remaining']);
        $timeout(function()
        {
            //console.log(angular.element("body input[type='checked']").length);
            angular.element("#chk_upgrade").parent('span').removeClass('checked');
            var a = parseFloat($("#f_amount_received").val()).toFixed(2);
            var b = parseFloat($("#f_amount_remaining_hidden").val()).toFixed(2);
            var c = parseFloat($("#f_kzn_paid").val()).toFixed(2);
            var total_amount = +a + +b + +c;
            $("#f_kazang_amount").val(total_amount);
        },200);
        
        $timeout(function()
        {
            $(".not-selected").each(function()
            {
                $(this).parent().removeClass('checked');
                $(this).attr('checked',false);
            });
           $(".selected").each(function()
           {
                $(this).attr('checked',true);
                $(this).parent().addClass('checked');
           }); 
        },100); 
    }
    
    function scroll_up_to(selector){
    $('html, body').animate({
        scrollTop: (parseInt($(selector).offset().top,10) - 200)
    }, 500);  
}
 
}); 

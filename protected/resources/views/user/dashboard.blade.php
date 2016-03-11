<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js" data-ng-app="app-user"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js" data-ng-app="app-user"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en" data-ng-app="app-user">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>

<base href="{{ BASE_HREF_USER }}" />
<title data-ng-bind="$state.current.data.pageTitle + ' | {{ SITE_NAME }}'"></title>

<meta charset="utf-8"/>
<meta name="robots" content="noindex, nofollow" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<!--<meta content="width=device-width, initial-scale=1" name="viewport"/>-->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<meta content="" name="description"/>
<meta content="" name="author"/>

<!-- BEGIN GLOBAL MANDATORY STYLES -->
<!--<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>-->
<link href='http://fonts.googleapis.com/css?family=Oswald:400,300,700' rel='stylesheet' type='text/css'>
<link href="{{ ADMIN_ASSET_URL }}plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
<!-- BEGIN DYMANICLY LOADED CSS FILES(all plugin and page related styles must be loaded between GLOBAL and THEME css files ) -->
<link id="ng_load_plugins_before"/>
<!-- END DYMANICLY LOADED CSS FILES -->


<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}plugins/select2/select2.css"/>

<link rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.css"/>
<link rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}plugins/bootstrap-markdown/css/bootstrap-markdown.min.css" />
<link rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}plugins/bootstrap-datepicker/css/datepicker.css"/>
<link rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}plugins/bootstrap-datepicker/css/datepicker3.css"/>
<link rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css"/>
<link rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}plugins/bootstrap-fileinput/bootstrap-fileinput.css"/>

<link rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}plugins/bootstrap-daterangepicker/daterangepicker-bs3.css"/>
<link rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css"/>
<link ng-if="$state.current.data.currTab == 'campaign'" href="{{ ADMIN_ASSET_URL }}plugins/dropzone/css/dropzone.css?v={{ JS_CSS_VER }}" rel="stylesheet"/> 
<link ng-if="$state.current.data.currTab != 'campaign'" rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}css/demo.html5imageupload.css?v={{ JS_CSS_VER }}"/> 
<link rel="stylesheet" type="text/css" href="{{ ADMIN_ASSET_URL }}plugins/fancybox/source/jquery.fancybox.css?v=2.1.2" media="screen" />

<!-- END PAGE LEVEL STYLES -->
<!-- BEGIN THEME STYLES -->

<!-- DOC: To use 'rounded corners' style just load 'components-rounded.css' stylesheet instead of 'components.css' in the below style tag -->
<link href="{{ ADMIN_ASSET_URL }}css/components.css?v={{ JS_CSS_VER }}" id="style_components" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}css/plugins.css?v={{ JS_CSS_VER }}" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}css/layout.css?v={{ JS_CSS_VER }}" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}css/default.css?v={{ JS_CSS_VER }}" rel="stylesheet" type="text/css" id="style_color"/>
<link href="{{ ADMIN_ASSET_URL }}css/custom.css?v={{ JS_CSS_VER }}" rel="stylesheet" type="text/css"/>
<!-- END THEME STYLES -->

<link rel="shortcut icon" href="{{ SITE_URL }}img/favicon.ico"/>
<!-- To initialize constants in javascript -->
<script type="text/javascript">
	var objConstant = {};
    <?php 
    $constant_data = get_defined_constants(true);
    foreach($constant_data['user'] as $constant_key => $constant_value){
    	if($constant_key != "PHPEXCEL_ROOT")
    	{
    		$constant_key = str_replace('"', "'", $constant_key);
        	$constant_value = str_replace('"', "'", $constant_value);
    	
    ?>
    {{ $constant_key }} = "{{ $constant_value }}";
    objConstant["{{ $constant_key }}"] = "{{ $constant_value }}";
    
    <?php } } if(Auth::check()){ ?> objConstant["checkUserId"] = "true"; <?php }else{ ?> objConstant["checkUserId"] = "false"; <?php } ?>  
    
   <?php 
   $v_name = '';
   $v_image = '';
   if(Auth::check())
   {
        $current_user = Auth::user()->toArray();
        $v_name = $current_user['v_name'];
        $v_image =  SITE_URL.TEMP_IMG_PATH.'company-'.$current_user['v_encryption_id'].'/'.$current_user['v_company_logo'];
    
   }
   $current_user = Auth::user();
   ?>
    $v_name = "{{ $v_name }}";
    $v_image = "{{ $v_image }}";
    
   
</script>
	
</head>
<!-- END HEAD -->

<!-- BEGIN BODY -->
<!-- DOC: Apply "page-header-fixed-mobile" and "page-footer-fixed-mobile" class to body element to force fixed header or footer in mobile devices -->
<!-- DOC: Apply "page-sidebar-closed" class to the body and "page-sidebar-menu-closed" class to the sidebar menu element to hide the sidebar by default -->
<!-- DOC: Apply "page-sidebar-hide" class to the body to make the sidebar completely hidden on toggle -->
<!-- DOC: Apply "page-sidebar-closed-hide-logo" class to the body element to make the logo hidden on sidebar toggle -->
<!-- DOC: Apply "page-sidebar-hide" class to body element to completely hide the sidebar on sidebar toggle -->
<!-- DOC: Apply "page-sidebar-fixed" class to have fixed sidebar -->
<!-- DOC: Apply "page-footer-fixed" class to the body element to have fixed footer -->
<!-- DOC: Apply "page-sidebar-reversed" class to put the sidebar on the right side -->
<!-- DOC: Apply "page-full-width" class to the body element to have full width page without the sidebar menu -->
<body data-ng-controller="AppUserController" class="page-header-fixed page-sidebar-closed-hide-logo page-quick-sidebar-over-content page-on-load" ng-class="($state.current.data.setLoginClass) ? 'login' : ''">

    <input id="show_popup_success" value="{{Session::get('success-message')}}" readonly="readonly" type="hidden" />
    
	<!-- BEGIN PAGE SPINNER -->
	<div ng-spinner-bar class="page-spinner-bar">
		<div class="bounce1"></div>
		<div class="bounce2"></div>
		<div class="bounce3"></div>
	</div>
	<!-- END PAGE SPINNER -->

	<!-- BEGIN HEADER -->
	<div ng-if="!$state.current.data.setLoginClass" data-ng-include="'{{ ADMIN_ASSET_URL }}templates/partials/user/header.html'" data-ng-controller="HeaderController" class="page-header navbar navbar-fixed-top">
	</div>
	<!-- END HEADER -->

	<div class="clearfix">
	</div>

	<!-- BEGIN CONTAINER -->
	<div ng-class="($state.current.data.setLoginClass) ? '' : 'page-container'">
		<!-- BEGIN SIDEBAR -->
		<div ng-if="!$state.current.data.setLoginClass" data-ng-include="'{{ ADMIN_ASSET_URL }}templates/partials/user/sidebar.html'" data-ng-controller="SidebarController" class="page-sidebar-wrapper">			
		</div>
		<!-- END SIDEBAR -->

		<!-- BEGIN CONTENT -->
		<div ng-class="($state.current.data.setLoginClass) ? '' : 'page-content-wrapper'">
			<div ng-class="($state.current.data.setLoginClass) ? '' : 'page-content'">
				<div ng-if="!$state.current.data.pageTitle" data-ng-include="'{{ ADMIN_ASSET_URL }}templates/partials/user/page-head.html'" data-ng-controller="PageHeadController" ></div>	
				<!-- BEGIN ACTUAL CONTENT -->
				<div ui-view class="fade-in-up">
				</div> 
				<!-- END ACTUAL CONTENT -->
			</div>	
		</div>
		<!-- END CONTENT -->
		
		<!-- BEGIN QUICK SIDEBAR -->
		<a href="javascript:;" class="page-quick-sidebar-toggler"><i class="icon-close"></i></a>		
		<!-- END QUICK SIDEBAR -->
	</div>
	<!-- END CONTAINER -->

	<!-- BEGIN FOOTER -->
	<div ng-if="!$state.current.data.setLoginClass" class="page-footer">
		<div class="page-footer-inner">
			{{ date('Y') }} &copy; {{ SITE_NAME }}.
		</div>
        <div class="scroll-to-top">
			<i class="icon-arrow-up"></i>            
		</div>        
        <!-- a style="float: right;" href="javascript:void(0);" onclick="$zopim.livechat.window.show();"><img src="{{ ADMIN_ASSET_URL }}images/zoopim.png" /></a -->
	</div>
	<!-- END FOOTER -->

	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->

	<!-- BEGIN CORE JQUERY PLUGINS -->
	<!--[if lt IE 9]>
	<script src="{{ ADMIN_URL }}plugins/respond.min.js"></script>
	<script src="{{ ADMIN_URL }}plugins/excanvas.min.js"></script> 
	<![endif]-->
	<script src="{{ ADMIN_ASSET_URL }}plugins/jquery.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/jquery-migrate.min.js" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/jquery-ui/jquery-ui-1.10.3.custom.js" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/jquery.blockui.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/jquery.cokie.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>	
	<script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
    
    
	<!-- END CORE JQUERY PLUGINS -->

    <!-- BEGIN PAGE LEVEL PLUGINS -->
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/jquery-validation/js/jquery.validate.min.js?v={{ JS_CSS_VER }}"></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/jquery-validation/js/additional-methods.min.js"></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/select2/select2.min.js"></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/datatables/media/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js"></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js"></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/clockface/js/clockface.js"></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-daterangepicker/moment.min.js"></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-daterangepicker/daterangepicker.js"></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-wysihtml5/wysihtml5-0.3.0.js" type="text/javascript" ></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.js" type="text/javascript" ></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/ckeditor/ckeditor.js" type="text/javascript" ></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}/plugins/ckeditor/adapters/jquery.js"></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-markdown/js/bootstrap-markdown.js" type="text/javascript" ></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-markdown/lib/markdown.js" type="text/javascript" ></script>
    <script src="{{ ADMIN_ASSET_URL }}js/scripts/html5imageupload.min.js" type="text/javascript" ></script> 
    <script src="{{ ADMIN_ASSET_URL }}plugins/fancybox/source/jquery.fancybox.js?v=2.1.3" type="text/javascript" ></script>
    <script src="{{ SITE_URL }}js/jquery.fancybox-media.js?v={{ JS_CSS_VER }}" type="text/javascript" ></script>
    
    <!-- END PAGE LEVEL PLUGINS -->
    
	<!-- BEGIN CORE ANGULARJS PLUGINS -->
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular.js" type="text/javascript"></script>	
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-sanitize.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-touch.min.js" type="text/javascript"></script>	
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-route.min.js" type="text/javascript"></script>	
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-resource.min.js" type="text/javascript"></script>	
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-cookies.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/plugins/angular-ui-router.min.js" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/plugins/ocLazyLoad.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/plugins/ui-bootstrap-tpls.min.js" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}js/crop-angular/crop-image.js"></script>
    <!-- END CORE ANGULARJS PLUGINS -->
    
	<!-- BEGIN APP LEVEL JQUERY SCRIPTS -->
	<script src="{{ ADMIN_ASSET_URL }}scripts/metronic.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}scripts/layout.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}scripts/quick-sidebar.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}scripts/demo.js" type="text/javascript"></script>  
    <script src="{{ ADMIN_ASSET_URL }}scripts/datatable.js"></script>
    <script src="{{ ADMIN_ASSET_URL }}scripts/custom.js?v={{ JS_CSS_VER }}"></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/dropzone/dropzone.js?v={{ JS_CSS_VER }}"></script>
    <script src="{{ ADMIN_ASSET_URL }}scripts/form-dropzone.js?v={{ JS_CSS_VER }}"></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/bootbox/bootbox.min.js"></script>
    <script src="{{ ADMIN_ASSET_URL }}scripts/components-pickers.js"></script>
    <script src="{{ ADMIN_ASSET_URL }}scripts/form-validation.js?v={{ JS_CSS_VER }}"></script>
    <script src="{{ ADMIN_ASSET_URL }}plugins/flot/jquery.flot.min.js"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/flot/jquery.flot.resize.min.js"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/flot/jquery.flot.pie.min.js"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/flot/jquery.flot.stack.min.js"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/flot/jquery.flot.crosshair.min.js"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/flot/jquery.flot.categories.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/flot/jquery.flot.time.js" type="text/javascript"></script>
    <!-- END APP LEVEL JQUERY SCRIPTS -->
    <script type="text/javascript">
	    $(document).ready(function() {
	       show_popup_success = $("#show_popup_success").val();
            if(show_popup_success != "")
            {
                bootbox.alert(show_popup_success);
            }
	    });
	</script>
	<script type="text/javascript">
		/* Init Metronic's core jquery plugins and layout scripts */
		$(document).ready(function() {
            
            Metronic.setAssetsPath('{{ ADMIN_ASSET_URL }}'); // Set the assets folder path
                
            //Tasks.initDashboardWidget();
            
            /*$(document).on('click', 'input[type="checkbox"]', function(){
                if($(this).closest('span').hasClass('checked')){
                    $(this).closest('span').removeClass('checked');
                } else {
                    $(this).closest('span').addClass('checked');
                }
            });*/
		});
	</script>
    
    <!-- BEGIN APP LEVEL ANGULARJS SCRIPTS -->
	<script src="{{ ADMIN_ASSET_URL }}js/app_user.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}js/directives.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/services.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/UsersLoginController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/UsersDashboardController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/UsersAccountSettingController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/SchoolsController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/BatchesController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/SubjectsController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/StudentsController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/ExamsController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/AttendancesController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/MarksController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/NewsController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/controllers/users/FeesController.js?v={{ JS_CSS_VER }}" type="text/javascript"></script>
    <script src="{{ ADMIN_ASSET_URL }}js/custom_validation.js?v={{ JS_CSS_VER }}"></script>    
	<!-- END APP LEVEL ANGULARJS SCRIPTS -->
	<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>
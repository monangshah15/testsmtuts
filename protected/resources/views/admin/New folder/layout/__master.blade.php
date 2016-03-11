<!DOCTYPE html>

<!--[if IE 8]> <html lang="en" class="ie8 no-js" data-ng-app="MetronicApp"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js" data-ng-app="MetronicApp"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en" data-ng-app="app">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<base href="{{ BASE_HREF }}" />
<title data-ng-bind="$state.current.data.pageTitle + ' | ZealousWeb'"></title>

<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<meta content="" name="description"/>
<meta content="" name="author"/>

<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->

<!-- BEGIN DYMANICLY LOADED CSS FILES(all plugin and page related styles must be loaded between GLOBAL and THEME css files ) -->
<link id="ng_load_plugins_before"/>
<!-- END DYMANICLY LOADED CSS FILES -->

<!-- BEGIN THEME STYLES -->
<!-- DOC: To use 'rounded corners' style just load 'components-rounded.css' stylesheet instead of 'components.css' in the below style tag -->
<link href="{{ ADMIN_ASSET_URL }}css/components.css" id="style_components" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}css/plugins.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}css/layout.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}css/themes/darkblue.css" rel="stylesheet" type="text/css" id="style_color"/>
<link href="{{ ADMIN_ASSET_URL }}css/custom.css" rel="stylesheet" type="text/css"/>
<!-- END THEME STYLES -->

<link rel="shortcut icon" href="{{ SITE_URL }}img/favicon.ico"/>
<!-- To initialize constants in javascript -->
<script type="text/javascript">
    <?php 
    $constant_data = get_defined_constants(true);
    foreach($constant_data['user'] as $constant_key => $constant_value){ ?>
    {{ $constant_key }} = '{{ $constant_value }}';
    <?php } ?>    
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
<body ng-controller="AppController" class="page-header-fixed page-sidebar-closed-hide-logo page-quick-sidebar-over-content page-on-load" ng-class="{'page-container-bg-solid': settings.layout.pageBodySolid, 'page-sidebar-closed': settings.layout.pageSidebarClosed}">

	<!-- BEGIN PAGE SPINNER -->
	<div ng-spinner-bar class="page-spinner-bar">
		<div class="bounce1"></div>
		<div class="bounce2"></div>
		<div class="bounce3"></div>
	</div>
	<!-- END PAGE SPINNER -->

	<!-- BEGIN HEADER -->
	<div data-ng-include="'{{ ADMIN_ASSET_URL }}templates/partials/header.html'" data-ng-controller="HeaderController" class="page-header navbar navbar-fixed-top">
	</div>
	<!-- END HEADER -->

	<div class="clearfix">
	</div>

	<!-- BEGIN CONTAINER -->
	<div class="page-container">
		<!-- BEGIN SIDEBAR -->
		<div data-ng-include="'{{ ADMIN_ASSET_URL }}templates/partials/sidebar.html'" data-ng-controller="SidebarController" class="page-sidebar-wrapper">			
		</div>
		<!-- END SIDEBAR -->

		<!-- BEGIN CONTENT -->
		<div class="page-content-wrapper">
			<div class="page-content">
				<div data-ng-include="'{{ ADMIN_ASSET_URL }}templates/partials/page-head.html'" data-ng-controller="PageHeadController" >			
		        </div>	
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
	<div data-ng-include="'{{ ADMIN_ASSET_URL }}templates/partials/footer.html'" data-ng-controller="FooterController" class="page-footer">
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
	<script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/jquery.blockui.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/jquery.cokie.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>	
	<script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
	<!-- END CORE JQUERY PLUGINS -->

	<!-- BEGIN CORE ANGULARJS PLUGINS -->
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular.min.js" type="text/javascript"></script>	
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-sanitize.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-touch.min.js" type="text/javascript"></script>	
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/plugins/angular-ui-router.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/plugins/ocLazyLoad.min.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/plugins/ui-bootstrap-tpls.min.js" type="text/javascript"></script>
	<!-- END CORE ANGULARJS PLUGINS -->

	<!-- BEGIN APP LEVEL JQUERY SCRIPTS -->
	<script src="{{ ADMIN_ASSET_URL }}scripts/metronic.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}scripts/layout.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}scripts/quick-sidebar.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}scripts/demo.js" type="text/javascript"></script>  
	<!-- END APP LEVEL JQUERY SCRIPTS -->
    
	<script type="text/javascript">
		/* Init Metronic's core jquery plugins and layout scripts */
		$(document).ready(function() {
            Metronic.init(); // Run metronic theme
            Metronic.setAssetsPath('{{ ADMIN_ASSET_URL }}'); // Set the assets folder path
            //Index.init();    
            //Tasks.initDashboardWidget();
		});
	</script>
    
    <!-- BEGIN APP LEVEL ANGULARJS SCRIPTS -->
	<script src="{{ ADMIN_ASSET_URL }}js/app.js" type="text/javascript"></script>
	<script src="{{ ADMIN_ASSET_URL }}js/directives.js" type="text/javascript"></script>
	<!-- END APP LEVEL ANGULARJS SCRIPTS -->
	<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>
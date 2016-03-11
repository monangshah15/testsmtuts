<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en" class="no-js">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8"/>
<title>Metronic | Admin Dashboard Template</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<meta content="" name="description"/>
<meta content="" name="author"/>
<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_URL }}plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_URL }}plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_URL }}plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_URL }}plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_URL }}plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->
<!-- BEGIN PAGE LEVEL PLUGIN STYLES -->
<link href="{{ ADMIN_URL }}plugins/bootstrap-daterangepicker/daterangepicker-bs3.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_URL }}plugins/fullcalendar/fullcalendar.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_URL }}plugins/jqvmap/jqvmap/jqvmap.css" rel="stylesheet" type="text/css"/>
<!-- END PAGE LEVEL PLUGIN STYLES -->
<!-- BEGIN PAGE STYLES -->
<link href="{{ ADMIN_URL }}css/tasks.css" rel="stylesheet" type="text/css"/>
<!-- END PAGE STYLES -->
<!-- BEGIN THEME STYLES -->
<!-- DOC: To use 'rounded corners' style just load 'components-rounded.css' stylesheet instead of 'components.css' in the below style tag -->
<link href="{{ ADMIN_URL }}css/components.css" id="style_components" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_URL }}css/plugins.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_URL }}css/layout.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_URL }}css/themes/default.css" rel="stylesheet" type="text/css" id="style_color"/>
<link href="{{ ADMIN_URL }}css/custom.css" rel="stylesheet" type="text/css"/>
<!-- END THEME STYLES -->
<link rel="shortcut icon" href="{{ SITE_URL }}images/favicon.ico"/>
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
<body class="page-header-fixed page-quick-sidebar-over-content page-style-square"> 
    @include('admin.partials.header')
    @yield('admin_content')
    @include('admin.partials.footer')    

<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
<!-- BEGIN CORE PLUGINS -->
<!--[if lt IE 9]>
<script src="plugins/respond.min.js"></script>
<script src="plugins/excanvas.min.js"></script> 
<![endif]-->
<script src="{{ ADMIN_URL }}plugins/jquery.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jquery-migrate.min.js" type="text/javascript"></script>
<!-- IMPORTANT! Load jquery-ui-1.10.3.custom.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
<script src="{{ ADMIN_URL }}plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="{{ ADMIN_URL }}plugins/jqvmap/jqvmap/jquery.vmap.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jqvmap/jqvmap/maps/jquery.vmap.russia.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jqvmap/jqvmap/maps/jquery.vmap.world.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jqvmap/jqvmap/maps/jquery.vmap.europe.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jqvmap/jqvmap/maps/jquery.vmap.germany.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jqvmap/jqvmap/maps/jquery.vmap.usa.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jqvmap/jqvmap/data/jquery.vmap.sampledata.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/flot/jquery.flot.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/flot/jquery.flot.resize.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/flot/jquery.flot.categories.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jquery.pulsate.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/bootstrap-daterangepicker/moment.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>
<!-- IMPORTANT! fullcalendar depends on jquery-ui-1.10.3.custom.min.js for drag & drop support -->
<script src="{{ ADMIN_URL }}plugins/fullcalendar/fullcalendar.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jquery-easypiechart/jquery.easypiechart.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/jquery.sparkline.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="{{ ADMIN_URL }}scripts/metronic.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}scripts/layout.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}scripts/quick-sidebar.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}scripts/demo.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}scripts/index.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}scripts/tasks.js" type="text/javascript"></script>
<!-- END PAGE LEVEL SCRIPTS -->

<!-- BEGIN ANGULARJS SCRIPTS -->
<script src="{{ ADMIN_URL }}plugins/angularjs/angular.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/angularjs/plugins/ui-bootstrap-tpls.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_URL }}plugins/angularjs/plugins/angular-ui-router.min.js" type="text/javascript"></script>
<!-- END ANGULARJS SCRIPTS -->


<script>
jQuery(document).ready(function() {    
   Metronic.init(); // init metronic core componets
   Layout.init(); // init layout
   QuickSidebar.init(); // init quick sidebar
   Demo.init(); // init demo features 
   Index.init();   
   Index.initDashboardDaterange();
   Index.initJQVMAP(); // init index page's custom scripts
   Index.initCalendar(); // init index page's custom scripts
   Index.initCharts(); // init index page's custom scripts
   Index.initChat();
   Index.initMiniCharts();
   Tasks.initDashboardWidget();
});
</script>
<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>
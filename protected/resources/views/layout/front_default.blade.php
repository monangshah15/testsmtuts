<!DOCTYPE html>
<html>
<head>
	<title>{{ SITE_NAME }} | <?php if(isset($page_title)) { echo $page_title; } ?></title>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <?php if(isset($meta_desc))  { ?>
    <meta name="description" content="<?php echo $meta_desc; ?>" /> <?php } ?>
    <?php if(isset($meta_keyword)) { ?>
    <meta name="keywords" content="<?php echo $meta_keyword;?>" /> <?php } ?>
    
    <meta name="generator" content="html-5" />
    @if($view_name == 'campaign.slideshow_template1')
        @if($arrUserCampaign['e_is_public'] == 'No')
            <meta name="robots" content="noindex, nofollow" />
        @else
            <meta name="robots" content="noindex, nofollow" /> <!-- Keep follow, index after site gets LIVE -->
        @endif
    @else
        <meta name="robots" content="noindex, nofollow" /> <!-- Keep follow, index after site gets LIVE -->
    @endif
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <link rel="shortcut icon" href="{{ SITE_URL }}images/favicon.ico"/>
    
    <meta name="robots" content="noodp,noydir" />
    <meta name="coverage" content="Worldwide" />
    <meta name="document-distribution" content="Global"/>
    <meta name="document-type" content="Public"/>
    <meta name="document-rating" content="Safe for Kids"/>
    <meta HTTP-EQUIV="CACHE-CONTROL" content="NO-CACHE" />
    <meta name="revisit-after" content="7 days" />
    <meta name="owner" content="Kandarp Bhatt" />
   
    @if($view_name == 'campaign.slideshow_template1' || $view_name == 'campaign.slideshow_template2' || $view_name == 'campaign.slideshow_template3')
    <meta property="og:image" content="{{ SITE_URL }}images/test.jpg"/>
    <meta property="og:title" content="Teest - Campaign Preview" />
    <meta property="og:description" content="{{ $_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'] }}" />
    
    @else
    
    <meta property="og:image" content="{{ SITE_URL }}images/test.jpg"/>
    <meta property="og:title" content="Welcome to Test" />
    <meta property="og:description" content="Test - Home Page" />
    
    @endif
    
    <script type="text/javascript">var SITE_URL = "<?php echo SITE_URL; ?>"; var ASSET_URL = "<?php echo ASSET_URL; ?>"; </script>    

    <link href='http://fonts.googleapis.com/css?family=Oswald:400,300,700' rel='stylesheet' type='text/css'>

    {{HTML::style('assets/css/front/styles.css')}}
    {{HTML::style('assets/css/front/royalslider.css')}}
    {{HTML::style('assets/css/front/chosen-selectbox.css')}}
    {{HTML::style('assets/css/front/bootstrap.min.css')}}
    {{HTML::style('font/styles.css')}}
    {{HTML::style('assets/css/front/shadowbox.css')}}
    {{HTML::script('assets/js/front/jquery-1.8.2.js')}}
    {{HTML::style('assets/css/front/jquery.fancybox.css')}}
    {{HTML::script('assets/js/front/modernizr.custom.82896.js')}}
    {{HTML::style('assets/css/front/custom_style.css')}}
    {{HTML::style('assets/plugins/fancybox/source/jquery.fancybox.css?v=2.1.2')}}
    {{HTML::script('assets/js/front/sharethis.js')}}
    <script type="text/javascript">
        var SITE_URL = '{{ SITE_URL }}';
        var ADVERTISEMENT_IMG_PATH = '{{ ADVERTISEMENT_IMG_PATH }}';
    </script>
    <style>#share-img-1{ display: none;}</style>
</head>
<body class="@if($view_name == 'campaign.slideshow_template1' || $view_name == 'campaign.slideshow_template2' || $view_name == 'campaign.slideshow_template3') campaigns slideshow @elseif($view_name == 'campaign.campaign_list') campaigns  @elseif($view_name == 'faq'|| $view_name == 'terms_conditions' || $view_name == 'privacy_policy') faq_page @elseif($view_name == 'news' || $view_name == 'news-detail') bg news_page @elseif($view_name == 'reset_password') create_password @elseif($view_name == 'select-package') select_packages_page @endif">
    <img id="share-img-1" src="{{ SITE_URL }}images/projectagram_logo.jpg" />
    @yield('content')

    {{HTML::script('assets/js/front/jquery.singlePageNav.min.js')}}
    {{HTML::script('assets/js/front/jquery-easing.js')}}
    {{HTML::script('assets/js/front/jquery.royalslider.min.js')}}
    {{HTML::script('assets/js/front/chosen-selectbox.js')}}
    {{HTML::script('assets/js/front/bootstrap.min.js')}}
    {{HTML::script('assets/js/front/shadowbox.js')}}
    {{HTML::script('assets/plugins/bootbox/bootbox.min.js')}}
    {{HTML::script('assets/js/front/jquery.fancybox.pack.js')}}
    {{HTML::script('assets/js/front/general.js')}}
    {{HTML::script('assets/js/custom_validation.js')}}
    {{HTML::script('assets/js/front/custom_script.js')}}
    {{HTML::script('assets/plugins/fancybox/source/jquery.fancybox.js?v=2.1.3')}}
    {{HTML::script('js/jquery.fancybox-media.js')}}
    
    
</body>
</html>
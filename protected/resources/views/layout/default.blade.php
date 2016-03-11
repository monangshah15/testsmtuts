<!DOCTYPE html>
<html>
<head>
	<title><?php if(isset($page_title)) { echo $page_title; } ?></title>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <?php if(isset($meta_desc))  { ?>
    <meta name="description" content="<?php echo $meta_desc; ?>" /> <?php } ?>
    <?php if(isset($meta_keyword)) { ?>
    <meta name="keywords" content="<?php echo $meta_keyword;?>" /> <?php } ?>
    
    <meta name="generator" content="html-5" />
	  <meta name="robots" content="noindex, nofollow" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <link rel="icon" type="image/ico" href="<?php echo ASSET_URL."img/front_images/favicon.ico";?>" />
    
    <meta name="robots" content="noodp,noydir" />
    <meta name="coverage" content="Worldwide" />
    <meta name="document-distribution" content="Global"/>
    <meta name="document-type" content="Public"/>
    <meta name="document-rating" content="Safe for Kids"/>
    <meta HTTP-EQUIV="CACHE-CONTROL" content="NO-CACHE" />
    <meta name="revisit-after" content="7 days" />
    <meta name="owner" content="Kandarp Bhatt" />
    
    <script type="text/javascript">var SITE_URL = "<?php echo SITE_URL; ?>"; var ASSET_URL = "<?php echo ASSET_URL; ?>"; </script>    

    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,700,600,300' rel='stylesheet' type='text/css'>
    
    {{HTML::style('css/styles.css')}}
    {{HTML::style('fonts/styles.css')}}
    {{HTML::style('css/bootstrap.css')}}
    {{HTML::style('css/owl.carousel.css')}}
    {{HTML::style('css/camera.css')}}
    {{HTML::style('css/responsive-slider-parallax.css')}}
    {{HTML::style('css/jquery.fancybox.css')}}
    {{HTML::style('css/chosen-selectbox.css')}}    

    {{HTML::script('js/jquery-2.1.0.min.js')}}    
    {{HTML::script('js/modernizr.custom.82896.js')}}
    {{HTML::script('js/jquery-1.8.3.min.js')}}
    {{HTML::script('js/jquery.easing.1.3.js')}}
    {{HTML::script('js/jquery.event.move.js')}}
    
    {{HTML::script('js/owl.carousel.js')}}
    {{HTML::script('js/camera.min.js')}}
    {{HTML::script('js/jquery.fancybox.pack.js')}}
    {{HTML::script('js/chosen-selectbox.js')}}

       <script src="http://www.google.com/jsapi" type="text/javascript"></script>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    
      ga('create', 'UA-6009180-1', 'zealousweb.com');
      ga('send', 'pageview');
    
    </script>
   
    <?php 
    if(Route::currentRouteAction() == "HomeController@index") { 
        echo '<link rel="canonical" href="http://www.zealousweb.com" />';
    } else {
        $page_url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        if(substr($page_url, -1) != '/') {
              echo '<link rel="canonical" href="'.$page_url.'" />';
      } 
    } ?>
    <!-- meta name="google-site-verification" content="dBjgTjayWrzT6bEcWW5B51cOkEDZGneozWLEhcj8YVY" / -->
    <link rel="publisher" href="https://plus.google.com/107029170350133960878"/>
    <link rel="author" href="https://plus.google.com/107029170350133960878"/>
       
    
</head>
<body <?php if(Route::currentRouteAction() == "HomeController@index") { echo 'id="home" data-controller="home" class="home pattern_0"'; }?>>
    <section id="main_wrapper">
    @yield('content')
    </section>    
    <!--script type="text/javascript">
    window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=
    z.s=d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o
    ){z.set._.push(o)};$.setAttribute('charset','utf-8');$.async=!0;z.set.
    _=[];$.src=('https:'==d.location.protocol?'https://ssl':'http://cdn')+
    '.zopim.com/?50dYYsA9jiYKmlfNl1cgOgxmW1HG8ebz';$.type='text/java'+s;z.
    t=+new Date;z._=[];e.parentNode.insertBefore($,e)})(document,'script')
    </script -->  
    {{HTML::script('js/responsive-slider.js')}}
    {{HTML::script('js/custom_validation.js')}}    
    {{HTML::script('js/general.js')}}
</body>
</html>
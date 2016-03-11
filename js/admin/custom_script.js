var timeoutID; 
var email_flag = true; // for email unique validation 
$(document).ready(function()
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
    if($( window ).height() > 900) {  
        $("#main-content").attr('style',"min-height: "+(eval($( window ).height())-95)+"px"); 
    }
    if($("#sidebar").height() >  $("#main-content").height()) {
        $("#main-content").attr('style',"min-height: "+($("#sidebar").height()+50)+"px");
    }
    
    $("a[rel=list_img_group]").fancybox({
		'openEffect'	: 'elastic',
    	'closeEffect'	: 'elastic',
		'titleFormat'       : function(title, currentArray, currentIndex, currentOpts) {
		    return '<span id="fancybox-title-over">Image ' +  (currentIndex + 1) + ' / ' + currentArray.length + ' ' + title + '</span>';
		}
	});
    
    $("a[rel=single_img_group]:visible").fancybox({
		'openEffect'	: 'elastic',
    	'closeEffect'	: 'elastic'
	});
    
    if($("#single_upload_img").length > 0 || $("#single_upload_img1").length > 0 || $("#single_upload_img2").length > 0 || $("#multi_upload_img1").length > 0 || $("#multi_upload_file").length > 0 || $("#single_upload_img4").length > 0) {
        console.log("jio");
        $.getScript( ASSET_URL+'js/admin/upload_script.js', function() { });
    }
    
    handleSidebarTogglerAnimated();
    handleWidgetTools();
    handleMainMenu();
    handleUniform();
    handleGoTop();
    
    if($("#d_start_date_search").val() <= $( "#d_expiry_date_search" ).val())
    {
        //$( "#d_expiry_date_search" ).val("");
    }
    
    // Validation for payment method in popup box
    $('body').on('click','.pay_method',function () {
       $("#city_state_hval").val('true');
        if ($('.pay_method:checked').length == 0 ) {
            $("#city_state_hval").val('');
        }
    });
    
    // Validation for package in popup box
    $('body').on('click','.pack',function () {
       $("#city_state_val").val('true');
        if ($('.pack:checked').length == 0 ) {
            $("#city_state_val").val('');
        }
    });
    
    $('body').on('keyup','#f_amount_received',function () {
        if($.trim(this.value) == '' || isNaN(this.value))
        {
            var amount = $('#f_kazang_amount').val();
            $('#f_amount_remaining').val(amount);
            $('#f_amount_remaining_hidden').val(amount);
        }
       if($.trim(this.value).length) {
        if(isNaN(this.value))
        {
           var amount = $('#f_kazang_amount').val();
            $('#f_amount_remaining_hidden').val(amount); 
        }
        else
        {
            var balance = parseFloat($('#f_kazang_amount').val()).toFixed(2) - 
                       parseFloat(this.value).toFixed(2);
         $('#f_amount_remaining_hidden').val(balance);
        }
       }
    });
    
    $('body').bind('paste','#f_amount_received',function () {
        if($.trim(this.value) == '' || isNaN(this.value))
        {
            var amount = $('#f_kazang_amount').val();
            $('#f_amount_remaining').val(amount);
            $('#f_amount_remaining_hidden').val(amount);
        }
       if($.trim(this.value).length) {
        if(isNaN(this.value))
        {
           var amount = $('#f_kazang_amount').val();
            $('#f_amount_remaining').val(amount);
            $('#f_amount_remaining_hidden').val(amount); 
        }
        else
        {
            var balance = parseFloat($('#f_kazang_amount').val()).toFixed(2) - 
                       parseFloat(this.value).toFixed(2);
         $('#f_amount_remaining').val(balance);
         $('#f_amount_remaining_hidden').val(balance);
        }
       }
    });
    $(document).on('change',"#chk_overdue",function()
    {
        if($(this).is(":checked"))
        {
            $("#f_kzn_paid").val('0.00');
            $("#f_kzn_paid").attr('readonly','readonly');   
        } 
        else
        {
            $("#f_kzn_paid").removeAttr('readonly');
        }
    });
});

function rtrim(str,lastChar) {
    if (str.substring(str.length-1) == lastChar) {
        str = str.substring(0, str.length-1);
    }    
    return str;
} 

function intialise_datepicker() { 
    
    /* Date picker for SA Page starts */
    if($("#d_payment_date:visible" )) {
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var todays_date = new Date(); 
        if($("#frmAdd").length > 0) {
            //todays_date = (day<10 ? '0' : '') + day + '-' + (month<10 ? '0' : '') + month + '-' + d.getFullYear();
        }        
        var dates = $( "#d_payment_date" ).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: todays_date,        
            dateFormat:'dd-mm-yy',
            onClose: function( selectedDate ) {
                //$("#d_payment_date").datepicker("option", "minDate", todays_date );
            }
            
        });
    }
        
    if($("#d_upgrade_date").length > 0) {
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var todays_date = new Date(); 
                
        var dates = $( "#d_upgrade_date" ).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: todays_date,        
            dateFormat:'dd-mm-yy',
            onClose: function( selectedDate ) {
                //$("#d_payment_date").datepicker("option", "minDate", todays_date );
            }
            
        });
    }
    
    if($("#edit_u_date").length > 0) {
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var todays_date = new Date(); 
                
        var dates = $( "#edit_u_date" ).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: todays_date,        
            dateFormat:'dd-mm-yy',
            onClose: function( selectedDate ) {
                //$("#d_payment_date").datepicker("option", "minDate", todays_date );
            }
            
        });
    }
        
    if($("#d_payment_date_edit:visible" )) {
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var todays_date = new Date(); 
                
        var dates = $( "#d_payment_date_edit" ).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: todays_date,        
            dateFormat:'dd-mm-yy',
            onClose: function( selectedDate ) {
                //$("#d_payment_date").datepicker("option", "minDate", todays_date );
            }
            
        });
    }  
    
    if($("#d_start_date_search , #d_expiry_date_search" ).length > 0) {        
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var todays_date = ''; 
        if($("#frmSearchForm").length > 0) {
            //todays_date = (day<10 ? '0' : '') + day + '-' + (month<10 ? '0' : '') + month + '-' + d.getFullYear();
        }        
        var dates = $( "#d_start_date_search" ).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: todays_date,        
            dateFormat:'dd-mm-yy',
            onClose: function( selectedDate ) {
                $("#d_expiry_date_search").datepicker("option", "minDate", selectedDate );
            }
        });
        var dates = $( "#d_expiry_date_search" ).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: todays_date,       
            dateFormat:'dd-mm-yy'
        }); 
    }  
    /* Date picker for SA Page ends */
    
    /* Date picker for News Page starts */
    
    if($("#d_date:visible" )) {
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var todays_date = new Date(); 
        if($("#frmAdd").length > 0) {
            //todays_date = (day<10 ? '0' : '') + day + '-' + (month<10 ? '0' : '') + month + '-' + d.getFullYear();
        }        
        var dates = $( "#d_date" ).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: todays_date,        
            dateFormat:'dd-mm-yy',
            onClose: function( selectedDate ) {
                //$("#d_payment_date").datepicker("option", "minDate", todays_date );
            }
            
        });
        }
        
    if($("#d_date_edit:visible" )) {
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var todays_date = new Date(); 
        if($("#frmAdd").length > 0) {
            //todays_date = (day<10 ? '0' : '') + day + '-' + (month<10 ? '0' : '') + month + '-' + d.getFullYear();
        }        
        var dates = $( "#d_date_edit" ).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: todays_date,        
            dateFormat:'dd-mm-yy',
            onClose: function( selectedDate ) {
                //$("#d_payment_date").datepicker("option", "minDate", todays_date );
            }
            
        });
        }
    
    if($("#d_news_start_search , #d_news_expiry_search" ).length > 0) {        
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var todays_date = ''; 
        if($("#frmSearchForm").length > 0) {
            //todays_date = (day<10 ? '0' : '') + day + '-' + (month<10 ? '0' : '') + month + '-' + d.getFullYear();
        }        
        var dates = $( "#d_news_start_search" ).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: todays_date,        
            dateFormat:'dd-mm-yy',
            onClose: function( selectedDate ) {
                $("#d_news_expiry_search").datepicker("option", "minDate", selectedDate );
            }
            
        });
        var dates = $( "#d_news_expiry_search" ).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: todays_date,        
            dateFormat:'dd-mm-yy',
        }); 
    }
    
    /* Date picker for News Page ends */
}
function strstr(haystack, needle, bool) {
   
    // Finds first occurrence of a string within another
    //
    // version: 1103.1210
    // discuss at: http://phpjs.org/functions/strstr    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: strstr(‘Kevin van Zonneveld’, ‘van’);
    // *     returns 1: ‘van Zonneveld’    // *     example 2: strstr(‘Kevin van Zonneveld’, ‘van’, true);
    // *     returns 2: ‘Kevin ‘
    // *     example 3: strstr(‘name@example.com’, ‘@’);
    // *     returns 3: ‘@example.com’
    // *     example 4: strstr(‘name@example.com’, ‘@’, true);    // *     returns 4: ‘name’
    var pos = 0;

    haystack += "";
    pos = haystack.indexOf(needle); if (pos == -1) {
        return false;
    } else {
        if (bool) {
            return haystack.substr(0, pos);
        } else {
            return haystack.slice(pos);
        }
    }
}
function handleGoTop() 
{
    /* set variables locally for increased performance */
    $('#footer .go-top').click(function () {
        $('html,body').animate({
                scrollTop: 0
            }, 'slow');
    });
}


function handleUniform() 
{
    if (!$().uniform) {
        return;
    }
    if (test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle)")) {
        test.uniform();
    }
}

function handleMainMenu() 
{
    $('#sidebar .has-sub > a').click(function () {
        var last = $('.has-sub.open', $('#sidebar'));
        last.removeClass("open");
        timeInt = 200;
        $('.arrow', last).removeClass("open");
        $('.sub', last).slideUp(timeInt);
        var sub = $(this).next();
        //sub.css({'display':'none'});
        if (sub.is(":visible")) {
            $('.arrow', $(this)).removeClass("open");
            $(this).parent().removeClass("open");
            //sub.slideUp(timeInt);
            sub.css({'display':'none'});
        } else {
            $('.arrow', $(this)).addClass("open");
            $(this).parent().addClass("open");
            sub.show();
            sub.css({'display':'block'});
        }
    });    
}
// this is optional to use if you want animated show/hide. But plot charts can make the animation slow.
function handleSidebarTogglerAnimated(){

    $('.sidebar-toggler').click(function () {
        if ($('#sidebar > ul').is(":visible") === true) 
        {
            $('#main-content').animate({
                'margin-left': '25px'
            });

            $('#sidebar').animate({
                'margin-left': '-190px'
            }, {
                complete: function () {
                    $('#sidebar > ul').hide();
                    $("#container").addClass("sidebar-closed");
                }
            });
        } 
        else 
        {
            $('#main-content').animate({
                'margin-left': '215px'
            });
            $('#sidebar > ul').show();
            $('#sidebar').animate({
                'margin-left': '0'
            }, {
                complete: function () {
                    $("#container").removeClass("sidebar-closed");
                }
            });
            
        }        
    })
}

function handleWidgetTools() 
{
    $('.widget .tools .icon-remove').click(function () {
        $(this).parents(".widget").parent().remove();
    });

    $('.widget .tools .icon-refresh').click(function () {
        var el = $(this).parents(".widget");
        App.blockUI(el);
        window.setTimeout(function () {
            App.unblockUI(el);
        }, 1000);
    });

    $('.widget .tools .icon-chevron-down, .widget .tools .icon-chevron-up').click(function () {
        var el = $(this).parents(".widget").children(".widget-body");
        if ($(this).hasClass("icon-chevron-down")) {
            $(this).removeClass("icon-chevron-down").addClass("icon-chevron-up");
            el.slideUp(200);
        } else {
            $(this).removeClass("icon-chevron-up").addClass("icon-chevron-down");
            el.slideDown(200);
        }
    });
    
    
}
function handleLoginForm() 
{

    $('#forget-password').click(function () {
        $(".login-inner-error").remove();
        $('#loginform').hide();
        $('#forgotform').show(500);
    });

    $('#back-login').click(function () {
        $(".login-inner-error").remove();
        $('#loginform').slideDown(500);
        $('#forgotform').slideUp(500);
    });
   
    $('#redirect-to-home').click(function(){
        window.location.href = ASSET_URL+"dashboard/";
    })
    
    $("#login-btn").click(function() {
        if(form_valid("#loginform")) {
            $("#loginform").submit();
        } else {
            return false;
        }
    });
    
  $("#btn_forgot").click(function() {
        if(form_valid("#forgotform")) {
            var btn_value = $("#btn_forgot").val();
            $("#btn_forgot").val(' ');
            $("#btn_forgot").addClass('img-loader');
            $("#forgotform").submit();
        }else{
            return false;
        }
    });
    
    setTimeout(function(){
        $('.flash-inner-error').remove();
        $('.login-inner-error').remove();
    },4000);
} 
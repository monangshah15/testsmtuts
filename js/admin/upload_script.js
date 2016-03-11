var currentfiles =  new Array() ;
var image_number = 0;
var timeoutID;
var LOADING_TIMEOUT = 1000;
var DOWNLOAD_FILE_EXTENSION = /\.(doc|docx|ppt|pptx|xls|xlsx|txt|gif|jpg|jpeg|tiff|png|pdf)$/i;
var IMAGE_EXTENSION = /\.(gif|jpg|jpeg|tiff|png)$/i;
var editOrNot = '0';
$(document).ready(function() 
{
    /*********************** Single Image Crop **************/    
    $('#single_upload_img').bind('added', function (e, data) {
        var currentfiles = [];
    	var nm;
    	$.each(data.files, function (index, x) {
    		var nm = x.name;
    	});
    	if ($.inArray(nm,currentfiles) >= 0) { alert("Image is already uploaded"); return false;}
    	var filenames = $("#images_name").val();
    	imgarray = filenames.split(';');
    	
    	if(imgarray.isArray)
    	{
    		$.each(imgarray, function (index, file) 
    		{
    			var arryname = file.name.split('@');
    			currentfiles.push(arryname[1]);
    		});	
    	}
    });
    
    $(".dialog_crop").css('display','none');
    var url =  PUBLIC_URL+"admin/upload-file";
    //var upload_dir = WWW_ROOT+USER_IMG_PATH; 
    $('#single_upload_img').fileupload({
        url: url,
        dataType: 'json',
        sequentialUploads: true,
        imageMaxWidth: 800,
        imageMaxHeight: 800,
        
        formData : {object:'single_upload_img',path:'',button_name:'single_upload_img',temp_thumb_path:$("#temp_thumb_path").val() },
        send : function (e, data) 
        {
           var uploadFile = data.files[0];
           if ($.inArray(uploadFile.name,currentfiles) >= 0) { alert(uploadFile.name+" is already uploaded"); return false;}
           
		   if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(uploadFile.name)) {
                alert('You must select an image file only');
                return false;
           }
           
		   if (uploadFile.size > 8*1024*1024) { 
                alert('Please upload a smaller image, maximum size is 8 MB');
                return false;
           }
           $.blockUI({
				message: '<img width="100%" src=' + PUBLIC_URL + 'img/admin/ajax-loader.gif' + ' />'
		   });
                   
		},
        done : function (e, data) 
        {
            editOrNot='1';
            if($(".dialog_crop").is(':visible')) 
            {
                $( ".dialog_crop" ).dialog( "close" );
            } 
            if(typeof data.result.single_upload_img[0]['error'] != 'undefined' && typeof data.result.single_upload_img[0]['error'] != ''){
                $.unblockUI(); 
                alert('Please upload a image with atleast 125 X 125.');
                return false;
            } 
            else {
             $.each(data.result.single_upload_img, function (index, file) {
                var filename = file.name;
                var height = file.height;
                var width = file.width;
                                
                $('#cropbox1').attr('src','');
                
                var newfilename = filename;
                $(".dialog_crop").css('display','');
                $('#btn_crop_submit').removeAttr('disabled');
            
                setTimeout(function()
                {
                    var H = height;
                    var W = width; 
                    
                    var url = PUBLIC_URL + "files/user/" + newfilename;
                     
                    $('#temp_img').val(newfilename);     
                    var img = new Image();

                    $('#cropbox1').attr('src', url ).load(function() 
                    {   
                        var w = parseInt($('#target_width').val());
                        var h = parseInt($('#target_height').val());
                         var target_left = parseInt($('#target_left').val());
                         
                         if(isNaN(target_left))
                         {
                           
                            target_left = 6;
                         } 
                        var dialog_width = eval(w+110); 
                        $( ".dialog_crop" ).dialog({
                            create: function (event, ui) { $(".ui-widget-header").hide(); },
                            width: dialog_width,
                            modal: true,
                            resizable: false,
                            open: function(event, ui) {
                                $('.pane img').jzac('destroy');
    					        initialize_jzak(eval(w+50),eval(h+50),w,h,target_left,7);
                                $(event.target).parent().css('top', '180px');
                            },
                            close: function() {
                                $('.dialog_crop').dialog("close");
                            }
                        }).bind("dialogclose", function (event, ui) {
                            $('.dialog_crop').dialog("close");
                        });                        
                        $("html, body").animate({ scrollTop: 0 }, "slow");                        
                        $.unblockUI(); 
                  });  
                },LOADING_TIMEOUT);
             }); 
           }  
        },
        progressall: function (e, data) {
            $(".progress").html("");
            $(".progress").show();
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
            $(".progress").hide();
        }       
    });
    
    //Banner add image dynamic
    
    if($("#max_height").length > 0 && $("#max_width").length > 0){
        max_width = $("#max_width").val();
        max_height =$("#max_height").val();
    }
    $('#single_upload_img1').fileupload({
        url: url,
        dataType: 'json',
        sequentialUploads: true,
        formData : {object:'single_upload_img1',path:'',button_name:'single_upload_img1',temp_thumb_path:$("#temp_thumb_path").val(),min_width:$("#min_width").val(),min_height:$("#min_height").val(),max_width:max_width,max_height:max_height },
        send : function (e, data) 
        {
            var uploadFile = data.files[0];
            if ($.inArray(uploadFile.name,currentfiles) >= 0) { alert(uploadFile.name+" is already uploaded"); return false;}
          
            if($('#rental_option_image').length == 1){
                if (!(/\.(png)$/i).test(uploadFile.name)) {
                    alert('You must select an png file only');
                    return false;
                }
            }else{
                if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(uploadFile.name)) {
                    alert('You must select an image file only');
                    return false;
               }
            }
            
            if (uploadFile.size > 8*1024*1024) { 
                alert('Please upload a smaller image, maximum size is 8 MB');
                return false;
            }
            $.blockUI({
                message: '<img width="100%" src=' + ASSET_URL + 'img/admin/ajax-loader.gif' + ' />'
            });
                   
		},
        done : function (e, data) 
        {
            $("a#upload_img_url1").parent().show();
            editOrNot='1';
            if(data.result.single_upload_img1[0]['error'] == 'Image requires a minimum height' || data.result.single_upload_img1[0]['error'] == 'Image requires a minimum width'){
                $.unblockUI(); 
                alert('Please upload a image with atleast '+$("#min_width").val()+'px X '+ $("#min_height").val()+'px');
                return false;
            }
            else if(data.result.single_upload_img1[0]['error'] == 'Image exceeds maximum width' || data.result.single_upload_img1[0]['error'] == 'Image exceeds maximum height'){
                $.unblockUI(); 
                alert('Please upload a small image ,'+$("#min_width").val()+'px X '+ $("#min_height").val()+'px');
                return false;
            }  
            else {
             $.each(data.result.single_upload_img1, function (index, file) {
                var filename = file.name;
                var height = file.height;
                var width = file.width;
                
                $('#image_name1').val(filename);
                $('#temp_img1').val(filename);
                filename = PUBLIC_URL + TEMP_IMG_PATH + filename       
                $('#upload_img_url1').find('img').attr("src",filename+ '?' + new Date().getTime());
                
                $('.pane img').jzac('destroy');
                $.unblockUI();   
                $("#single_upload_img1").removeClass('required');
                $("#single_upload_img_error").remove();
                $('#upload_img_url1').attr("href", filename);                    
                $('#upload_img_url1').show();
             }); 
           }  
        },
        progressall: function (e, data) {
            $(".progress").html("");
            $(".progress").show();
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
            $(".progress").hide();
        }       
    });
    
    //Edit Banner Image dynamic
    
    $(".dialog_crop").css('display','none');
    var url =  PUBLIC_URL+"admin/upload-file"; 
    var max_width = '';
    var max_height = '';
    
    if($("#max_height").length > 0 && $("#max_width").length > 0){
        max_width = $("#max_width").val();
        max_height =$("#max_height").val();
    }
    
    $('#single_upload_img2').fileupload({
        url: url,
        dataType: 'json',
        sequentialUploads: true,
        formData : {object:'single_upload_img2',path:'',button_name:'single_upload_img2',temp_thumb_path:$("#temp_thumb_path").val(),min_width:$("#min_width").val(),min_height:$("#min_height").val(),max_width:max_width,max_height:max_height },
        send : function (e, data) 
        {
            var uploadFile = data.files[0];
            if ($.inArray(uploadFile.name,currentfiles) >= 0) { alert(uploadFile.name+" is already uploaded"); return false;}
          
            if($('#rental_option_image').length == 1){
                if (!(/\.(png)$/i).test(uploadFile.name)) {
                    alert('You must select an png file only');
                    return false;
                }
            }else{
                if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(uploadFile.name)) {
                    alert('You must select an image file only');
                    return false;
               }
            }
            
            if (uploadFile.size > 8*1024*1024) { 
                alert('Please upload a smaller image, maximum size is 8 MB');
                return false;
            }
            $.blockUI({
                message: '<img width="100%" src=' + ASSET_URL + 'img/admin/ajax-loader.gif' + ' />'
            });
                   
		},
        done : function (e, data) 
        {
            editOrNot='1';
            if(data.result.single_upload_img2[0]['error'] == 'Image requires a minimum height' || data.result.single_upload_img2[0]['error'] == 'Image requires a minimum width'){
                $.unblockUI(); 
                alert('Please upload a image with atleast '+$("#min_width").val()+'px X '+ $("#min_height").val()+'px');
                return false;
            }
            else if(data.result.single_upload_img2[0]['error'] == 'Image exceeds maximum width' || data.result.single_upload_img2[0]['error'] == 'Image exceeds maximum height'){
                $.unblockUI(); 
                alert('Please upload a small image ,'+$("#min_width").val()+'px X '+ $("#min_height").val()+'px');
                return false;
            }  
            else {
             $.each(data.result.single_upload_img2, function (index, file) {
                var filename = file.name;
                var height = file.height;
                var width = file.width;
                
                $('#image_name2').val(filename);
                $('#temp_img2').val(filename);
                filename = PUBLIC_URL + TEMP_IMG_PATH + filename       
                $('#upload_img_url2').find('img').attr("src",filename+ '?' + new Date().getTime());
                
                $('.pane img').jzac('destroy');
                $.unblockUI();   
                $("#single_upload_img2").removeClass('required');
                $("#single_upload_img_error").remove();
                $('#upload_img_url2').attr("href", filename);                    
                $('#upload_img_url2').show();
             }); 
           }  
        },
        progressall: function (e, data) {
            $(".progress").html("");
            $(".progress").show();
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
            $(".progress").hide();
        }       
    });
    
    //Add image for static banner
    
    $(".dialog_crop").css('display','none');
    var url =  PUBLIC_URL+"admin/upload-file"; 
    var max_width = '';
    var max_height = '';
    
    if($("#max_height").length > 0 && $("#max_width").length > 0){
        max_width = $("#max_width").val();
        max_height =$("#max_height").val();
    }
    $('#single_upload_img3').fileupload({
        url: url,
        dataType: 'json',
        sequentialUploads: true,
        formData : {object:'single_upload_img3',path:'',button_name:'single_upload_img3',temp_thumb_path:$("#temp_thumb_path").val(),min_width:$("#min_width").val(),min_height:$("#min_height_2").val(),max_width:max_width,max_height:$("#max_height_2").val() },
        send : function (e, data) 
        {
            var uploadFile = data.files[0];
            if ($.inArray(uploadFile.name,currentfiles) >= 0) { alert(uploadFile.name+" is already uploaded"); return false;}
          
            if($('#rental_option_image').length == 1){
                if (!(/\.(png)$/i).test(uploadFile.name)) {
                    alert('You must select an png file only');
                    return false;
                }
            }else{
                if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(uploadFile.name)) {
                    alert('You must select an image file only');
                    return false;
               }
            }
            
            if (uploadFile.size > 8*1024*1024) { 
                alert('Please upload a smaller image, maximum size is 8 MB');
                return false;
            }
            $.blockUI({
                message: '<img width="100%" src=' + ASSET_URL + 'img/admin/ajax-loader.gif' + ' />'
            });
                   
		},
        done : function (e, data) 
        {
            $("a#upload_img_url3").parent().show();
            editOrNot='1';
            if(data.result.single_upload_img3[0]['error'] == 'Image requires a minimum height' || data.result.single_upload_img3[0]['error'] == 'Image requires a minimum width'){
                $.unblockUI(); 
                alert('Please upload a image with atleast '+$("#min_width").val()+'px X '+ $("#min_height_2").val()+'px');
                return false;
            }
            else if(data.result.single_upload_img3[0]['error'] == 'Image exceeds maximum width' || data.result.single_upload_img3[0]['error'] == 'Image exceeds maximum height'){
                $.unblockUI(); 
                alert('Please upload a small image ,'+$("#min_width").val()+'px X '+ $("#min_height_2").val()+'px');
                return false;
            }  
            else {
             $.each(data.result.single_upload_img3, function (index, file) {
                var filename = file.name;
                var height = file.height;
                var width = file.width;
                
                $('#image_name3').val(filename);
                $('#temp_img3').val(filename);
                filename = PUBLIC_URL + TEMP_IMG_PATH + filename       
                $('#upload_img_url3').find('img').attr("src",filename+ '?' + new Date().getTime());
                
                $('.pane img').jzac('destroy');
                $.unblockUI();   
                $("#single_upload_img3").removeClass('required');
                $("#single_upload_img3_error").remove();
                $('#upload_img_url3').attr("href", filename);                    
                $('#upload_img_url3').show();
             }); 
           }  
        },
        progressall: function (e, data) {
            $(".progress").html("");
            $(".progress").show();
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
            $(".progress").hide();
        }       
    });
    
    //Edit image for static banner
    
    $(".dialog_crop").css('display','none');
    var url =  PUBLIC_URL+"admin/upload-file"; 
    var max_width = '';
    var max_height = $("#max_height_4").val();
    
    
    $('#single_upload_img4').fileupload({
        url: url,
        dataType: 'json',
        sequentialUploads: true,
        formData : {object:'single_upload_img4',path:'',button_name:'single_upload_img4',temp_thumb_path:$("#temp_thumb_path").val(),min_width:$("#min_width_4").val(),min_height:$("#min_height_4").val(),max_width:$("#max_width_4").val(),max_height:$("#max_height_4").val() },
        send : function (e, data) 
        {
            var uploadFile = data.files[0];
            if ($.inArray(uploadFile.name,currentfiles) >= 0) { alert(uploadFile.name+" is already uploaded"); return false;}
          
            if($('#rental_option_image').length == 1){
                if (!(/\.(png)$/i).test(uploadFile.name)) {
                    alert('You must select an png file only');
                    return false;
                }
            }else{
                if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(uploadFile.name)) {
                    alert('You must select an image file only');
                    return false;
               }
            }
            
            if (uploadFile.size > 8*1024*1024) { 
                alert('Please upload a smaller image, maximum size is 8 MB');
                return false;
            }
            $.blockUI({
                message: '<img width="100%" src=' + ASSET_URL + 'img/admin/ajax-loader.gif' + ' />'
            });
                   
		},
        done : function (e, data) 
        {
            editOrNot='1';
            if(data.result.single_upload_img4[0]['error'] == 'Image requires a minimum height' || data.result.single_upload_img4[0]['error'] == 'Image requires a minimum width'){
                $.unblockUI(); 
                alert('Please upload a image with atleast '+$("#min_width_4").val()+'px X '+ $("#min_height_4").val()+'px');
                return false;
            }
            else if(data.result.single_upload_img4[0]['error'] == 'Image exceeds maximum width' || data.result.single_upload_img4[0]['error'] == 'Image exceeds maximum height'){
                $.unblockUI(); 
                alert('Please upload a small image ,'+$("#min_width_4").val()+'px X '+ $("#min_height_4").val()+'px');
                return false;
            }  
            else {
             $.each(data.result.single_upload_img4, function (index, file) {
                var filename = file.name;
                var height = file.height;
                var width = file.width;
                
                $('#image_name4').val(filename);
                $('#temp_img4').val(filename);
                filename = PUBLIC_URL + TEMP_IMG_PATH + filename       
                $('#upload_img_url4').find('img').attr("src",filename+ '?' + new Date().getTime());
                
                $('.pane img').jzac('destroy');
                $.unblockUI();   
                $("#single_upload_img4").removeClass('required');
                $("#single_upload_img4_error").remove();
                $('#upload_img_url4').attr("href", filename);                    
                $('#upload_img_url4').show();
             }); 
           }  
        },
        progressall: function (e, data) {
            $(".progress").html("");
            $(".progress").show();
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
            $(".progress").hide();
        }       
    });
    
    //end edit image
    
    $(".dialog_crop").css('display','none');
    var url =  PUBLIC_URL+"admin/upload-file"; 
    var max_width = '';
    var max_height = '';
    
    if($("#max_height").length > 0 && $("#max_width").length > 0){
        max_width = $("#max_width").val();
        max_height =$("#max_height").val();
    }
    
    //.prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled'); 
    $(".jzac_panel").on("click",".crop_btn_class #btn_crop_cancel",function () {
        $('.pane img').jzac('destroy');
        if($(".poster-image").length == 0 && $('#temp_img').val() != '' && $('#temp_img').val() != $('#image_name').val()) {
            if($(".edit-record").length > 0 && $('#temp_img').val() != $('#temp_img').attr('rel')) {
                clearTimeout(timeoutID);
                timeoutID = setTimeout(function() {
                    $.get(SITE_URL+'admin/delete_temp_img/'+$('#temp_img').val(), function(res){
                        if($.trim(res)=='') { $('#temp_img').val(''); }    
                    })
                 },200); 
            }
        }    
        $('.dialog_crop').dialog("close");
    });
    
    $(".crop-image-container").on('click','.edit-crop-link', function(){
        editOrNot='0';        
        if($(".dialog_crop").is(':visible')) {
            $( ".dialog_crop" ).dialog( "close" );
        } 
        $('#cropbox1').attr('src','');
        
        $('#cropbox1').attr('src', $('#upload_img_url').attr('href')+ '?' + new Date().getTime()).load(function() 
        {
            var w = parseInt($('#target_width').val());
            var h = parseInt($('#target_height').val());   
             var target_left = parseInt($('#target_left').val());  
             if(isNaN(target_left))
             {
               
                target_left = 6;
             }            
            if ( typeof jcrop_api !== "undefined" && jcrop_api) {
                jcrop_api.destroy(); 
            }
            
            var dialog_width = eval(w+110);
             
            $(".dialog_crop" ).dialog({
                create: function (event, ui) { $(".ui-widget-header").hide(); },
                width: dialog_width,
                modal: true,
                resizable: false,
                open: function(event, ui) {
                    $('.pane img').jzac('destroy');
			        initialize_jzak(eval(w+50),eval(h+50),w,h,target_left,7);
                    $(event.target).parent().css('top', '180px');
                    $(event.target).parent().css("width","23% !important");
                },
                close: function()
                {
                    if (typeof jcrop_api !== "undefined" && jcrop_api) {
				        jcrop_api.destroy();
				    }
                    $('.dialog_crop').dialog("close");
                }
            }).bind("dialogclose", function (event, ui) {
               if (typeof jcrop_api !== "undefined" && jcrop_api) {
			        jcrop_api.destroy();
			   }                                   
               $('.dialog_crop').dialog("close");
            });                        
            $("html, body").animate({ scrollTop: 0 }, "slow");                        
            $.unblockUI(); 
        });
        return false; 
    });
    
    $(".jzac_panel").on("click",".crop_btn_class #btn_crop_submit",function (event) {
        $('#btn_crop_submit').attr('disabled','disabled');        
        var x_cord = $('#crop_x').val();
		var y_cord = $('#crop_y').val();
		var w_cord = $('#crop_width').val();
		var h_cord = $('#crop_height').val();
        var crop_img_width = $('#crop_img_width').val();
        var crop_img_height = $('#crop_img_height').val();
        var image_name = $('#temp_img').val();
        var targ_w = $('#target_width').val();
  		var targ_h = $('#target_height').val();
        var flag = 0;
        if($(".poster-image").length > 0) {
            flag = 1;            
        }
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() 
        {
            $.post(PUBLIC_URL+'admin/create_dept_img_thumb',{'folder_path':$("#folder_path").val(), 'image_name':image_name,'x_cord':x_cord,'y_cord':y_cord,'w_cord':w_cord,'h_cord':h_cord,'targ_w':targ_w,'targ_h':targ_h, 'crop_img_width': crop_img_width, 'crop_img_height': crop_img_height, 'poster_image_flag': flag ,'editOrNot':editOrNot }, function(data) 
            {
                data = $.trim(data);
                $('#image_name').val(data);
                $('#temp_img').val(data);
                $('#upload_img_url').attr("href", PUBLIC_URL+TEMP_IMG_PATH+data); 
                data = PUBLIC_URL+TEMP_IMG_PATH+'thumb/'+data;
               
                $('#upload_img_url').find('img').attr("src",data+ '?' + new Date().getTime());
                
                if($(".poster-image").length > 0) 
                {
                    $(".delete_image").each(function()
                    {
                       $(this).html('<img src="'+ASSET_URL+'public/img/delete-image.png" alt="Delete" />'); 
                    });
                    
                    var tmp_data = "";
                    
                    $(".check_poster").each(function()
                    {
                        if($(this).is(":checked"))
                        {
                            tmp_data = $(this).attr('rel');
                        } 
                    });
                    
                    $(".poster-image").show();
                    if($("#add-delete"+image_number).length > 0)
                    {
                        $("#add-delete"+image_number).html('&nbsp;');   
                    } 
                    if($("#edit-delete"+image_number).length > 0)
                    {
                        $("#edit-delete"+image_number).html('&nbsp;');   
                    }     
                    if(tmp_data != "")
                    {
                        $('#upload_img_url').attr("href", tmp_data);
                    }   
                    else
                    {
                        $('#upload_img_url').attr("href", data.replace('thumb/poster/',''));   
                    }
                } 
                else 
                {
                    $("#single_upload_img").removeClass('required');
                    $("#single_upload_img_error").remove();
                    
                    //$('#upload_img_url').attr("href", data.replace('thumb/',''));      
                    if($('#frmEdit').length <= 0){
                       $('#upload_img_url').attr("href", data.replace('thumb/',''));
                    }               
                }                
                $(".edit-crop-link").show();
                $('#upload_img_url').show();
                
                $('.pane img').jzac('destroy');
                
                $('#btn_crop_submit').attr('disabled',false); 
                $('.dialog_crop').dialog("close");
                $(".dialog_crop").hide();            
            });
            event.preventDefault(); 
        },500);
     });
     /*********************** Single Image Crop: End **************/
  
});     
function IsValidImageUrl(url) {
$("<img>", {
    src: url,
    error: function() { return false; },
    load: function() { return true; }
});
}     
var DeveloperNewThreadMsg = function () {
   
    var initEditor = function (){
        $('#thread_msg_post').summernote({
                height: 300,
                disableLinkTarget: true,     // hide link Target Checkbox
                disableDragAndDrop: true,    // disable drag and drop event
                disableResizeEditor: true,
                toolbar: [
                    ['style', false],
                    ['font', ['bold', 'italic', 'underline']],
                    ['fontname', false],
                    // ['fontsize', ['fontsize']], // Still buggy
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    ['table', false],
                    ['insert', ['link', 'picture']],
                    ['help', ['help']]
                ],
                oninit: function() {
                    //$editable.closest('textarea.email-template').innerHtml = contents;
                    var init_content = $('.email-template-system').code();    
                    if(init_content == '<br>' || init_content == '<div><br></div>'){
                        $('#thread_msg_post').val('');
                    } else {
                        $('#thread_msg_post').val(init_content);
                    }                        
                },
                onChange: function(contents, $editable) {
                    //$editable.closest('textarea.email-template').innerHtml = contents;
                    if(contents == '<br>' || contents == '<div><br></div>'){
                        $('#thread_msg_post').val('');
                    } else {
                        $('#thread_msg_post').val(contents);
                    }                        
                } 
        });
         
        $('#developer_new_msg').summernote({
                height: 300,
                disableLinkTarget: true,     // hide link Target Checkbox
                disableDragAndDrop: true,    // disable drag and drop event
                disableResizeEditor: true,
                toolbar: [
                    ['style', false],
                    ['font', ['bold', 'italic', 'underline']],
                    ['fontname', false],
                    // ['fontsize', ['fontsize']], // Still buggy
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    ['table', false],
                    ['help', ['help']]
                ],
                oninit: function() {
                    //$editable.closest('textarea.email-template').innerHtml = contents;
                    var init_content = $('.email-template-system').code();    
                    if(init_content == '<br>' || init_content == '<div><br></div>'){
                        $('#developer_new_msg').val('');
                    } else {
                        $('#developer_new_msg').val(init_content);
                    }                        
                },
                onChange: function(contents, $editable) {
                    //$editable.closest('textarea.email-template').innerHtml = contents;
                    if(contents == '<br>' || contents == '<div><br></div>'){
                        $('#developer_new_msg').val('');
                    } else {
                        $('#developer_new_msg').val(contents);
                    }                        
                } 
        });
        $('.select2me').select2({
                placeholder: "Select an option",
                allowClear: true
        });
    }

    var initFileupload = function () {
        $('#developer_new_thread_form').fileupload({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: 'assets/plugins/jquery-file-upload/server/php/index.php',
            autoUpload: true
        });

        // Upload server status check for browsers with CORS support:
        if ($.support.cors) {
            $.ajax({
                url: 'assets/plugins/jquery-file-upload/server/php/index.php',
                type: 'HEAD'
            }).fail(function () {
                $('<span class="alert alert-error"/>')
                .text('Upload server currently unavailable - ' +
                      new Date())
                .appendTo('#developer_new_thread_form');
            });
        }
        
        $('#developer_new_msg_form').fileupload({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: 'assets/plugins/jquery-file-upload/server/php/index.php',
            autoUpload: true
        });

        // Upload server status check for browsers with CORS support:
        if ($.support.cors) {
            $.ajax({
                url: 'assets/plugins/jquery-file-upload/server/php/index.php',
                type: 'HEAD'
            }).fail(function () {
                $('<span class="alert alert-error"/>')
                .text('Upload server currently unavailable - ' +
                      new Date())
                .appendTo('#developer_new_msg_form');
            });
        }
    }
        
    
    return {
        //main function to initiate the module
        init: function () {
            initFileupload();
            initEditor();
        }
    };

}();
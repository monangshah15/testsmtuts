var Inbox = function () {

    var content = $('.inbox-content');
    var content_nda = $('.nda_content');
    var content_edit = $('.content_edit');
    var loading = $('.inbox-loading');
    var listListing = '';
    var editor = '';

    var initFileupload = function () {
        $('#fileupload').fileupload({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: 'plugins/jquery-file-upload/server/php/index.php',
            autoUpload: true
        });

        // Upload server status check for browsers with CORS support:
        if ($.support.cors) {
            $.ajax({
                url: 'plugins/jquery-file-upload/server/php/index.php',
                type: 'HEAD'
            }).fail(function () {
                $('<span class="alert alert-error"/>')
                .text('Upload server currently unavailable - ' +
                      new Date())
                .appendTo('#fileupload');
            });
        }
    }

    var loadCompose = function (el) {
        var url = 'inbox_compose.html';

        loading.show();
        content.html('');
        toggleButton(el);

        // load the form via ajax
        $.ajax({
            type: "GET",
            cache: false,
            url: url,
            dataType: "html",
            success: function(res) 
            {
                toggleButton(el);

                $('.inbox-nav > li.active').removeClass('active');
                $('.inbox-header > h1').text('Compose');

                loading.hide();
                content.html(res);

                initFileupload();
                $('.inbox-wysihtml5').focus();
                /*Layout.fixContentHeight();*/
                Metronic.initUniform();
            },
            error: function(xhr, ajaxOptions, thrownError)
            {
                toggleButton(el);
            },
            async: false
        });
    }
    var loadCompose_nda = function (el) {
        var url = 'inbox_compose.html';

        loading.show();
        content_nda.html('');
        toggleButton(el);

        // load the form via ajax
        $.ajax({
            type: "GET",
            cache: false,
            url: url,
            dataType: "html",
            success: function(res) 
            {
                toggleButton(el);

                $('.inbox-nav > li.active').removeClass('active');
                $('.inbox-header > h1').text('Compose');

                loading.hide();
                content_nda.html(res);

                initFileupload();
                $('#myModal2 .inbox-wysihtml5').focus();
                /*Layout.fixContentHeight();*/
                Metronic.initUniform();
            },
            error: function(xhr, ajaxOptions, thrownError)
            {
                toggleButton(el);
            },
            async: false
        });
    }
    
     var loadCompose_edit_inves = function (el) {
        var url = 'investor_editor.html';

        loading.show();
        content_edit.html('');
        toggleButton(el);

        $('.inbox-nav > li.active').removeClass('active');
        $('.inbox-header > h1').text('Compose');

        loading.hide();
        //content_edit.html(res);
        $('.content_edit #fileupload').show();
        ComponentsEditors.init();
        //initFileupload();
        
        $('#invest_summry .inbox-wysihtml5').focus();
        Metronic.initUniform();
        
        // load the form via ajax
        
        /*$.ajax({
            type: "GET",
            cache: false,
            url: url,
            dataType: "html",
            success: function(res) 
            {
                toggleButton(el);

                $('.inbox-nav > li.active').removeClass('active');
                $('.inbox-header > h1').text('Compose');

                loading.hide();
                content_edit.html(res);
                ComponentsEditors.init();
                //initFileupload();
                $('#invest_summry .inbox-wysihtml5').focus();
                Metronic.initUniform();
            },
            error: function(xhr, ajaxOptions, thrownError)
            {
                toggleButton(el);
            },
            async: false
        });*/
    }



    var handleCCInput = function () {
        var the = $('.inbox-compose .mail-to .inbox-cc');
        var input = $('.inbox-compose .input-cc');
        the.hide();
        input.show();
        $('.close', input).click(function () {
            input.hide();
            the.show();
        });
    }

    var handleBCCInput = function () {

        var the = $('.inbox-compose .mail-to .inbox-bcc');
        var input = $('.inbox-compose .input-bcc');
        the.hide();
        input.show();
        $('.close', input).click(function () {
            input.hide();
            the.show();
        });
    }

    var toggleButton = function(el) {
        if (typeof el == 'undefined') {
            return;
        }
        if (el.attr("disabled")) {
            el.attr("disabled", false);
        } else {
            el.attr("disabled", true);
        }
    }

    return {
        //main function to initiate the module
        init: function () {
          
            // handle compose btn click
            editor =  $('.content_edit #fileupload');
            $('.inbox').on('click', '.compose', function(e) {
                e.preventDefault();
                loadCompose($(this));
            });
            $('#show_summry').click(function(e) {
                $('.content_edit #fileupload').hide();
                $('.edit_investor').show();
            });
            $('.inbox').on('click', '.compose_nda', function(e) {
                e.preventDefault();
                loadCompose_nda($(this));
            });
            $('#invest_summry').on('click', '.save_investor', function(e) {
                var edited_data = $('.note-editable').html();
                $('.content_edit').addClass('content_added');
                $('.content_edit').html(edited_data);
                $('.edit_investor').show();
                 $('.inbox-loading').hide();
            })
            $('#invest_summry').on('click', '.edit_investor', function(e) {
                e.preventDefault();
                $('.edit_investor').hide();
                $('.inbox-loading').hide();
                $('.content_edit').removeClass('.content_added');
                var edit_old = $('.content_edit').html();
                $('.content_edit').html(editor);
                loadCompose_edit_inves($(this));
                //editor.setValue(edit_old)
            });

            // handle discard btn
            $('.inbox').on('click', '.inbox-discard-btn', function(e) {
                e.preventDefault();
                loadInbox($(this), listListing);
            });


            //handle compose/reply cc input toggle
            $('.inbox').on('click', '.mail-to .inbox-cc', function () {
                handleCCInput();
            });

            //handle compose/reply bcc input toggle
            $('.inbox').on('click', '.mail-to .inbox-bcc', function () {
                handleBCCInput();
            });


        }


    };

}();
// button state demo
$('.demo-loading-btn')
.click(function () {
    var btn = $(this)
    btn.button('loading')
    setTimeout(function () {
        btn.button('reset')
    }, 3000)
});

//Toggle for creating card
$(".show-card").click(function(){
    $(".collapse_new").collapse('show');
});
$(".hide-card").click(function(){
    $(".collapse_new").collapse('hide');
});
$('.bs-select').selectpicker({
    iconBase: 'fa',
    tickIcon: 'fa-check'
});
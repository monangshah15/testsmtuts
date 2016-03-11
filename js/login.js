var Login = function() {
    var handleLoginForm = function() {
  
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
        });
        
        $("#forgote_pass_error").find(".close").click(function() {
            $('#forgote_pass_error').hide();
            $('#forget_form #v_email').focus();
        });
        
        $("#btn_forgot").click(function() {
            $('#forgote_pass_error').hide();
            if($("#forget_form").valid()){
                $(this).addClass('invite_loading');
                $(this).prop('disabled',true);
                $.post($("#forget_form").attr('rel'), $("#forget_form").serialize(), function (data) {
                    data = $.trim(data);                    
                    if(data == 'TRUE'){
                        $('#forgote_pass_error').hide();
                        $('#loginform').show();
                        $('#forget_form').hide();
                        $('.forget-password-success').show();
                        $('#forget_form')[0].reset();
                        setTimeout(function(){
                            $('.forget-password-success').hide();
                        },5000);
                    } else {
                        $('#forgote_pass_error').show();
                    }
                    $("#btn_forgot").removeClass('invite_loading');
                    $('#btn_forgot').prop('disabled',false);
                    
                });
                
            } else {
                return false;
            }
        });
    	
        setTimeout(function(){
            $('.flash-inner-error').remove();
            $('.login-inner-error').remove();
        },4000);
    }
    
    var handleLogin = function() {
        $('#loginform').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                v_email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                v_email: {
                    required: "Email ID is required.",
                    email: "Please enter a valid Email ID."
                },
                password: {
                    required: "Password is required."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                $('.alert-danger', $('#loginform')).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                form.submit(); // form validation success, call ajax form submit
            }
        });

        $('#loginform input').keypress(function(e) {
            if (e.which == 13) {
                if ($('#loginform').validate().form()) {
                    $('#loginform').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleForgetPassword = function() {
        $('#forget_form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                v_email: {
                    required: true,
                    email: true
                }
            },

            messages: {
                v_email: {
                    required: "Email Id is required.",
                    email: "Please enter a valid Email ID."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   

            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                form.submit();
            }
        });

        $('.forget-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.forget-form').validate().form()) {
                    $('.forget-form').submit();
                }
                return false;
            }
        });

        jQuery('#forget-password').click(function() {
            jQuery('.login-form').hide();
            jQuery('.forget-form').show();
        });

        jQuery('#back-btn').click(function() {
            jQuery('.login-form').show();
            jQuery('.forget-form').hide();
        });

    }
    
    var handleResetPassword = function() {
        $('#reset_password').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                password: {
                    required: true,
                },
                confirm_password: {
                    required: true,
                     equalTo: "#password1"
                }
            },

            messages: {
                password: {
                    required: "Password is required."
                },
                confirm_password: {
                    required: "Confirm password is required.",
                    equalTo:"Password does not match."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                //$('.alert-danger', $('#reset_password')).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error');
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                form.submit(); // form validation success, call ajax form submit
            }
        });

        $('#reset_password input').keypress(function(e) {
            if (e.which == 13) {
                if ($('#reset_password').validate().form()) {
                    $('#reset_password').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    return {
        //main function to initiate the module
        init: function() {

            handleLogin();
            handleForgetPassword();
            handleLoginForm();
            handleResetPassword();
        }

    };

}();
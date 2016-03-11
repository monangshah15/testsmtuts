function handleLoginForm(){
    $('#frmEmpLogin').validate({
        errorElement: 'span', 
        errorClass: 'help-block', 
        focusInvalid: false, 
        rules: {
            v_email: {
                required: true,
                email: true
            },
            password: {
                required: true,
            },
            remember: {
                required: false
            }
        },    
        messages: {
            v_email: {
                required: "Please enter email id.",
                email: "Please enter valid email id."
            },
            password: {
                required: "Please enter Password."
            }
        },
    
        invalidHandler: function(event, validator) {  
            $('.alert-danger', $('#frmEmpLogin')).show();
        },
    
        highlight: function(element) { 
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
            form.submit(); 
        }
    });
    $('#forget-password').click(function()
    {
        $(".alert").remove();
        $('.help-block').remove();
        $('.form-group').removeClass('has-error');
        $('#loginform').hide();
        $('#forget_password').show();
    });

    $('#back-login').click(function()
    {
        $(".alert").remove();
        $('.help-block').remove();
        $('.form-group').removeClass('has-error');
        $('#loginform').show();
        $('#forget_password').hide();
    });
    
    $("#forgot_btn").click(function() {
            $('#forgote_pass_error').hide();
            if($("#forgot_pass_form").valid()){
                $(this).addClass('invite_loading');
                $(this).prop('disabled',true);
                $.post($("#forgot_pass_form").attr('rel'), $("#forgot_pass_form").serialize(), function (data) {
                    data = $.trim(data);                    
                    if(data == 'TRUE'){
                        $('#forgote_pass_error').hide();
                        $('#loginform').show();
                        $('#forgot_pass_form').hide();
                        $('.forget-password-success').show();
                        $('#forgot_pass_form')[0].reset();
                        setTimeout(function(){
                            $('.forget-password-success').hide();
                        },5000);
                    } else {
                        $('#forgote_pass_error').show();
                    }
                    $("#forgot_btn").removeClass('invite_loading');
                    $('#forgot_btn').prop('disabled',false);
                    
                });
                
            } else {
                return false;
            }
        });
    $('#forgot_pass_form').validate({
        errorElement: 'span', 
        errorClass: 'help-block', 
        focusInvalid: false, 
        rules: {
            email: {
                required: true,
                email: true
            }
        },
         messages: { 
         email: {
                required: "Email address is required.",
                email: "Please enter valid email id."
            }
        },
        invalidHandler: function(event, validator) {  
            $('.alert-danger', $('#forgot_pass_form')).show();
        },

        highlight: function(element) { 
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
            form.submit(); 
            $("#forgot_btn").attr('disabled',true);
        }
    });
    
  
    
    $('#reset_pass_form').validate({
        errorElement: 'span', 
        errorClass: 'help-block', 
        focusInvalid: false, 
        rules: {
            v_email:{
                required: true
            },
            password: {
                required: true,
                minlength: 6
            },
            rpassword: {
                required: true,
                equalTo: "#password"
            }
        },
         messages: {
         v_email: {
                required: "Please enter email id."
            },
         password: {
                required: "Password is required.",
                minlength: "Minimum 6 characters required."
            },
         rpassword: {
                required: "Confirm password is required."
            }
        },
        invalidHandler: function(event, validator) {  
            $('.alert-danger', $('#forgot_pass_form')).show();
        },

        highlight: function(element) { 
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
            form.submit(); 
        }
    });
}
var Login = function() {

    var handlePublicSubmitForm = function() {

        var form = $('#developer_acc_form');
        var error = $('.alert-danger', form);
        var success = $('.alert-success', form);

        $("#submit_developer_acc_create").click(function(){
            $(".form-group").removeClass('has-error');
            $(".form-group").find(".help-block-error").hide();
            success.show();
            error.hide();
            Metronic.scrollTo(success, -200);
        });

        $('#developer_acc_form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                deve_name: {
                    required: true
                },
                deve_last_name: {
                    required: true
                },
                deve_username: {
                    required: true
                },                
                deve_password: {
                    required: true,
                    minlength: 8
                },
                deve_password_rpt: {
                    required: true,
                    equalTo: 'deve_password'
                },
                deve_email: {
                    required: true,
                    email: true
                },
                options1: {
                    required: true
                },
                options2: {
                    required: true                    
                },
                options3: {
                    required: true                    
                },
                ans1: {
                    required: true
                },
                ans2: {
                    required: true                    
                },
                ans3: {
                    required: true                    
                }
            },

            messages: {
                deve_password_rpt: {
                    equalTo: 'Password & repeat password not matched', 
                }     
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                success.hide();
                error.show();
                Metronic.scrollTo(error, -200);
            },

            highlight: function (element) { // hightlight error inputs                    
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function(form) {
                success.show();
                error.hide();
                form.submit(); // form validation success, call ajax form submit
            }
        });

        $('#project-opportunity-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('#project-opportunity-form').validate().form()) {
                    $('#project-opportunity-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    


    }


 return {
        //main function to initiate the module
        init: function() {

            handlePublicSubmitForm();
        }

    };
}();
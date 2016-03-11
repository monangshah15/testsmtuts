var ComponentsPickers = function () {
    var handleDatePickers = function () {

        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: "auto",
                autoclose: true
            });
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
        }

        /* Workaround to restrict daterange past date select: http://stackoverflow.com/questions/11933173/how-to-restrict-the-selectable-date-ranges-in-bootstrap-datepicker */
    }
    
    var handleTagsInput = function () {
        if (!jQuery().tagsInput) {
            return;
        }
        $('#tags_2').tagsInput({
            width: 'auto'
        });
        $('.file_tags').tagsInput({
            width: '100%'
        });
        $('.tags_2').tagsInput({
            'defaultText':''
        });
        
        /*$('.tags_send_a_message').tagsInput({
            'defaultText':'',
            width: 'auto'
        });*/
        
        $('.tags_send_nda').tagsInput({
            'defaultText':'',
            width: 'auto'
        });
    }
    

    return {
        //main function to initiate the module
        init: function () {
            handleDatePickers();
            handleTagsInput();
        }
    };

}();
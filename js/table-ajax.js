var project_array;
var TableAjax = function (url) {

    var initPickers = function () {
        //init date pickers
        $('.date-picker').datepicker({
            rtl: Metronic.isRTL(),
            autoclose: true
        });
    }

    var handleRecords = function (url) {

        var grid = new Datatable();
        var table = $('#datatable_ajax'); // actual table jquery object
        grid.init({
            src: $("#datatable_ajax"),
            onSuccess: function (grid) {
                
                // execute some code after table records loaded
            },
            onError: function (grid) {
                // execute some code on network or other general error  
            },
            loadingMessage: 'Loading...',
            dataTable: { // here you can define a typical datatable settings from http://datatables.net/usage/options 

                // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: scripts/datatable.js). 
                // So when dropdowns used the scrollable div should be removed. 
                //"dom": "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>",
                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
                "lengthMenu": [
                    [10, 20, 50, 100, 150, -1],
                    [10, 20, 50, 100, 150, "All"] // change per page values here
                ],
                "pageLength": 10, // default record count per page
                "ajax": {
                    "url": url, // ajax source
                },
                "columnDefs":[{
                    "targets": 'no-sort',
                    "orderable": false,
                }],
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                  // Bold the grade for all 'A' grade browsers
                    setTimeout(function(){
                        $(nRow).find('.make-switch').bootstrapSwitch();
                        $(nRow).find('.make-switch').bootstrapSwitch.defaults.size = 'large';
                },1);
                }
                //"order":  [0, "desc"]// set first column as a default sort by asc
              
            }
        });

        // handle group actionsubmit button click
        /*grid.getTableWrapper().on('click', '.table-group-action-submit', function (e) {
            e.preventDefault();
            var action = $(".table-group-action-input", grid.getTableWrapper());
            if (action.val() != "" && grid.getSelectedRowsCount() > 0) {
                grid.setAjaxParam("customActionType", "group_action");
                grid.setAjaxParam("customActionName", action.val());
                grid.setAjaxParam("id", grid.getSelectedRows());
                grid.getDataTable().ajax.reload();
                grid.clearAjaxParams();
            } else if (action.val() == "") {
                Metronic.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'Please select an action',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            } else if (grid.getSelectedRowsCount() === 0) {
                Metronic.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'No record selected',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            }
        });*/
        // handle group actionsubmit button click
        grid.getTableWrapper().on('click', '.table-group-action-submit', function (e) {
            e.preventDefault();
            var action = $(".table-group-action-input", grid.getTableWrapper());
            var url = $(".table-group-action-url", grid.getTableWrapper()).val();
            if (action.val() != "" && grid.getSelectedRowsCount() > 0) {
                 var send_data = {};
                 send_data.action = action.val();
                 send_data['ids'] = grid.getSelectedRows();
                 bootbox.confirm('Are you sure you want to delete selected record?', function (confirmed) {
                    if(confirmed){
                        $.post(url,send_data, function(data) {
                            if(data == 'TRUE') {
                                send_data_action = send_data.action.toLowerCase();
                                    if(send_data_action == 'active') {
                                        send_data_action = 'actived';
                                    } else if(send_data_action == 'inactive') { 
                                        send_data_action = 'inactived';
                                    } else {
                                        send_data_action = 'deleted';
                                    }
                                Metronic.alert({
                                    type: 'success',
                                    icon: 'check',
                                    message: 'Record has been '+send_data_action +' successfully.',
                                    container: grid.getTableWrapper(),
                                    place: 'prepend'
                                });
                                $.each(send_data['ids'], function(i,id) {
                                    if(send_data.action == 'Active'){
                                        $('tbody > tr > td > .status_' + id, table).addClass('label-success');
                                        $('tbody > tr > td > .status_' + id, table).removeClass('label-danger');
                                        $('tbody > tr > td > .status_' + id, table).text(send_data.action);
                                    } else if(send_data.action == 'Inactive'){
                                        $('tbody > tr > td > .status_' + id, table).addClass('label-danger');
                                        $('tbody > tr > td > .status_' + id, table).removeClass('label-success');
                                        $('tbody > tr > td > .status_' + id, table).text(send_data.action);
                                    } else {
                                       $('tbody > tr > td  .delete_' + id, table).closest('tr').fadeOut(1500, function() {
                                            $(this).closest('tr').remove();
                                            $('#datatable_ajax').DataTable().ajax.reload();
                                            if($("#datatable_ajax tbody > tr").length <= 1) {
                                                $(".filter-submit").trigger( "click" );
                                            }
                					   });  
                                    }
                                });
                                setTimeout(function(){ $('.alert-success').fadeOut(4000); },3000);      
                                var set = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', table);
                                var checked = $(this).is(":checked");
                                $(set).each(function() {
                                    $(this).attr("checked", false);
                                });
                                $('.table-group-action-input').val('');
                                $('.group-checkable').attr("checked", false);
                                $.uniform.update(set, table);
                                $.uniform.update($('.group-checkable', table));
                            }
                        });
                    }
                });
            } else if (action.val() == "") {
                Metronic.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'Please select an action',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            } else if (grid.getSelectedRowsCount() === 0) {
                Metronic.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'No record selected',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            }
        });
        
        $(".form-filter").val('');
        // handle group actionsubmit button click
        $(document).on('click', '#export_to_excel', function (e) {
             var send_data = $('#datatable_ajax').DataTable().ajax.params();
             //var send_data = grid.getAjaxParams();
             var send_data = $.param(send_data);
             var url = $(this).attr('action-url');
             window.location.href = url+ '?' + decodeURI(send_data);
        });
    }

    return {

        //main function to initiate the module
        init: function (url) {
            initPickers();
            handleRecords(url);
        }

    };

}();
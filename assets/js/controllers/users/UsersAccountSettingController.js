'use strict';
app.controller('UsersAccountSettingController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    /* Begin add form */
    $rootScope.filename = '';
    $rootScope.parent_items = {};
    $rootScope.add_fields = {};
    $rootScope.edit_fields = {};
    $rootScope.view_data = {};
    $rootScope.search_fields = {};
    $rootScope.selected_record = {};
    $rootScope.prev_record = false;   
    $rootScope.nexts_record = false;
    $rootScope.timeStamp = Date.now();
    
    $rootScope.submit_frm_edit = function(edit_fields){
        if(form_valid('#frmEdit',"help-block")){
            //Call submit data services   
            edit_fields.v_img = $('#full-image-element').val();
            edit_fields.v_img_thumb = $('#crop-image-element').val();
                $http.post(GLOBAL.API_USER_URL+"update_account_setting", edit_fields).success(function(data, status, headers, config) {
                    if(angular.element.trim(data) == 'TRUE'){         
                       
                        $rootScope.success_msg = 'Updated successfully';
                        // To clear form elements
                        setTimeout(function(){
                            $rootScope.v_name = edit_fields['v_name'];
                            angular.element('.alert-success').fadeIn(1000);
                            angular.element('.alert-success').fadeOut(2000);
                        },500);
                    } else {
                        return false;
                    }
              });               
        }
    };
        
    $scope.$on('$viewContentLoaded', function() 
    {
        var responsePromise = $http.post(GLOBAL.API_USER_URL+"account_setting");
        responsePromise.success(function(data, status1, headers, config) 
        {
            if(data.items != "" && data.items != undefined)
            {
                $timeout(function()
                {
                    $rootScope.edit_fields = data.items;
                    if($rootScope.edit_fields.v_company_logo != ''){
                        var imagePath = GLOBAL.TEMP_IMG_PATH+'company-'+$rootScope.edit_fields.v_encryption_id+'/';
                        $scope.imageDataURI = GLOBAL.SITE_URL + imagePath + $rootScope.edit_fields.v_company_logo+'?'+$rootScope.timeStamp;
                        $scope.enableCrop = true;
                        $scope.image_type = "Existing";
                    } else {
                        $scope.imageDataURI='';
                        $scope.enableCrop = false;
                        $scope.image_type = "New";
                    }
                });
            } else {
                $state.go('/');  
            }
        });       
    });
    
    
    
    
    /* Begin image uplaod and crop functionality */    
    $scope.size='small';
    $scope.type='circle';
    //$scope.enableCrop = false;
    //$scope.imageDataURI='';
    $scope.resImageDataURI='';
    $scope.resImgFormat='image/webp';
    $scope.resImgQuality=1;
    $scope.selMinSize=100;
    $scope.resImgSize=200;
    $scope.validImage = 1;
    $scope.error_message = "";
    $scope.changeOnFly = true;
    $scope.imageSaved = 1;
    $scope.cropImageElementId = "crop-image-element";
    $scope.fullImageElementId = "full-image-element";
    
    //$scope.aspectRatio=1.2;
    $scope.onChange=function($dataURI) {
      //console.log('onChange fired');
    };
    $scope.onLoadBegin=function() {
      //console.log('onLoadBegin fired');
    };
    $scope.onLoadDone=function() {
      //console.log('onLoadDone fired');
    };
    $scope.onLoadError=function() {
      //console.log('onLoadError fired');
    };
            
    var handleFileSelect = function(evt) 
    {     
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
            
            $scope.$apply(function($scope) {
                if (evt.target.result.toLowerCase().indexOf("data:image/png;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpg;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/gif;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpeg;base64") >= 0) {
                    if(file_size < GLOBAL.MAX_UPLOAD_SIZE*1000) {
                        $scope.validImage = 1;
                        $scope.enableCrop = true;
                        $scope.imageDataURI = evt.target.result;                            
                    } else {
                        $scope.validImage = 0;
                        $scope.error_message = GLOBAL.INVALID_IMAGE_SIZE;
                    }
                } else {
                    $scope.validImage = 0;  
                    $scope.error_message = GLOBAL.INVALID_IMAGE_EXTENSION;                                               
                }
            });
        };
        reader.readAsDataURL(file); 
    };
    
    
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    
    $scope.$watch('resImageDataURI',function(){
        //console.log('Res image', $scope.resImageDataURI);
    });   
    
    $scope.trigger = function(elem) {
        $(elem).trigger('click');
    };
    
    $scope.removeImage = function() {
        angular.element('.cropArea').remove();
        $scope.enableCrop = false;
        $scope.validImage = 1;
        $scope.imageDataURI='';
        angular.element("#fileInput").val("");
    }
    $scope.onLoadError = function(e) {
        console.log(e);
    }
    
});
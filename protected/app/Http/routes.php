<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
//After Login 
Route::group(['prefix' => ADMIN_NAME,'middleware' => 'guest'], function()
{
    Route::any('/',array('uses' => 'AdminAuthenticateController@dashboard'));
    Route::any('/dashboard',array('uses' => 'AdminAuthenticateController@dashboard'));
});
Route::group(['prefix' => ADMIN_NAME, 'middleware' => 'auth'], function() {
	Route::any('/logout',array('uses' => 'AdminAuthenticateController@logout'));
    Route::any('/dashboard',array('uses' => 'AdminAuthenticateController@dashboard'));
    Route::any('/update_account_setting',array('uses' => 'AdminAuthenticateController@update_account_setting'));
    Route::any('/logout',array('uses' => 'AdminAuthenticateController@logout'));
	Route::any('/{url}',array('uses' => 'AdminAuthenticateController@dashboard'));
    Route::any('/{url}/{param1}',array('uses' => 'AdminAuthenticateController@dashboard'));
    Route::any('/{url}/{param1}/{param2}',array('uses' => 'AdminAuthenticateController@dashboard'));    
});


Route::group(['prefix' => API_ADMIN_NAME, 'middleware' => 'guest'], function(){
    /* Login required and with api prefix */
    Route::any('/check-auth-status',array('uses' => 'AdminAuthenticateController@check_auth_status'));
    Route::any('/check-login-status',array('uses' => 'AdminAuthenticateController@check_login_status'));
    Route::any('/send-forgot-password',array('uses' => 'AdminAuthenticateController@forgot_password'));
    Route::any('/reset-password/{access_code}',array('uses' => 'AdminAuthenticateController@reset_password'));
    Route::any('/reset-password-status/{access_code}',array('uses' => 'AdminAuthenticateController@reset_password_status'));
});

//Before Login 
/**/

Route::group(['prefix' => API_ADMIN_NAME, 'middleware' => 'auth'],function(){
	Route::any('/account_setting',array('uses' => 'AdminAuthenticateController@account_setting'));
    Route::any('/update_account_setting',array('uses' => 'AdminAuthenticateController@update_account_setting'));
    /*Route::any('/setting',array('uses' => 'AdminSettingController@setting'));
    Route::any('/edit_setting',array('uses' => 'AdminSettingController@edit_setting'));
    Route::any('/setting/upload_img',array('uses' => 'AdminSettingController@anyUploadImg'));*/
    Route::any('/user_login{id}',array('uses' => 'UserAuthenticateController@anyUserLogin'));
    Route::any('/get_status_list',array('uses' => 'AdminUsersController@get_status_list'));
    Route::any('/dashboard-count',array('uses' => 'AdminAuthenticateController@dashboard_count'));
    Route::controller('users', 'AdminUsersController');
});

/** *-----------------------------------------------------------------------------------------------------------------*/

Route::group(['prefix' => API_USER_NAME, 'middleware' => 'guest'], function(){
    /* Login required and with api prefix */
    Route::any('/check-auth-status',array('uses' => 'UserAuthenticateController@check_auth_status'));
    Route::any('/check-login-status',array('uses' => 'UserAuthenticateController@check_login_status'));
    Route::any('/send-forgot-password',array('uses' => 'UserAuthenticateController@forgot_password'));
    Route::any('/send-security-check',array('uses' => 'UserAuthenticateController@security_check'));
    Route::any('/reset-password/{access_code}',array('uses' => 'UserAuthenticateController@reset_password'));
    Route::any('/reset-password-status/{access_code}',array('uses' => 'UserAuthenticateController@reset_password_status'));
});
Route::group(['prefix' => API_USER_NAME, 'middleware' => 'user'], function(){
    /* Login required and with api prefix */
    Route::any('/account_setting',array('uses' => 'UserAuthenticateController@account_setting'));
    Route::any('/my_profile/post_upload_for_ie',array('uses' => 'UserAuthenticateController@post_upload_for_ie'));
    Route::any('/update_account_setting',array('uses' => 'UserAuthenticateController@update_account_setting'));
    Route::any('/get_count',array('uses' => 'UserAuthenticateController@get_count'));
    Route::any('/dashboard-count',array('uses' => 'UserAuthenticateController@dashboard_count'));
    Route::any('/get_all_lists/{url?}',array('uses' => 'UserAuthenticateController@get_all_lists'));
    Route::controller('schools', 'SchoolsController');
    Route::controller('batches', 'BatchesController');
    Route::controller('subjects', 'SubjectsController');
    Route::controller('students', 'StudentsController');
    Route::controller('exams', 'ExamsController');
    Route::controller('attendances', 'AttendancesController');
    Route::controller('news', 'NewsController');
    Route::controller('marks', 'MarksController');
    Route::controller('fees', 'FeesController');
});

Route::any('/',array('uses' => 'UserAuthenticateController@dashboard'));
Route::group(['middleware' => 'user'], function() {
    Route::any('/',array('uses' => 'UserAuthenticateController@dashboard'));
    Route::any('/logout',array('uses' => 'UserAuthenticateController@logout'));
    Route::any('/{url}',array('uses' => 'UserAuthenticateController@dashboard'));
    Route::any('/{url}/{param1}',array('uses' => 'UserAuthenticateController@dashboard'));
    Route::any('/{url}/{param1}/{param2}',array('uses' => 'UserAuthenticateController@dashboard'));
});
/*App::missing(function($exception) {
    return Response::view('errors.missing', array(), 404);
    //return Redirect::to('someurl');
});*/
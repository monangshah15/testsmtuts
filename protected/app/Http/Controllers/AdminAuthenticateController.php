<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Template;
use Auth, Input, Hash, Session, Redirect;
class AdminAuthenticateController extends Controller
{
    public function check_auth_status()
    {
        if(Auth::check() && Auth::user()->e_type == 'Super')
        {
            echo Auth::user()->id;
            exit;
        }
        echo '0';
        exit;
    }

    public function reset_password_status($access_code = "")
    {
        $objUser = Admin::where('v_access_code','=',$access_code)->count();
        if($objUser > 0)
        {
            echo '1';
            exit;
        }
        echo '0';
        exit;
    }

    public function check_login_status()
    {
        $arrData = Input::all();
        if($arrData)
        {
            $remember = (Input::has('remember')) ? true : false;
            $auth = Auth::attempt(array(
                'v_email' => $arrData['v_username'],
                'password' => $arrData['v_password'],
                'e_type' => 'Super'    
            ),$remember);
            if($auth) {
                return response(array('login_status'=>(Auth::user()->id * CIPHER_KEY) + CIPHER_KEY,'v_name' => Auth::user()->v_name));
            } 
        }
        echo '0';
        exit;
    }
    
    public function dashboard()
    {
        return view('admin.dashboard', array('title' => 'Dashboard'));
    }
    
    public function forgot_password()
    {
        if (Input::all() and Input::has('email')) {
            $adminData = Admin::where('v_email', '=', e(trim(Input::get('email'))))->where('e_type','Super')->first();
            if(empty($adminData)) 
            {
                echo "0";
            } 
            else 
            {
                $v_access_code= str_random(10);
                $adminData->v_access_code = $v_access_code; // random access_code 
                if ($adminData->save())
                {
                    $objEmailTemplate = Template::find(1);
                    $strTemplate = $objEmailTemplate['t_email_content'];
                    $strTemplate = str_replace('[SITE_URL]',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('[SITE_NAME]',SITE_NAME,$strTemplate);
                    $strTemplate = str_replace('../',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('[LINK]',ADMIN_URL.'reset-password/'.$v_access_code,$strTemplate);
                    $strTemplate = str_replace('[USERNAME]',$adminData->v_name,$strTemplate);
                    @ob_end_clean();
                    header("Connection: close");
                    ignore_user_abort(); 
                    ob_start();
                    header('HTTP/1.1 200 OK', true, 200);
                    echo "TRUE";
                    $size = ob_get_length();
                    header("Content-Length: $size");
                    ob_end_flush();
                    flush();
                    session_write_close();
                    Mail::send('emails.auth.generate-email-template',array('strTemplate' => $strTemplate), function($message) use ($adminData,$objEmailTemplate)
                    {
                        $message->to($adminData->v_email, $adminData->v_name);
                        $message->replyTo(FROM_EMAIL_ADDRESS, FROM_EMAIL_ADDRESS_NAME);
                        $message->subject($objEmailTemplate['v_template_subject']);                        
                    });
                  }
            }
        }
        exit;
    }

    public function reset_password($access_code = "")
    {
        if (Input::all())
        {
            $strPassword= e(trim(Input::get('password'))); // getting password value
            $objUser = Admin::where('v_access_code','=',$access_code);
            $objUser  = $objUser->first();
            //$objUser->v_txt_password = $strPassword;
            $objUser->password = Hash::make($strPassword); // convert password into hash formate
            $objUser->v_access_code = '';
            if($objUser->save()) // save new password
            {
                echo "1";
            }
        }
        echo "0";
        exit;
    }
    
    public function test($code)
    {
        echo $code;exit;
    }

    public function account_setting()
    {
        if(Auth::check() == true && Auth::user()->e_type == 'Super')
        {
            $arrData = Auth::user();
            $results = [
                'items' => $arrData,
                'access_page' => 'my_profile'
            ];
            return json_encode($results);
        } else {
            return json_encode(array());   
        }
    }
    
    public function update_account_setting()
    {
        $arrData = Input::all();
        if(!empty($arrData) && count($arrData) > 0)
        {
            $check_dupliacte_email = Admin::where('v_email' , '=' , $arrData['v_email'])->where('id','!=',$arrData['id'])->get()->count();
            if($check_dupliacte_email > 0)
            {
                return 'Email address';
            }
            
            $arrUser = Admin::find($arrData['id']);

            $arrUser->v_name = e(trim($arrData['v_name']));
            $arrUser->v_email = e(trim($arrData['v_email']));
            if(isset($arrData['v_password']))
            {
                //$arrUser->v_txt_password = $arrData['v_password'];
                $arrUser->password = Hash::make(e(trim($arrData['v_password'])));
            }
            if($arrUser->save())
            {
                return 'TRUE';
            }
            return "FALSE";  
        }
        return "FALSE";
    }
    
    /*public function setting()
    {
        if(Auth::check() == true && Auth::user()->e_type == 'Super')
        {
            $arrData = Setting::find(1);
            $results = [
                'items' => $arrData,
                'access_page' => 'setting'
            ];
            return json_encode($results);
        } else {
            echo '0';
        }
    }
    
    public function edit_setting()
    {
        $arrData = Input::all();
        if(!empty($arrData) && count($arrData) > 0)
        {  
            $arrSetting = Setting::find($arrData['id']);
            $arrSetting->v_carrier = e(trim($arrData['v_carrier']));
            $arrSetting->v_carrier_licence_number = e(trim($arrData['v_carrier_licence_number']));
            $arrSetting->v_disposal_destination = e(trim($arrData['v_disposal_destination']));
            if($arrSetting->save())
            {
                return 'TRUE';
            }
            return "FALSE";  
        }
        return "FALSE";
    }*/
    

    public function logout()
    {
        Auth::logout();
        Session::remove('SessionUser');
        Session::flash('message', "You have successfully logout.");
        return Redirect::to(ADMIN_URL);   
    }
    
    public function dashboard_count()
    {
        $total = array();
        $total['total_user'] = Admin::where('e_type','Simple')->count();
        $results = ['items' => $total];
        return json_encode($results);
    }
    
    public function get_all_lists()
    {
        $arrRecord = array();
        $arrRecord['userslist'] = Admin::where('e_type','Simple')->orderBy('v_name','ASC')->lists('v_name','id')->toArray();
        $results = [
    	    'user_list' => $arrRecord['userslist'],
        ];
        return json_encode($results);
        
    }
}

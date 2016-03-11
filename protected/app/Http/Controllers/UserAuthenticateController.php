<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\School;
use App\Models\Batch;
use App\Models\Subject;
use App\Models\Student;
use App\Models\Exam;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Auth, Input, Session, Validator, Hash,DB;
use App\Models\Template;

class UserAuthenticateController extends Controller
{
    public function check_auth_status()
    {
        if(Auth::check() && Auth::user()->e_type == 'Simple')
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
        /*$record = Admin::find(7);
        $record->v_email = 'user@gmail.com';
        $record->password = Hash::make('this.admin');
        $record->save();*/
        $requestData = Input::all();
        if(!empty($requestData) && count($requestData) > 0)
        {
            $strMessage='';
            $strMessageInactive = '';
            $strRemember = (Input::has('remember') ? true : false); // getting value of remember me
            
            $comapnyData = Admin::where('v_company_alias',Input::get('v_company_alias'))->first();
            if(count($comapnyData) == 0){
                return '2';
            } else {
                if($comapnyData->e_status == 'Inactive')
                {
                    return '3';
                }
            }
            $objCompanyUserAuth = Auth::attempt(array( 
                    'v_email' => Input::get('v_username'),
                    'password' => Input::get('v_password'),
                    'v_company_alias' => Input::get('v_company_alias'),
                    'e_type' => 'Simple'
            ),$strRemember);
            if($objCompanyUserAuth)
            {
                Auth::user()->get()->d_recent_login = date('Y-m-d H:i:s');
                Auth::user()->save();
                $user = Auth::user();
                $userImage =  SITE_URL.TEMP_IMG_PATH.'company-'.$user->v_encryption_id.'/'.$user->v_company_logo;
                return response(array('login_status'=>($user->id * CIPHER_KEY) + CIPHER_KEY,'v_name' => $user->v_name,'v_image'=>$userImage));
            }
        }
        
        return 0;
    }
    
    public function dashboard()
    {
        return view('user.dashboard', array('title' => 'Dashboard')); 
    }

    public function forgot_password()
    {
        if (Input::all() and Input::has('email')) {
            $record = Admin::where('v_email', '=', e(trim(Input::get('email'))))->where('e_type','Simple')->first();
            if(empty($record)) 
            {
                echo "0";
            } 
            else 
            {
                $v_access_code = str_random(10);
                $record->v_access_code = $v_access_code; // random access_code 
                if ($record->save())
                {
                    $objEmailTemplate = Template::find(1);
                    $strTemplate = $objEmailTemplate['t_email_content'];
                    $strTemplate = str_replace('[SITE_URL]',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('[SITE_NAME]',SITE_NAME,$strTemplate);
                    $strTemplate = str_replace('../',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('[LINK]',SITE_URL.'reset-password/'.$v_access_code,$strTemplate);
                    $strTemplate = str_replace('[USERNAME]',$record->v_name,$strTemplate);
                    
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
                    // mail sent to user with new link 
                    //queue
                    Mail::send('emails.auth.generate-email-template',array('strTemplate' => $strTemplate), function($message) use ($record,$objEmailTemplate)
                    {
                        $message->to($record->v_email, $record->v_username);
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

    public function account_setting()
    {
        if(Auth::check() == true && Auth::user()->e_type == 'Simple')
        {
            $arrData = Auth::user();
            $results = [
                'items' => $arrData,
                'access_page' => 'account_setting'
            ];
            return json_encode($results);
        } else {
            return json_encode(array());
        }
    }
    
    public function update_account_setting()
    {
        if(Auth::check() == true && Auth::user()->e_type == 'Simple')
        {
            $data = Input::all();
            $objValidator = Validator::make(Input::all(), array(  //method for server side validation 
                'v_email'  => 'required|email|unique:tbl_administrators,v_email,'.$data['id'],
            ),array(
                'required'=>'Required',
                'email'=>'Invalid email',
                'unique' => 'exists'
            ));
            if($objValidator->fails())
            {
                return $objValidator->errors();
            }        
            if(!empty($data)){
                $passFlag = 0;
                $record = Admin::find(Auth::user()->id);
                if(isset($data['v_password']) && $data['v_password'] != '')
                {
                    $record->password = Hash::make($data['v_password']);
                    $passFlag = 1;
                }
                $record->v_name = $data['v_name'];
                $record->v_email = $data['v_email'];
                $record->v_phone = $data['v_phone'];
                $record->v_company_name = $data['v_company_name'];
                $record->v_company_email = $data['v_company_email'];
                $record->v_company_address = $data['v_company_address'];
                $record->v_user_signature = $data['v_user_signature'];
                $record->updated_at = date('Y-m-d H:i:s');        
                if(isset($data['v_img']) && $data['v_img'] !='' && $data['v_img'] != SITE_URL.TEMP_IMG_PATH.'company-'.$record->v_encryption_id.'/'.$record->v_company_logo){
                    // Save Image 
                    $base64_fullImg = $data['v_img'].'=';
                    $v_random_image = time().'-'.str_random(6);
                    $path = TEMP_IMG_PATH;
                    $imageName =  $this->generateImage($base64_fullImg, $v_random_image,$path);
                    $imageName = $this->generateImage($base64_fullImg, $v_random_image,$path);
                    if($imageName){
                        // Save Thumb Image 
                        $base64_fullImg = $data['v_img_thumb'].'=';
                        $thumb_path = TEMP_IMG_PATH.'thumb/';
                        $imageName = $this->generateImage($base64_fullImg, $v_random_image, $thumb_path);
                    }
                    $v_image = $imageName;
                    if(isset($v_image) && $v_image != "")
                    {
                        rename(TEMP_IMG_PATH.$v_image,TEMP_IMG_PATH.'company-'.$record->v_encryption_id.'/'.$v_image);
                        rename(TEMP_IMAGE_THUMB_PATH.$v_image,TEMP_IMG_PATH.'company-'.$record->v_encryption_id.'/thumb/'.$v_image);             
                        if(file_exists(DOC_ROOT.FOLDER_NAME.TEMP_IMG_PATH.'company-'.$record->v_encryption_id.'/'.$record->v_company_logo))
                        {
                            @unlink(DOC_ROOT.FOLDER_NAME.TEMP_IMG_PATH.'company-'.$record->v_encryption_id.'/'.$record->v_company_logo);
                            @unlink(DOC_ROOT.FOLDER_NAME.TEMP_IMG_PATH.'company-'.$record->v_encryption_id.'/thumb/'.$record->v_company_logo);
                        }
                    }
                    $record->v_company_logo = $v_image;
                }
                $record->save();
                return 'TRUE';
            }
        } else {
            return json_encode(array());    
        }
    }

    public function logout()
    {
        Auth::logout();
        Session::remove('SessionUser');
        Session::flash('message', "You have successfully logout.");
        return redirect(SITE_URL);                
    }
    
    public function dashboard_count()
    {
        if(Auth::check())
        {
            $total = array();
            /*$total['total_students'] = Student::where('i_user_id',Auth::user()->id)->count();
            $total['total_exam'] = Exam::where('i_user_id',Auth::user()->id)->count();*/
            $results = ['items' => $total];
    	    return json_encode($results);
        } else {
            return json_encode(array());
        }
    }
    
    public function get_all_lists($sectionName)
    {
        if(Auth::check())
        {
            $students = array();
            $schools = array();
            $batches = array();
            $subject = array();
            $template = array();
            $exam = array();
            
            $companyData = Auth::user();
            $this->dynamic_db_connection($companyData);
            $batches = Batch::where('e_status','Active')->orderBy('v_batch_title','ASC')->lists('v_batch_title','id');
            if($sectionName !='' && $sectionName == 'attendances')
            {
                $students = Student::where('e_status','Active')->select('id','i_batch_id', DB::raw('CONCAT(v_first_Name, " ", v_last_Name) AS v_name'))->orderBy('v_name','ASC')->get();    
                $template = Template::where('e_status','Active')->where('e_type','Attendence')->select('id', 'v_template_title','v_template_content')->orderBy('v_template_title','ASC')->get();
            } elseif($sectionName !='' && $sectionName == 'exams')
            {
               $subject = Subject::where('e_status','Active')->orderBy('v_subject_name','ASC')->lists('v_subject_name','id');
            } elseif($sectionName !='' && $sectionName == 'fees')
            {
                $students = Student::where('e_status','Active')->select('id','i_batch_id', DB::raw('CONCAT(v_first_Name, " ", v_last_Name) AS v_name'))->orderBy('v_name','ASC')->get();
                $template = Template::where('e_status','Active')->where('e_type','Fee')->select('id', 'v_template_title','v_template_content')->orderBy('v_template_title','ASC')->get();
            } elseif($sectionName !='' && $sectionName == 'marks')
            {
               $exam = Exam::where('e_status','Active')->select('id', 'v_title','d_date','i_subject_id', 'i_batch_id','i_total_marks')->orderBy('d_date','ASC')->get();
               $subject = Subject::where('e_status','Active')->orderBy('v_subject_name','ASC')->lists('v_subject_name','id');
               $template = Template::where('e_status','Active')->where('e_type','Mark')->select('id', 'v_template_title','v_template_content')->orderBy('v_template_title','ASC')->get();
               $students = Student::where('e_status','Active')->select('id','i_batch_id', DB::raw('CONCAT(v_first_Name, " ", v_last_Name) AS v_name'))->orderBy('v_name','ASC')->get();    
            } elseif($sectionName !='' && $sectionName == 'news')
            {
                $students = Student::where('e_status','Active')->select('id','i_batch_id', DB::raw('CONCAT(v_first_Name, " ", v_last_Name) AS v_name'))->orderBy('v_name','ASC')->get();    
                $template = Template::where('e_status','Active')->where('e_type','Other')->select('id', 'v_template_title','v_template_content')->orderBy('v_template_title','ASC')->get();
                
            } elseif($sectionName !='' && $sectionName == 'student')
            {
                $schools = School::where('e_status','Active')->orderBy('v_title','ASC')->lists('v_title','id');    
            }
            $results = [
        	    'students_list' => $students,
                'schools_list' => $schools,
                'batches_list' => $batches,
                'subjects_list' => $subject,
                'templates_list' => $template,
                'exams_list' => $exam
            ];
            return $results;
        } else {
            return json_encode(array());
        }
    }
    
}

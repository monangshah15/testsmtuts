<?php 
namespace App\Http\Controllers;

use Validator, Session, Input, Auth, Hash, Mail, Excel,Config,File, DB;
use Illuminate\Support\Str;
use App\Models\Admin;
use App\Models\CompanyUser;
use App\Models\EmailTemplate;
use UploadHandler;
class AdminUsersController extends Controller 
{
    /* Use listing*/
	public function postIndex()
	{
	    if(Auth::check() != true || Auth::user()->e_type != 'Super')
        {
            return json_encode(array());
        }
	    $data = Input::get();
        $query = new Admin;
        //pr($data); exit;
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$query = $query->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $query = $query->orderBy('i_order','ASC');
		}
        
        if(isset($data['search_fields']['v_name']) && $data['search_fields']['v_name']!=""){
			$query = $query->where('v_name', 'LIKE',"%".$data['search_fields']['v_name']."%");
		}
        
		if(isset($data['search_fields']['v_email']) && $data['search_fields']['v_email']!=""){
			$query = $query->where('v_email', 'LIKE',"%".$data['search_fields']['v_email']."%");
		}
        if(isset($data['search_fields']['v_company_name']) && $data['search_fields']['v_company_name']!=""){
			$query = $query->where('v_company_name', 'LIKE',"%".$data['search_fields']['v_company_name']."%");
		}
        if(isset($data['search_fields']['e_messages_type']) && $data['search_fields']['e_messages_type']!=""){
			$query = $query->where('e_messages_type', 'LIKE',"%".$data['search_fields']['e_messages_type']."%");
		}
        if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
			$query = $query->where('e_status', '=',$data['search_fields']['e_status']);
		}
		$current_user = Auth::user()->id;
        $query->where("id", "!=", $current_user);
        $user = $query->paginate($data['rec_per_page']);
        
        $arrUser = $user->toArray();
        $results = [
    	    'items' => $arrUser['data'],
            '_meta' => [
    	        'total'   => $arrUser['total'],
    	        'rpp'     => $arrUser['per_page'],
    	        'current' => $arrUser['current_page'],
    	        'last_page'    => $arrUser['last_page'],
    	        'from'         => $arrUser['from'],
    	        'to'           => $arrUser['to']
    	    ]
    	];
	    return json_encode($results);
	}
    
    public function anyData($id)
    {
        $query = Admin::query();
        $query = $query->where('id','=',$id);
        $user = $query->first();
        if(count($user) > 0){
            $arrUser = $user->toArray();
            $results = array('items' => $arrUser);
            return json_encode($results);    
        } else {
            return json_encode(array());
        }
        
    }
    
    public function postAdd()
	{
	   if(Auth::check() != true || Auth::user()->e_type != 'Super')
        {
            return json_encode(array());
        }
	    $strErrorMessage = 'error';
	    $data = Input::get();
        $objValidator = Validator::make(Input::all(), array(  //method for server side validation 
                'v_company_name'  => 'required',
                'v_name'  => 'required',
                'v_phone'  => 'required',
                'v_email'  => 'required|email|unique:tbl_administrators',
                'v_username'  => 'unique:tbl_administrators',
                'v_company_alias'=>'required|unique:tbl_administrators'
        ),array(
            'required'=>'Required',
            'email'=>'Invalid email',
            'unique' => 'exists',
            'v_company_alias.unique' =>'Company alias already exist'
        ));
        
        if($objValidator->fails())
        {
            return $objValidator->errors();
        }
        
        if(!empty($data)){
            $code = str_random(10);
            $v_encryption_id = customEncrypt(str_random(2).time().str_random(2));
            $v_db_name = 'db_'.$v_encryption_id;
            $v_db_host = DB_HOST;
            $v_db_user = DB_USER;
            $v_db_password = DB_PASSWORD;
            
            // generate new database with respect to company
            $strSql="CREATE DATABASE ".$v_db_name;
            DB::statement($strSql); 
            
            // get all the table which we need to create
            $tables = DB::select(DB::raw('SHOW TABLES'));
            
            foreach($tables as $value) {
                if(current($value) != "tbl_administrators")
                {
                    $aTables[] = current($value);
                }
            }
            $i = 0;
            $aFields = array();
            // get the fields with respect to database
            foreach ($aTables as $table) {
                $desc = DB::select(DB::raw("describe " . $table));
                foreach($desc as $key => $row)
                {
                    $aFields[$i][] = array($row->Field,$row->Type,$row->Null,$row->Key,$row->Default,$row->Extra);   
                }
                $i++;
            }
            // connect new database using below code
            Config::set('database.connections.'.$v_db_name, array(
                'driver'    => 'mysql',
                'host'      => $v_db_host,
                'database'  => $v_db_name,
                'username'  => $v_db_user,
                'password'  => $v_db_password,
                'charset'   => 'utf8',
                'collation' => 'utf8_unicode_ci',
                'prefix'    => '',
            ));
            
            // create duplicate database into mysql
            $con = DB::connection($v_db_name);
            for ($i = 0; $i < count($aTables); $i++) 
            {
                $insert_column = "";
                $intCount = 0;
                foreach($aFields[$i] as $key => $value)
                {
                    if($intCount == 0)
                    {
                          $insert_column = $insert_column."$value[0] $value[1] NOT NULL AUTO_INCREMENT, "; 
                          $add_primary_key = "PRIMARY KEY ($value[0])"; 
                    }
                    else
                    {
                        $insert_column = $insert_column."$value[0] $value[1], ";   
                    } 
                    $intCount++;
                }
                $insert_column = $insert_column.$add_primary_key;
                
                $query = "CREATE TABLE IF NOT EXISTS $aTables[$i]($insert_column)";
                $con->statement($query);
                $query = "";
                $result = DB::select(DB::raw("SELECT * FROM $aTables[$i]"));
                
                if(!empty($result) && count($result) > 0)
                {
                    $query .= "INSERT INTO $aTables[$i] VALUES";
                    
                    foreach($result as $table_val) 
                    {
                        $query .= '(';
                        $intC = 0;
                        
                        foreach ($table_val as $field => $value) {
                            if($intC < (count((array)$table_val)-1))
                            {
                                $query .= "'".addslashes($value)."',";   
                            }
                            else
                            {
                                $query .= "'".addslashes($value)."'";
                            }
                            $intC++;
                        }
                        $query .= '),';
                    }
                    $query = rtrim($query,',');
                    $con->statement($query);
                }
            }
            $companyDirectory = File::makeDirectory(TEMP_IMG_PATH.'company-'.$v_encryption_id, 0777, true, true);
            $companyThumbDirectory = File::makeDirectory(TEMP_IMG_PATH.'company-'.$v_encryption_id.'/'.'thumb', 0777, true, true);
            $v_image = '';
            if(Input::get('v_img') !=''){
                // Save Image 
                $base64_fullImg = Input::get('v_img').'=';
                $v_random_image = time().'-'.str_random(6);
                $path = TEMP_IMG_PATH.'company-'.$v_encryption_id.'/';
                $imageName =  $this->generateImage($base64_fullImg, $v_random_image,$path);
                $imageName = $this->generateImage($base64_fullImg, $v_random_image,$path);
                if($imageName){
                    // Save Thumb Image 
                    $base64_fullImg = Input::get('v_img_thumb').'=';
                    $path = TEMP_IMG_PATH.'company-'.$v_encryption_id.'/'.'thumb/';
                    $imageName = $this->generateImage($base64_fullImg, $v_random_image, $path);
                }
                $v_image = $imageName;
            }
            /*if(isset($v_image) && $v_image != "")
            {
                $v_image = $this->saveImage($v_image); 
                if(file_exists(TEMP_IMG_PATH.$v_image))
                {
                    rename(TEMP_IMG_PATH.$v_image,TEMP_IMG_PATH.'company-'.$v_encryption_id.'/'.$v_image);
                    rename(TEMP_IMAGE_THUMB_PATH.$v_image,TEMP_IMG_PATH.'company-'.$v_encryption_id.'/'.'thumb/'.$v_image);
                }
            }*/
            $str_random = Str::random(4,'alpha').(string)rand(1111, 9999);
            $v_contact_person = e(trim(Input::get('v_contact_person')));
            if(!empty($v_image) && $v_image != '')
            {
                $v_image = TEMP_IMG_PATH.'company-'.$v_encryption_id.'/'.'thumb/'.$v_image;
            }
            $v_email = e(trim(Input::get('v_email')));
            $parts = array();
            $parts = explode('@', $v_email);
            $v_username = $parts[0];
            // store company information into database
            $company = Admin::create(array(
                'v_name' => e(trim(Input::get('v_name'))),
                'v_username' => $v_username,
                'v_email' => $v_email,
                'password' => Hash::make(e(trim(Input::get('v_password')))),
                'e_type' => 'Simple',
                'e_status' => e(trim(Input::get('e_status'))), 
                'd_registration_date' => date('Y-m-d',strtotime(Input::get('d_registration_date'))),
                'i_default_sms_count' => e(trim(Input::get('i_default_sms_count'))),
                'v_company_name' => e(trim(Input::get('v_company_name'))),
                'v_company_email' => e(trim(Input::get('v_company_email'))),
                'v_phone' => e(trim(Input::get('v_phone'))),
                'v_whatsapp_number' => e(trim(Input::get('v_whatsapp_number'))),
                'v_company_alias' => e(trim(Input::get('v_company_alias'))),
                'v_company_address' => e(trim(Input::get('v_company_address'))),
                'v_regards_name' => e(trim(Input::get('v_regards_name'))),
                'f_prize' => Input::get('f_prize'),
                'v_company_logo' => $v_image,
                'v_auth_key' => $v_encryption_id,
                'v_encryption_id' => $v_encryption_id,
                'v_sender_id' => e(trim(Input::get('v_sender_id'))),
                'e_messages_type' => e(trim(Input::get('e_messages_type'))),
                'v_db_name' => $v_db_name,
                'd_recent_login' => date('Y-m-d H:i:s'),
                'v_db_host' => $v_db_host,
                'v_db_user' => $v_db_user,
                'v_db_password' => $v_db_password
            ));
            
            //send activation link to respective company
            if($company)
            {
                $parts = array();
                $parts = explode('@', $v_email);
                $v_username = $parts[0];
                
                $arrCompanyUserData = array(
                    'v_name' => $v_contact_person,
                    'v_email' => $v_email,
                    'password' => Hash::make('this.admin123'),
                    'e_status' => 'Active',
                    'e_type' => 'Super',
                    'v_username' => $v_username,
                    'd_recent_login' => date('Y-m-d H:i:s'),
                    'd_registration_date' => date('Y-m-d H:i:s'),
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                );
                /*$company_user = CompanyUser::on($v_db_name)->insert($arrCompanyUserData);
                
                $objEmailTemplate = EmailTemplate::find(1)->toArray();
                $strTemplate = $objEmailTemplate['t_email_content'];
                $strTemplate = str_replace('../',SITE_URL,$strTemplate);
                $strTemplate = str_replace('[SITE_URL]',SITE_URL,$strTemplate);
                $strTemplate = str_replace('[LINK]',SITE_URL.'company/login',$strTemplate);
                $strTemplate = str_replace('[CONTACT_PERSON]',$v_contact_person,$strTemplate);
                $strTemplate = str_replace('[EMAIL_ID]',$v_email,$strTemplate);
                $strTemplate = str_replace('[PASSWORD]',$str_random,$strTemplate);
                $strTemplate = str_replace('[ALIAS]',e(trim(Input::get('v_company_alias'))),$strTemplate);                    
                // activation link
                Mail::send('emails.auth.company-activation-link',array('strTemplate'=>$strTemplate), function($message) use ($company)
                {
                    $message->to($company->v_email, $company->v_contact_person);
                    $message->replyTo(FROM_EMAIL_ADDRESS, FROM_EMAIL_ADDRESS_NAME);
                    $message->subject('Account activation link');
                });*/   
            }
            return 'TRUE';            
        }
    }
    
    public function postEdit()
	{
	    if(Auth::check() != true || Auth::user()->e_type != 'Super')
        {
            return json_encode(array());
        }
        $data = Input::get();
        $objValidator = Validator::make(Input::all(), array(  //method for server side validation 
            'v_email'  => 'required|email|unique:tbl_administrators,v_email,'.$data['id'],
            'v_username'=>'required|unique:tbl_administrators,v_username,'.$data['id']
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
            $record = Admin::find($data['id']);
            $dateField = array('created_at','updated_at');
            if(isset($data['v_password']) && $data['v_password'] != '')
            {
                //$user->v_txt_password = $data['v_password'];
                $record->password = Hash::make($data['v_password']);
                $passFlag = 1;
            }
            $record->v_name = $data['v_name'];
            $record->v_email = $data['v_email'];
            $record->v_username = $data['v_username'];
            $record->v_regards_name = $data['v_regards_name'];
            $record->f_prize = $data['f_prize'];
            $record->v_phone = $data['v_phone'];
            if(isset($data['v_whatsapp_number'])){
                $record->v_whatsapp_number = isset($data['v_whatsapp_number']);    
            }
            $record->e_status = $data['e_status'];
            $record->i_default_sms_count = $data['i_default_sms_count'];
            $record->v_company_name = $data['v_company_name'];
            $record->d_payment_due_date = date('Y-m-d',strtotime($data['d_payment_due_date']));
            $record->v_regards_name = $data['v_regards_name'];
            $record->v_company_address = $data['v_company_address'];
            $record->v_company_email = $data['v_company_email'];
            if(Input::get('v_img') !='' && Input::get('v_img') != SITE_URL.TEMP_IMG_PATH.'company-'.$record->v_encryption_id.'/'.$record->v_company_logo){
                // Save Image 
                $base64_fullImg = Input::get('v_img').'=';
                $v_random_image = time().'-'.str_random(6);
                $path = TEMP_IMG_PATH.'company-'.$record->v_encryption_id.'/';
                $imageName =  $this->generateImage($base64_fullImg, $v_random_image,$path);
                $imageName = $this->generateImage($base64_fullImg, $v_random_image,$path);
                if($imageName){
                    // Save Thumb Image 
                    $base64_fullImg = Input::get('v_img_thumb').'=';
                    $path = TEMP_IMG_PATH.'company-'.$record->v_encryption_id.'/'.'thumb/';
                    $imageName = $this->generateImage($base64_fullImg, $v_random_image, $path);
                }
                $v_image = $imageName;
                $record->v_company_logo = $v_image;
            }
            /*if(isset($v_image) && $v_image != "")
            {
                $v_image = $this->saveImage($v_image); 
                if(file_exists(TEMP_IMG_PATH.$v_image))
                {
                    rename(TEMP_IMG_PATH.$v_image,TEMP_IMG_PATH.'company-'.$v_encryption_id.'/'.$v_image);
                    rename(TEMP_IMAGE_THUMB_PATH.$v_image,TEMP_IMG_PATH.'company-'.$v_encryption_id.'/'.'thumb/'.$v_image);
                }
            }*/
            $v_contact_person = e(trim(Input::get('v_contact_person')));
            $v_email = $data['v_email'];
            $record->save();
            return 'TRUE';
            if($user->save()){
                if($passFlag == 1){
                    $loginLink = SITE_URL;  
                    $objEmailTemplate = EmailTemplate::find(5);
                    $emailSubject = $objEmailTemplate['v_template_subject']; 
                    $strTemplate = $objEmailTemplate['t_email_content'];
                    $strTemplate = str_replace('[SITE_URL]',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('[SITE_NAME]',SITE_NAME,$strTemplate);
                    $strTemplate = str_replace('[LINK]',$loginLink,$strTemplate);
                    $strTemplate = str_replace('../',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('[USERNAME]',$user->v_name,$strTemplate);
                    $strTemplate = str_replace('[EMAIL_ADDRESS]',$user->v_email,$strTemplate);
                    $strTemplate = str_replace('[PASSWORD]',$data['v_password'],$strTemplate);
                    
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
                    //echo $strTemplate;exit;
                    // mail sent to user
                    Mail::send('emails.auth.generate-email-template',array('strTemplate' => $strTemplate), function($message) use ($user,$objEmailTemplate)
                    {
                        $message->to($user->v_email, $user->v_name);
                        $message->replyTo(FROM_EMAIL_ADDRESS, FROM_EMAIL_ADDRESS_NAME);
                        $message->subject($objEmailTemplate['v_template_subject']);                        
                    });
                } else {
                    return 'TRUE';
                }
            } else {
                return 'FALSE';
            }             
        }
    }
    
    public function postChangeStatus(){
        $data = Input::get();
        if(!empty($data)){
            
            $user = Admin::find($data['id']);

            $user->e_status = $data['status'];
            
            if($user->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
        return "TRUE";
    }
    public function anyUserDelete()
    {
        $deleteID = e(trim(Input::get('id')));
        if($deleteID != "")
        {
            $objGetCompany = Admin::find($deleteID);
            $success = File::deleteDirectory(TEMP_IMG_PATH.'company-'.$objGetCompany->v_auth_key);
            $objGetCompany->delete();
            $this->otherDBConnection($objGetCompany->v_db_host,$objGetCompany->v_db_name,$objGetCompany->v_db_user,$objGetCompany->v_db_password);                                                                                                 
            $con = DB::connection($objGetCompany->v_db_name);
            $strSql="DROP DATABASE ".$objGetCompany->v_db_name;
            $con->statement($strSql);
            return 'TRUE';    
        }
    }
    
    public function anyCheckAuthPermission()
    {
        if(Auth::check() != true || Auth::user()->e_type != 'Super')
        {
            return json_encode(array());
        }else {
            return json_encode(Auth::user()->get());
        } 
    }
    
    public function anyBulkActions(){
        if(Auth::check() != true || Auth::user()->e_type != 'Super')
        {
            return json_encode(array());
        }
        $data = Input::all(); //get action ids

        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Faq
            if ($action == "deleted") {
                //delete Faq  loop
               for ($p = 0; $p < count($data['id']); $p++)
                {
                   $id = $data['id'][$p];
                    $objGetCompany = Admin::find($id);
                    if(!empty($objGetCompany))
                    {
                        $success = File::deleteDirectory(TEMP_IMG_PATH.'company-'.$objGetCompany->v_auth_key);
                        $objGetCompany->delete();
                        $this->otherDBConnection($objGetCompany->v_db_host,$objGetCompany->v_db_name,$objGetCompany->v_db_user,$objGetCompany->v_db_password);                                                                                                 
                        $con = DB::connection($objGetCompany->v_db_name);
                        $strSql="DROP DATABASE ".$objGetCompany->v_db_name;
                        $con->statement($strSql);    
                    }
                }
                echo "Delete";  
            }else  if ($action == "0") { //Active Faq   
                User::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Active"));
                 echo "1";
            } else  if ($action == "1") { //Inctive Faq   
                User::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Inactive"));
                echo "0";
            }
        }
    }
    public function anyExport($parameters = null)
    {
        if(Auth::check() != true || Auth::user()->e_type != 'Super')
        {
            return redirect()->guest('admin/');
        }
        Excel::create('users_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('USER'  , function($sheet) use ($parameters)
            {
                $query = Admin::query();
                
                if($parameters != null && trim($parameters) != '""'){             
        		    $reqestData = json_decode($parameters, true);
                    if(isset($reqestData)){
                        foreach($reqestData as $key => $val) { if($key != 'search_fields'){ $$key = trim($val); } }   
                    }

                    $sort = 'id';
                    $order = 'ASC';

                    if(isset($order_field) && $order_field!=""){
                        $sort = $order_field;
                    }
                    if(isset($sort_order) && $sort_order!=""){
                        $order = $sort_order;
                    }
                    
                    if(isset($name) && $name!=""){
            			$query = $query->where('v_name', 'LIKE',"%".$name."%");
            		}
                    if(isset($email) && $email!=""){
                        $query = $query->where('v_email', 'LIKE',"%".$email."%");
                    }
                    if(isset($phone) && $phone!=""){
                        $query = $query->where('v_phone', 'LIKE',"%".$phone."%");
                    }
            		if(isset($e_status) && $e_status!=""){
            			$query = $query->where('e_status', '=',$e_status);
            		}
                    $query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'DESC');    
                }
                $query->where("e_type",'!=','Super');
                $query->select('id','v_name','v_username','v_email', 'password', 'v_company_name','e_type','e_status');
                $records = $query->get()->toArray();
                
                $field['no'] = 'Sr.No';
                $field['v_name'] = 'Name';
                $field['v_email'] = 'Email';
                $field['password'] = 'Password';
                $field['v_company_name'] = 'Company Name';
                $field['e_type'] = 'User Type';;   
                $field['e_status'] = 'Status';
                	
                                       
                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:H1');
                $sheet->setWidth(array('A'     =>  8,'B'     =>  30,'C'     =>  40,'D'     =>  30,'E'     =>  20,'F'     =>  20,'G'     =>  10,'H'     =>  10));
                
                $sheet->cells('A1:H1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(1,array('User'));
                
                $sheet->cells('A2:H2', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('12');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(2,$field);
                
                $intCount = 3;
                $srNo=1;
                foreach($records as $val){
                    $val['id'] = $srNo;
                    $sheet->row($intCount, $val);
                    $intCount++;
                    $srNo++;
                }
            });
        
        })->download('xls');
    }
    
}
?>
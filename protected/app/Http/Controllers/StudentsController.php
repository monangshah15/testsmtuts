<?php 
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Session, Validator;
use Input;
use Auth;
use Excel;
use App\Models\Admin;
use App\Models\Student;
use App\Models\Batch;
use App\Models\School;
use UploadHandler;
class StudentsController extends Controller 
{
	public function postIndex()
	{
	       /** We Check in middleware**/
        if(Auth::check() != true || Auth::user()->e_type != 'Simple')
        {
            return json_encode(array());
        }
        
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        $query = new Student;
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$query = $query->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $query = $query->orderBy('v_first_name','ASC');
		}
        if(isset($data['search_fields']['v_name']) && $data['search_fields']['v_name']!=""){
			$query = $query->where('tbl_students.v_first_name', 'LIKE',"%".$data['search_fields']['v_name']."%");
		}
        
		if(isset($data['search_fields']['i_batch_id']) && $data['search_fields']['i_batch_id']!=""){
			$query = $query->where('tbl_students.i_batch_id',$data['search_fields']['i_batch_id']);
		}
        if(isset($data['search_fields']['i_school_id']) && $data['search_fields']['i_school_id']!=""){
			$query = $query->where('tbl_students.i_school_id',$data['search_fields']['i_school_id']);
		}
        
        if(isset($data['search_fields']['v_email']) && $data['search_fields']['v_email']!=""){
			$query = $query->where('v_email', 'LIKE',"%".$data['search_fields']['v_email']."%");
		}
		
        $query = $query->join('tbl_schools', 'tbl_schools.id', '=', 'tbl_students.i_school_id');
        
        $query = $query->join('tbl_batches', 'tbl_batches.id', '=', 'tbl_students.i_batch_id');
        
        $query = $query->select('tbl_schools.id as school_id','tbl_schools.v_title as v_school_name','tbl_batches.id as batch_id','tbl_batches.v_batch_title as v_batch_name','tbl_students.*');
        $query = $query->paginate($data['rec_per_page']);
        $arrRecord = $query->toArray();
        $results = [
    	    'items' => $arrRecord['data'],
            '_meta' => [
    	        'total'   => $arrRecord['total'],
    	        'rpp'     => $arrRecord['per_page'],
    	        'current' => $arrRecord['current_page'],
    	        'last_page'    => $arrRecord['last_page'],
    	        'from'         => $arrRecord['from'],
    	        'to'           => $arrRecord['to']
    	    ]
    	];
	    return json_encode($results);
	}
    
    public function anyData($id)
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $record = new Student;
        $record = $record->where('id','=',$id)->first();
        $arrRecord = $record->toArray();
        $results = array('items' => $arrRecord);
        return json_encode($results);
    }
    
    public function postAdd()
	{
	    $data = Input::get();
        //pr($data);exit;
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        if(!empty($data)){
            $objValidator = Validator::make(Input::all(), array(  //method for server side validation 
                'v_email'  => 'required|email|unique:tbl_students'
            ),array(
                'required'=>'Required',
                'email'=>'Invalid email',
                'unique' => 'exists'
            ));
            
            if($objValidator->fails())
            {
                return $objValidator->errors();
            }
            $record = new Student;
            $record->i_user_id = Auth::user()->id;
            $record->v_first_name = $data['v_first_name'];
            $record->v_last_name = $data['v_last_name'];
            $record->v_email = $data['v_email'];
            $record->i_school_id = $data['i_school_id'];
            $record->i_batch_id = $data['i_batch_id'];
            $record->e_sms_type = $data['e_sms_type'];
            $record->v_parent_name = $data['v_parent_name'];
            $record->v_mobile_number = $data['v_mobile_number'];
            if(isset($data['v_whatsapp_number']) && $data['v_whatsapp_number']!=''){
                $record->v_whatsapp_number = $data['v_whatsapp_number'];
            }
            $record->v_nick_name = isset($data['v_nick_name']) ? $data['v_nick_name']: '';
            $record->v_address = $data['v_address'];
            $record->e_status = $data['e_status'];
            $record->created_at = date("Y-m-d H:i:s");
            $record->updated_at = date("Y-m-d H:i:s");                                                                                   
            if($record->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }             
        }
    }
    
    public function postEdit()
	{
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
	    $data = Input::get();
        $objValidator = Validator::make(Input::all(), array(  //method for server side validation 
                'v_email'  => 'required|email|unique:tbl_students,v_email,'.$data['id']
        ),array(
            'required'=>'Required',
            'email'=>'Invalid email',
            'unique' => 'exists'
        ));
        
        if($objValidator->fails())
        {
            return $objValidator->errors();
        }
        if(!empty($data))
        {
            $record = Student::find($data['id']);
            $record->i_user_id = Auth::user()->id;
            $record->v_first_name = $data['v_first_name'];
            $record->v_last_name = $data['v_last_name'];
            $record->v_email = $data['v_email'];
            $record->i_school_id = $data['i_school_id'];
            $record->i_batch_id = $data['i_batch_id'];
            $record->e_sms_type = $data['e_sms_type'];
            $record->v_parent_name = $data['v_parent_name'];
            $record->v_mobile_number = $data['v_mobile_number'];
            if(isset($data['v_whatsapp_number']) && $data['v_whatsapp_number']!=''){
                $record->v_whatsapp_number = $data['v_whatsapp_number'];
            }
            $record->v_nick_name = isset($data['v_nick_name']) ? $data['v_nick_name']: '';
            $record->v_address = $data['v_address'];
            $record->e_status = $data['e_status'];
            $record->updated_at = date("Y-m-d H:i:s"); 
            if($record->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }             
        }
    }
    
    public function anyBulkActions()
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::all(); //get action ids
        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Faq
            if ($action == "deleted") {
                //delete Faq  loop
               for ($p = 0; $p < count($data['id']); $p++)
                {
                   $id = $data['id'][$p];
                    $arrRecors = Student::find($id);
                    if(!empty($arrRecord))
                    {
                        $arrRecord->delete();    
                    }
                }
                echo "Delete";  
            }else  if ($action == "0") { //Active Faq   
                Student::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Active"));
                 echo "1";
            } else  if ($action == "1") { //Inctive Faq   
                Student::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Inactive"));
                echo "0";
            }
        }
    }
    
    public function anyExport($parameters = null)
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        Excel::create('student_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('Student'  , function($sheet) use ($parameters)
            {
                $query = Student::query();
            
                $sort = 'id';
                $order = 'ASC';
                
                if(isset($data['search_fields']['v_name']) && $data['search_fields']['v_name']!=""){
                	$query = $query->where('v_first_name', 'LIKE',"%".$data['search_fields']['v_name']."%");
                }
                
                if(isset($data['search_fields']['i_batch_id']) && $data['search_fields']['i_batch_id']!=""){
                	$query = $query->where('i_batch_id',$data['i_batch_id']);
                }
                if(isset($data['search_fields']['i_school_id']) && $data['search_fields']['i_school_id']!=""){
                	$query = $query->where('i_school_id',$data['i_school_id']);
                }
                
                if(isset($data['search_fields']['v_email']) && $data['search_fields']['v_email']!=""){
                	$query = $query->where('v_email', 'LIKE',"%".$data['search_fields']['v_email']."%");
                }
                
                $query = $query->select('id', 'v_first_name', 'v_last_name', 'v_email', 'i_school_id', 'i_batch_id', 'v_parent_name', 'v_mobile_number', 'v_whatsapp_number', 'v_nick_name', 'v_address', 'e_status', 'created_at');
                $records = $query->get()->toArray();
                $field['no'] = 'Sr.No';
                $field['v_first_name'] = 'First Name';
                $field['v_last_name'] = 'Last Name';
                $field['v_email'] = 'Email';
                $field['i_school_id'] = 'School Name';
                $field['i_batch_id'] = 'Batch Name';
                $field['v_parent_name'] = 'Parent Name';
                $field['v_mobile_number'] = 'Mobile Number';
                $field['v_whatsapp_number'] = 'Whatsapp Number';
                $field['v_nick_name'] = 'Nick Name';
                $field['v_address'] = 'Address';
                $field['e_status'] = 'Status';
                $field['created_at'] = 'Create Date ';
                                       
                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:M1');
                $sheet->setWidth(array('A' => 8,'B' => 20,'C' => 20,'D' => 30,'E' => 30,'F' => 30,'G' => 30,'H' => 30, 'I' => 30,'J' => 30,'K' => 30,'L' => 30,'M'=>30));
                
                $sheet->cells('A1:M1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(1,array('Students'));
                
                $sheet->cells('A2:M2', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('12');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(2,$field);
                $intCount = 3;
                $schools = School::lists('v_title','id');
                $batches = Batch::lists('v_batch_title','id');
                foreach($records as $val){
                    $val['i_school_id'] = isset($schools[$val['i_school_id']]) ? $schools[$val['i_school_id']] : '';
                    $val['i_batch_id'] = isset($batches[$val['i_batch_id']]) ? $batches[$val['i_batch_id']] : '';
                    $val['created_at'] = date('d-m-Y',strtotime($val['created_at']));
                    $sheet->row($intCount, $val);
                    $intCount++;
                }
            });
        })->download('xlsx');
    }
    
    public function postChangeStatus()
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        if(!empty($data)){
            $record = Student::find($data['id']);
            $record->e_status = $data['status'];
            if($record->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
        return "TRUE";
    }
    public function anyStudentsDelete()
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $record = Student::find($data['id']);
            if($record->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }
}
?>
<?php
namespace App\Http\Controllers;

use Session, Input, Auth, Hash, Excel, DB;
use App\Models\Batch;
use App\Models\Mark;
use App\Models\Subject;
use App\Models\Student;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
class MarksController extends Controller 
{
    /* Use for cms listing*/
	public function postIndex()
	{
	    /** We Check in middleware**/
        /*if(Auth::check() != true || Auth::user()->e_type != 'Admin')
        {
            return json_encode(array());
        }*/
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        $query = new Mark;
        //pr($data); exit;
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$query = $query->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $query = $query->orderBy('d_date','ASC');
		}
        
        if(isset($data['search_fields']['v_student_name']) && $data['search_fields']['v_student_name']!=""){
			$query = $query->where(DB::raw("CONCAT(tbl_students.v_first_name, ' ', tbl_students.v_last_name)"), 'LIKE', "%".$data['search_fields']['v_student_name']."%");
		}
        if(isset($data['search_fields']['i_batch_id']) && $data['search_fields']['i_batch_id']!=""){
			$query = $query->where('tbl_marks.i_batch_id', '=',$data['search_fields']['i_batch_id']);
		}
        if(isset($data['search_fields']['i_subject_id']) && $data['search_fields']['i_subject_id']!=""){
			$query = $query->where('tbl_marks.i_subject_id', '=',$data['search_fields']['i_subject_id']);
		}
        if(isset($data['search_fields']['d_date']) && $data['search_fields']['d_date']!=""){
			$query = $query->where('tbl_exams.d_date', '=',date('Y-m-d',strtotime($data['search_fields']['d_date'])));
		}
        
        if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
			$query = $query->where('tbl_marks.e_status', '=',$data['search_fields']['e_status']);
		}
        
        $query = $query->join('tbl_exams', 'tbl_exams.id', '=', 'tbl_marks.i_exam_id');
        
        $query = $query->join('tbl_students', 'tbl_students.id', '=', 'tbl_marks.i_student_id');
        
        $query = $query->join('tbl_batches', 'tbl_batches.id', '=', 'tbl_marks.i_batch_id');
        
        $query = $query->select('tbl_students.id as student_id',DB::raw('CONCAT(tbl_students.v_first_name, " ", tbl_students.v_last_name) AS v_student_name'),'tbl_batches.id as batch_id','tbl_batches.v_batch_title as v_batch_name','tbl_exams.id as exam_id','tbl_exams.v_title as v_exam_title','tbl_exams.d_date as d_exam_date','tbl_exams.i_total_marks','tbl_marks.*');
        //DB::raw('CONCAT(tbl_students.v_first_name, " ", tbl_students.v_last_name) AS v_student_name'),
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
        $record = new Mark;
        $record = $record->where('id','=',$id)->with('exams')->first();
        $arrRecord = '';
        if(count($record)> 0)
        {
            $arrRecord = $record->toArray();    
        }
        $results = array('items' => $arrRecord);
        return json_encode($results);
    }
    
    public function anyBulkActions(){
        $data = Input::all(); //get action ids
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Faq
            if ($action == "deleted") {
                //delete Faq  loop
               for ($p = 0; $p < count($data['id']); $p++)
                {
                   $id = $data['id'][$p];
                    $arryUser = Mark::find($id);
                    if(!empty($arryUser))
                    {
                        $arryUser->delete();    
                    }
                }
                echo "Delete";  
            }else  if ($action == "0") { //Active Faq   
                Mark::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Active"));
                 echo "1";
            } else  if ($action == "1") { //Inctive Faq   
                Mark::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Inactive"));
                echo "0";
            }
        }
    }
    public function anyExport($parameters = null)
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        Excel::create('marks_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('Mark'  , function($sheet) use ($parameters)
            {
                $query = Mark::query();
                
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
                    if(isset($v_title) && $v_title!=""){
            			$query = $query->where('v_title', 'LIKE',"%".$v_title."%");
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
                $query = $query->join('tbl_exams', 'tbl_exams.id', '=', 'tbl_marks.i_exam_id');
        
                $query = $query->join('tbl_students', 'tbl_students.id', '=', 'tbl_marks.i_student_id');
                
                $query = $query->join('tbl_batches', 'tbl_batches.id', '=', 'tbl_marks.i_batch_id');
                
                $query = $query->select('tbl_students.id',DB::raw('CONCAT(tbl_students.v_first_name, " ", tbl_students.v_last_name) AS v_student_name'),'tbl_batches.v_batch_title as v_batch_name','tbl_exams.v_title as v_exam_title','tbl_exams.i_total_marks','tbl_marks.i_mark_obtained', 'tbl_marks.e_status');        
                $records = $query->get()->toArray();
                $field['no'] = 'Sr.No';
                $field['v_student_name'] = 'Student Name';
                $field['v_batch_name'] = 'Batch Name';
                $field['v_exam_title'] = 'Exam Title';
                $field['i_total_marks'] = 'Total Marks';
                $field['i_mark_obtained'] = 'Mark obtained';
                $field['e_status'] = 'Status';
                
                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:G1');
                $sheet->setWidth(array('A'     =>  8,'B'     =>  30,'C'     =>  40,'D'     =>  30,'E'     =>  20,'F'     =>  20, 'G'=>20));
                
                $sheet->cells('A1:G1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(1,array('Marks'));
                
                $sheet->cells('A2:G2', function($cell)
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
        
        })->download('xlsx');
    }
    
    public function postAdd()
	{
	    $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
	    $data = Input::get();
        $data['marksInput'] = array_filter($data['marksInput']);
        if(!empty($data) && isset($data['i_student_ids'])){
            $students = Student::where('e_status','Active')->where('i_batch_id',$data['i_batch_id'])->select('id', DB::raw('CONCAT(v_first_Name, " ", v_last_Name) AS v_student_name'))->orderBy('v_student_name','ASC')->get();
            foreach($students as $key=> $val)
            {
                $record = Mark::where('i_batch_id',$data['i_batch_id'])->where('i_student_id',$val->id)->where('i_exam_id',$data['i_exam_id'])->first();
                if(count($record) == 0){
                    $record = new Mark;
                }
                $record->i_user_id = $companyData->id;
                $record->i_batch_id = $data['i_batch_id'];
                $record->i_exam_id = $data['i_exam_id'];
                $record->i_template_id = $data['i_template_id'];
                $record->i_student_id = $val->id;
                if(in_array($val->id,$data['i_student_ids'])){
                    $record->e_status = 'Present';
                    $record->i_mark_obtained = isset($data['marksInput'][$val->id]) ? $data['marksInput'][$val->id] : '';
                } else {
                    $record->e_status = 'Absent';
                    $record->i_mark_obtained = '';
                }                   
                $record->e_send_message = 'Yes';
                $record->created_at = date("Y-m-d H:i:s");
                $record->updated_at = date("Y-m-d H:i:s");
                $record->save();
            }
            return 'TRUE';
        }        
    }
    
    
    public function postEdit()
	{
	    $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        if(!empty($data)){
            $record = Mark::find($data['id']);
            $record->i_user_id = Auth::user()->id;
            if($record->i_mark_obtained != $data['i_mark_obtained'])
            {
                $record->e_status = 'Present';    
            }
            $record->i_mark_obtained = $data['i_mark_obtained'];
            $record->updated_at = date("Y-m-d H:i:s");
            if($record->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }             
        }            
    }
    
    public function postChangeStatus(){
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        if(!empty($data)){
            $record = Mark::find($data['id']);
            $record->e_status = $data['status'];
            if($record->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
        return "TRUE";
    }
    public function anyMarkDelete()
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $record = Mark::find($data['id']);
            if($record->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }
}
?>
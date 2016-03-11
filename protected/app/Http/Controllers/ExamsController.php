<?php
namespace App\Http\Controllers;

use Session, Input, Auth, Hash, Excel;
use App\Models\Admin;
use App\Models\School;
use App\Models\Batch;
use App\Models\Exam;
use App\Models\Subject;
use UploadHandler;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
class ExamsController extends Controller 
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
        $query = new Exam;
        //pr($data); exit;
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$query = $query->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $query = $query->orderBy('v_title','ASC');
		}
        
        if(isset($data['search_fields']['v_title']) && $data['search_fields']['v_title']!=""){
			$query = $query->where('v_title', 'LIKE',"%".$data['search_fields']['v_title']."%");
		}
        if(isset($data['search_fields']['i_subject_id']) && $data['search_fields']['i_subject_id']!=""){
			$query = $query->where('i_subject_id', 'LIKE',"%".$data['search_fields']['i_subject_id']."%");
		}
        if(isset($data['search_fields']['i_batch_id']) && $data['search_fields']['i_batch_id']!=""){
			$query = $query->where('i_batch_id', '=',$data['search_fields']['i_batch_id']);
		}
        if(isset($data['search_fields']['d_date']) && $data['search_fields']['d_date']!=""){
			$query = $query->where('d_date', '=',date('Y-m-d',strtotime($data['search_fields']['d_date'])));
		}
        if(isset($data['search_fields']['i_total_marks']) && $data['search_fields']['i_total_marks']!=""){
			$query = $query->where('i_total_marks', '=',$data['search_fields']['i_total_marks']);
		}
        if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
			$query = $query->where('tbl_exams.e_status', '=',$data['search_fields']['e_status']);
		}
        
        $query = $query->join('tbl_subjects', 'tbl_subjects.id', '=', 'tbl_exams.i_subject_id');
        
        $query = $query->join('tbl_batches', 'tbl_batches.id', '=', 'tbl_exams.i_batch_id');
        
        $query = $query->select('tbl_subjects.id as subject_id','tbl_subjects.v_subject_name as v_subject_name','tbl_batches.id as batch_id','tbl_batches.v_batch_title as v_batch_name','tbl_exams.*');
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
        $record = new Exam;
        $record = $record->where('id','=',$id)->first();
        $arrRecord = $record->toArray();
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
                    $arrRecord = Exam::find($id);
                    if(!empty($arrRecord))
                    {
                        $arrRecord->delete();    
                    }
                }
                echo "Delete";  
            }else  if ($action == "0") { //Active Faq   
                Exam::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Active"));
                 echo "1";
            } else  if ($action == "1") { //Inctive Faq   
                Exam::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Inactive"));
                echo "0";
            }
        }
    }
    
    public function anyExport($parameters = null)
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        Excel::create('Exam_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('Exam'  , function($sheet) use ($parameters)
            {
                $query = Exam::query();
                
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
                    if(isset($data['search_fields']['v_title']) && $data['search_fields']['v_title']!=""){
            			$query = $query->where('v_title', 'LIKE',"%".$data['search_fields']['v_title']."%");
            		}
                    if(isset($data['search_fields']['i_subject_id']) && $data['search_fields']['i_subject_id']!=""){
            			$query = $query->where('i_subject_id', 'LIKE',"%".$data['search_fields']['i_subject_id']."%");
            		}
                    if(isset($data['search_fields']['i_batch_id']) && $data['search_fields']['i_batch_id']!=""){
            			$query = $query->where('i_batch_id', '=',date('Y-m-d',strtotime($data['search_fields']['i_batch_id'])));
            		}
                    if(isset($data['search_fields']['d_date']) && $data['search_fields']['d_date']!=""){
            			$query = $query->where('d_date', '=',date('Y-m-d',strtotime($data['search_fields']['d_date'])));
            		}
                    
                    if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
            			$query = $query->where('e_status', '=',$data['search_fields']['e_status']);
            		}
                    $query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'DESC');    
                }
                        
                $query->select('id','v_title', 'i_subject_id', 'i_batch_id', 'i_total_marks','d_date','e_status');
        		$records = $query->get()->toArray();
                $field['no'] = 'Sr.No';
                $field['v_title'] = 'Title';
                $field['i_subject_id'] = 'Subject Name';
                $field['i_batch_id'] = 'Batch Name';
                $field['i_total_marks'] = 'Total Marks';
                $field['d_date'] = 'Date';
                $field['e_status'] = 'Status';
                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:G1');
                $sheet->setWidth(array('A'     =>  8,'B'     =>  30,'C'     =>  40,'D'     =>  30,'E'     =>  20,'F'     =>  10,'G'     =>  10));
                
                $sheet->cells('A1:G1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(1,array('Exam'));
                
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
                $subject = Subject::lists('v_subject_name','id');
                $batches = Batch::lists('v_batch_title','id');
                foreach($records as $val){
                    $val['id'] = $srNo;
                    $val['d_date'] = date('d-m-Y',strtotime($val['d_date']));
                    $val['i_subject_id'] = isset($subject[$val['i_subject_id']])?$subject[$val['i_subject_id']]:'';
                    $val['i_batch_id'] = isset($batches[$val['i_batch_id']])?$batches[$val['i_batch_id']]:'';
                    $sheet->row($intCount, $val);
                    $intCount++;
                    $srNo++;
                }
            });
        
        })->download('xlsx');
    }
    
    public function postAdd()
	{
	    $data = Input::get();
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        if(!empty($data)){
            $record = new Exam;
            $record->i_user_id = Auth::user()->id;
            $record->i_batch_id = $data['i_batch_id'];
            $record->i_subject_id = $data['i_subject_id'];
            $record->v_title = $data['v_title'];
            $record->i_total_marks = $data['i_total_marks'];
            $record->d_date = date("Y-m-d H:i:s",strtotime($data['d_date']));
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
	    $data = Input::get();
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        if(!empty($data)){
            $record = Exam::find($data['id']);
            $record->i_user_id = Auth::user()->id;
            $record->i_batch_id = $data['i_batch_id'];
            $record->i_subject_id = $data['i_subject_id'];
            $record->v_title = $data['v_title'];
            $record->i_total_marks = $data['i_total_marks'];
            $record->d_date = date("Y-m-d H:i:s",strtotime($data['d_date']));
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
    
    public function postChangeStatus()
    {
        $data = Input::get();
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        if(!empty($data)){
            $record = Exam::find($data['id']);
            $record->e_status = $data['status'];
            if($record->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
        return "TRUE";
    }
    public function anyExamDelete()
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $record = Exam::find($data['id']);
            if($record->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }
}
?>
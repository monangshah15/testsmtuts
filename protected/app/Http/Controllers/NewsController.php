<?php
namespace App\Http\Controllers;

use Session, Input, Auth, DB;
use App;
use App\Models\User;
use App\Models\News;
use App\Models\Batch;
use App\Models\Student;
use App\Models\Template;
use UploadHandler;
use Excel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
class NewsController extends Controller 
{
    /* Use for cms listing*/
	public function postIndex()
	{
	    $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        $query = new News;
        //pr($data); exit;
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$query = $query->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $query = $query->orderBy('i_batch_id','ASC');
		}
        
        if(isset($data['search_fields']['v_student_name']) && $data['search_fields']['v_student_name']!=""){
			$query = $query->where(DB::raw("CONCAT(tbl_students.v_first_name, ' ', tbl_students.v_last_name)"), 'LIKE', "%".$data['search_fields']['v_student_name']."%");
		}
        if(isset($data['search_fields']['i_batch_id']) && $data['search_fields']['i_batch_id']!=""){
			$query = $query->where('tbl_news.i_batch_id', '=',$data['search_fields']['i_batch_id']);
		}
        if(isset($data['search_fields']['e_send_message']) && $data['search_fields']['e_send_message']!=""){
			$query = $query->where('tbl_news.e_send_message', '=',$data['search_fields']['e_send_message']);
		}
        
        $query = $query->join('tbl_students', 'tbl_students.id', '=', 'tbl_news.i_student_id');
        
        $query = $query->join('tbl_batches', 'tbl_batches.id', '=', 'tbl_news.i_batch_id');
        $query = $query->select('tbl_students.id as student_id',DB::raw('CONCAT(tbl_students.v_first_name, " ", tbl_students.v_last_name) AS v_student_name'),'tbl_batches.id as batch_id','tbl_batches.v_batch_title as v_batch_name','tbl_news.*');
        //concat("tbl_students.v_first_name"," ","tbl_students.v_last_name") as v_student_name
        //concat(tbl_students.v_first_name," ",tbl_students.v_last_name) as v_student_name')
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
        $record = new News;
        $record = $record->where('id','=',$id)->with('students','batches','templates')->first();
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
                    $arrRecord = News::find($id);
                    if(!empty($arrRecord))
                    {
                        $arrRecord->delete();    
                    }
                }
                echo "Delete";  
            }
        }
    }
    
    public function anyExport($parameters = null)
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        Excel::create('news_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('News'  , function($sheet) use ($parameters)
            {
                $query = News::query();
                
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
                    if(isset($d_date) && $d_date!=""){
                        $query = $query->where('d_date', '=',date('Y-m-d',strtotime($d_date)));
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
                        
                $query = $query->select('id', 'i_student_id', 'i_batch_id','v_template', 'e_send_message');        
                $records = $query->get()->toArray();
                $field['no'] = 'Sr.No';
                $field['i_student_id'] = 'Student Name';
                $field['i_batch_id'] = 'Batch Name';
                $field['v_template'] = 'Template';
                $field['e_send_message'] = 'Status';
                
                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:G1');
                $sheet->setWidth(array('A'     =>  8,'B'     =>  30,'C'     =>  40,'D'     =>  30,'E'     =>  20,'F'     =>  10));
                
                $sheet->cells('A1:E1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(1,array('News'));
                
                $sheet->cells('A2:E2', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('12');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(2,$field);
                
                $intCount = 3;
                $srNo=1;
                $students = Student::select('id', DB::raw('CONCAT(v_first_name, " ", v_last_name) AS v_student_name'))->lists('v_name','id');
                $batches = Batch::lists('v_batch_title','id');
                foreach($records as $val){
                    $val['id'] = $srNo;
                    $val['i_student_id'] = isset($students[$val['i_student_id']]) ? $students[$val['i_student_id']] : '';
                    $val['i_batch_id'] = isset($batches[$val['i_batch_id']]) ? $batches[$val['i_batch_id']] : '';
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
        if(!empty($data)){
            foreach($data['i_student_ids'] as $key=> $val)
            {
                $record = new News;
                $record->i_user_id = $companyData->id;
                $record->i_student_id = $val;
                $record->i_batch_id = $data['i_batch_id'];
                $record->i_template_id = $data['i_template_id'];
                $record->v_template = $data['v_template_content'];
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
            $record = News::find($data['id']);
            /*$record->i_student_id = $data['i_student_id'];
            $record->i_batch_id = $data['i_batch_id'];
            $record->i_template_id = $data['i_template_id'];
            $record->v_template = $data['v_template'];*/
            $record->e_send_message = $data['e_send_message'];
            $record->updated_at = date("Y-m-d H:i:s");
            if($record->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }             
        }            
    }
    
    public function anyNewsDelete()
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
	    $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $record = News::find($data['id']);
            if($record->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }
}
?>
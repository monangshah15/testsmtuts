<?php
namespace App\Http\Controllers;

use Session, Input, Auth;
use App;
use App\Models\Admin;
use App\Models\Batch;
use Excel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
class BatchesController extends Controller 
{
    /* Use for Batches listing*/
	public function postIndex()
	{
	    /** We Check in middleware**/
        if(Auth::check() != true || Auth::user()->e_type != 'Simple')
        {
            return json_encode(array());
        }
        
        $data = Input::get();
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $query = new Batch;
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$query = $query->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $query = $query->orderBy('v_batch_title','ASC');
		}
        
        /*if(isset($data['search_fields']['i_user_id']) && $data['search_fields']['i_user_id']!=""){
			$query = $query->where('i_user_id', '=',date('Y-m-d',strtotime($data['search_fields']['i_user_id'])));
		}*/
        if(isset($data['search_fields']['v_batch_title']) && $data['search_fields']['v_batch_title']!=""){
			$query = $query->where('v_batch_title', 'LIKE',"%".$data['search_fields']['v_batch_title']."%");
		}
        if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
			$query = $query->where('e_status', '=',$data['search_fields']['e_status']);
		}
		
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
        $record = new Batch;
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
                    $arrRecord = Batch::find($id);
                    if(!empty($arrRecord))
                    {
                        $arrRecord->delete();    
                    }
                }
                echo "Delete";  
            }else  if ($action == "0") { //Active Faq   
                Batch::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Active"));
                 echo "1";
            } else  if ($action == "1") { //Inctive Faq   
                Batch::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Inactive"));
                echo "0";
            }
        }
    }
    
    public function anyExport($parameters = null)
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        Excel::create('Batches_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('Batch'  , function($sheet) use ($parameters)
            {
                $query = Batch::query();
                
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
                    if(isset($v_batch_title) && $v_batch_title!=""){
            			$query = $query->where('v_batch_title', 'LIKE',"%".$v_batch_title."%");
            		}
                    if(isset($e_status) && $e_status!=""){
            			$query = $query->where('e_status', '=',$e_status);
            		}
                    $query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'DESC');    
                }
                        
                $query->select('id','v_batch_title','e_status','created_at');
        		$records = $query->get()->toArray();
                $field['no'] = 'Sr.No';
                $field['v_batch_title'] = 'Title';
                $field['e_status'] = 'Status';
                $field['created_at'] = 'Created Date';
                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:D1');
                $sheet->setWidth(array('A'     =>  8,'B'     =>  30,'C'     =>  40,'D'     =>  30));
                
                $sheet->cells('A1:D1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(1,array('Batches'));
                
                $sheet->cells('A2:D2', function($cell)
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
                    $val['created_at'] = date('d-m-Y',strtotime($val['created_at']));
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
            $record = new Batch;
            $record->i_user_id = Auth::user()->id;
            $record->v_batch_title = $data['v_batch_title'];
            $record->e_status = 'Active';
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
        if(!empty($data)){
            $record = Batch::find($data['id']);
            $record->i_user_id = Auth::user()->id;
            $record->v_batch_title = $data['v_batch_title'];
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
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        if(!empty($data)){
            $record = Batch::find($data['id']);
            $record->e_status = $data['status'];
            if($record->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
        return "TRUE";
    }
    public function anyBatchesDelete()
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $record = Batch::find($data['id']);
            if($record->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }
}
?>
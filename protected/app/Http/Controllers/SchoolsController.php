<?php
namespace App\Http\Controllers;

use Session, Input, Auth, Hash, Excel;
use App\Models\Admin;
use App\Models\School;
use UploadHandler;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
class SchoolsController extends Controller 
{
    /* Use for cms listing*/
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
        $query = new School;
        //pr($data); exit;
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$query = $query->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $query = $query->orderBy('i_order','ASC');
		}
        
        if(isset($data['search_fields']['v_title']) && $data['search_fields']['v_title']!=""){
			$query = $query->where('v_title', 'LIKE',"%".$data['search_fields']['v_title']."%");
		}
        
		if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
			$query = $query->where('e_status', '=',$data['search_fields']['e_status']);
		}
		
        $query = $query->paginate($data['rec_per_page']);
        $arrJob = $query->toArray();
        
        $results = [
    	    'items' => $arrJob['data'],
            '_meta' => [
    	        'total'   => $arrJob['total'],
    	        'rpp'     => $arrJob['per_page'],
    	        'current' => $arrJob['current_page'],
    	        'last_page'    => $arrJob['last_page'],
    	        'from'         => $arrJob['from'],
    	        'to'           => $arrJob['to']
    	    ]
    	];
	    return json_encode($results);
	}
    
    public function anyData($id)
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $record = new School;
        $arrRecord = $record->where('id','=',$id)->first();
        if(count($arrRecord) > 0){
            $arrRecord = $arrRecord->toArray();    
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
                    $arrRecors = School::find($id);
                    if(!empty($arryUser))
                    {
                        $arryUser->delete();    
                    }
                }
                echo "Delete";  
            }else  if ($action == "0") { //Active Faq   
                School::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Active"));
                 echo "1";
            } else  if ($action == "1") { //Inctive Faq   
                School::whereIn('id', array_values($data['id']))->update(array("e_status" =>"Inactive"));
                echo "0";
            }
        }
    }
    public function anyExport($parameters = null)
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        Excel::create('schools_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('Schools'  , function($sheet) use ($parameters)
            {
                $query = School::query();
                
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
                    if(isset($e_status) && $e_status!=""){
            			$query = $query->where('e_status', '=',$e_status);
            		}
                    $query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'DESC');    
                }
                        
                $query->select('id','v_title','e_status');
        		$records = $query->get()->toArray();
                $field['no'] = 'Sr.No';
                $field['v_name'] = 'Title';
                $field['e_status'] = 'Status';
                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:C1');
                $sheet->setWidth(array('A'     =>  8,'B'     =>  30,'C'     =>  40));
                
                $sheet->cells('A1:C1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(1,array('Schools'));
                
                $sheet->cells('A2:C2', function($cell)
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
        if(!empty($data)){
            $companyData = Auth::user();
            $this->dynamic_db_connection($companyData);
            $record = new School;
            $record->i_user_id = $companyData->id;
            $record->v_title = $data['v_title'];
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
        if(!empty($data)){
            $companyData = Auth::user();
            $this->dynamic_db_connection($companyData);
            $record = School::find($data['id']);
            $record->i_user_id = Auth::user()->id;
            $record->v_title = $data['v_title'];
            $record->e_status = $data['e_status'];
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
            $record = School::find($data['id']);
            $record->e_status = $data['status'];
            if($record->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
        return "TRUE";
    }
    public function anySchoolsDelete()
    {
        $companyData = Auth::user();
        $this->dynamic_db_connection($companyData);
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $record = School::find($data['id']);
            if($record->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }
}
?>
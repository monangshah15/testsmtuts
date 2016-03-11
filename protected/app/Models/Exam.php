<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Exam extends Model{
    protected $connection = 'mysql_dynamic_connection';
	protected $table = 'tbl_exams';
    protected $fillable = array('id','v_title', 'i_user_id','i_subject_id', 'i_batch_id', 'i_total_marks','d_date','e_status');
    
    public function users(){
        return $this->belongsTo('App\Models\Admin','i_user_id');
    }
    public function schools(){
        return $this->belongsTo('App\Models\School','i_school_id');
    }
    public function batches(){
        return $this->belongsTo('App\Models\Batch','i_batch_id');
    }
    
    public function delete() {
        return parent::delete();
    }
}

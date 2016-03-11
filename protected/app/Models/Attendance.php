<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model{
    protected $connection = 'mysql_dynamic_connection';
	protected $table = 'tbl_attendances';
    protected $fillable = ['id','i_user_id','i_student_id', 'i_batch_id', 'i_template_id','d_date','e_status','e_send_message', 'd_date'];
    public $timestamps = false;
    
    public function users(){
        return $this->belongsTo('App\Models\Admin','i_user_id');
    }
    public function students(){
        return $this->belongsTo('App\Models\Student','i_student_id')->select('id',DB::raw('CONCAT(v_first_name, " ", v_last_name) AS v_student_name'));
    }
    public function batches(){
        return $this->belongsTo('App\Models\Batch','i_batch_id')->select('id', 'v_batch_title','e_status');
    }
    public function templates(){
        return $this->belongsTo('App\Models\Template','i_template_id')->select('id', 'v_template_title','e_status');
    }
}

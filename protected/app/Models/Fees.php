<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Fees extends Model{
	protected $table = 'tbl_fees';
    protected $fillable = array('id','i_user_id','v_first_name','v_last_name','v_email','i_school_id','i_batch_id','v_parent_name','v_mobile_number','v_nick_name','v_address','e_status');
    
    public function users(){
        return $this->belongsTo('App\Models\User','i_user_id');
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

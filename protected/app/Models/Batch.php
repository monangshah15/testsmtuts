<?php
namespace App\Models;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model{
    protected $connection = 'mysql_dynamic_connection';
	protected $table = 'tbl_batches';
    protected $fillable = ['id','i_user_id','v_batch_title','e_status'];
    public $timestamps = false;
    
    public function batches_list(){
        return $this->lists('id','v_batch_title');
    }
}

<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model{
    protected $connection = 'mysql_dynamic_connection';
	protected $table = 'tbl_subjects';
    protected $fillable = array('i_user_id','v_subject_name','e_status','created_at','updated_at');
}

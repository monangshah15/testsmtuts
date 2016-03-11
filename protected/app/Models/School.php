<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class School extends Model{
    protected $connection = 'mysql_dynamic_connection';
	protected $table = 'tbl_schools';
    protected $fillable = ['v_title','e_status','created_at','updated_at'];
}

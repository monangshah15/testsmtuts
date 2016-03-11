<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Template extends Model{
	protected $table = 'tbl_templates';
    protected $fillable = array('i_user_id', 'v_template_title', 'v_template_content','e_type', 'v_template', 'e_status','created_at','updated_at');
}

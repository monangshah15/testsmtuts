<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class Admin extends Model implements AuthenticatableContract, CanResetPasswordContract
{
    use Authenticatable, CanResetPassword;
    

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'tbl_administrators';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['id', 'v_name', 'v_username', 'v_email', 'password', 'remember_token', 'd_recent_login', 'v_access_code', 'e_type', 'e_status', 'd_registration_date', 'f_prize', 'd_payment_due_date', 'i_default_sms_count', 'v_company_name', 'v_company_alias', 'v_company_address', 'v_company_email', 'v_user_signature', 'v_phone', 'v_whatsapp_number', 'v_regards_name', 'v_company_logo', 'v_auth_key', 'v_encryption_id', 'v_sender_id', 'e_messages_type', 'v_db_name', 'v_db_host', 'v_db_user', 'v_db_password', 'created_at', 'updated_at', 'deleted_at'];
    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];
}

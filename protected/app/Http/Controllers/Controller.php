<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Config;

abstract class Controller extends BaseController
{
    use DispatchesJobs, ValidatesRequests;
    
    public function otherDBConnection($host,$database,$username,$password){ // dynamic db connection funct
        
         Config::set('database.connections.'.$database, array(
                'driver'    => 'mysql',
                'host'      => $host,
                'database'  => $database,
                'username'  => $username,
                'password'  => $password,
                'charset'   => 'utf8',
                'collation' => 'utf8_unicode_ci',
                'prefix'    => '',
            ));
    }
    
    public function dynamic_db_connection($objdataAuth)
    {
        $this->otherDBConnection($objdataAuth->v_db_host,$objdataAuth->v_db_name,$objdataAuth->v_db_user,$objdataAuth->v_db_password);
        Config::set('database.connections.mysql_dynamic_connection.database', $objdataAuth->v_db_name);   
    }
    
    protected function generateImage($base64img, $v_random_image, $path) {
        if (strpos($base64img,'data:image/jpeg;base64,') !== false) {
            $base64img = str_replace('data:image/jpeg;base64,', '', $base64img);
            //$tmpFile = $v_random_image.'.jpeg';
        }
        if (strpos($base64img,'data:image/png;base64,') !== false) {
            $base64img = str_replace('data:image/png;base64,', '', $base64img);
            //$tmpFile = $v_random_image.'.png';
        }
        if (strpos($base64img,'data:image/webp;base64,') !== false) {
            
            $base64img = str_replace('data:image/webp;base64,', '', $base64img);
            //$tmpFile = $v_random_image.'.png';
        }
        
        if (strpos($base64img,'data:image/jpg;base64,') !== false) {
            $base64img = str_replace('data:image/jpg;base64,', '', $base64img);
            //$tmpFile = $v_random_image.'.jpg';
        }
        if (strpos($base64img,'data:image/gif;base64,') !== false) {
            $base64img = str_replace('data:image/gif;base64,', '', $base64img);
            //$tmpFile = $v_random_image.'.gif';
        }
        $tmpFile = $v_random_image.'.png';
        $data = base64_decode($base64img);
        
        $file = $path.$tmpFile;
            
        file_put_contents($file, $data);
        
        return $tmpFile;
    }
}

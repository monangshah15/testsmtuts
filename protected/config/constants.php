<?php 
use Illuminate\Support\Str;
function getCurrentControllerAction() {
    $routeArray = Str::parseCallback(Route::currentRouteAction(), null);
    if (last($routeArray) != null) {
        // Remove 'controller' from the controller name.
        $controller = str_replace('Controller', '', class_basename(head($routeArray)));
         
        // Take out the method from the action.
        $action = str_replace(['get', 'post', 'patch', 'put', 'delete'], '', last($routeArray));
        return $controller . '||' . $action;
    }
 
    return '';
}
define('VERSION','?ver=v.1.0.1');
define('JS_VERSION','?ver=v.1.0.1');
define('CSS_VERSION','?ver=v.1.0.1');

$SITE_URL = url()."/";
$SITE_URL = url().'/';
define('SITE_NAME','Smarttuts Ltd');
define('SITE_URL',$SITE_URL);
define('ASSET_URL',$SITE_URL.'assets/');
define("DOMPDF_ENABLE_REMOTE", false);

define('ADMIN_NAME','admin');
define('ADMIN_PATH',ADMIN_NAME);
define('ADMIN_URL',$SITE_URL.ADMIN_NAME."/");
define('ADMIN_ASSET_URL',$SITE_URL."assets/");
define('DOC_ROOT' , $_SERVER['DOCUMENT_ROOT']);

define('API_ADMIN_NAME','api-admin');
define('API_URL',$SITE_URL.API_ADMIN_NAME."/");

define('USER_NAME','user');
define('USER_URL',$SITE_URL.USER_NAME."/");

define('API_USER_NAME','api-user');
define('API_USER_URL',$SITE_URL.API_USER_NAME."/");

define('FROM_EMAIL_ADDRESS','testing.demo@gmail.com');
define('FROM_EMAIL_ADDRESS_NAME','eSynergy');
define('JS_CSS_VER','1.0.0');

define('EMAIL_FROM','dinesh@zealousweb.com');
define('EMAIL_PASSWORD','this.admin');
define('EMAIL_PORT','465');
define('EMAIL_SERVER','zealousweb.com');
define('EMAIL_SSL','ssl');

define('FILE_PATH','files/');
define('TEMP_PDF_PATH','files/temp-pdf/');
define('TEMP_SIGN_IMG_PATH','files/temp-sign-img/');

/*Database Credentials*/
define('DB_HOST','localhost');
define('DB_NAME','db_smarttuts');
define('DB_USER','root');
define('DB_PASSWORD','');
define('DB_PREFIX','');
define('CIPHER_KEY',159753852456);

/*Admin side constants*/
define('MAX_UPLOAD_SIZE','4');
define('PROFILE_PATH','files/profile/');
define('INVALID_IMAGE_EXTENSION','You must select an image file only.');
define('INVALID_IMAGE_SIZE','Please upload a smaller image, maximum size is '.MAX_UPLOAD_SIZE.' MB');
define('REC_PER_PAGE', 10);
define('BASE_HREF_ADMIN','/smarttuts/'.ADMIN_NAME.'/');
define('BASE_HREF_USER','/smarttuts/');
define('FOLDER_NAME','/smarttuts/');
define('TEMP_IMG_PATH', 'files/'); // all the image will be uploaded in this folder path
define('TEMP_IMAGE_THUMB_PATH', 'files/thumb/'); // all the thumb image will be uploaded in this folder path

function get_last_query() {
    $queries = DB::getQueryLog();
    $sql = end($queries);
    
    if( ! empty($sql['bindings'])) {
        $pdo = DB::getPdo();
        foreach($sql['bindings'] as $binding) {
            $sql['query'] = preg_replace('/\?/', $pdo->quote($binding), $sql['query'], 1);
        }
    }
    return pr($sql['query']);
}

function pr($arr) {
    echo "<pre>";
    print_r($arr);
    echo "</pre>";    
}
function customEncrypt($strData)
{
    $strData = Crypt::encrypt($strData);
    $strData = preg_replace('/[^A-Za-z0-9\-]/', '', $strData);
    return strtolower(substr($strData,(strlen($strData)-12),strlen($strData)));
}
?>
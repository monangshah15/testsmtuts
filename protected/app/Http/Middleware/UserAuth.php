<?php namespace App\Http\Middleware;
use Closure;
use Auth;
use Redirect;
use App\Models\User;
use Illuminate\Contracts\Auth\Guard;
use URL;

class UserAuth {
	/**
     * The Guard implementation.
     *
     * @var Guard
     */
    protected $auth;

    /**
     * Create a new filter instance.
     *
     * @param  Guard  $auth
     * @return void
     */
    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
	public function handle($request, Closure $next)
	{
	   	if ($this->auth->guest()) {
	   	    if ($request->ajax()) {
	   	        return response('Unauthorized.', 401);
            } 
        }
        else {
            $userType = Auth::user()->e_type;
            if($userType != 'Simple') {
    	    	return redirect()->guest('dashboard');
    	    }    
        }
        return $next($request);
	}
}
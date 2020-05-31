<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Type;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class TypeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Type
     */
    protected function create(array $data)
    {
        return Type::create([
            'name' => $data['name']
        ]);
       
    }

    /**
    * success response method.
    *
    * @return \Illuminate\Http\Response
    */
    public function getTypes()
    {
        $data = Type::all();

        return view('type')->with('data', json_encode($data));
    }

    public function typeSubmit(Request $request)
    {
        Type::create(['name' => $request['name']]);

        return response()->json([$request->all()]);
    }
}

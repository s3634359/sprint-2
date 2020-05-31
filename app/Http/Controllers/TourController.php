<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Tour;
use App\ToursLocations;
use App\ToursTypes;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class TourController extends Controller
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
            'min_time' => ['required', 'int']
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Tour
     */
    protected function create(array $data)
    {
        return Tour::create([
            'name' => $data['name'],
            'min_time' => 0
        ]);
       
    }

    /**
    * success response method.
    *
    * @return \Illuminate\Http\Response
    */
    public function getTours()
    {
        $data = DB::select('select * from tours');
        $type = DB::select('select tour_id, type_id, types.name as name from tours_types, tours, types where tours.id = tours_types.tour_id and tours_types.type_id = types.id');
        return view('tour')->with('data', json_encode($data))->with('type', json_encode($type));
    }

    public function newTourSubmit(Request $request)
    {
        $tour = Tour::create([
            'name' => $request['name'],
            'min_time' => 0
        ]);

        return response()->json([$request->all()]);
    }

    public function deleteTour(Request $request)
    {
        Tour::destroy($request['id']);
        return response()->json([$request->all()]);
    }

    public function getTourItem(Request $request)
    {
        $location_list = DB::select('select id, name, min_time from locations');
        $location = DB::select('select tours_locations.location_id as id, name, min_time, tours_locations.order from locations, tours_locations where tours_locations.tour_id = '. $request->id .' and locations.id = tours_locations.location_id order by tours_locations.order ASC');
        return view('tour_item')->with('location', json_encode($location))->with('location_list', json_encode($location_list));
    }

    public function tourSubmit(Request $request)
    {
        DB::insert('insert into locations values (NULL, ?, ?, ?, ?, ?, NOW(), NULL)', [$request['name'], $request['x_axis'], $request['y_axis'], $request['description'], $request['min_time']]);
        return response()->json([$request->all()]);
    }

    public function tourTimeUpdate(Request $request)
    {
        
        DB::table('tours')
            ->where('id', $request['id'])
            ->update(['min_time' => $request['min_time']]);
        
        return response()->json([$request->all()]);
    }

    public function tourSubmitLocation(Request $request)
    {
        $tours_locations = ToursLocations::where('tour_id', '=', $request['id'])->where('location_id', '=', $request['location_id'])->first();
        if ($tours_locations != null) {
            $tours_locations->order = $request['location_order'];
            $tours_locations->save();
        } else {
            $tours_locations = new ToursLocations;
            $tours_locations->order = $request['location_order'];
            $tours_locations->tour_id = $request['id'];
            $tours_locations->location_id = $request['location_id'];
            $tours_locations->save();
        }
        return response()->json([$request->all()]);
    }

    public function tourDeleteLocation(Request $request)
    {
        ToursLocations::where('tour_id', '=', $request['id'])->where('location_id', '=', $request['location_id'])->delete();
        return response()->json([$request->all()]);
    }

    public function getTourType(Request $request)
    {
        $type_list = DB::select('select * from types');
        $type = DB::select('select type_id as id, name from types, tours_types where types.id = tours_types.type_id and tours_types.tour_id = ?', [$request['id']]);
        return view('tour_type')->with('type', json_encode($type))->with('type_list', json_encode($type_list));
    }

    public function tourSubmitType(Request $request)
    {
        $tours_types = ToursTypes::where('tour_id', '=', $request['id'])->where('type_id', '=', $request['type_id'])->first();
        if ($tours_types == null) {
            $tours_types = new ToursTypes;
            $tours_types->tour_id = $request['id'];
            $tours_types->type_id = $request['type_id'];
            $tours_types->save();
        }
        return response()->json([$request->all()]);
    }

    public function tourDeleteType(Request $request)
    {
        ToursTypes::where('tour_id', '=', $request['id'])->where('type_id', '=', $request['type_id'])->delete();
        return response()->json([$request->all()]);
    }
    
}

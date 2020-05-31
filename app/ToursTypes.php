<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class ToursTypes extends Model
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    public function types()
    {
        return $this->hasMany('App\Type');
    }

    public function tours()
    {
        return $this->hasMany('App\Tour');
    }

}

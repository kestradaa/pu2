<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Collective\Html\Eloquent\FormAccessible;

class Mayor extends Model
{
    use FormAccessible;

    protected $fillable = [
        'name', 'department_id', 'municipality_id',
        'nominated', 'signed_up',
    ];

    protected $dates = [
        'created_at',
        'updated_at'
    ];

    public static function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'nominated' => 'boolean',
            'signed_up' => 'boolean',
            'department_id' => 'required|numeric',
            'municipality_id' => 'required|numeric',
        ];
    }

    public function setNameAttribute($value = '')
    {
        $this->attributes['name'] = mb_convert_case($value, MB_CASE_TITLE, "UTF-8");
    }

    public function getNominatedAttribute($value)
    {
        return $value ? "Si" : "No";
    }

    public function getSignedUpAttribute($value)
    {
        return $value ? "Si" : "No";
    }

    public function formNominatedAttribute($value)
    {
        return $value;
    }

    public function formSignedUpAttribute($value)
    {
        return $value;
    }
    
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }
}

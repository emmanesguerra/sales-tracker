<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateQrRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // If you have authorization logic, adjust it accordingly
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'items.selectedItems' => 'required|array|min:1',
            'items.isGrid' => 'required|boolean',
        ];
    }

    public function messages()
    {
        return [
            'items.selectedItems.required' => 'You must select at least one item.',
            'items.selectedItems.min' => 'Please select at least one item.',
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentListResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'PaymentID' => $this->PaymentID,
            'Payer'     => $this->payer_name,
            'Course'    => $this->course_title,
            'Amount'    => (float) $this->Amount,
            'Status'    => (string) ($this->status_label ?? ''),
            'PayDate'   => (string) ($this->pay_date_formatted ?? ''),
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AccountListResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'AccountID' => $this->AccountID,
            'FullName'  => $this->AName,
            'Role'      => $this->ARole,
            'Status'    => (string) ($this->status_label ?? $this->AStatus ?? ''),
        ];
    }
}

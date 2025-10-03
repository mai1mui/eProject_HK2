<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseTopResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'CourseID'      => $this->CourseID,
            'Title'         => (string) ($this->Title ?? $this->CName ?? ''),
            'student_count' => (int) ($this->enrollments_count ?? 0),
        ];
    }
}

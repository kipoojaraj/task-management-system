<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'user' => [
                'id' => $this->whenLoaded('user', fn () => $this->user?->id),
                'name' => $this->whenLoaded('user', fn () => $this->user?->name),
                'email' => $this->whenLoaded('user', fn () => $this->user?->email),
                'role' => $this->whenLoaded('user', fn () => $this->user?->role),
            ],
        ];
    }
}

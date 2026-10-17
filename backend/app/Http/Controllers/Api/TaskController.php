<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Task::query()->with('user:id,name,email,role');

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        } else {
            if ($request->filled('user_id')) {
                $query->where('user_id', $request->query('user_id'));
            } elseif ($request->query('filter') === 'admin') {
                $query->where('user_id', $request->user()->id);
            } elseif ($request->query('filter') === 'users') {
                $query->where('user_id', '!=', $request->user()->id);
            }
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->toString();

            $query->where(function ($q) use ($search, $request) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");

                if ($request->user()->role === 'admin') {
                    $q->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                           ->orWhere('email', 'like', "%{$search}%");
                    });
                }
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $tasks = $query
            ->latest()
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->withQueryString();

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $request->user()->tasks()->create(
            $request->validated()
        );

        $task->load('user:id,name,email,role');

        return (new TaskResource($task))
            ->response()
            ->setStatusCode(201);
    }

    public function update(
        UpdateTaskRequest $request,
        Task $task
    ): TaskResource {
        Gate::authorize('update', $task);

        $task->update($request->validated());
        $task->load('user:id,name,email,role');

        return new TaskResource($task);
    }

    public function destroy(Task $task): JsonResponse
    {
        Gate::authorize('delete', $task);

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully.',
        ]);
    }
}

<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/users', function (Request $request) {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            User::select('id', 'name', 'email', 'role')->orderBy('name')->get()
        );
    });

    Route::get('/dashboard/summary', function (Request $request) {
        $user = $request->user();

        if ($user->role !== 'admin') {
            $total = Task::where('user_id', $user->id)->count();
            $pending = Task::where('user_id', $user->id)->where('status', 'pending')->count();
            $inProgress = Task::where('user_id', $user->id)->where('status', 'in_progress')->count();
            $completed = Task::where('user_id', $user->id)->where('status', 'completed')->count();

            return response()->json([
                'role' => 'user',
                'total' => $total,
                'pending' => $pending,
                'in_progress' => $inProgress,
                'completed' => $completed,
            ]);
        }

        $total = Task::count();
        $pending = Task::where('status', 'pending')->count();
        $inProgress = Task::where('status', 'in_progress')->count();
        $completed = Task::where('status', 'completed')->count();
        $totalUsers = User::count();

        $usersSummary = User::select('id', 'name', 'email', 'role')
            ->withCount([
                'tasks as total_tasks',
                'tasks as pending_tasks' => fn ($q) => $q->where('status', 'pending'),
                'tasks as in_progress_tasks' => fn ($q) => $q->where('status', 'in_progress'),
                'tasks as completed_tasks' => fn ($q) => $q->where('status', 'completed'),
            ])
            ->orderBy('name')
            ->get();

        return response()->json([
            'role' => 'admin',
            'total' => $total,
            'pending' => $pending,
            'in_progress' => $inProgress,
            'completed' => $completed,
            'total_users' => $totalUsers,
            'users_summary' => $usersSummary,
        ]);
    });

    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
});

<?php

namespace App\Http\Controllers;

use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ResultController extends Controller
{
    /**
     * GET /api/results
     * Hỗ trợ: search, rstatus, min_mark, max_mark, sort_by, sort_dir, page, per_page
     */
    public function index(Request $req)
    {
        $q = Result::query();

        // ===== Filters =====
        if ($s = trim((string) $req->input('search', ''))) {
            $q->where(function ($qb) use ($s) {
                $qb->where('id', 'like', "%{$s}%")
                   ->orWhere('ResultCode', 'like', "%{$s}%")
                   ->orWhere('AccountID', 'like', "%{$s}%")
                   ->orWhere('CourseID', 'like', "%{$s}%")
                   ->orWhere('Content', 'like', "%{$s}%");
            });
        }

        if ($rstatus = $req->input('rstatus')) {
            $q->where('RStatus', $rstatus);
        }

        if ($req->filled('min_mark') && is_numeric($req->min_mark)) {
            $q->where('Mark', '>=', (float) $req->min_mark);
        }
        if ($req->filled('max_mark') && is_numeric($req->max_mark)) {
            $q->where('Mark', '<=', (float) $req->max_mark);
        }

        // ===== Sorting =====
        $sortBy  = (string) $req->input('sort_by', 'id');
        $sortDir = strtolower((string) $req->input('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';
        $allowed = ['id', 'ResultCode', 'AccountID', 'CourseID', 'Mark', 'RStatus'];
        if (!in_array($sortBy, $allowed, true)) {
            $sortBy = 'id';
        }
        $q->orderBy($sortBy, $sortDir);

        // ===== Pagination =====
        $page    = max(1, (int) $req->input('page', 1));
        $perPage = max(1, min(100, (int) $req->input('per_page', 10)));
        $p = $q->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data'          => $p->items(),
            'total'         => $p->total(),
            'per_page'      => $p->perPage(),
            'current_page'  => $p->currentPage(),
            'last_page'     => $p->lastPage(),
            'sort_by'       => $sortBy,
            'sort_dir'      => $sortDir,
        ]);
    }

    /**
     * POST /api/results
     * Tạo bản ghi mới, sau đó sinh ResultCode = RES + id (zero-pad 3)
     */
    public function store(Request $req)
    {
        $v = $req->validate([
            'AccountID' => ['required', 'string', 'max:50'],
            'CourseID'  => ['required', 'string', 'max:50'],
            'Content'   => ['required', 'string', 'max:1000'],
            'Mark'      => ['required', 'numeric', 'between:0,100'],
            'RStatus'   => ['required', Rule::in(['Passed', 'Pending', 'Failed'])],
        ]);

        // B1: tạo để có id auto-increment
        $created = Result::create($v);

        // B2: sinh mã hiển thị từ id
        $created->ResultCode = 'RES' . str_pad((string) $created->id, 3, '0', STR_PAD_LEFT);
        $created->save();

        return response()->json([
            'message' => 'Created',
            'data'    => $created,
        ], 201);
    }

    /**
     * GET /api/results/{id}
     */
    public function show($id)
    {
        $row = Result::findOrFail($id);
        return response()->json(['data' => $row]);
    }

    /**
     * PUT/PATCH /api/results/{id}
     */
    public function update(Request $req, $id)
    {
        $row = Result::findOrFail($id);

        $req->validate([
            'AccountID' => ['sometimes', 'required', 'string', 'max:50'],
            'CourseID'  => ['sometimes', 'required', 'string', 'max:50'],
            'Content'   => ['sometimes', 'required', 'string', 'max:1000'],
            'Mark'      => ['sometimes', 'required', 'numeric', 'between:0,100'],
            'RStatus'   => ['sometimes', 'required', Rule::in(['Passed', 'Pending', 'Failed'])],
        ]);

        $payload = $req->only(['AccountID', 'CourseID', 'Content', 'Mark', 'RStatus']);
        $row->fill($payload)->save();

        return response()->json([
            'message' => 'Updated',
            'data'    => $row,
        ]);
    }

    /**
     * DELETE /api/results/{id}
     */
    public function destroy($id)
    {
        $row = Result::findOrFail($id);
        $row->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

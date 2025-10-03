<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;
use Illuminate\Support\Str;

class AdminMediaController extends Controller
{
    /** Thư mục đích theo loại */
    private const DIRS = [
        'video'      => 'lessons/videos',
        'image'      => 'lessons/images',
        'assignment' => 'lessons/assignments',
        'doc'        => 'lessons/docs',
    ];

    /** Giới hạn dung lượng theo loại (MB) */
    private const MAX_SIZE_MB = [
        'video'      => 1024, // 1GB
        'image'      => 20,
        'assignment' => 200,
        'doc'        => 100,
    ];

    /** MIME types cho từng loại */
    private const MIMES = [
        'video'      => ['mp4', 'mov', 'm4v', 'mkv', 'webm', 'avi'],
        'image'      => ['png', 'jpg', 'jpeg', 'webp', 'gif'],
        'assignment' => ['pdf', 'zip', 'rar', '7z', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'],
        'doc'        => ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'csv'],
    ];

    /** POST /api/admin/uploads  (multipart) */
    public function store(Request $req)
    {
        $req->validate([
            'kind' => 'required|string|in:video,image,doc,assignment',
            'file' => [
                'required',
                'file',
                File::types(self::MIMES[$req->input('kind', 'doc')] ?? self::MIMES['doc'])
                    ->max(($this->maxSizeBytes($req->input('kind'))) / 1024), // laravel expects KB
            ],
        ]);

        $kind = $req->string('kind');
        $disk = 'public';
        $dir  = self::DIRS[$kind] ?? self::DIRS['doc'];

        $file = $req->file('file');

        // Tên file an toàn & duy nhất
        $ext       = strtolower($file->getClientOriginalExtension());
        $origName  = $file->getClientOriginalName();
        $safeBase  = Str::slug(pathinfo($origName, PATHINFO_FILENAME));
        $filename  = Str::uuid()->toString() . '_' . ($safeBase ?: 'file') . '.' . $ext;

        // Lưu
        $path = $file->storeAs($dir, $filename, $disk); // e.g. lessons/docs/uuid_file.pdf

        // Metadata
        $size = $file->getSize(); // bytes
        $mime = $file->getMimeType();

        return response()->json([
            'ok'            => true,
            'kind'          => $kind,
            'path'          => $path,                                 // Lưu vào DB (Content)
            'url'           => asset("storage/{$path}"),              // Mở từ FE
            'original_name' => $origName,
            'filename'      => $filename,
            'mime'          => $mime,
            'size'          => $size,
        ], 201);
    }

    /** DELETE /api/admin/uploads  (body: { path: "lessons/xxx/file.ext" }) */
    public function destroy(Request $req)
    {
        $data = $req->validate([
            'path' => 'required|string',
        ]);

        $disk = 'public';
        $path = $data['path'];

        if (!Storage::disk($disk)->exists($path)) {
            return response()->json(['ok' => false, 'message' => 'File not found'], 404);
        }

        Storage::disk($disk)->delete($path);

        return response()->json(['ok' => true]);
    }

    /** Helper: bytes limit theo loại */
    private function maxSizeBytes(string $kind = 'doc'): int
    {
        $mb = self::MAX_SIZE_MB[$kind] ?? self::MAX_SIZE_MB['doc'];
        return $mb * 1024 * 1024;
    }
}

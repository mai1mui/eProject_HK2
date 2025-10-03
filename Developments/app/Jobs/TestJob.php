<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;   // <-- thêm
use Illuminate\Queue\InteractsWithQueue;      // <-- thêm (khuyến nghị)
use Illuminate\Queue\SerializesModels;        // <-- thêm (khuyến nghị)

class TestJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        \Log::info('TestJob ran at ' . now());
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // GET /api/payments
    public function index(Request $request)
    {
        $query = Payment::with(['account', 'course']);

        if ($search = $request->input('search')) {
            $query->where('PaymentID', 'like', "%$search%")
                  ->orWhere('AccountID', 'like', "%$search%")
                  ->orWhere('CourseID', 'like', "%$search%");
        }

        if ($status = $request->input('status')) {
            $query->where('PStatus', $status);
        }

        return response()->json($query->get());
    }

    // GET /api/payments/{id}
    public function show($id)
    {
        $payment = Payment::with(['account', 'course'])->findOrFail($id);
        return response()->json($payment);
    }

    // POST /api/payments
    public function store(Request $request)
    {
        $request->validate([
            'PaymentID' => 'required|string|unique:payments,PaymentID',
            'AccountID' => 'required|string|exists:accounts,AccountID',
            'CourseID' => 'required|string|exists:courses,CourseID',
            'Amount' => 'required|numeric|min:0',
            'PDate' => 'required|date',
            'PStatus' => 'required|in:Paid,Processing,Not confirmed',
            'TransactionRef' => 'required|string',
        ]);

        $payment = Payment::create($request->all());

        return response()->json(['message' => 'Payment created', 'payment' => $payment], 201);
    }

    // PUT /api/payments/{id}
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $request->validate([
            'AccountID' => 'sometimes|string|exists:accounts,AccountID',
            'CourseID' => 'sometimes|string|exists:courses,CourseID',
            'Amount' => 'sometimes|numeric|min:0',
            'PDate' => 'sometimes|date',
            'PStatus' => 'sometimes|in:Paid,Processing,Not confirmed',
            'TransactionRef' => 'sometimes|string',
        ]);

        $payment->update($request->all());

        return response()->json(['message' => 'Payment updated', 'payment' => $payment]);
    }

    // DELETE /api/payments/{id}
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(['message' => 'Payment deleted']);
    }
}

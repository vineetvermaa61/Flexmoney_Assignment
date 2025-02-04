const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  amount: { type: Number, default: 500 },
  transactionId: { type: String, required: true },
  status: { type: String, enum: ["success", "failed"], default: "success" },
  paymentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);

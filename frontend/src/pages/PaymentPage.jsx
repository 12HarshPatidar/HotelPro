import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { ShieldCheck, CreditCard, Lock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        if (res.data.success) {
          setBooking(res.data.data);
          // If already paid, redirect straight to confirmation
          if (res.data.data.paymentStatus === 'paid') {
            navigate(`/confirmation/${bookingId}`);
          }
        }
      } catch (err) {
        toast.error('Unable to fetch reservation details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  // Razorpay Gateway Checkout
  const handleRazorpayPayment = async () => {
    setProcessing(true);
    try {
      const orderRes = await api.post('/payments/create-order', { bookingId });
      if (!orderRes.data.success) {
        toast.error('Failed to initiate payment gateway');
        setProcessing(false);
        return;
      }

      const { orderId, amount, currency, keyId, mode } = orderRes.data;

      // If in test_mode sandbox without razorpay keys
      if (mode === 'test_mode' || !window.Razorpay) {
        handleTestPayment();
        return;
      }

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'HotelPro Luxury Hospitality',
        description: `Reservation #${booking.bookingReference}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success('Payment verified successfully!');
              navigate(`/confirmation/${bookingId}`);
            }
          } catch (verifyErr) {
            toast.error(verifyErr.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: booking.guestDetails?.name,
          email: booking.guestDetails?.email,
          contact: booking.guestDetails?.phone,
        },
        theme: {
          color: '#c5a880',
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      razorpayInstance.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment processing error');
    } finally {
      setProcessing(false);
    }
  };

  // Dedicated Test-Mode Sandbox Simulator
  const handleTestPayment = async () => {
    setProcessing(true);
    try {
      const res = await api.post('/payments/test-payment', { bookingId });
      if (res.data.success) {
        toast.success('Test payment verified! Booking is confirmed.');
        navigate(`/confirmation/${bookingId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Test payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center min-vh-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading payment...</span>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h4>Reservation Not Found</h4>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: '#faf9f6' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="mb-4">
              <span className="badge badge-gold mb-2">Secure Checkout</span>
              <h2 className="font-serif fw-bold">Complete Your Reservation</h2>
              <p className="text-muted m-0">
                Booking Reference: <strong className="text-dark">#{booking.bookingReference}</strong>
              </p>
            </div>

            {/* Reservation Summary Card */}
            <div className="card luxury-card p-4 border-0 mb-4 shadow-sm">
              <h5 className="font-serif fw-bold mb-3 border-bottom pb-2">Reservation Summary</h5>
              <div className="row g-3 text-secondary small mb-3">
                <div className="col-md-6">
                  <span className="text-muted d-block">Hotel</span>
                  <strong className="text-dark fs-6">{booking.hotelId?.name}</strong>
                  <div>{booking.hotelId?.city}, India</div>
                </div>
                <div className="col-md-6">
                  <span className="text-muted d-block">Accommodation</span>
                  <strong className="text-dark fs-6">{booking.roomId?.categoryId?.name || 'Luxury Suite'}</strong>
                  <div>Room #{booking.roomId?.roomNumber}</div>
                </div>
                <div className="col-md-6">
                  <span className="text-muted d-block">Check-In</span>
                  <strong className="text-dark">{new Date(booking.checkIn).toLocaleDateString()}</strong>
                  <div>From {booking.hotelId?.policies?.checkInTime || '14:00'}</div>
                </div>
                <div className="col-md-6">
                  <span className="text-muted d-block">Check-Out</span>
                  <strong className="text-dark">{new Date(booking.checkOut).toLocaleDateString()}</strong>
                  <div>Until {booking.hotelId?.policies?.checkOutTime || '11:00'}</div>
                </div>
                <div className="col-md-12">
                  <span className="text-muted d-block">Guest Information</span>
                  <strong className="text-dark">
                    {booking.guestDetails?.name} ({booking.guestDetails?.email}, {booking.guestDetails?.phone})
                  </strong>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-light p-3 rounded text-secondary small">
                <div className="d-flex justify-content-between mb-1">
                  <span>
                    Room Rate ({booking.pricing.nights} Night{booking.pricing.nights > 1 ? 's' : ''})
                  </span>
                  <span>₹{(booking.pricing.roomPricePerNight * booking.pricing.nights).toLocaleString('en-IN')}</span>
                </div>
                {booking.pricing.discountAmount > 0 && (
                  <div className="d-flex justify-content-between text-success mb-1">
                    <span>Promotional Discount</span>
                    <span>-₹{booking.pricing.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-1">
                  <span>GST Taxes (12%)</span>
                  <span>₹{booking.pricing.taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-top pt-2 mt-2 d-flex justify-content-between text-dark fw-bold fs-5">
                  <span>Total Amount Due</span>
                  <span style={{ color: '#ab8d64' }}>₹{booking.pricing.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Payment Options Card */}
            <div className="card luxury-card p-4 border-0 mb-4 shadow-sm">
              <h5 className="font-serif fw-bold mb-3 d-flex align-items-center gap-2">
                <Lock size={18} className="text-warning" />
                <span>Select Payment Method</span>
              </h5>

              <p className="text-muted small mb-4">
                All transactions are verified using encrypted 256-bit SSL protocols. Cards and credentials are never stored.
              </p>

              {/* Live Razorpay Checkout Option */}
              <div className="p-3 border rounded mb-3 bg-white d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded bg-light border text-warning">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h6 className="m-0 fw-bold">Razorpay Payment Gateway</h6>
                    <small className="text-muted">UPI, Credit/Debit Cards, NetBanking, Wallets</small>
                  </div>
                </div>
                <button
                  className="btn btn-gold px-4"
                  onClick={handleRazorpayPayment}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay ₹${booking.pricing.totalAmount.toLocaleString('en-IN')}`}
                </button>
              </div>

              {/* Sandbox Test Mode Option for instant developer testing */}
              <div className="p-3 border border-warning rounded bg-warning bg-opacity-10 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 text-warning mb-1">
                    <AlertTriangle size={16} />
                    <strong className="text-dark small">Sandbox Test-Mode Simulation</strong>
                  </div>
                  <p className="text-muted small m-0" style={{ maxWidth: '420px' }}>
                    Verify the complete booking workflow immediately without live credit card credentials.
                  </p>
                </div>
                <button
                  className="btn btn-charcoal btn-sm px-3 flex-shrink-0"
                  onClick={handleTestPayment}
                  disabled={processing}
                >
                  Instant Test-Payment
                </button>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between text-muted small">
              <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-muted p-0 small">
                <ArrowLeft size={14} className="me-1" /> Return to Room
              </button>
              <div className="d-flex align-items-center gap-1">
                <ShieldCheck size={16} className="text-success" />
                <span>Verified SSL Hospitality Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

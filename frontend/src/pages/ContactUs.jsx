import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Thank you for contacting HotelPro Concierge. Our desk will respond within 2 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#faf9f6' }}>
      <div className="container">
        <div className="text-center mb-5" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span className="badge badge-gold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>
            Concierge Desk
          </span>
          <h1 className="font-serif fw-bold display-5 mb-2">Connect with HotelPro</h1>
          <p className="text-muted">
            Whether planning an intimate getaway, executive conference, or private celebration, our hospitality desk is
            available 24 hours a day.
          </p>
        </div>

        <div className="row g-5">
          {/* Contact Details */}
          <div className="col-lg-5">
            <div className="card luxury-card p-4 p-md-5 border-0 bg-white shadow-sm h-100">
              <h4 className="font-serif fw-bold text-dark mb-4">Direct Contact Channels</h4>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded bg-light border text-warning flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <strong className="text-dark d-block">Flagship Properties</strong>
                    <span className="text-secondary small d-block">Udaipur, Goa, and Mumbai, India</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded bg-light border text-warning flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <strong className="text-dark d-block">24/7 Luxury Desk Hotline</strong>
                    <span className="text-secondary small d-block">+91 98765 00000 (Toll-Free in India)</span>
                    <span className="text-secondary small d-block">+91 22 6633 4400 (International)</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded bg-light border text-warning flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <strong className="text-dark d-block">Concierge Email</strong>
                    <span className="text-secondary small d-block">concierge@hotelpro.com</span>
                    <span className="text-secondary small d-block">reservations@hotelpro.com</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded bg-light border text-warning flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <strong className="text-dark d-block">Operating Hours</strong>
                    <span className="text-secondary small d-block">Front Desk & Concierge: 24 Hours / 7 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="col-lg-7">
            <div className="card luxury-card p-4 p-md-5 border-0 bg-white shadow-sm">
              <h4 className="font-serif fw-bold text-dark mb-4">Send a Message</h4>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Your Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rahul Verma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Inquiry Subject</label>
                    <select
                      className="form-select"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Suite Reservation">Suite Reservation Assistance</option>
                      <option value="Private Event">Wedding or Private Event</option>
                      <option value="Corporate Booking">Corporate Conference</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Message / Special Requirements</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="How may our concierge team assist you today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-gold w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                      disabled={submitting}
                    >
                      <Send size={16} />
                      <span>{submitting ? 'Transmitting Message...' : 'Send Inquiry to Concierge'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

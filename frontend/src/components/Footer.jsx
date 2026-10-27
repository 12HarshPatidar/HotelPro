import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      toast.success('Thank you for subscribing to HotelPro Luxury Privileges newsletter!');
      setEmail('');
    }
  };

  return (
    <footer style={{ backgroundColor: '#181a1b', color: '#d0d4d9', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, #c5a880 0%, #ab8d64 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Hotel size={20} />
              </div>
              <span className="brand-font fs-4 fw-bold text-white tracking-wide">
                HOTEL<span style={{ color: '#c5a880' }}>PRO</span>
              </span>
            </div>
            <p className="text-secondary small leading-relaxed mb-4">
              HotelPro represents the pinnacle of luxury hospitality. Seamless reservations, opulent suites, Michelin-caliber gastronomy, and bespoke concierge care.
            </p>
            <div className="d-flex flex-column gap-2 small text-secondary">
              <div className="d-flex align-items-center gap-2">
                <MapPin size={16} className="text-warning flex-shrink-0" />
                <span>Flagships in Udaipur, Goa & Mumbai, India</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-warning flex-shrink-0" />
                <span>+91 98765 00000 (24/7 Luxury Desk)</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-warning flex-shrink-0" />
                <span>concierge@hotelpro.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white text-uppercase tracking-wider fw-bold mb-3 small" style={{ letterSpacing: '1px' }}>
              Destinations
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/rooms?city=Udaipur" className="text-secondary text-decoration-none hover-white">
                  Grand Palace, Udaipur
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Goa" className="text-secondary text-decoration-none hover-white">
                  Oceanview Resort, Goa
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Mumbai" className="text-secondary text-decoration-none hover-white">
                  Royal Pavilion, Mumbai
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-secondary text-decoration-none hover-white">
                  All Suites & Villas
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-secondary text-decoration-none hover-white">
                  Experiences & Spa
                </Link>
              </li>
            </ul>
          </div>

          {/* Guest Services */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white text-uppercase tracking-wider fw-bold mb-3 small" style={{ letterSpacing: '1px' }}>
              Information
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/about" className="text-secondary text-decoration-none hover-white">
                  About HotelPro
                </Link>
              </li>
              <li>
                <Link to="/policies" className="text-secondary text-decoration-none hover-white">
                  Booking & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary text-decoration-none hover-white">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-secondary text-decoration-none hover-white">
                  Member Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-white text-uppercase tracking-wider fw-bold mb-3 small" style={{ letterSpacing: '1px' }}>
              Exclusive Privileges
            </h6>
            <p className="text-secondary small mb-3">
              Receive private invitations to seasonal offers, complimentary upgrades, and culinary previews.
            </p>
            {subscribed ? (
              <div className="alert alert-success d-flex align-items-center gap-2 p-2 small">
                <CheckCircle size={16} /> Subscribed with VIP privileges!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="d-flex gap-2">
                <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-gold btn-sm px-3 flex-shrink-0">
                  Join
                </button>
              </form>
            )}
            <div className="d-flex align-items-center gap-2 mt-3 text-muted small">
              <ShieldCheck size={16} className="text-warning" />
              <span style={{ fontSize: '0.75rem' }}>Encrypted & Verified Secure Platform</span>
            </div>
          </div>
        </div>

        <div className="border-top border-secondary border-opacity-25 pt-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 small text-secondary">
          <p className="m-0">© {new Date().getFullYear()} HotelPro Luxury Hospitality Group. All rights reserved.</p>
          <div className="d-flex gap-3">
            <Link to="/policies" className="text-secondary text-decoration-none">
              Cancellation Policies
            </Link>
            <span>•</span>
            <Link to="/policies" className="text-secondary text-decoration-none">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/policies" className="text-secondary text-decoration-none">
              Terms of Stay
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

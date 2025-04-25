
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-12 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="font-bold text-2xl bg-gradient-to-r from-queueless-primary to-queueless-secondary bg-clip-text text-transparent">
              QueueLess
            </h3>
            <p className="text-queueless-grey text-sm leading-relaxed">
              Transforming the way you book and manage appointments with real-time wait tracking and seamless scheduling.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-queueless-dark">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-queueless-grey hover:text-queueless-primary transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-queueless-grey hover:text-queueless-primary transition-colors duration-200">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-queueless-grey hover:text-queueless-primary transition-colors duration-200">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-queueless-dark">Contact</h4>
            <ul className="space-y-3">
              <li className="text-queueless-grey hover:text-queueless-primary transition-colors duration-200">
                Email: contact@queueless.com
              </li>
              <li className="text-queueless-grey hover:text-queueless-primary transition-colors duration-200">
                Phone: (123) 456-7890
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-queueless-grey">
          © {new Date().getFullYear()} QueueLess. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

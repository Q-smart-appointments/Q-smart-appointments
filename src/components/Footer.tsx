
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 md:px-8 bg-gray-50 border-t">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-queueless-dark mb-4">QueueLess</h3>
            <p className="text-queueless-grey text-sm">
              Transforming the way you book and manage appointments with real-time wait tracking and seamless scheduling.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-queueless-dark mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-queueless-grey hover:text-queueless-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-queueless-grey hover:text-queueless-primary transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-queueless-grey hover:text-queueless-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-queueless-dark mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-queueless-grey">Email: contact@queueless.com</li>
              <li className="text-queueless-grey">Phone: (123) 456-7890</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-6 pt-6 text-center text-sm text-queueless-grey">
          © {new Date().getFullYear()} QueueLess. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

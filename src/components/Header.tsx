
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full py-4 px-4 md:px-8 bg-white shadow-sm">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-queueless-primary to-queueless-secondary flex items-center justify-center text-white font-bold text-xl">
            Q
          </div>
          <span className="text-queueless-dark font-bold text-xl hidden sm:inline">QueueLess</span>
        </Link>

        <nav>
          <ul className="flex items-center space-x-4 md:space-x-8">
            <li>
              <Link to="/" className="text-queueless-grey hover:text-queueless-dark transition-colors">
                Home
              </Link>
            </li>
            {!isAuthenticated && (
              <>
                <li>
                  <Link to="/book" className="text-queueless-grey hover:text-queueless-dark transition-colors">
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <Button asChild variant="outline">
                    <Link to="/login">Login</Link>
                  </Button>
                </li>
              </>
            )}
            {isAuthenticated && role === "customer" && (
              <>
                <li>
                  <Link to="/book" className="text-queueless-grey hover:text-queueless-dark transition-colors">
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <Link to="/customer-dashboard" className="text-queueless-grey hover:text-queueless-dark transition-colors">
                    My Appointments
                  </Link>
                </li>
                <li>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </li>
              </>
            )}
            {isAuthenticated && role === "provider" && (
              <>
                <li>
                  <Link to="/provider-dashboard" className="text-queueless-grey hover:text-queueless-dark transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

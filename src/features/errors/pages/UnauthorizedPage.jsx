import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <h1 className="text-9xl font-bold text-gray-200">403</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mt-4">Access Denied</h2>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        You don't have permission to access this page. 
        Please contact your administrator if you believe this is an error.
      </p>
      <div className="mt-8 space-x-4">
        <Link to="/dashboard">
          <Button variant="primary">
            Back to Dashboard
          </Button>
        </Link>
        <Button 
          variant="outline"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link to="/dashboard" className="mt-8">
        <Button variant="primary">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
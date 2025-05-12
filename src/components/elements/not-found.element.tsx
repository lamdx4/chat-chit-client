import React from 'react';
import { useNavigate } from 'react-router';

const NotFoundElement: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
            <h1 className="text-6xl font-bold text-blue-600 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-6 max-w-md">
                Sorry, the page you are looking for does not exist or has been moved.
            </p>
            
            <div className="mb-8">
                <span className="text-7xl">💬</span>
            </div>
            
            <button
                onClick={() => navigate('/')}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Back to Home
            </button>
        </div>
    );
};

export default NotFoundElement;
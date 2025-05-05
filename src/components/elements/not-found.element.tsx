import React from 'react';
import { useNavigate } from 'react-router';

const NotFoundElement: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
            <h1 className="text-6xl font-bold text-blue-600 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trang không tìm thấy</h2>
            <p className="text-gray-600 mb-6 max-w-md">
                Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
            </p>
            
            <div className="mb-8">
                <span className="text-7xl">💬</span>
            </div>
            
            <button
                onClick={() => navigate('/')}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Quay lại trang chính
            </button>
        </div>
    );
};

export default NotFoundElement;
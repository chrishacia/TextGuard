import React from 'react';

type BannerProps = {
    type: 'success' | 'danger' | 'info' | 'warning';
    message: string;
    onClose?: () => void;
};

const Banner: React.FC<BannerProps> = ({ type, message, onClose }) => (
    <div
        className={`alert alert-${type} d-flex justify-content-between align-items-center py-2 mb-3`}
        role="alert"
    >
        <span>{message}</span>
        {onClose && (
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
            ></button>
        )}
    </div>
);

export default Banner;

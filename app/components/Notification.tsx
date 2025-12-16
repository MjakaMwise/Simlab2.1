import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export default function Notification({ type, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-4 z-50 animate-slide-up">
      <div
        className={`glass-card p-4 pr-12 max-w-md ${
          type === 'success'
            ? 'border-green-500/50 bg-green-500/10'
            : 'border-red-500/50 bg-red-500/10'
        }`}
      >
        <div className="flex items-start gap-3">
          {type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          )}
          <p className="text-white">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

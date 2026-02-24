import { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning',
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '⚠️',
          bgColor: 'bg-red-50',
          iconBgColor: 'bg-red-100',
          confirmBtnColor: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'bg-yellow-50',
          iconBgColor: 'bg-yellow-100',
          confirmBtnColor: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'info':
        return {
          icon: 'ℹ️',
          bgColor: 'bg-blue-50',
          iconBgColor: 'bg-blue-100',
          confirmBtnColor: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };

  const { icon, bgColor, iconBgColor, confirmBtnColor } = getIconAndColor();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
        <div className={`${bgColor} px-6 pt-6 pb-4 rounded-t-xl`}>
          <div className="flex items-start space-x-4">
            <div className={`${iconBgColor} rounded-full p-3 flex-shrink-0`}>
              <span className="text-2xl">{icon}</span>
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-700 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex space-x-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 ${confirmBtnColor} text-white rounded-lg font-medium transition-colors shadow-md`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );

    if (!isInDialog) {
      onCancel();
    }
  };

  return (
    <dialog ref={dialogRef} className="confirm-dialog" onClick={handleBackdropClick}>
      <div className="dialog-content">
        <h3 className="dialog-title">{title}</h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-buttons">
          <button
            type="button"
            className="dialog-button dialog-button-cancel"
            onClick={onCancel}
          >
            Отмена
          </button>
          <button
            type="button"
            className="dialog-button dialog-button-confirm"
            onClick={onConfirm}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </dialog>
  );
};

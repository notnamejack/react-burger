import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const Modal = ({
  title,
  children,
  onClose,
}: TModalProps): React.JSX.Element | null => {
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keyup', handleKeyUp);

    return (): void => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return (): void => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const modalRoot = document.getElementById('modals');

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.head}>
          {title && <h2 className="text text_type_main-large">{title}</h2>}
          <button type="button" className={styles.close} onClick={onClose}>
            <CloseIcon type="primary" />
          </button>
        </div>
        {children}
      </div>
      <ModalOverlay onClose={onClose} />
    </div>,
    modalRoot
  );
};

import React, { useRef, useState } from 'react';

import Button from '@/components/atoms/Button/Button';
import Text from '@/components/atoms/Text/Text';

export type FullScreenModalType = {
  children: React.ReactElement | React.ReactNode;
  onClose: () => void;
  title: string;
  text?: React.ReactNode;
  primaryButtonText: string;
  secondaryButtonText: string;
  onSecondaryButtonClick: () => void;
  onPrimaryButtonClick: () => void;
  isPrimaryButtonDisabled?: boolean;
  primaryButtonType?: 'button' | 'submit';

  // ✅ Optional confirmation before primary action
  confirmBeforePrimaryAction?: boolean;
  confirmTitle?: string;
  confirmText?: string;
  cancelConfirmText?: string;
};

const FullScreenModal = ({
  primaryButtonType = 'button',
  isPrimaryButtonDisabled = false,
  children,
  onClose,
  title,
  text,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  confirmBeforePrimaryAction = false,
  confirmTitle = 'Are you sure?',
  confirmText = 'Confirm',
  cancelConfirmText = 'Cancel',
}: FullScreenModalType) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handlePrimaryClick = () => {
    if (confirmBeforePrimaryAction) {
      setShowConfirmation(true);
    } else {
      onPrimaryButtonClick();
    }
  };

  const handleConfirm = () => {
    onPrimaryButtonClick();
    setShowConfirmation(false);
  };

  return (
    <div
      onClick={handleClickOutside}
      className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
    >
      <div
        ref={modalContentRef}
        id="content"
        className="relative max-h-full min-w-[500px] max-w-[600px] overflow-y-auto rounded-lg bg-white p-4"
      >
        <Text size="XL" color="DARK" text={title} />
        {text && (
          <div className="my-2 max-w-full whitespace-normal break-words text-sm text-dark">
            {text}
          </div>
        )}
        <div className="my-6">{children}</div>
        <div className="flex justify-end">
          <Button
            type="SUCESS"
            onClick={handlePrimaryClick}
            title={primaryButtonText}
            isDisabled={isPrimaryButtonDisabled}
            buttonType={primaryButtonType}
          />
          <div className="px-2" />
          <Button type="LIGHT" onClick={onSecondaryButtonClick} title={secondaryButtonText} />
        </div>

        {showConfirmation && (
          <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-lg bg-black bg-opacity-20">
            <div className="w-[350px] rounded-lg bg-white p-6 shadow-md">
              <Text size="S" color="DARK" text={confirmTitle} />
              <div className="mt-6 flex justify-end">
                <Button
                  type="LIGHT"
                  title={cancelConfirmText}
                  onClick={() => setShowConfirmation(false)}
                />
                <div className="mx-2" />
                <Button type="SUCESS" title={confirmText} onClick={handleConfirm} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenModal;

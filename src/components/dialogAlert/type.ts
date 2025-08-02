interface DialogAlertProps {
  isOpen: boolean;
  onConfirmAction: () => void;
  onCancelAction: () => void;
  message?: string;
}

export type { DialogAlertProps };
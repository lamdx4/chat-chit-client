import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Action {
  label: string;
  onClick: () => void;
}

interface DialogOptions {
  title: string;
  description: string;
  actions: Action[];
}

let showDialog: (options: DialogOptions) => void;
let hideDialog: () => void;

const DialogGlobal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOptions, setDialogOptions] = useState<DialogOptions | null>(
    null
  );

  showDialog = (options: DialogOptions) => {
    setDialogOptions(options);
    setIsOpen(true);
  };

  hideDialog = () => {
    setIsOpen(false);
  };

  const dialog = dialogOptions && (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogOptions.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogOptions.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {dialogOptions.actions.map((action, index) => (
            <AlertDialogAction
              key={index}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
            >
              {action.label}
            </AlertDialogAction>
          ))}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return ReactDOM.createPortal(dialog, document.body);
};

export { DialogGlobal, showDialog, hideDialog };

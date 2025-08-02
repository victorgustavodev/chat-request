'use client';

import React from 'react';
import { DialogAlertProps } from './type';

export default function DialogAlert({
  isOpen,
  onConfirmAction,
  onCancelAction,
  message = 'Tem certeza que deseja sair?',
}: DialogAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <p className="mb-6 text-gray-800">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancelAction}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmAction}
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

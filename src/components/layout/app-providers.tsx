'use client';

import React from 'react';
import { DataProvider, useData } from '@/context/data-context';
import { NewCaseDialog } from '@/components/forms/new-case-dialog';
import { EditPatientDialog } from '@/components/forms/edit-patient-dialog';
import { LoginDialog } from '@/components/auth/login-dialog';

function ToastNotifier() {
  const { toastMessage } = useData();
  if (!toastMessage) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-2xl text-xs font-medium flex items-center gap-2 border border-slate-700 transition-all">
      {toastMessage}
    </div>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      {children}
      <NewCaseDialog />
      <EditPatientDialog />
      <LoginDialog />
      <ToastNotifier />
    </DataProvider>
  );
}

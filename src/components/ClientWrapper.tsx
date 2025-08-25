'use client';

import { useEffect, useState } from 'react';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 p-6 bg-white rounded-2xl shadow-sm">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="relative p-4 rounded-xl animate-pulse bg-gray-100 min-h-[400px]"
          />
        ))}
      </div>
    );
  }

  return <>{children}</>;
}

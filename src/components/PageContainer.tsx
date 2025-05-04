
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className={`max-w-3xl mx-auto ${className}`}>
        {children}
      </div>
    </div>
  );
};

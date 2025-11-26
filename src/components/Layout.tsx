import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-textPrimary flex justify-center">
            <div className="w-full max-w-md bg-surface min-h-screen shadow-2xl relative">
                {children}
            </div>
        </div>
    );
};

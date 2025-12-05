import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-textPrimary flex justify-center">
            <div className="w-full max-w-7xl mx-auto bg-surface min-h-screen shadow-2xl relative transition-all duration-300 flex flex-col">
                <div className="flex-grow">
                    {children}
                </div>
                <footer className="py-6 text-center text-sm text-textSecondary border-t border-border">
                    <p>
                        Family Site: <a href="https://mini-bell.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accentHover transition-colors font-medium">mini-bell.com</a>
                    </p>
                </footer>
            </div>
        </div>
    );
};

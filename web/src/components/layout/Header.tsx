import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
            <button
                onClick={onMenuClick}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
            >
                <Menu size={24} />
            </button>

            <div className="flex items-center gap-4 ml-auto">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <div className="h-8 w-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                        <User size={16} />
                    </div>
                </div>
            </div>
        </header>
    );
}

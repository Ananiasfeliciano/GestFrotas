import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, Settings, LogOut, X, Users, ClipboardCheck, Wrench, Fuel } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../ui/Button';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { logout } = useAuth();

    const links = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/vehicles', icon: Car, label: 'Veículos' },
        { to: '/partners', icon: Users, label: 'Parceiros' },
        { to: '/inspections', icon: ClipboardCheck, label: 'Inspeções' },
        { to: '/maintenances', icon: Wrench, label: 'Manutenções' },
        { to: '/refuelings', icon: Fuel, label: 'Abastecimentos' },
        { to: '/settings', icon: Settings, label: 'Configurações' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <span className="text-xl font-bold text-brand-600">GestFrota</span>
                    <button onClick={onClose} className="lg:hidden text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => onClose()} // Close on mobile click
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-brand-50 text-brand-700"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <link.icon size={20} />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>
            </aside>
        </>
    );
}

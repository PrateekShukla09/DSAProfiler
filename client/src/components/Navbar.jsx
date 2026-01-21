import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Trophy, Calendar, BookOpen } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 w-full z-50 glass-card border-b border-gray-700/50 h-16 px-4 md:px-10">
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        DSA Profiler
                    </span>
                </div>

                <div className="flex items-center space-x-6">
                    {user?.role === 'admin' ? (
                        <>
                            <Link to="/admin/dashboard" className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors">
                                <LayoutDashboard size={18} />
                                <span>Admin Panel</span>
                            </Link>
                            <Link to="/leaderboard" className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors">
                                <Trophy size={18} />
                                <span>Leaderboard</span>
                            </Link>
                            <Link to="/admin/sheets" className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors">
                                <BookOpen size={18} />
                                <span>Sheets Progress</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors">
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/leaderboard" className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors">
                                <Trophy size={18} />
                                <span>Leaderboard</span>
                            </Link>
                            <Link to="/contests" className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors">
                                <Calendar size={18} />
                                <span>Contests</span>
                            </Link>
                            <Link to="/sheets" className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors">
                                <BookOpen size={18} />
                                <span>Sheets</span>
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-sm text-right hidden md:block">
                        <p className="text-white font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.libraryId || user?.username}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-gray-700/50 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

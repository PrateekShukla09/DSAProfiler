import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Shield } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import { motion } from 'framer-motion';

const Login = () => {
    const [role, setRole] = useState('student');
    const [libraryId, setLibraryId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let res;
        if (role === 'student') {
            res = await login(libraryId, password);
        } else {
            res = await adminLogin(libraryId, password); // Reusing variable for username
        }

        if (res.success) {
            navigate(role === 'student' ? '/dashboard' : '/admin/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <SpotlightCard className="p-8 rounded-2xl neon-border relative overflow-visible">

                    {/* Decorative elements - Adjusted for spotlight card */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-neon-cyan blur-[4px] z-20"></div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2 neon-text-cyan">DSA Tracker</h1>
                        <p className="text-gray-400">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Role Select */}
                        <div className="relative">
                            <Shield className="absolute left-3 top-3 text-neon-purple w-5 h-5" />
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-[#0a0a2a]/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-neon-purple transition-colors appearance-none"
                            >
                                <option value="student">Student</option>
                                <option value="admin">Admin / Teacher</option>
                            </select>
                        </div>

                        {/* ID Input */}
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-neon-cyan w-5 h-5" />
                            <input
                                type="text"
                                placeholder={role === 'student' ? "Library ID" : "Username"}
                                value={libraryId}
                                onChange={(e) => setLibraryId(e.target.value)}
                                className="w-full bg-[#0a0a2a]/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-neon-cyan w-5 h-5" />
                            <input
                                type="password"
                                placeholder={password}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0a0a2a]/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>Don't have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">Register Now</Link></p>
                    </div>

                </SpotlightCard>
            </motion.div>
        </div>
    );
};

export default Login;

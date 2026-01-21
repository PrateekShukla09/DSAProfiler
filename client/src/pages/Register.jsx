import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, Hash, AtSign, BookOpen, Layers } from 'lucide-react';
import Background from '../components/Background';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        libraryId: '',
        password: '',
        year: '',
        section: '',
        leetcodeUsername: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/register', formData);
            // Save token and redirect
            localStorage.setItem('dsa_token', data.token);
            localStorage.setItem('dsa_user', JSON.stringify(data));
            // Force reload to update context or use a context method if available, generally simple reload works or navigating
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative p-4">
            <Background />

            <div className="glass-card w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,243,255,0.1)]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white neon-text-cyan">Student Registration</h1>
                    <p className="text-gray-400 mt-2">Join the DSA Leaderboard</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div className="relative group">
                        <User className="absolute left-3 top-3 text-cyan-500 w-5 h-5 group-focus-within:text-neon-cyan transition-colors" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#050511] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all"
                        />
                    </div>

                    {/* Library ID */}
                    <div className="relative group">
                        <Hash className="absolute left-3 top-3 text-cyan-500 w-5 h-5 group-focus-within:text-neon-cyan transition-colors" />
                        <input
                            type="text"
                            name="libraryId"
                            placeholder="Library ID (e.g. 2122CS101)"
                            value={formData.libraryId}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#050511] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Year */}
                        <div className="relative group">
                            <BookOpen className="absolute left-3 top-3 text-cyan-500 w-5 h-5 group-focus-within:text-neon-cyan transition-colors" />
                            <input
                                type="number"
                                name="year"
                                placeholder="Year (2/3/4)"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#050511] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all"
                            />
                        </div>
                        {/* Section */}
                        <div className="relative group">
                            <Layers className="absolute left-3 top-3 text-cyan-500 w-5 h-5 group-focus-within:text-neon-cyan transition-colors" />
                            <input
                                type="text"
                                name="section"
                                placeholder="Section (A/B/C)"
                                value={formData.section}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#050511] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all"
                            />
                        </div>
                    </div>

                    {/* LeetCode User */}
                    <div className="relative group">
                        <AtSign className="absolute left-3 top-3 text-cyan-500 w-5 h-5 group-focus-within:text-neon-cyan transition-colors" />
                        <input
                            type="text"
                            name="leetcodeUsername"
                            placeholder="LeetCode Username"
                            value={formData.leetcodeUsername}
                            onChange={handleChange}
                            className="w-full bg-[#050511] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 text-cyan-500 w-5 h-5 group-focus-within:text-neon-cyan transition-colors" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#050511] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold py-3 rounded-xl hover:from-cyan-500 hover:to-blue-600 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Profile...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

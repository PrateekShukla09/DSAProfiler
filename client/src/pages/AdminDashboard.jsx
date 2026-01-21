import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
// Imports
import { UserPlus, User, Lock, BookOpen, Hash, AtSign, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SpotlightCard from '../components/SpotlightCard';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterYear, setFilterYear] = useState('All');
    const [filterSection, setFilterSection] = useState('All');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        libraryId: '',
        password: '',
        section: '',
        year: '',
        leetcodeUsername: ''
    });
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('dsa_token');
            const { data } = await axios.get('http://localhost:5000/api/admin/students', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching students", error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });

        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            setMsg({ type: 'success', text: 'Student added successfully!' });
            setFormData({
                name: '',
                libraryId: '',
                password: '',
                section: '',
                year: '',
                leetcodeUsername: ''
            });
            fetchStudents();
        } catch (error) {
            setMsg({ type: 'error', text: error.response?.data?.message || 'Failed to add student' });
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        if (!window.confirm("Are you sure you want to delete this student?")) return;

        try {
            const token = localStorage.getItem('dsa_token');
            await axios.delete(`http://localhost:5000/api/admin/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchStudents();
        } catch (error) {
            alert("Failed to delete student");
        }
    };

    const filteredStudents = students.filter(student => {
        const matchYear = filterYear === 'All' || student.year.toString() === filterYear;
        const matchSection = filterSection === 'All' || student.section.toLowerCase() === filterSection.toLowerCase();
        return matchYear && matchSection;
    });

    const uniqueYears = ['2', '3', '4'];
    const uniqueSections = ['A', 'B', 'C', 'CS', 'IT', 'AI', 'ML']; // Could be dynamic but hardcoding standard ones is fine

    const handleRefresh = async () => {
        if (!window.confirm("Trigger manual refresh for ALL students? This might take a few minutes.")) return;
        setMsg({ type: '', text: 'Starting refresh in background...' });

        try {
            const token = localStorage.getItem('dsa_token');
            const { data } = await axios.post('http://localhost:5000/api/admin/refresh', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg({ type: 'success', text: data.message });
        } catch (error) {
            setMsg({ type: 'error', text: 'Failed to trigger refresh' });
        }
    };

    return (
        <div className="min-h-screen pt-20 px-4 md:px-10 pb-10">
            <Navbar />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Add Student Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-1"
                >
                    <SpotlightCard className="p-6 rounded-2xl sticky top-24">
                        <div className="flex items-center space-x-2 mb-6 text-neon-cyan">
                            <UserPlus size={24} />
                            <h2 className="text-xl font-bold">Add Student</h2>
                        </div>

                        {msg.text && (
                            <div className={`p-3 rounded mb-4 text-sm ${msg.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {msg.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-xs mb-1 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                                    <input
                                        type="text" name="name" value={formData.name} onChange={handleChange} required
                                        className="w-full bg-[#050511] border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:border-neon-cyan outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs mb-1 ml-1">Library ID</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                                    <input
                                        type="text" name="libraryId" value={formData.libraryId} onChange={handleChange} required
                                        className="w-full bg-[#050511] border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:border-neon-cyan outline-none transition-colors"
                                        placeholder="2223CS101"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-400 text-xs mb-1 ml-1">Year</label>
                                    <input
                                        type="number" name="year" value={formData.year} onChange={handleChange} required
                                        className="w-full bg-[#050511] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-neon-cyan outline-none transition-colors"
                                        placeholder="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs mb-1 ml-1">Section</label>
                                    <input
                                        type="text" name="section" value={formData.section} onChange={handleChange} required
                                        className="w-full bg-[#050511] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-neon-cyan outline-none transition-colors"
                                        placeholder="A"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs mb-1 ml-1">LeetCode Username</label>
                                <div className="relative">
                                    <AtSign className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                                    <input
                                        type="text" name="leetcodeUsername" value={formData.leetcodeUsername} onChange={handleChange}
                                        className="w-full bg-[#050511] border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:border-neon-cyan outline-none transition-colors"
                                        placeholder="leetcode_user"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs mb-1 ml-1">Initial Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                                    <input
                                        type="text" name="password" value={formData.password} onChange={handleChange} required
                                        className="w-full bg-[#050511] border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:border-neon-cyan outline-none transition-colors"
                                        placeholder="Secret123"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                                Add Student
                            </button>
                        </form>
                    </SpotlightCard>
                </motion.div>

                {/* Right Col: Student List */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <SpotlightCard className="rounded-2xl overflow-hidden min-h-[500px] flex flex-col">
                        <div className="p-6 border-b border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">Registered Students</h2>
                                <span className="text-sm text-gray-400">{filteredStudents.length} Students</span>
                            </div>

                            {/* Filters */}
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleRefresh}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all text-sm font-medium"
                                >
                                    <RefreshCw size={16} />
                                    <span>Refresh Data</span>
                                </button>

                                <select
                                    className="bg-[#050511] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-neon-cyan outline-none transition-all hover:border-cyan-400"
                                    value={filterYear}
                                    onChange={(e) => setFilterYear(e.target.value)}
                                >
                                    <option value="All">All Years</option>
                                    {uniqueYears.map(y => <option key={y} value={y}>Year {y}</option>)}
                                </select>

                                <select
                                    className="bg-[#050511] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-neon-cyan outline-none transition-all hover:border-cyan-400"
                                    value={filterSection}
                                    onChange={(e) => setFilterSection(e.target.value)}
                                >
                                    <option value="All">All Sections</option>
                                    {uniqueSections.map(s => <option key={s} value={s}>Section {s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-700/30 overflow-y-auto custom-scrollbar flex-1">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-400 animate-pulse">Loading students...</p>
                                </div>
                            ) : filteredStudents.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No students found matching filters.</div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {filteredStudents.map((student, index) => (
                                        <motion.div
                                            key={student._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2, delay: index < 15 ? index * 0.05 : 0 }}
                                            onClick={() => navigate(`/student/${student._id}`)}
                                            className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-cyan-400 border border-gray-700">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{student.name}</p>
                                                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                                                        <span>{student.libraryId}</span>
                                                        <span>•</span>
                                                        <span>{student.year}-{student.section}</span>
                                                        {student.leetcodeUsername && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-cyan-600">@{student.leetcodeUsername}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-sm font-bold text-white">{student.stats?.totalSolved || 0}</p>
                                                    <p className="text-xs text-gray-500">Solved</p>
                                                </div>

                                                <button
                                                    onClick={(e) => handleDelete(e, student._id)}
                                                    className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </SpotlightCard>
                </motion.div>

            </div>
        </div>
    );
};

export default AdminDashboard;

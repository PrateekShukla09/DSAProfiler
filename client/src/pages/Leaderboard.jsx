import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Trophy, Filter, Search } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// Simple in-memory cache to prevent re-fetching on tab switching
let leaderboardCache = {
    data: null,
    timestamp: 0,
    params: {}
};

const CACHE_DURATION = 60 * 1000; // 1 minute

const Leaderboard = () => {
    const [students, setStudents] = useState([]);
    const [filterYear, setFilterYear] = useState('');
    const [filterSection, setFilterSection] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, [filterYear, filterSection]);

    const fetchLeaderboard = async () => {
        const currentParams = JSON.stringify({ year: filterYear, section: filterSection });

        // Check cache foundation
        if (leaderboardCache.data &&
            Date.now() - leaderboardCache.timestamp < CACHE_DURATION &&
            JSON.stringify(leaderboardCache.params) === currentParams) {
            setStudents(leaderboardCache.data);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const params = {};
            if (filterYear) params.year = filterYear;
            if (filterSection) params.section = filterSection;

            const { data } = await axios.get('http://localhost:5000/api/student/leaderboard', { params });

            // Update cache
            leaderboardCache = {
                data: data,
                timestamp: Date.now(),
                params: { year: filterYear, section: filterSection }
            };

            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch leaderboard", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.libraryId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-20 px-4 md:px-10 pb-10">
            <Navbar />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-bold neon-text-cyan mb-2">Leaderboard</h1>
                    <p className="text-gray-400">Top performers in DSA</p>
                </motion.div>

                {/* Filters & Search */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-[#0a0a2a]/40 p-4 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                >

                    <div className="flex gap-4">
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="bg-[#050511] border border-gray-600 text-white rounded-lg px-4 py-2 focus:border-cyan-500 outline-none transition-all hover:border-cyan-400"
                        >
                            <option value="">All Years</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>

                        <select
                            value={filterSection}
                            onChange={(e) => setFilterSection(e.target.value)}
                            className="bg-[#050511] border border-gray-600 text-white rounded-lg px-4 py-2 focus:border-cyan-500 outline-none transition-all hover:border-cyan-400"
                        >
                            <option value="">All Sections</option>
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                            <option value="C">Section C</option>
                        </select>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#050511] border border-gray-600 text-white rounded-lg pl-10 pr-4 py-2 focus:border-cyan-500 outline-none transition-all hover:border-cyan-400"
                        />
                    </div>
                </motion.div>

                {/* List */}
                <div className="glass-card rounded-xl overflow-hidden min-h-[500px]">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700/50 bg-black/20 text-gray-400 font-medium text-sm sticky top-0 z-10 backdrop-blur-md">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-5">Name</div>
                        <div className="col-span-2 text-center">Total Solved</div>
                        <div className="col-span-2 text-center">Year</div>
                        <div className="col-span-2 text-center">Section</div>
                    </div>

                    <div className="divide-y divide-gray-700/30">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-400 animate-pulse">Loading leaderboard...</p>
                            </div>
                        ) : filteredStudents.length > 0 ? (
                            <AnimatePresence mode="popLayout">
                                {filteredStudents.map((student, index) => (
                                    <motion.div
                                        key={student._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2, delay: index < 20 ? index * 0.03 : 0 }}
                                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="col-span-1 text-center font-bold text-lg">
                                            {index + 1 === 1 && <Trophy className="text-yellow-400 w-5 h-5 mx-auto drop-shadow-lg" />}
                                            {index + 1 === 2 && <Trophy className="text-gray-300 w-5 h-5 mx-auto drop-shadow-lg" />}
                                            {index + 1 === 3 && <Trophy className="text-amber-600 w-5 h-5 mx-auto drop-shadow-lg" />}
                                            {index + 1 > 3 && <span className="text-gray-500">#{index + 1}</span>}
                                        </div>
                                        <div className="col-span-5">
                                            <div className="flex items-center space-x-3">
                                                <div className={clsx(
                                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-offset-2 ring-offset-[#0a0a2a]",
                                                    index === 0 ? "bg-yellow-400 text-black ring-yellow-400/30" :
                                                        index === 1 ? "bg-gray-300 text-black ring-gray-300/30" :
                                                            index === 2 ? "bg-amber-600 text-white ring-amber-600/30" :
                                                                "bg-gray-800 text-gray-300 ring-gray-700"
                                                )}>
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{student.name}</p>
                                                    <p className="text-xs text-gray-500">{student.libraryId}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-center font-mono font-bold text-cyan-400 text-lg">
                                            {student.stats?.totalSolved || 0}
                                        </div>
                                        <div className="col-span-2 text-center text-gray-400">
                                            {student.year ? `Year ${student.year}` : '-'}
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className="px-2 py-1 rounded bg-gray-800 text-xs text-gray-300 border border-gray-700 group-hover:border-cyan-500/50 transition-colors">
                                                {student.section || '-'}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-10 text-center text-gray-500"
                            >
                                No students found.
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;

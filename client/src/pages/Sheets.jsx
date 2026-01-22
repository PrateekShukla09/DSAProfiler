import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SheetView from '../components/SheetView';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import axios from 'axios';
import API_URL from '../config';

const Sheets = () => {
    const [sheets, setSheets] = useState([]);
    const [activeSheet, setActiveSheet] = useState(null);

    useEffect(() => {
        const fetchSheets = async () => {
            try {
                const token = localStorage.getItem('dsa_token');
                const { data } = await axios.get(`${API_URL}/api/sheets`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSheets(data);
                if (data.length > 0) setActiveSheet(data[0]);
            } catch (error) {
                console.error("Error fetching sheets list:", error);
            }
        };
        fetchSheets();
    }, []);

    return (
        <div className="min-h-screen pt-20 px-4 md:px-10 pb-10">
            <Navbar />

            <div className="max-w-5xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 mb-2">
                        DSA Practice Sheets
                    </h1>
                    <p className="text-gray-400">Master Data Structures & Algorithms with curated lists.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8 gap-4 overflow-x-auto pb-2">
                    {sheets.map(sheet => (
                        <button
                            key={sheet}
                            onClick={() => setActiveSheet(sheet)}
                            className={clsx(
                                "px-6 py-2 rounded-full border transition-all whitespace-nowrap",
                                activeSheet === sheet
                                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                    : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                            )}
                        >
                            {sheet}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <motion.div
                    key={activeSheet}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeSheet && <SheetView sheetName={activeSheet} />}
                </motion.div>
            </div>
        </div>
    );
};

export default Sheets;

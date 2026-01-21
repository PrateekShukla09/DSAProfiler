import Student from '../models/Student.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fetchAllStudentData } from '../services/leetcodeService.js';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

import { calculateStreaks } from '../utils/streakCalculator.js';

export const registerStudent = async (req, res) => {
    const { libraryId, password, name, section, year, leetcodeUsername } = req.body;

    try {
        const studentExists = await Student.findOne({ libraryId });
        if (studentExists) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Fetch initial stats if leetcode name provided
        let stats = {};
        let recentSubmissions = [];
        let streak = { currentStreak: 0, maxStreak: 0 };

        if (leetcodeUsername) {
            const data = await fetchAllStudentData(leetcodeUsername);

            // Validate: If no stats returned (or totalSolved is undefined), username likely invalid
            if (!data.stats || data.stats.totalSolved === undefined) {
                return res.status(400).json({ message: 'Invalid LeetCode Username. Please verify.' });
            }

            if (data.stats) {
                const submissionCalendar = data.stats.submissionCalendar || {};
                const streaks = calculateStreaks(submissionCalendar);

                stats = {
                    totalSolved: data.stats.totalSolved || 0,
                    easySolved: data.stats.easySolved || 0,
                    mediumSolved: data.stats.mediumSolved || 0,
                    hardSolved: data.stats.hardSolved || 0,
                    ranking: data.stats.ranking || 0,
                    submissionCalendar,
                    topics: data.topics ? data.topics.map(t => ({
                        tagName: t.tagName,
                        count: t.problemsSolved,
                        tagSlug: t.tagSlug
                    })) : []
                };
                streak = {
                    currentStreak: streaks.currentStreak,
                    maxStreak: streaks.maxStreak,
                    lastActiveDate: new Date()
                };
            }
            if (data.submissions) {
                recentSubmissions = data.submissions.map(sub => ({
                    title: sub.title,
                    timestamp: sub.timestamp,
                    status: sub.statusDisplay
                }));
            }
        } else {
            // If username is required for leaderboard, maybe make it mandatory here too?
            // User said: "dont add those student who does not have a valid leetcode id"
            // Implies mandatory.
            return res.status(400).json({ message: 'LeetCode Username is required.' });
        }

        const student = await Student.create({
            libraryId,
            passwordHash,
            name,
            section,
            year,
            leetcodeUsername,
            stats,
            streak,
            recentSubmissions
        });

        if (student) {
            res.status(201).json({
                _id: student._id,
                libraryId: student.libraryId,
                name: student.name,
                stats: student.stats,
                recentSubmissions: student.recentSubmissions,
                token: generateToken(student._id, 'student')
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginStudent = async (req, res) => {
    const { libraryId, password } = req.body;

    try {
        const student = await Student.findOne({ libraryId });

        if (student && (await bcrypt.compare(password, student.passwordHash))) {
            res.json({
                _id: student._id,
                libraryId: student.libraryId,
                name: student.name,
                leetcodeUsername: student.leetcodeUsername,
                stats: student.stats,
                recentSubmissions: student.recentSubmissions,
                token: generateToken(student._id, 'student')
            });
        } else {
            res.status(401).json({ message: 'Invalid Library ID or Password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    console.log('Admin login attempt:', { username, password });
    console.log('Env Secret:', process.env.ADMIN_SECRET);

    try {
        // For development, creates a hardcoded admin if not exists, OR checks DB
        // In real app, seed DB mostly.
        const admin = await Admin.findOne({ username });

        if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
            return res.json({
                _id: admin._id,
                username: admin.username,
                token: generateToken(admin._id, 'admin')
            });
        }

        // Quick fallback for demo purposes if no admin exists (NOT FOR PROD)
        // Check env secret
        if (password === process.env.ADMIN_SECRET) {
            return res.json({
                _id: "master-admin",
                username: "Master Admin",
                token: generateToken("master-admin", 'admin')
            });
        }

        res.status(401).json({ message: 'Invalid Admin Credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

import DsaSheet from '../models/DsaSheet.js';
import StudentSheetProgress from '../models/StudentSheetProgress.js';

// Get list of all available sheets (just names for tabs)
export const getSheetsList = async (req, res) => {
    try {
        const sheets = await DsaSheet.distinct('sheetName');
        res.json(sheets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get content of a specific sheet
export const getSheetContent = async (req, res) => {
    const { sheetName } = req.params;
    try {
        // Group by topic
        const sheetData = await DsaSheet.find({ sheetName });
        if (!sheetData.length) return res.status(404).json({ message: "Sheet not found" });

        // Transform to convenient structure if needed, or send as is
        // Current structure: Array of objects { sheetName, topic, problems: [] }
        res.json(sheetData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get progress for a student
export const getStudentProgress = async (req, res) => {
    const { sheetName } = req.params;
    const studentId = req.user.id; // From auth middleware

    try {
        const progress = await StudentSheetProgress.find({ studentId, sheetName });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update progress (toggle completion)
export const updateProgress = async (req, res) => {
    const { sheetName, topic, problemId } = req.body;
    const studentId = req.user.id;

    try {
        // Find existing progress doc or create one
        let progressDoc = await StudentSheetProgress.findOne({ studentId, sheetName, topic });

        if (!progressDoc) {
            progressDoc = new StudentSheetProgress({
                studentId,
                sheetName,
                topic,
                completedProblems: [problemId]
            });
        } else {
            const index = progressDoc.completedProblems.indexOf(problemId);
            if (index > -1) {
                // Remove if exists
                progressDoc.completedProblems.splice(index, 1);
            } else {
                // Add if not exists
                progressDoc.completedProblems.push(problemId);
            }
        }

        await progressDoc.save();
        res.json(progressDoc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get all students progress for a sheet
export const getAllStudentsProgress = async (req, res) => {
    const { sheetName } = req.params;
    try {
        // We need to aggregate total problems in sheet first to calculate percentage
        // But for list view, maybe just raw count?

        // This is a more complex query. For now, let's return all progress docs and let frontend/admin optimize
        const allProgress = await StudentSheetProgress.find({ sheetName }).populate('studentId', 'name section');
        res.json(allProgress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

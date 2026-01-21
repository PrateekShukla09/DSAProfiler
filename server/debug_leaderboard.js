import mongoose from 'mongoose';
import Student from './models/Student.js';

const MONGO_URI = "mongodb+srv://18prateekshukla_db_user:cpjDqRKyEgQNbVgi@cluster0.rapgzgu.mongodb.net/dsa-tracker?appName=Cluster0";

const debug = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB.");

        const students = await Student.find({});
        console.log(`Total Students: ${students.length}`);

        students.forEach(s => {
            console.log(`\nName: ${s.name}`);
            console.log(`Username: '${s.leetcodeUsername}'`);
            console.log(`Stats present: ${!!s.stats}`);
            if (s.stats) {
                console.log(`Total Solved: ${s.stats.totalSolved}`);
            }
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();

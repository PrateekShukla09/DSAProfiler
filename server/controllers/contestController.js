import axios from 'axios';

// Cache for contests to avoid hitting API too often
let contestsCache = {
    data: [],
    lastUpdated: 0
};

export const getUpcomingContests = async (req, res) => {
    const NOW = Date.now();
    const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

    if (contestsCache.data.length > 0 && (NOW - contestsCache.lastUpdated < CACHE_DURATION)) {
        return res.json(contestsCache.data);
    }

    try {
        // Fetch Codeforces
        const cfResponse = await axios.get('https://codeforces.com/api/contest.list');
        const cfContests = cfResponse.data.result
            .filter(c => c.phase === 'BEFORE')
            .map(c => ({
                name: c.name,
                platform: 'Codeforces',
                startTime: c.startTimeSeconds * 1000,
                durationSeconds: c.durationSeconds,
                link: `https://codeforces.com/contest/${c.id}`
            }));

        // Fetch CodeChef (Parsing logic is complex without official API key sometimes, 
        // using the link provided in prompt: https://www.codechef.com/api/list/contests/all)
        const ccResponse = await axios.get('https://www.codechef.com/api/list/contests/all');
        // Structure of CodeChef API can vary, assuming standard response
        const ccContests = ccResponse.data.future_contests.map(c => ({
            name: c.contest_name,
            platform: 'CodeChef',
            startTime: new Date(c.contest_start_date).getTime(), // might need parsing
            durationSeconds: c.contest_duration * 60,
            link: `https://www.codechef.com/${c.contest_code}`
        }));

        const allContests = [...cfContests, ...ccContests].sort((a, b) => a.startTime - b.startTime);

        contestsCache = {
            data: allContests,
            lastUpdated: NOW
        };

        res.json(allContests);
    } catch (error) {
        console.error("Error fetching contests:", error.message);
        // Return mostly empty or cached if partial failure
        res.json(contestsCache.data.length ? contestsCache.data : []);
    }
};

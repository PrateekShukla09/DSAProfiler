
import axios from 'axios';

const username = "PrateekShukla09"; // Using the corpus name as a likely valid username, or generic
// Actually, let's use a known valid username or the one from the seed if possible.
// "18prateekshukla" is in the mongo uri, maybe the leetcode username is similar?
// I will try "prateekshukla" or just "tourist" (if he exists on leetcode) or similar.
// Better: check the database seeded data?
// I'll just use a hardcoded one for testing, e.g. "neal_wu" or similar valid leetcoder if known, or just "test".
// Let's try "yash" or something simple.
// Actually, I can use the `leetcodeService.js` logic.

async function testPublicApi() {
    try {
        const response = await axios.get('https://leetcode-stats-api.herokuapp.com/PrateekShukla09');
        // Check if response.data contains topic breakdown with difficulty
        console.log(JSON.stringify(response.data, null, 2));
    } catch (e) {
        console.error(e.message);
    }
}

testPublicApi();

async function testQuery() {
    const query = `
    query userSessionProgress($username: String!) {
        allMatchedUserQuestions(username: $username) {
            question {
                questionId
                title
                titleSlug
                difficulty
                topicTags {
                    name
                }
            }
        }
    }
    `;
    // Note: allMatchedUserQuestions might not be the right one or might be heavy. 
    // Usually 'ACQuestions' is better but let's try finding a query that lists solved q's with tags.
    // 'recentSubmissionList' gives recently solved, but we need ALL.

    // Alternative: 
    /*
    query userQuestionProgress($userSlug: String!) {
        userProfileUserQuestionProgress(userSlug: $userSlug) {
             numAcceptedQuestions {
                 difficulty
                 count
             }
             numFailedQuestions {
                 difficulty
                 count
             }
             numUntouchedQuestions {
                 difficulty
                 count
             }
        }
    }
    */

    // Actually, standard practice for "Detailed Topic stats" is unavailable directly. 
    // We have to iterate over all solved problems.
    // Let's try 'GetProfileSubmissions' or 'RecentAcSubmissions' with a high limit? No, limit is usually small.

    // Let's try to query 'matchedUser' -> 'submissions' ? No.

    // The trick is usually:
    /*
    query {
      matchedUser(username: "username") {
        submissionCalendar
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
    */

    // Let's try to use the query that gets *all* solved questions if possible.
    // Or maybe we just stick to the total count if granular is impossible, 
    // BUT proper "Topic Strength" needs the diff breakdown.
    // Let's try requesting "skillStats" again and see if there are other fields in `tagProblemCounts`.

    const query2 = `
     query skillStats($username: String!) {
       matchedUser(username: $username) {
         tagProblemCounts {
           advanced { tagName tagSlug problemsSolved }
           intermediate { tagName tagSlug problemsSolved }
           fundamental { tagName tagSlug problemsSolved }
         }
       }
     }
   `;

    // Since I cannot easily get the breakdown *per topic* from the API without fetching ALL questions (which might be 1000+), 
    // and `allQuestions` query might be blocked or huge.
    // 
    // Let's try to find a query for "questions with specific tag" and see if we can filter by user status? No.

    // Let's try this one which simply gets the last 20 recent submissions to at least show the concept, 
    // OR assume "Average Logic" based on global stats? No, user wants specific accuracy.

    // WAIT! `acSubmissionNum` gives global Easy/Med/Hard. 
    // `tagProblemCounts` gives total per topic.
    // We CANNOT get "Easy DP problems solved" directly easily.

    // HYBRID APPROACH: 
    // 1. Fetch `tagProblemCounts` (as we did).
    // 2. Fetch `recentAcSubmissionList` (size 20 or 50).
    // 3. For the "Volume" score, we have the total.
    // 4. For "Difficulty", we might have to approximate or just use the global difficulty ratio if topic specific is unavailable?
    // 
    // OR, I can try to fetch `allSolved` via a different endpoint if available.

    // Let's actually try to use the python script approach often used: 
    // Querying `https://leetcode.com/api/problems/all/` with cookies? We don't have cookies.

    // Let's try one more GraphQL query that sometimes works for retrieving solved list:

    const query3 = `
    query userProfileQuestions($username: String!) {
        matchedUser(username: $username) {
            submissions(limit: 1000) {
                 title
                 titleSlug
                 statusDisplay
                 lang
            }
        }
    }
   `;
    // 'submissions' isn't usually on matchedUser.

    // Let's revert to a simpler query to check validity first.

    const validQuery = `
     query getUserProfile($username: String!) {
       allQuestionsCount {
         difficulty
         count
       }
       matchedUser(username: $username) {
         username
         submitStats {
           acSubmissionNum {
             difficulty
             count
             submissions
           }
         }
       }
     }
   `;

    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query,
            variables: { username: "prateekshukla" }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (e) {
        console.error(e.message);
    }
}

testQuery();

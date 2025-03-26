const path = require('path');
const fs = require('fs').promises;

exports.handler = async (event, context) => {
    try {
        const questionsPath = path.resolve(__dirname, 'questions.json');
        const questionsData = await fs.readFile(questionsPath, 'utf8');
        const questions = JSON.parse(questionsData);

        const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
        const questionIndex = today % questions.length;
        const selectedQuestion = questions[questionIndex];

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(selectedQuestion),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Failed to load question', details: error.message }),
        };
    }
};

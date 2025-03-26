const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // Read questions from JSON file
        const questionsPath = path.join(__dirname, '../../data/questions.json');
        const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

        // Calculate the current day's question based on creation date
        const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
        const questionIndex = today % questions.length;
        const selectedQuestion = questions[questionIndex];

        return {
            statusCode: 200,
            body: JSON.stringify(selectedQuestion)
        };
    } catch (error) {
        console.error('Error loading question:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to load question' })
        };
    }
};

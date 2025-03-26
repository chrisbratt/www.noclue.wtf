const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // Use absolute path to ensure correct file location
        const questionsPath = path.resolve(__dirname, '../../data/questions.json');
        
        // Log the exact path being used
        console.log('Questions file path:', questionsPath);

        // Read questions file
        const questionsData = await fs.readFile(questionsPath, 'utf8');
        const questions = JSON.parse(questionsData);

        // Log the questions to verify content
        console.log('Loaded questions:', JSON.stringify(questions, null, 2));

        // Calculate the current day's question based on creation date
        const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
        const questionIndex = today % questions.length;
        const selectedQuestion = questions[questionIndex];

        // Log the selected question
        console.log('Selected question:', JSON.stringify(selectedQuestion, null, 2));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(selectedQuestion)
        };
    } catch (error) {
        console.error('Error in get-question function:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: 'Failed to load question', 
                details: error.message,
                stack: error.stack 
            })
        };
    }
};
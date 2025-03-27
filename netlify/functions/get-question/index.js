const questions = require("./questions.json");

exports.handler = async () => {
  try {
    // Fixed starting date for index 0
    const startDate = new Date("2025-03-26");
    const today = new Date();

    // Strip time from today so timezone doesn't affect calculation
    today.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const index = ((diffInDays % questions.length) + questions.length) % questions.length; // wrap safely

    const todayQuestion = questions[index];

    return {
      statusCode: 200,
      body: JSON.stringify(todayQuestion),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to load question",
        details: error.message,
      }),
    };
  }
};

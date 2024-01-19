const { Configuration, OpenAI } = require("openai");

const analyzeContract = async (contractText, API_KEY) => {
  try {
    console.log(API_KEY);
    const openai = new OpenAI({
      apiKey: API_KEY ,
    });
    const prompt = `Give the explanation in points and add a @ before every point Analyze the following contract and summarize its main points, highlight anything that could potentially help the user and anything that could be dangerous to the user, also provide suggestions to improve the contract :\n\n${contractText}\n `;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error in analyzing contract:", error);
    throw error;
  }
};
module.exports = analyzeContract;

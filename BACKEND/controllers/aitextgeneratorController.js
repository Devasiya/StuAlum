const { generateWithGemini } = require('../utils/gemini');
const { generateMockText } = require('../utils/mockResponses');

const hasGeminiKey = !!process.env.GEMINI_API_KEY;

exports.generateText = async (req, res, next) => {
    try {
        const { topic, tone, length } = req.body;

        if (!topic || !tone || !length) {
            return res.status(400).json({ error: 'Please fill all fields.' });
        }

        if (!hasGeminiKey) {
            const mock = await generateMockText(topic, tone, length);
            return res.json({ result: mock, warning: 'Something went wrong please try after some time!' });
        }

        const prompt = `Write a ${tone} blog post about "${topic}". Length: ${length} words...`;

        const content = await generateWithGemini(prompt);
        res.json({ result: content });
    } catch (error) {
        next(error);
    }
};

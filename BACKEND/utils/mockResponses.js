exports.generateMockText = async (topic, tone, length) => {
    return `# Mock ${tone} Blog on ${topic}\nThis is a sample blog post of length ${length} words.`;
};

exports.generateMockGrammar = async (text) => {
    return `Corrected text: ${text}`;
};

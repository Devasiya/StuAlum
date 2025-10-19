// Mock NLP Service - In production, this would be a real NLP microservice or library
const NLP_SERVICE = {
    // Generate TF-IDF vector for text using corpus
    generateTfIdfVector: async (text, corpus) => {
        // Mock implementation - returns a vector of length 100 with random values
        // In production, this would use actual TF-IDF calculation
        const vector = [];
        for (let i = 0; i < 100; i++) {
            vector.push(Math.random());
        }
        return vector;
    },

    // Calculate cosine similarity between two vectors
    cosineSimilarity: async (v1, v2) => {
        if (!v1 || !v2 || v1.length !== v2.length) {
            return 0.0;
        }

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i = 0; i < v1.length; i++) {
            dotProduct += v1[i] * v2[i];
            norm1 += v1[i] * v1[i];
            norm2 += v2[i] * v2[i];
        }

        if (norm1 === 0 || norm2 === 0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
};

module.exports = NLP_SERVICE;

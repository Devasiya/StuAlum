// Utility functions for mentorship matching
const UTILS = {
    // Calculate Jaccard similarity between two sets
    jaccardSimilarity: (setA, setB) => {
        if (!setA || !setB) return 0.0;

        const intersection = new Set([...setA].filter(x => setB.has(x)));
        const union = new Set([...setA, ...setB]);

        if (union.size === 0) return 0.0;

        return intersection.size / union.size;
    },

    // Calculate role compatibility score
    calculateRoleSimilarity: (sRole, aRole) => {
        if (!sRole || !aRole) return 0.0;

        const studentRole = sRole.toLowerCase().trim();
        const alumniRole = aRole.toLowerCase().trim();

        // Exact match
        if (studentRole === alumniRole) return 1.0;

        // Partial matches
        if (studentRole.includes(alumniRole) || alumniRole.includes(studentRole)) return 0.8;

        // Common role mappings
        const roleMappings = {
            'software engineer': ['developer', 'programmer', 'engineer', 'coder'],
            'data scientist': ['data analyst', 'machine learning engineer', 'ai engineer'],
            'product manager': ['product owner', 'program manager'],
            'engineering manager': ['tech lead', 'engineering director', 'vp engineering'],
            'senior engineer': ['principal engineer', 'staff engineer', 'lead engineer']
        };

        // Check if roles are related
        for (const [key, related] of Object.entries(roleMappings)) {
            if ((studentRole.includes(key) && related.some(r => alumniRole.includes(r))) ||
                (alumniRole.includes(key) && related.some(r => studentRole.includes(r)))) {
                return 0.6;
            }
        }

        // No match
        return 0.0;
    },

    // Calculate location proximity score
    calculateLocationScore: (sLoc, aLoc) => {
        if (!sLoc || !aLoc) return 0.0;

        const studentLoc = sLoc.toLowerCase().trim();
        const alumniLoc = aLoc.toLowerCase().trim();

        // Exact match
        if (studentLoc === alumniLoc) return 1.0;

        // Same city/state/country
        if (studentLoc.includes(alumniLoc) || alumniLoc.includes(studentLoc)) return 0.8;

        // Remote work consideration
        if (studentLoc === 'remote' || alumniLoc === 'remote') return 0.7;

        // Different but same region (simplified)
        const regions = {
            'us': ['california', 'new york', 'texas', 'florida', 'washington'],
            'europe': ['london', 'berlin', 'paris', 'amsterdam'],
            'asia': ['singapore', 'tokyo', 'bangalore', 'mumbai']
        };

        for (const [region, cities] of Object.entries(regions)) {
            if (cities.some(city => studentLoc.includes(city)) &&
                cities.some(city => alumniLoc.includes(city))) {
                return 0.5;
            }
        }

        return 0.0;
    },

    // Calculate availability overlap score
    calculateAvailabilityScore: (sAvail, aAvail) => {
        if (!sAvail || !aAvail) return 0.0;

        const studentAvail = sAvail.toLowerCase().trim();
        const alumniAvail = aAvail.toLowerCase().trim();

        // Exact match
        if (studentAvail === alumniAvail) return 1.0;

        // Weekly vs monthly - some overlap
        if ((studentAvail === 'weekly' && alumniAvail === 'monthly') ||
            (studentAvail === 'monthly' && alumniAvail === 'weekly')) return 0.7;

        // Quarterly is less frequent
        if (studentAvail === 'quarterly' || alumniAvail === 'quarterly') return 0.3;

        return 0.0;
    }
};

module.exports = UTILS;

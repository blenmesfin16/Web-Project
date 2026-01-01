// Mock API for GeniusGuide Quiz App

const API = {
    // Base URL for API calls
    baseURL: 'https://api.geniusguide.com/v1',
    
    // Mock delay for API calls
    delay(ms = 800) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Get all quizzes
    async getQuizzes(filters = {}) {
        await this.delay();
        
        const mockQuizzes = [
            {
                id: 1,
                title: "Data Structures Fundamentals",
                subtitle: "Data Structures & Algorithms",
                category: "Computer Science",
                description: "Test your knowledge on arrays, linked lists, stacks, queues, trees, and graphs.",
                questions: 20,
                time: 30,
                difficulty: "medium",
                completed: true,
                bestScore: 92,
                attempts: 3,
                lastAttempt: "2024-12-15",
                tags: ["algorithms", "data-structures", "computer-science"]
            },
            {
                id: 2,
                title: "Python Basics Assessment",
                subtitle: "Python Programming",
                category: "Programming",
                description: "Basic Python syntax, data types, control structures, and functions.",
                questions: 15,
                time: 20,
                difficulty: "easy",
                completed: true,
                bestScore: 88,
                attempts: 2,
                lastAttempt: "2024-12-10",
                tags: ["python", "programming", "beginners"]
            },
            {
                id: 3,
                title: "Web Development Quiz",
                subtitle: "Web Development Fundamentals",
                category: "Web Development",
                description: "HTML, CSS, JavaScript, and modern web development concepts.",
                questions: 25,
                time: 40,
                difficulty: "medium",
                completed: true,
                bestScore: 95,
                attempts: 4,
                lastAttempt: "2024-12-18",
                tags: ["web", "html", "css", "javascript"]
            },
            {
                id: 4,
                title: "Database Systems",
                subtitle: "SQL & NoSQL Fundamentals",
                category: "Database",
                description: "Relational databases, SQL queries, and NoSQL database concepts.",
                questions: 18,
                time: 25,
                difficulty: "medium",
                completed: false,
                bestScore: null,
                attempts: 0,
                lastAttempt: null,
                tags: ["database", "sql", "nosql"]
            },
            {
                id: 5,
                title: "Machine Learning",
                subtitle: "Algorithms & Models",
                category: "AI/ML",
                description: "Supervised and unsupervised learning algorithms, neural networks basics.",
                questions: 30,
                time: 45,
                difficulty: "hard",
                completed: false,
                bestScore: null,
                attempts: 0,
                lastAttempt: null,
                tags: ["machine-learning", "ai", "algorithms"]
            },
            {
                id: 6,
                title: "Network Security",
                subtitle: "Security Protocols",
                category: "Cybersecurity",
                description: "Network security protocols, encryption, and security best practices.",
                questions: 22,
                time: 35,
                difficulty: "medium",
                completed: false,
                bestScore: null,
                attempts: 0,
                lastAttempt: null,
                tags: ["security", "networking", "cybersecurity"]
            },
            {
                id: 7,
                title: "Operating Systems",
                subtitle: "System Fundamentals",
                category: "Computer Science",
                description: "Process management, memory management, and file systems.",
                questions: 24,
                time: 35,
                difficulty: "hard",
                completed: true,
                bestScore: 85,
                attempts: 2,
                lastAttempt: "2024-12-05",
                tags: ["os", "systems", "computer-science"]
            },
            {
                id: 8,
                title: "Software Engineering",
                subtitle: "Development Practices",
                category: "Software Engineering",
                description: "Software development lifecycle, design patterns, and testing.",
                questions: 20,
                time: 30,
                difficulty: "medium",
                completed: true,
                bestScore: 90,
                attempts: 1,
                lastAttempt: "2024-11-28",
                tags: ["software", "engineering", "development"]
            }
        ];
        
        // Apply filters
        let filtered = [...mockQuizzes];
        
        if (filters.category) {
            filtered = filtered.filter(q => q.category === filters.category);
        }
        
        if (filters.difficulty) {
            filtered = filtered.filter(q => q.difficulty === filters.difficulty);
        }
        
        if (filters.completed !== undefined) {
            filtered = filtered.filter(q => q.completed === filters.completed);
        }
        
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(q => 
                q.title.toLowerCase().includes(searchLower) ||
                q.subtitle.toLowerCase().includes(searchLower) ||
                q.description.toLowerCase().includes(searchLower) ||
                q.tags.some(tag => tag.includes(searchLower))
            );
        }
        
        return {
            success: true,
            data: filtered,
            count: filtered.length
        };
    },
    
    // Get quiz by ID
    async getQuizById(id) {
        await this.delay(500);
        
        const response = await this.getQuizzes();
        const quiz = response.data.find(q => q.id === parseInt(id));
        
        if (!quiz) {
            return {
                success: false,
                error: "Quiz not found"
            };
        }
        
        return {
            success: true,
            data: quiz
        };
    },
    
    // Get quiz questions
    async getQuizQuestions(quizId) {
        await this.delay(800);
        
        // Mock questions
        const questions = [
            {
                id: 1,
                question: "What is the time complexity of accessing an element in an array?",
                type: "multiple-choice",
                options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
                correctAnswer: 0,
                explanation: "Arrays provide O(1) access time as elements are stored contiguously in memory.",
                points: 10
            },
            {
                id: 2,
                question: "Which data structure uses LIFO (Last In, First Out) principle?",
                type: "multiple-choice",
                options: ["Queue", "Stack", "Tree", "Linked List"],
                correctAnswer: 1,
                explanation: "Stack uses LIFO principle where the last element added is the first one to be removed.",
                points: 10
            },
            {
                id: 3,
                question: "What is the main advantage of a linked list over an array?",
                type: "multiple-choice",
                options: [
                    "Faster access time",
                    "Dynamic size",
                    "Better cache locality",
                    "Less memory usage"
                ],
                correctAnswer: 1,
                explanation: "Linked lists can grow and shrink dynamically without reallocation of the entire structure.",
                points: 10
            }
        ];
        
        return {
            success: true,
            data: questions,
            totalPoints: 30
        };
    },
    
    // Submit quiz attempt
    async submitQuiz(quizId, answers) {
        await this.delay(1200);
        
        // Calculate score
        const questionsResponse = await this.getQuizQuestions(quizId);
        const questions = questionsResponse.data;
        
        let score = 0;
        let totalPoints = 0;
        const results = [];
        
        questions.forEach(question => {
            totalPoints += question.points;
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            
            if (isCorrect) {
                score += question.points;
            }
            
            results.push({
                questionId: question.id,
                userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                points: isCorrect ? question.points : 0
            });
        });
        
        const percentage = Math.round((score / totalPoints) * 100);
        
        return {
            success: true,
            data: {
                quizId,
                score,
                totalPoints,
                percentage,
                results,
                submittedAt: new Date().toISOString()
            }
        };
    },
    
    // Get user stats
    async getUserStats() {
        await this.delay(600);
        
        return {
            success: true,
            data: {
                totalQuizzes: 15,
                completedQuizzes: 8,
                averageScore: 85,
                streakDays: 7,
                totalTime: 1250, // minutes
                rank: "Gold",
                level: 3,
                xp: 1250,
                nextLevelXp: 2000
            }
        };
    },
    
    // Get upcoming quizzes
    async getUpcomingQuizzes() {
        await this.delay(400);
        
        return {
            success: true,
            data: [
                {
                    id: 9,
                    title: "Cloud Computing",
                    subtitle: "AWS & Azure Fundamentals",
                    date: "2024-12-25",
                    difficulty: "medium"
                },
                {
                    id: 10,
                    title: "DevOps Practices",
                    subtitle: "CI/CD & Containerization",
                    date: "2024-12-28",
                    difficulty: "hard"
                },
                {
                    id: 11,
                    title: "Mobile Development",
                    subtitle: "React Native & Flutter",
                    date: "2025-01-05",
                    difficulty: "medium"
                }
            ]
        };
    }
};

// Export for Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
} else {
    window.API = API;
}
// Utility functions for GeniusGuide Quiz App

// Format date to readable string
function formatDate(date = new Date()) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Generate random ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce function for search/input events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Calculate percentage
function calculatePercentage(part, total) {
    return total > 0 ? Math.round((part / total) * 100) : 0;
}

// Difficulty color mapping
function getDifficultyColor(difficulty) {
    const colors = {
        'easy': '#10b981',
        'medium': '#f59e0b',
        'hard': '#ef4444'
    };
    return colors[difficulty] || '#64748b';
}

// Format time in minutes to readable string
function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}

// Storage utilities
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(`geniusguide_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },
    
    get(key) {
        try {
            const item = localStorage.getItem(`geniusguide_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },
    
    remove(key) {
        localStorage.removeItem(`geniusguide_${key}`);
    },
    
    clear() {
        localStorage.clear();
    }
};

// User session management
const Session = {
    getUser() {
        return Storage.get('user') || { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=38bdf8&color=fff' };
    },
    
    updateUser(data) {
        const user = this.getUser();
        Storage.set('user', { ...user, ...data });
    },
    
    getStats() {
        return Storage.get('stats') || {
            totalQuizzes: 0,
            averageScore: 0,
            streakDays: 0,
            totalTime: 0
        };
    },
    
    updateStats(newStats) {
        const stats = this.getStats();
        Storage.set('stats', { ...stats, ...newStats });
    }
};

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        generateId,
        debounce,
        calculatePercentage,
        getDifficultyColor,
        formatTime,
        Storage,
        Session
    };
}
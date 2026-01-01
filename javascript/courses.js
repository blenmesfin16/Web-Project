// ================ COURSES DATA & FUNCTIONALITY ================

// Quiz topics data (same as your quiz system)
const courseData = [
    {
        id: 1,
        title: "HTML Fundamentals",
        description: "Learn the building blocks of web development with HTML. Create structured web pages using semantic elements, forms, and multimedia.",
        category: "programming",
        level: "beginner",
        duration: "4 hours",
        lessons: 12,
        students: 1250,
        rating: 4.8,
        progress: 75,
        icon: "fab fa-html5",
        iconColor: "#E34F26",
        bgColor: "rgba(227, 79, 38, 0.1)"
    },
    {
        id: 2,
        title: "CSS Styling Mastery",
        description: "Master CSS to create beautiful and responsive web designs. Learn flexbox, grid, animations, and modern CSS techniques.",
        category: "programming",
        level: "beginner",
        duration: "6 hours",
        lessons: 18,
        students: 980,
        rating: 4.7,
        progress: 40,
        icon: "fab fa-css3-alt",
        iconColor: "#1572B6",
        bgColor: "rgba(21, 114, 182, 0.1)"
    },
    {
        id: 3,
        title: "JavaScript Essentials",
        description: "Learn JavaScript from basics to advanced concepts. Master DOM manipulation, events, async programming, and modern ES6+ features.",
        category: "programming",
        level: "intermediate",
        duration: "8 hours",
        lessons: 24,
        students: 2100,
        rating: 4.9,
        progress: 20,
        icon: "fab fa-js",
        iconColor: "#F7DF1E",
        bgColor: "rgba(247, 223, 30, 0.1)"
    },
    {
        id: 4,
        title: "Python Programming",
        description: "Start your journey with Python. Learn syntax, data structures, OOP, and build real-world applications with this versatile language.",
        category: "programming",
        level: "beginner",
        duration: "10 hours",
        lessons: 30,
        students: 3500,
        rating: 4.9,
        progress: 0,
        icon: "fab fa-python",
        iconColor: "#3776AB",
        bgColor: "rgba(55, 118, 171, 0.1)"
    },
    {
        id: 5,
        title: "Data Science Basics",
        description: "Introduction to data science concepts, statistics, and data visualization. Learn to analyze and interpret data effectively.",
        category: "science",
        level: "intermediate",
        duration: "12 hours",
        lessons: 28,
        students: 890,
        rating: 4.6,
        progress: 0,
        icon: "fas fa-chart-bar",
        iconColor: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.1)"
    },
    {
        id: 6,
        title: "Machine Learning Intro",
        description: "Learn the fundamentals of machine learning, algorithms, and neural networks. Build your first ML model with Python.",
        category: "science",
        level: "advanced",
        duration: "15 hours",
        lessons: 35,
        students: 670,
        rating: 4.8,
        progress: 0,
        icon: "fas fa-brain",
        iconColor: "#8B5CF6",
        bgColor: "rgba(139, 92, 246, 0.1)"
    },
    {
        id: 7,
        title: "Calculus for Beginners",
        description: "Master the fundamentals of calculus including limits, derivatives, integrals, and their applications in real-world problems.",
        category: "mathematics",
        level: "intermediate",
        duration: "14 hours",
        lessons: 32,
        students: 1200,
        rating: 4.7,
        progress: 90,
        icon: "fas fa-square-root-alt",
        iconColor: "#3B82F6",
        bgColor: "rgba(59, 130, 246, 0.1)"
    },
    {
        id: 8,
        title: "Linear Algebra",
        description: "Learn vectors, matrices, linear transformations, and eigenvalues. Essential for computer graphics and machine learning.",
        category: "mathematics",
        level: "advanced",
        duration: "16 hours",
        lessons: 36,
        students: 750,
        rating: 4.8,
        progress: 0,
        icon: "fas fa-project-diagram",
        iconColor: "#F59E0B",
        bgColor: "rgba(245, 158, 11, 0.1)"
    },
    {
        id: 9,
        title: "English Grammar Pro",
        description: "Master English grammar, punctuation, and writing skills. Improve your communication for academic and professional success.",
        category: "language",
        level: "beginner",
        duration: "8 hours",
        lessons: 22,
        students: 2800,
        rating: 4.8,
        progress: 60,
        icon: "fas fa-language",
        iconColor: "#EF4444",
        bgColor: "rgba(239, 68, 68, 0.1)"
    },
    {
        id: 10,
        title: "Spanish for Beginners",
        description: "Start speaking Spanish from day one. Learn vocabulary, grammar, and conversation skills for everyday situations.",
        category: "language",
        level: "beginner",
        duration: "12 hours",
        lessons: 30,
        students: 1500,
        rating: 4.9,
        progress: 0,
        icon: "fas fa-globe-americas",
        iconColor: "#10B981",
        bgColor: "rgba(16, 185, 129, 0.1)"
    },
    {
        id: 11,
        title: "Business Fundamentals",
        description: "Learn essential business concepts including marketing, finance, operations, and strategy for entrepreneurial success.",
        category: "business",
        level: "beginner",
        duration: "10 hours",
        lessons: 26,
        students: 1900,
        rating: 4.7,
        progress: 0,
        icon: "fas fa-briefcase",
        iconColor: "#6366F1",
        bgColor: "rgba(99, 102, 241, 0.1)"
    },
    {
        id: 12,
        title: "Digital Marketing",
        description: "Master digital marketing strategies including SEO, social media, content marketing, and email campaigns.",
        category: "business",
        level: "intermediate",
        duration: "14 hours",
        lessons: 32,
        students: 1100,
        rating: 4.8,
        progress: 0,
        icon: "fas fa-bullhorn",
        iconColor: "#EC4899",
        bgColor: "rgba(236, 72, 153, 0.1)"
    }
];

// Continue learning courses (in-progress)
const continueCourses = [
    {
        id: 1,
        title: "HTML Fundamentals",
        progress: 75,
        lastAccessed: "2 hours ago",
        nextLesson: "HTML Forms",
        icon: "fab fa-html5",
        iconColor: "#E34F26",
        bgColor: "rgba(227, 79, 38, 0.1)"
    },
    {
        id: 7,
        title: "Calculus for Beginners",
        progress: 90,
        lastAccessed: "1 day ago",
        nextLesson: "Applications of Derivatives",
        icon: "fas fa-square-root-alt",
        iconColor: "#3B82F6",
        bgColor: "rgba(59, 130, 246, 0.1)"
    },
    {
        id: 9,
        title: "English Grammar Pro",
        progress: 60,
        lastAccessed: "3 days ago",
        nextLesson: "Advanced Punctuation",
        icon: "fas fa-language",
        iconColor: "#EF4444",
        bgColor: "rgba(239, 68, 68, 0.1)"
    }
];

// DOM Elements
const coursesContainer = document.getElementById('coursesContainer');
const continueContainer = document.getElementById('continueContainer');
const filterOptions = document.querySelectorAll('.filter-option');
const viewButtons = document.querySelectorAll('.view-btn');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// State variables
let currentCategory = 'all';
let currentView = 'grid';
let displayedCourses = 6;
const coursesPerLoad = 6;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateProgressCounters();
    renderCourses();
    renderContinueCourses();
    setupEventListeners();
});

// Update progress counters
function updateProgressCounters() {
    const enrolled = courseData.length;
    const completed = courseData.filter(course => course.progress === 100).length;
    const inProgress = courseData.filter(course => course.progress > 0 && course.progress < 100).length;
    
    document.getElementById('enrolledCourses').textContent = enrolled;
    document.getElementById('completedCourses').textContent = completed;
    document.getElementById('inProgress').textContent = inProgress;
}

// Render courses based on filters
function renderCourses() {
    coursesContainer.innerHTML = '';
    
    // Filter courses by category
    let filteredCourses = courseData;
    if (currentCategory !== 'all') {
        filteredCourses = courseData.filter(course => course.category === currentCategory);
    }
    
    // Limit displayed courses
    const coursesToShow = filteredCourses.slice(0, displayedCourses);
    
    if (coursesToShow.length === 0) {
        showEmptyState();
        return;
    }
    
    // Render each course
    coursesToShow.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesContainer.appendChild(courseCard);
    });
    
    // Show/hide load more button
    loadMoreBtn.style.display = filteredCourses.length > displayedCourses ? 'flex' : 'none';
    
    // Update container class for list view
    coursesContainer.className = currentView === 'list' ? 'courses-grid list-view' : 'courses-grid';
}

// Create a course card element
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.dataset.id = course.id;
    card.dataset.category = course.category;
    
    const levelClass = `level-${course.level}`;
    
    card.innerHTML = `
        <div class="course-image" style="background: ${course.bgColor}">
            <i class="${course.icon} course-icon" style="color: ${course.iconColor}"></i>
            <span class="course-category">${course.category}</span>
        </div>
        <div class="course-content">
            <div class="course-header">
                <h3 class="course-title">${course.title}</h3>
                <div class="course-meta">
                    <span class="course-meta-item">
                        <i class="fas fa-clock"></i>
                        ${course.duration}
                    </span>
                    <span class="course-meta-item">
                        <i class="fas fa-book-open"></i>
                        ${course.lessons} lessons
                    </span>
                    <span class="course-level ${levelClass}">${course.level}</span>
                </div>
                <p class="course-description">${course.description}</p>
            </div>
            
            ${course.progress > 0 ? `
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                    <div class="progress-info">
                        <span>${course.progress}% complete</span>
                        <span>${course.students.toLocaleString()} students</span>
                    </div>
                </div>
            ` : `
                <div class="course-meta">
                    <span class="course-meta-item">
                        <i class="fas fa-star" style="color: #f59e0b"></i>
                        ${course.rating}
                    </span>
                    <span class="course-meta-item">
                        <i class="fas fa-users"></i>
                        ${course.students.toLocaleString()} students
                    </span>
                </div>
            `}
            
            <div class="course-actions">
                ${course.progress > 0 ? `
                    <button class="btn btn-primary" onclick="continueCourse(${course.id})">
                        <i class="fas fa-play-circle"></i>
                        Continue
                    </button>
                ` : `
                    <button class="btn btn-primary" onclick="enrollCourse(${course.id})">
                        <i class="fas fa-plus-circle"></i>
                        Enroll Now
                    </button>
                `}
                <button class="btn btn-secondary" onclick="viewCourseDetails(${course.id})">
                    <i class="fas fa-info-circle"></i>
                    Details
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Show empty state
function showEmptyState() {
    coursesContainer.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <i class="fas fa-book-open"></i>
            </div>
            <h3 class="empty-title">No courses found</h3>
            <p class="empty-description">
                No courses match your current filter. Try selecting a different category or clear your filters.
            </p>
            <button class="btn btn-primary" onclick="clearFilters()">
                <i class="fas fa-filter"></i>
                Clear Filters
            </button>
        </div>
    `;
    loadMoreBtn.style.display = 'none';
}

// Render continue learning courses
function renderContinueCourses() {
    continueContainer.innerHTML = '';
    
    continueCourses.forEach(course => {
        const continueCard = document.createElement('div');
        continueCard.className = 'continue-card';
        
        continueCard.innerHTML = `
            <div class="continue-icon" style="background: ${course.bgColor}; color: ${course.iconColor}">
                <i class="${course.icon}"></i>
            </div>
            <div class="continue-content">
                <h4 class="continue-title">${course.title}</h4>
                <div class="continue-meta">
                    <span class="continue-meta-item">
                        <i class="fas fa-clock"></i>
                        Last accessed: ${course.lastAccessed}
                    </span>
                    <span class="continue-meta-item">
                        <i class="fas fa-forward"></i>
                        Next: ${course.nextLesson}
                    </span>
                </div>
                <div class="continue-progress">
                    <div class="progress-text">
                        <span>Progress</span>
                        <span class="progress-percent">${course.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                </div>
                <div class="continue-action">
                    <button class="btn btn-primary btn-icon" onclick="continueCourse(${course.id})">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
        `;
        
        continueContainer.appendChild(continueCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active filter
            filterOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update state and render
            currentCategory = category;
            displayedCourses = coursesPerLoad;
            renderCourses();
        });
    });
    
    // View toggle buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active view
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update state and render
            currentView = view;
            renderCourses();
        });
    });
    
    // Load more button
    loadMoreBtn.addEventListener('click', function() {
        displayedCourses += coursesPerLoad;
        renderCourses();
        
        // Scroll to new courses
        const newCourses = coursesContainer.children;
        if (newCourses.length > 0) {
            newCourses[newCourses.length - coursesPerLoad].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    });
    
    // Search functionality
    const searchInput = document.querySelector('.nav-search-input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            renderCourses();
            return;
        }
        
        // Filter courses by search term
        const filteredCourses = courseData.filter(course => 
            course.title.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm) ||
            course.category.toLowerCase().includes(searchTerm)
        );
        
        // Update displayed courses
        const coursesToShow = filteredCourses.slice(0, displayedCourses);
        
        if (coursesToShow.length === 0) {
            showEmptyState();
            return;
        }
        
        coursesContainer.innerHTML = '';
        coursesToShow.forEach(course => {
            const courseCard = createCourseCard(course);
            coursesContainer.appendChild(courseCard);
        });
        
        loadMoreBtn.style.display = filteredCourses.length > displayedCourses ? 'flex' : 'none';
    });
}

// Course actions
function enrollCourse(courseId) {
    const course = courseData.find(c => c.id === courseId);
    
    // Simulate enrollment
    showNotification(`Successfully enrolled in "${course.title}"!`, 'success');
    
    // Update course progress
    course.progress = 5; // Start with 5% progress
    
    // Update UI
    updateProgressCounters();
    renderCourses();
    renderContinueCourses();
    
    // Show modal with course details
    showCourseModal(course);
}

function enrollCourse(courseId) {
    const course = courseData.find(c => c.id === courseId);
    
    // Simulate enrollment
    showNotification(`Successfully enrolled in "${course.title}"!`, 'success');
    
    // Update course progress
    course.progress = 5; // Start with 5% progress
    
    // Save progress to localStorage
    saveCourseProgressToStorage(courseId, 5);
    
    // Update UI
    updateProgressCounters();
    renderCourses();
    renderContinueCourses();
    
    // Redirect to course learning page after 1 second
    setTimeout(() => {
        window.location.href = `course-learning.html?course=${courseId}`;
    }, 1000);
}

function continueCourse(courseId) {
    // Redirect to course learning page
    showNotification(`Continuing "${getCourseTitle(courseId)}"...`, 'info');
    
    setTimeout(() => {
        window.location.href = `course-learning.html?course=${courseId}`;
    }, 1000);
}

function viewCourseDetails(courseId) {
    const course = courseData.find(c => c.id === courseId);
    showCourseModal(course);
}

function showCourseModal(course) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal-container modal-lg" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3 class="modal-title">
                        <i class="${course.icon}" style="color: ${course.iconColor}"></i>
                        ${course.title}
                    </h3>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="course-modal-content">
                        <div class="course-modal-header">
                            <div class="course-modal-category">${course.category}</div>
                            <div class="course-modal-level level-${course.level}">${course.level}</div>
                        </div>
                        
                        <p>${course.description}</p>
                        
                        <div class="course-modal-stats">
                            <div class="stat-item">
                                <i class="fas fa-clock"></i>
                                <div class="stat-value">${course.duration}</div>
                                <div class="stat-label">Duration</div>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-book-open"></i>
                                <div class="stat-value">${course.lessons}</div>
                                <div class="stat-label">Lessons</div>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-users"></i>
                                <div class="stat-value">${course.students.toLocaleString()}</div>
                                <div class="stat-label">Students</div>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-star" style="color: #f59e0b"></i>
                                <div class="stat-value">${course.rating}/5.0</div>
                                <div class="stat-label">Rating</div>
                            </div>
                        </div>
                        
                        <h4>Course Content</h4>
                        <div class="course-syllabus">
                            ${generateSyllabus(course.category).map((item, index) => `
                                <div class="syllabus-item">
                                    <div class="syllabus-number">${index + 1}</div>
                                    <div class="syllabus-content">
                                        <div class="syllabus-title">${item.title}</div>
                                        <div class="syllabus-duration">${item.duration}</div>
                                    </div>
                                    ${course.progress > 0 ? `
                                        <div class="syllabus-status completed">
                                            <i class="fas fa-check"></i>
                                        </div>
                                    ` : `
                                        <div class="syllabus-status">
                                            <i class="fas fa-lock"></i>
                                        </div>
                                    `}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                        Close
                    </button>
                    ${course.progress > 0 ? `
                        <button class="btn btn-primary" onclick="continueCourse(${course.id}); closeModal()">
                            <i class="fas fa-play-circle"></i>
                            Continue Learning
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="enrollCourse(${course.id}); closeModal()">
                            <i class="fas fa-plus-circle"></i>
                            Enroll Now
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modal = document.createElement('div');
    modal.id = 'courseModal';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .course-modal-content {
            padding: 1rem 0;
        }
        
        .course-modal-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .course-modal-category {
            padding: 0.375rem 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-sm);
            font-size: 0.85rem;
            color: var(--text-primary);
        }
        
        .course-modal-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .stat-item {
            text-align: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-md);
        }
        
        .stat-item i {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--water-blue);
        }
        
        .stat-value {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
        }
        
        .stat-label {
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        
        .course-syllabus {
            margin-top: 1.5rem;
        }
        
        .syllabus-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .syllabus-item:last-child {
            border-bottom: none;
        }
        
        .syllabus-number {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .syllabus-content {
            flex: 1;
        }
        
        .syllabus-title {
            font-weight: 500;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
        }
        
        .syllabus-duration {
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        
        .syllabus-status {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
        }
        
        .syllabus-status.completed {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }
    `;
    document.head.appendChild(modalStyles);
}

function closeModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
        modal.remove();
    }
}

// Helper functions
function getCourseTitle(courseId) {
    const course = courseData.find(c => c.id === courseId);
    return course ? course.title : 'Course';
}

function clearFilters() {
    currentCategory = 'all';
    displayedCourses = coursesPerLoad;
    
    // Reset UI
    filterOptions.forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.category === 'all') {
            opt.classList.add('active');
        }
    });
    
    renderCourses();
}

function generateSyllabus(category) {
    const syllabi = {
        programming: [
            { title: "Introduction to Programming", duration: "45 min" },
            { title: "Variables and Data Types", duration: "1 hour" },
            { title: "Control Structures", duration: "1.5 hours" },
            { title: "Functions and Modules", duration: "2 hours" },
            { title: "Object-Oriented Programming", duration: "2.5 hours" },
            { title: "Final Project", duration: "2 hours" }
        ],
        science: [
            { title: "Scientific Method", duration: "40 min" },
            { title: "Data Collection", duration: "1 hour" },
            { title: "Statistical Analysis", duration: "1.5 hours" },
            { title: "Hypothesis Testing", duration: "2 hours" },
            { title: "Research Paper Writing", duration: "1.5 hours" }
        ],
        mathematics: [
            { title: "Basic Concepts", duration: "1 hour" },
            { title: "Equations and Formulas", duration: "1.5 hours" },
            { title: "Problem Solving", duration: "2 hours" },
            { title: "Advanced Topics", duration: "2.5 hours" },
            { title: "Applications", duration: "2 hours" }
        ],
        language: [
            { title: "Grammar Basics", duration: "1 hour" },
            { title: "Vocabulary Building", duration: "1.5 hours" },
            { title: "Conversation Practice", duration: "2 hours" },
            { title: "Writing Skills", duration: "1.5 hours" },
            { title: "Cultural Context", duration: "1 hour" }
        ],
        business: [
            { title: "Business Fundamentals", duration: "1 hour" },
            { title: "Marketing Strategies", duration: "1.5 hours" },
            { title: "Financial Management", duration: "2 hours" },
            { title: "Operations", duration: "1.5 hours" },
            { title: "Business Plan Development", duration: "2 hours" }
        ]
    };
    
    return syllabi[category] || syllabi.programming;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 9999;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .notification-success {
            background: rgba(16, 185, 129, 0.1);
            border-color: rgba(16, 185, 129, 0.3);
            color: #10b981;
        }
        
        .notification-info {
            background: rgba(56, 189, 248, 0.1);
            border-color: rgba(56, 189, 248, 0.3);
            color: var(--water-blue);
        }
        
        .notification-error {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
            color: #ef4444;
        }
        
        .notification-warning {
            background: rgba(245, 158, 11, 0.1);
            border-color: rgba(245, 158, 11, 0.3);
            color: #f59e0b;
        }
        
        .notification-close {
            margin-left: auto;
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            opacity: 0.7;
            padding: 0.25rem;
            border-radius: var(--radius-sm);
        }
        
        .notification-close:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    
    document.head.appendChild(notificationStyles);
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}
// ================ UTILITY FUNCTIONS ================

// Existing utility functions...

// New utility functions for enhanced courses system

// Format lesson duration
function formatLessonDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
}

// Calculate course progress
function calculateCourseProgress(completedLessons, totalLessons) {
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
}

// Get resource type icon
function getResourceIcon(type) {
    const icons = {
        'video': 'video',
        'pdf': 'file-pdf',
        'article': 'newspaper',
        'code': 'code',
        'quiz': 'question-circle',
        'link': 'external-link-alt',
        'exercise': 'dumbbell'
    };
    return icons[type] || 'link';
}

// Parse duration string to minutes
function parseDurationToMinutes(duration) {
    const match = duration.match(/(\d+)\s*hours?/);
    if (match) {
        return parseInt(match[1]) * 60;
    }
    return 60; // Default to 60 minutes
}

// Generate unique ID
function generateLessonId(courseId, lessonIndex) {
    return `${courseId}-${lessonIndex}`;
}

// Check if lesson is accessible
function isLessonAccessible(course, lessonIndex) {
    if (lessonIndex === 0) return true;
    if (!course.lessonsData[lessonIndex - 1]) return false;
    return course.lessonsData[lessonIndex - 1].completed;
}

// Format date relative
function formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

// Validate YouTube video ID
function isValidYouTubeId(videoId) {
    return videoId && videoId.length === 11;
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(videoId, quality = 'medium') {
    const qualities = {
        'default': 'default.jpg',
        'medium': 'mqdefault.jpg',
        'high': 'hqdefault.jpg',
        'standard': 'sddefault.jpg',
        'maxres': 'maxresdefault.jpg'
    };
    
    const qualityKey = qualities[quality] || qualities['medium'];
    return `https://img.youtube.com/vi/${videoId}/${qualityKey}`;
}

// Create YouTube embed URL
function createYouTubeEmbedUrl(videoId, options = {}) {
    const params = new URLSearchParams();
    params.set('rel', '0');
    params.set('modestbranding', '1');
    params.set('showinfo', '0');
    
    if (options.autoplay) params.set('autoplay', '1');
    if (options.start) params.set('start', options.start);
    if (options.end) params.set('end', options.end);
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

// Extract YouTube video ID from URL
function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
}

// Course progress tracking
function trackCourseProgress(courseId, lessonId, action) {
    const trackingData = {
        courseId,
        lessonId,
        action,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`
    };
    
    // In a real app, send this to analytics
    console.log('Tracking:', trackingData);
}

// Save lesson position
function saveLessonPosition(courseId, lessonIndex, videoTime) {
    const positions = JSON.parse(localStorage.getItem('lessonPositions') || '{}');
    const key = `${courseId}-${lessonIndex}`;
    positions[key] = {
        time: videoTime,
        date: new Date().toISOString()
    };
    localStorage.setItem('lessonPositions', JSON.stringify(positions));
}

// Get saved lesson position
function getLessonPosition(courseId, lessonIndex) {
    const positions = JSON.parse(localStorage.getItem('lessonPositions') || '{}');
    const key = `${courseId}-${lessonIndex}`;
    return positions[key] || null;
}

// Calculate estimated course completion
function estimateCompletionTime(course, completedLessons) {
    const totalMinutes = parseDurationToMinutes(course.duration);
    const completedMinutes = (completedLessons / course.lessons) * totalMinutes;
    const remainingMinutes = totalMinutes - completedMinutes;
    
    if (remainingMinutes < 60) {
        return `${Math.ceil(remainingMinutes)} minutes`;
    } else {
        const hours = Math.ceil(remainingMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
}

// Validate course enrollment
function canEnrollInCourse(course, user) {
    // Check prerequisites
    if (course.prerequisites) {
        for (const prereq of course.prerequisites) {
            const prereqCourse = courseData.find(c => c.id === prereq);
            if (!prereqCourse || prereqCourse.progress < 100) {
                return {
                    canEnroll: false,
                    reason: `Complete "${prereqCourse?.title}" first`,
                    prerequisite: prereqCourse
                };
            }
        }
    }
    
    // Check level requirements
    if (course.level === 'advanced') {
        const completedCourses = courseData.filter(c => c.progress === 100).length;
        if (completedCourses < 3) {
            return {
                canEnroll: false,
                reason: 'Complete 3 beginner/intermediate courses first',
                required: 3,
                current: completedCourses
            };
        }
    }
    
    return { canEnroll: true };
}

// Generate course certificate data
function generateCertificateData(course, user) {
    return {
        courseName: course.title,
        userName: user.name || 'Learner',
        completionDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        courseDuration: course.duration,
        certificateId: `CERT-${course.id}-${Date.now()}`,
        instructor: 'GeniusGuide Team',
        platform: 'GeniusGuide Learning Platform'
    };
}

// Export user progress
function exportProgress() {
    const progress = {
        exportDate: new Date().toISOString(),
        user: localStorage.getItem('userEmail'),
        courses: userProgress,
        totalCompleted: courseData.filter(c => c.progress === 100).length,
        totalEnrolled: courseData.filter(c => c.progress > 0).length
    };
    
    const dataStr = JSON.stringify(progress, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `geniusguide-progress-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import user progress
function importProgress(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate imported data
            if (!importedData.courses || !importedData.user) {
                throw new Error('Invalid progress file format');
            }
            
            // Merge with existing progress
            Object.assign(userProgress, importedData.courses);
            
            // Update course data
            courseData.forEach(course => {
                const progress = userProgress[course.id];
                if (progress) {
                    course.progress = progress.progress || 0;
                    if (progress.lessons) {
                        course.lessonsData.forEach((lesson, index) => {
                            if (progress.lessons[index]) {
                                lesson.completed = progress.lessons[index].completed;
                                if (lesson.completed && index < course.lessonsData.length - 1) {
                                    course.lessonsData[index + 1].locked = false;
                                }
                            }
                        });
                    }
                }
            });
            
            saveUserProgress();
            updateProgressCounters();
            renderCourses();
            
            showNotification('Progress imported successfully!', 'success');
        } catch (error) {
            showNotification('Error importing progress: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

// Reset course progress
function resetCourseProgress(courseId) {
    if (confirm('Are you sure you want to reset your progress for this course? This action cannot be undone.')) {
        const course = courseData.find(c => c.id === courseId);
        if (course) {
            course.progress = 0;
            course.lessonsData.forEach(lesson => {
                lesson.completed = false;
                lesson.locked = lesson.id !== 1;
            });
            
            delete userProgress[courseId];
            saveUserProgress();
            updateProgressCounters();
            renderCourses();
            
            showNotification('Course progress reset successfully', 'info');
        }
    }
}

// Existing utility functions remain the same...
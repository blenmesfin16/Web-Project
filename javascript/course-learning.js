// ================ UDACITY-STYLE COURSE LEARNING ================

// Default course data used as fallback when detailed lessons are not available
const defaultCourseData = {
    id: 1,
    title: "HTML Fundamentals",
    description: "Learn the building blocks of web development with HTML.",
    totalLessons: 5,
    progress: 0,
    lessons: [
        {
            id: 1,
            title: "Introduction to HTML",
            duration: "45 min",
            videoId: "qz0aGYrrlhU",
            completed: false,
            locked: false,
            content: `
                <h3>What is HTML?</h3>
                <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of web content using a system of tags and attributes.</p>
            `,
            resources: []
        }
    ]
};

// Mutable course object used by the page (will be populated from global list when available)
let coursePageData = null;

// Current state
let currentLessonIndex = 0;
let userProgress = {};

// DOM Elements
const lessonList = document.getElementById('lessonList');
const videoContainer = document.getElementById('videoContainer');
const videoPlaceholder = document.getElementById('videoPlaceholder');
const lessonTitle = document.getElementById('lessonTitle');
const courseDescriptionEl = document.getElementById('courseDescription');
const lessonDuration = document.getElementById('lessonDuration');
const lessonStatus = document.getElementById('lessonStatus');
const lessonContent = document.getElementById('lessonContent');
const lessonResources = document.getElementById('lessonResources');
const prevBtn = document.getElementById('prevBtn');
const completeBtn = document.getElementById('completeBtn');
const nextBtn = document.getElementById('nextBtn');
const courseTitle = document.getElementById('courseTitle');
const completedLessons = document.getElementById('completedLessons');
const totalLessons = document.getElementById('totalLessons');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('course') || '1', 10);

    // Try to load detailed course from global courses list (if included)
    if (typeof courseData !== 'undefined' && Array.isArray(courseData)) {
        const found = courseData.find(c => parseInt(c.id, 10) === courseId);
        if (found) {
            // If allowedDepartments exists, enforce whitelist
            if (typeof allowedDepartments !== 'undefined' && Array.isArray(allowedDepartments) && found.department && !allowedDepartments.includes(found.department)) {
                alert('This course is not available for your department.');
                window.location.href = 'courses.html';
                return;
            }

            // Build a minimal coursePageData structure from the summary
            const totalLessons = found.lessons || 5;
            const lessonsArr = [];
            for (let i = 0; i < totalLessons; i++) {
                lessonsArr.push({
                    id: i + 1,
                    title: `${found.title} - Lesson ${i + 1}`,
                    duration: '30 min',
                    videoId: found.sampleVideoId || '',
                    completed: false,
                    locked: i !== 0,
                    content: `<p>Lesson ${i + 1} content for ${found.title}.</p>`,
                    resources: []
                });
            }

            coursePageData = {
                id: found.id,
                title: found.title,
                description: found.description || '',
                totalLessons: totalLessons,
                progress: found.progress || 0,
                lessons: lessonsArr,
                department: found.department || null
            };
        }
    }

    // Fall back to default course if not found
    if (!coursePageData) {
        coursePageData = JSON.parse(JSON.stringify(defaultCourseData));
    }

    loadUserProgress();
    initializeCourse();
    loadLesson(0); // Start with first lesson
});

// Load user progress from localStorage
function loadUserProgress() {
    const savedProgress = localStorage.getItem('courseProgress');
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
        
        // Update course data with user progress
        if (userProgress[coursePageData.id]) {
            coursePageData.progress = userProgress[coursePageData.id].progress || 0;

            // Update lesson completion status
            coursePageData.lessons.forEach((lesson, index) => {
                if (userProgress[coursePageData.id].lessons && userProgress[coursePageData.id].lessons[index]) {
                    lesson.completed = userProgress[coursePageData.id].lessons[index].completed;

                    // Unlock next lesson if current is completed
                    if (lesson.completed && index < coursePageData.lessons.length - 1) {
                        coursePageData.lessons[index + 1].locked = false;
                    }
                }
            });
        }
    }
}

// Save user progress to localStorage
function saveUserProgress() {
    if (!userProgress[coursePageData.id]) {
        userProgress[coursePageData.id] = {
            progress: coursePageData.progress,
            lessons: []
        };
    }

    userProgress[coursePageData.id].progress = coursePageData.progress;
    userProgress[coursePageData.id].lessons = coursePageData.lessons.map(lesson => ({
        completed: lesson.completed
    }));
    
    localStorage.setItem('courseProgress', JSON.stringify(userProgress));
}

// Initialize course UI
function initializeCourse() {
    // Set course title
    courseTitle.textContent = coursePageData.title;

    // Set lesson counts
    totalLessons.textContent = coursePageData.totalLessons;
    // Set course description
    if (courseDescriptionEl) courseDescriptionEl.innerHTML = coursePageData.description || '';
    
    // Update progress
    updateProgress();
    
    // Render lesson list
    renderLessonList();
}

// Render lesson list in sidebar
function renderLessonList() {
    lessonList.innerHTML = '';
    
    coursePageData.lessons.forEach((lesson, index) => {
        const lessonItem = document.createElement('div');
        lessonItem.className = `lesson-item ${lesson.completed ? 'completed' : ''} 
                               ${index === currentLessonIndex ? 'active' : ''}
                               ${lesson.locked ? 'locked' : ''}`;
        
        if (!lesson.locked) {
            lessonItem.onclick = () => loadLesson(index);
        }
        
        lessonItem.innerHTML = `
            <div class="lesson-number">${index + 1}</div>
            <div class="lesson-content">
                <div class="lesson-item-title">${lesson.title}</div>
                <div class="lesson-item-duration">${lesson.duration}</div>
            </div>
            <div class="lesson-status">
                ${lesson.locked ? '<i class="fas fa-lock"></i>' : ''}
                ${lesson.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
        `;
        
        lessonList.appendChild(lessonItem);
    });
}

// Load a specific lesson
function loadLesson(index) {
    if (index < 0 || index >= coursePageData.lessons.length) return;

    const lesson = coursePageData.lessons[index];
    
    // Check if lesson is locked
    if (lesson.locked) {
        showLockedModal();
        return;
    }
    
    // Update current lesson index
    currentLessonIndex = index;
    
    // Update lesson info
    lessonTitle.textContent = lesson.title;
    lessonDuration.textContent = lesson.duration;
    lessonStatus.textContent = lesson.completed ? 'Completed' : 'In Progress';
    lessonContent.innerHTML = lesson.content;
    
    // Update resources
    updateResources(lesson.resources);
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update lesson list active state
    updateLessonListActive();
    
    // Load YouTube video
    loadVideo(lesson.videoId);
}

// Load YouTube video
function loadVideo(videoId) {
    // Remove existing iframe
    const existingFrame = videoContainer.querySelector('.video-frame');
    if (existingFrame) existingFrame.remove();

    if (!videoId) {
        // No video – show placeholder
        videoPlaceholder.style.display = 'flex';
        return;
    }

    // Hide placeholder and create YouTube iframe
    videoPlaceholder.style.display = 'none';
    const iframe = document.createElement('iframe');
    iframe.className = 'video-frame';
    iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
    iframe.title = coursePageData.lessons[currentLessonIndex].title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    videoContainer.appendChild(iframe);
}

// Update resources section
function updateResources(resources) {
    // If lesson has no resources, show the course description as a resource card
    if (!resources || resources.length === 0) {
        if (typeof coursePageData !== 'undefined' && coursePageData && coursePageData.description) {
            const descHTML = `
                <a href="#" class="resource-card">
                    <div class="resource-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="resource-content">
                        <div class="resource-title">Course Description</div>
                        <div class="resource-desc">${coursePageData.description}</div>
                        <div class="resource-meta">
                            <span><i class="fas fa-info-circle"></i> Description</span>
                        </div>
                    </div>
                </a>
            `;
            lessonResources.innerHTML = descHTML;
            return;
        }

        lessonResources.innerHTML = '<div class="empty-resources"><p>No resources for this lesson</p></div>';
        return;
    }

    let resourcesHTML = '';
    resources.forEach(resource => {
        resourcesHTML += `
            <a href="#" class="resource-card">
                <div class="resource-icon">
                    <i class="${resource.icon}"></i>
                </div>
                <div class="resource-content">
                    <div class="resource-title">${resource.title}</div>
                    <div class="resource-desc">${resource.description}</div>
                    <div class="resource-meta">
                        <span><i class="fas fa-file"></i> ${resource.type.toUpperCase()}</span>
                        <span><i class="fas fa-download"></i> Download</span>
                    </div>
                </div>
            </a>
        `;
    });

    lessonResources.innerHTML = resourcesHTML;
}

// Update navigation buttons
function updateNavigationButtons() {
    const lesson = coursePageData.lessons[currentLessonIndex];
    
    // Previous button
    prevBtn.disabled = currentLessonIndex === 0;
    
    // Complete button
    completeBtn.disabled = lesson.completed;
    completeBtn.innerHTML = lesson.completed ? 
        '<i class="fas fa-check-circle"></i> Completed' : 
        '<i class="fas fa-check-circle"></i> Mark Complete';
    
    // Next button
    const hasNextLesson = currentLessonIndex < coursePageData.lessons.length - 1;
    const nextLesson = hasNextLesson ? coursePageData.lessons[currentLessonIndex + 1] : null;
    
    if (hasNextLesson) {
        nextBtn.disabled = nextLesson.locked;
    } else {
        nextBtn.disabled = true;
    }
}

// Update lesson list active state
function updateLessonListActive() {
    document.querySelectorAll('.lesson-item').forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentLessonIndex) {
            item.classList.add('active');
        }
    });
}

// Update progress display
function updateProgress() {
    const completed = coursePageData.lessons.filter(lesson => lesson.completed).length;
    const progress = Math.round((completed / coursePageData.totalLessons) * 100);
    
    completedLessons.textContent = completed;
    progressPercent.textContent = `${progress}%`;
    progressFill.style.width = `${progress}%`;
    
    coursePageData.progress = progress;
}

// Show locked lesson modal
function showLockedModal() {
    document.getElementById('lockedModal').classList.add('active');
}

// Event listeners for buttons
prevBtn.addEventListener('click', () => {
    if (currentLessonIndex > 0) {
        loadLesson(currentLessonIndex - 1);
    }
});

completeBtn.addEventListener('click', () => {
    completeCurrentLesson();
});

nextBtn.addEventListener('click', () => {
    if (currentLessonIndex < coursePageData.lessons.length - 1) {
        loadLesson(currentLessonIndex + 1);
    }
});

// Complete current lesson
function completeCurrentLesson() {
    const lesson = coursePageData.lessons[currentLessonIndex];

    if (lesson.completed) return;

    // Mark lesson as completed
    lesson.completed = true;

    // Unlock next lesson if exists
    if (currentLessonIndex < coursePageData.lessons.length - 1) {
        coursePageData.lessons[currentLessonIndex + 1].locked = false;
    }
    
    // Update progress
    updateProgress();
    
    // Save progress
    saveUserProgress();
    
    // Update UI
    renderLessonList();
    updateNavigationButtons();
    
    // Show success message
    showNotification('Lesson completed!', 'success');
    
    // If course is complete, show celebration
    if (coursePageData.progress === 100) {
        setTimeout(() => {
            alert('🎉 Congratulations! You have completed this course!');
        }, 1000);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
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
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}
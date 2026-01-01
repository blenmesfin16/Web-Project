// ================ UDACITY-STYLE COURSE LEARNING ================

// Course data structure
const courseData = {
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
            videoId: "qz0aGYrrlhU", // YouTube video ID
            completed: false,
            locked: false,
            content: `
                <h3>What is HTML?</h3>
                <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of web content using a system of tags and attributes.</p>
                
                <h3>Why Learn HTML?</h3>
                <p>HTML is the foundation of all websites. Whether you're building a simple blog or a complex web application, HTML is where it all begins.</p>
                
                <h3>Basic HTML Structure</h3>
                <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My First Page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Hello World!&lt;/h1&gt;
    &lt;p&gt;This is my first HTML page.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
                
                <h3>Key Concepts</h3>
                <ul>
                    <li><strong>Tags:</strong> HTML elements are defined by tags</li>
                    <li><strong>Elements:</strong> Complete tags with content</li>
                    <li><strong>Attributes:</strong> Additional information for elements</li>
                    <li><strong>Nesting:</strong> Elements inside other elements</li>
                </ul>
            `,
            resources: [
                {
                    type: "pdf",
                    title: "HTML Cheat Sheet",
                    description: "Quick reference for all HTML tags",
                    icon: "fas fa-file-pdf"
                },
                {
                    type: "code",
                    title: "Starter Template",
                    description: "Basic HTML5 template to get started",
                    icon: "fas fa-code"
                }
            ]
        },
        {
            id: 2,
            title: "HTML Elements & Tags",
            duration: "1 hour",
            videoId: "MDuagwOuCxw",
            completed: false,
            locked: true,
            content: `
                <h3>Common HTML Elements</h3>
                <p>HTML provides a wide range of elements for different types of content:</p>
                
                <h4>Text Elements</h4>
                <ul>
                    <li><code>&lt;h1&gt; to &lt;h6&gt;</code> - Headings</li>
                    <li><code>&lt;p&gt;</code> - Paragraphs</li>
                    <li><code>&lt;strong&gt;</code> - Important text</li>
                    <li><code>&lt;em&gt;</code> - Emphasized text</li>
                </ul>
                
                <h4>Link and Image Elements</h4>
                <pre><code>&lt;a href="https://example.com"&gt;Visit Example&lt;/a&gt;
&lt;img src="image.jpg" alt="Description"&gt;</code></pre>
                
                <h4>List Elements</h4>
                <pre><code>&lt;ul&gt;
    &lt;li&gt;Item 1&lt;/li&gt;
    &lt;li&gt;Item 2&lt;/li&gt;
&lt;/ul&gt;</code></pre>
                
                <h3>Element Attributes</h3>
                <p>Attributes provide additional information about elements:</p>
                <pre><code>&lt;img src="photo.jpg" alt="Description" width="300" height="200"&gt;
&lt;a href="page.html" target="_blank"&gt;Open in new tab&lt;/a&gt;</code></pre>
            `,
            resources: [
                {
                    type: "pdf",
                    title: "Elements Reference",
                    description: "Complete list of HTML elements",
                    icon: "fas fa-file-pdf"
                },
                {
                    type: "code",
                    title: "Practice Exercises",
                    description: "HTML coding exercises",
                    icon: "fas fa-code"
                }
            ]
        },
        {
            id: 3,
            title: "HTML Forms",
            duration: "1.5 hours",
            videoId: "fNcJuPIZ2WE",
            completed: false,
            locked: true,
            content: `
                <h3>Creating Forms in HTML</h3>
                <p>Forms allow users to interact with your website by submitting data.</p>
                
                <h4>Basic Form Structure</h4>
                <pre><code>&lt;form action="/submit" method="post"&gt;
    &lt;label for="name"&gt;Name:&lt;/label&gt;
    &lt;input type="text" id="name" name="name"&gt;
    
    &lt;label for="email"&gt;Email:&lt;/label&gt;
    &lt;input type="email" id="email" name="email"&gt;
    
    &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>
                
                <h4>Input Types</h4>
                <ul>
                    <li><code>type="text"</code> - Single-line text input</li>
                    <li><code>type="email"</code> - Email address input</li>
                    <li><code>type="password"</code> - Password input</li>
                    <li><code>type="checkbox"</code> - Checkbox</li>
                    <li><code>type="radio"</code> - Radio button</li>
                    <li><code>type="file"</code> - File upload</li>
                </ul>
                
                <h4>Form Validation</h4>
                <p>HTML5 provides built-in form validation:</p>
                <pre><code>&lt;input type="text" required&gt;
&lt;input type="email" required&gt;
&lt;input type="number" min="1" max="100"&gt;</code></pre>
            `,
            resources: [
                {
                    type: "pdf",
                    title: "Forms Guide",
                    description: "Complete guide to HTML forms",
                    icon: "fas fa-file-pdf"
                }
            ]
        }
    ]
};

// Current state
let currentLessonIndex = 0;
let userProgress = {};

// DOM Elements
const lessonList = document.getElementById('lessonList');
const videoContainer = document.getElementById('videoContainer');
const videoPlaceholder = document.getElementById('videoPlaceholder');
const lessonTitle = document.getElementById('lessonTitle');
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
        if (userProgress[courseData.id]) {
            courseData.progress = userProgress[courseData.id].progress || 0;
            
            // Update lesson completion status
            courseData.lessons.forEach((lesson, index) => {
                if (userProgress[courseData.id].lessons && userProgress[courseData.id].lessons[index]) {
                    lesson.completed = userProgress[courseData.id].lessons[index].completed;
                    
                    // Unlock next lesson if current is completed
                    if (lesson.completed && index < courseData.lessons.length - 1) {
                        courseData.lessons[index + 1].locked = false;
                    }
                }
            });
        }
    }
}

// Save user progress to localStorage
function saveUserProgress() {
    if (!userProgress[courseData.id]) {
        userProgress[courseData.id] = {
            progress: courseData.progress,
            lessons: []
        };
    }
    
    userProgress[courseData.id].progress = courseData.progress;
    userProgress[courseData.id].lessons = courseData.lessons.map(lesson => ({
        completed: lesson.completed
    }));
    
    localStorage.setItem('courseProgress', JSON.stringify(userProgress));
}

// Initialize course UI
function initializeCourse() {
    // Set course title
    courseTitle.textContent = courseData.title;
    
    // Set lesson counts
    totalLessons.textContent = courseData.totalLessons;
    
    // Update progress
    updateProgress();
    
    // Render lesson list
    renderLessonList();
}

// Render lesson list in sidebar
function renderLessonList() {
    lessonList.innerHTML = '';
    
    courseData.lessons.forEach((lesson, index) => {
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
    if (index < 0 || index >= courseData.lessons.length) return;
    
    const lesson = courseData.lessons[index];
    
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
    // Remove placeholder
    videoPlaceholder.style.display = 'none';
    
    // Remove existing iframe
    const existingFrame = videoContainer.querySelector('.video-frame');
    if (existingFrame) {
        existingFrame.remove();
    }
    
    // Create YouTube iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'video-frame';
    iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
    iframe.title = courseData.lessons[currentLessonIndex].title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    
    videoContainer.appendChild(iframe);
}

// Update resources section
function updateResources(resources) {
    if (!resources || resources.length === 0) {
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
    const lesson = courseData.lessons[currentLessonIndex];
    
    // Previous button
    prevBtn.disabled = currentLessonIndex === 0;
    
    // Complete button
    completeBtn.disabled = lesson.completed;
    completeBtn.innerHTML = lesson.completed ? 
        '<i class="fas fa-check-circle"></i> Completed' : 
        '<i class="fas fa-check-circle"></i> Mark Complete';
    
    // Next button
    const hasNextLesson = currentLessonIndex < courseData.lessons.length - 1;
    const nextLesson = hasNextLesson ? courseData.lessons[currentLessonIndex + 1] : null;
    
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
    const completed = courseData.lessons.filter(lesson => lesson.completed).length;
    const progress = Math.round((completed / courseData.totalLessons) * 100);
    
    completedLessons.textContent = completed;
    progressPercent.textContent = `${progress}%`;
    progressFill.style.width = `${progress}%`;
    
    courseData.progress = progress;
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
    if (currentLessonIndex < courseData.lessons.length - 1) {
        loadLesson(currentLessonIndex + 1);
    }
});

// Complete current lesson
function completeCurrentLesson() {
    const lesson = courseData.lessons[currentLessonIndex];
    
    if (lesson.completed) return;
    
    // Mark lesson as completed
    lesson.completed = true;
    
    // Unlock next lesson if exists
    if (currentLessonIndex < courseData.lessons.length - 1) {
        courseData.lessons[currentLessonIndex + 1].locked = false;
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
    if (courseData.progress === 100) {
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
// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        document.querySelector('.theme-toggle i').classList.replace('fa-sun', 'fa-moon');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        document.querySelector('.theme-toggle i').classList.replace('fa-moon', 'fa-sun');
    }
}

// Function to set initial theme
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeToggle.classList.add('fa-moon');
    }
}

// Create and append theme toggle button
function createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.addEventListener('click', toggleDarkMode);
    document.body.appendChild(themeToggle);
}

// Initialize dark mode functionality
document.addEventListener('DOMContentLoaded', () => {
    createThemeToggle();
    setInitialTheme();
});


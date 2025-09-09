// Main JavaScript for fel-baio application
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    loadUserData();
    initializeEventListeners();
});

// Global variables
let userLinks = [];
let userData = {
    name: '',
    bio: '',
    image: '',
    theme: 'default'
};

// Initialize event listeners
function initializeEventListeners() {
    // Profile customization
    document.getElementById('name-input').addEventListener('input', debounce(updatePreview, 300));
    document.getElementById('bio-input').addEventListener('input', debounce(updatePreview, 300));
    document.getElementById('image-input').addEventListener('input', debounce(updatePreview, 300));
    document.getElementById('theme-select').addEventListener('change', changeTheme);
}

// Debounce function for performance
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

// Update preview in real-time
function updatePreview() {
    updateProfileDisplay();
}

// Update profile display based on current inputs and language
function updateProfileDisplay() {
    const name = document.getElementById('name-input').value;
    const bio = document.getElementById('bio-input').value;
    const image = document.getElementById('image-input').value;
    
    // Update profile name
    if (name) {
        document.querySelector('.profile-name').textContent = name;
    } else {
        document.querySelector('.profile-name').textContent = t('default_name');
    }
    
    // Update profile bio
    if (bio) {
        document.querySelector('.profile-bio').textContent = bio;
    } else {
        document.querySelector('.profile-bio').textContent = t('default_bio');
    }
    
    // Update profile image
    if (image && isValidURL(image)) {
        document.getElementById('profile-img').src = image;
    }
}

// Validate URL
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Add new link
function addNewLink() {
    const title = prompt(t('link_title_prompt'));
    if (!title) return;
    
    const url = prompt(t('link_url_prompt'));
    if (!url) return;
    
    if (!isValidURL(url)) {
        alert(t('invalid_url'));
        return;
    }
    
    const link = {
        id: Date.now(),
        title: title,
        url: url
    };
    
    userLinks.push(link);
    renderLinks();
    saveUserData();
}

// Render links
function renderLinks() {
    const container = document.getElementById('links-container');
    container.innerHTML = '';
    
    if (userLinks.length > 0) {
        userLinks.forEach(link => {
            const linkElement = createLinkElement(link);
            container.appendChild(linkElement);
        });
    } else {
        // Show default samples only if no custom links
        renderDefaultLinks();
    }
}

// Create link element
function createLinkElement(link) {
    const linkDiv = document.createElement('div');
    linkDiv.className = 'link-wrapper';
    linkDiv.style.position = 'relative';
    
    const linkElement = document.createElement('a');
    linkElement.href = link.url;
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    linkElement.className = 'link-item';
    linkElement.textContent = link.title;
    
    // Add edit/delete buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'link-actions';
    actionsDiv.style.cssText = `
        position: absolute;
        top: 5px;
        ${currentLanguage === 'ar' ? 'left' : 'right'}: 5px;
        display: none;
        gap: 5px;
    `;
    
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️';
    editBtn.title = t('edit_link');
    editBtn.style.cssText = 'background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;';
    editBtn.onclick = (e) => {
        e.preventDefault();
        editLink(link.id);
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = t('delete_link');
    deleteBtn.style.cssText = 'background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;';
    deleteBtn.onclick = (e) => {
        e.preventDefault();
        deleteLink(link.id);
    };
    
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    
    // Show actions on hover
    linkDiv.addEventListener('mouseenter', () => {
        actionsDiv.style.display = 'flex';
    });
    
    linkDiv.addEventListener('mouseleave', () => {
        actionsDiv.style.display = 'none';
    });
    
    linkDiv.appendChild(linkElement);
    linkDiv.appendChild(actionsDiv);
    
    return linkDiv;
}

// Render default sample links
function renderDefaultLinks() {
    const container = document.getElementById('links-container');
    const sampleLinks = ['sample_link_1', 'sample_link_2', 'sample_link_3', 'sample_link_4'];
    
    sampleLinks.forEach(linkKey => {
        const linkElement = document.createElement('a');
        linkElement.href = '#';
        linkElement.className = 'link-item';
        linkElement.setAttribute('data-translate', linkKey);
        linkElement.textContent = t(linkKey);
        linkElement.onclick = (e) => {
            e.preventDefault();
            // Demo action - could add a modal or redirect to customization
        };
        
        container.appendChild(linkElement);
    });
}

// Edit link
function editLink(linkId) {
    const link = userLinks.find(l => l.id === linkId);
    if (!link) return;
    
    const newTitle = prompt(t('link_title_prompt'), link.title);
    if (newTitle === null) return;
    
    const newUrl = prompt(t('link_url_prompt'), link.url);
    if (newUrl === null) return;
    
    if (!isValidURL(newUrl)) {
        alert(t('invalid_url'));
        return;
    }
    
    link.title = newTitle;
    link.url = newUrl;
    
    renderLinks();
    saveUserData();
}

// Delete link
function deleteLink(linkId) {
    if (!confirm(t('delete_link_confirm'))) return;
    
    userLinks = userLinks.filter(l => l.id !== linkId);
    renderLinks();
    saveUserData();
}

// Change theme
function changeTheme() {
    const theme = document.getElementById('theme-select').value;
    document.body.className = '';
    
    if (theme !== 'default') {
        document.body.classList.add(`${theme}-theme`);
    }
    
    userData.theme = theme;
    saveUserData();
}

// Save changes
function saveChanges() {
    userData.name = document.getElementById('name-input').value;
    userData.bio = document.getElementById('bio-input').value;
    userData.image = document.getElementById('image-input').value;
    
    updatePreview();
    saveUserData();
    
    // Show success message
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = t('changes_saved');
    saveBtn.style.background = '#4CAF50';
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '';
    }, 2000);
}

// Save user data to localStorage
function saveUserData() {
    const data = {
        userData: userData,
        userLinks: userLinks,
        language: currentLanguage
    };
    localStorage.setItem('felBaioData', JSON.stringify(data));
}

// Load user data from localStorage
function loadUserData() {
    const saved = localStorage.getItem('felBaioData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            userData = data.userData || userData;
            userLinks = data.userLinks || [];
            
            // Apply loaded data
            document.getElementById('name-input').value = userData.name || '';
            document.getElementById('bio-input').value = userData.bio || '';
            document.getElementById('image-input').value = userData.image || '';
            document.getElementById('theme-select').value = userData.theme || 'default';
            
            updatePreview();
            changeTheme();
            renderLinks();
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    } else {
        // First time visitor - show default sample links
        renderDefaultLinks();
    }
}

// Export data (for future features)
function exportData() {
    const data = {
        userData: userData,
        userLinks: userLinks,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fel-baio-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import data (for future features)
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            userData = data.userData || userData;
            userLinks = data.userLinks || [];
            
            loadUserData();
            alert(t('changes_saved'));
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveChanges();
    }
    
    // Ctrl/Cmd + N to add new link
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addNewLink();
    }
});

// Share functionality (for future enhancement)
function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: userData.name || t('page_title'),
            text: userData.bio || t('default_bio'),
            url: window.location.href
        });
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

// Initialize service worker for PWA functionality (future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker when available
    });
}
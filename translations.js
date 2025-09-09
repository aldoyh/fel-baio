// Language translations for fel-baio
const translations = {
    ar: {
        page_title: "اللينك في البايو",
        default_name: "اسمك هنا",
        default_bio: "أضف نبذة عنك هنا",
        links_title: "الروابط",
        sample_link_1: "موقعي الشخصي",
        sample_link_2: "حسابي على تويتر",
        sample_link_3: "قناتي على يوتيوب",
        sample_link_4: "صفحتي على لينكد إن",
        add_link: "إضافة رابط جديد",
        customize_title: "تخصيص الصفحة",
        name_label: "الاسم:",
        name_placeholder: "أدخل اسمك",
        bio_label: "النبذة:",
        bio_placeholder: "أدخل نبذة عنك",
        image_label: "رابط الصورة:",
        image_placeholder: "أدخل رابط الصورة",
        theme_label: "المظهر:",
        theme_default: "افتراضي",
        theme_dark: "داكن",
        theme_colorful: "ملون",
        save_changes: "حفظ التغييرات",
        footer_text: "مدعوم بـ <strong>فِ البايو</strong> - البديل المجاني لخدمات الروابط",
        
        // JavaScript messages
        link_title_prompt: "أدخل عنوان الرابط:",
        link_url_prompt: "أدخل رابط URL:",
        invalid_url: "رابط غير صحيح، يرجى المحاولة مرة أخرى",
        changes_saved: "تم حفظ التغييرات بنجاح!",
        delete_link_confirm: "هل أنت متأكد من حذف هذا الرابط؟",
        edit_link: "تعديل الرابط",
        delete_link: "حذف الرابط",
        new_link: "رابط جديد"
    },
    en: {
        page_title: "Link in Bio",
        default_name: "Your Name Here",
        default_bio: "Add your bio here",
        links_title: "Links",
        sample_link_1: "My Website",
        sample_link_2: "My Twitter",
        sample_link_3: "My YouTube Channel", 
        sample_link_4: "My LinkedIn",
        add_link: "Add New Link",
        customize_title: "Customize Page",
        name_label: "Name:",
        name_placeholder: "Enter your name",
        bio_label: "Bio:",
        bio_placeholder: "Enter your bio",
        image_label: "Image URL:",
        image_placeholder: "Enter image URL",
        theme_label: "Theme:",
        theme_default: "Default",
        theme_dark: "Dark",
        theme_colorful: "Colorful",
        save_changes: "Save Changes",
        footer_text: "Powered by <strong>Fel-Baio</strong> - Free alternative to link services",
        
        // JavaScript messages
        link_title_prompt: "Enter link title:",
        link_url_prompt: "Enter URL:",
        invalid_url: "Invalid URL, please try again",
        changes_saved: "Changes saved successfully!",
        delete_link_confirm: "Are you sure you want to delete this link?",
        edit_link: "Edit Link",
        delete_link: "Delete Link",
        new_link: "New Link"
    }
};

// Current language
let currentLanguage = 'ar';

// Function to get translation
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Function to update all translations on the page
function updateTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = t(key);
        
        if (element.innerHTML.includes('<strong>')) {
            element.innerHTML = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    placeholderElements.forEach(element => {
        if (element.hasAttribute('data-translate')) {
            const key = element.getAttribute('data-translate');
            element.placeholder = t(key);
        }
    });
    
    // Update document title
    document.title = t('page_title');
    
    // Update profile display if no custom data is entered
    updateProfileDisplay();
    
    // Re-render links to update translations
    renderLinks();
}

// Function to switch language
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Update all translations
    updateTranslations();
    
    // Save language preference
    localStorage.setItem('felBaioLanguage', lang);
    
    // Add fade effect
    document.body.classList.add('fade-in');
    setTimeout(() => {
        document.body.classList.remove('fade-in');
    }, 500);
}

// Initialize language from localStorage or default to Arabic
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('felBaioLanguage') || 'ar';
    switchLanguage(savedLanguage);
}
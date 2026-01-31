// LocalizationManager - Handles language switching and text retrieval
const localizationManager = {
    currentLanguage: 'en',

    init() {
        // Load saved language preference
        const saved = localStorage.getItem('breakout_language');
        if (saved && TRANSLATIONS[saved]) {
            this.currentLanguage = saved;
        }
        // Update DOM text after document is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateDOMText());
        } else {
            this.updateDOMText();
        }
    },

    setLanguage(lang) {
        if (TRANSLATIONS[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('breakout_language', lang);
            this.updateDOMText();
            return true;
        }
        return false;
    },

    updateDOMText() {
        // Update rotate warning text
        const rotateText = document.getElementById('rotate-text');
        if (rotateText) {
            rotateText.textContent = this.getText('rotateDevice');
        }
    },

    getLanguage() {
        return this.currentLanguage;
    },

    getText(key) {
        const translations = TRANSLATIONS[this.currentLanguage];
        if (translations && translations[key]) {
            return translations[key];
        }
        // Fallback to English
        if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
            return TRANSLATIONS.en[key];
        }
        // Return key if not found
        return key;
    },

    t(key) {
        return this.getText(key);
    }
};

// Initialize on load
localizationManager.init();

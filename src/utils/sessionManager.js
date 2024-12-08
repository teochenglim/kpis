import { defaultData, CURRENT_VERSION } from './defaultData';

function migrateData(oldData) {
    // Handle data structure updates between versions
    if (!oldData.version || oldData.version !== CURRENT_VERSION) {
        console.log('Data structure outdated, resetting to defaults');
        return defaultData;
    }
    return oldData;
}

export function getCurrentState(activeTabIndex, tabCount) {
    const tabs = [];
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach((tab, index) => {
        const tabTitle = tab.querySelector('.tab-text').textContent;
        const content = document.querySelector(`.tab-content[data-tab-index="${index}"]`);
        const categories = [];
        
        if (content) {
            content.querySelectorAll('.category').forEach(category => {
                const categoryTitle = category.querySelector('.category-text').textContent;
                const patterns = [];
                
                category.querySelectorAll('.pattern').forEach(pattern => {
                    patterns.push(pattern.querySelector('.pattern-text').textContent);
                });
                
                categories.push({
                    title: categoryTitle,
                    patterns: patterns
                });
            });
        }
        
        tabs.push({
            title: tabTitle,
            categories: categories
        });
    });
    
    return {
        version: CURRENT_VERSION,
        activeTabIndex,
        tabCount,
        tabs
    };
}

export function saveSession(data) {
    // Ensure version is set before saving
    const dataToSave = {
        ...data,
        version: CURRENT_VERSION
    };
    localStorage.setItem('kpiDashboardData', JSON.stringify(dataToSave));
}

export function loadSession() {
    try {
        const savedData = localStorage.getItem('kpiDashboardData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            return migrateData(parsedData);
        }
    } catch (error) {
        console.error('Error loading session data:', error);
        return defaultData;
    }
    return defaultData;
}

export function resetToDefaults() {
    if (confirm('Are you sure you want to reset to default values? This action cannot be undone.')) {
        localStorage.removeItem('kpiDashboardData');
        window.location.reload();
    }
}

export function clearSession() {
    localStorage.removeItem('kpiDashboardData');
}
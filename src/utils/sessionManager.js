export function saveSession(data) {
    localStorage.setItem('kpiDashboardData', JSON.stringify(data));
}

export function loadSession() {
    const savedData = localStorage.getItem('kpiDashboardData');
    if (savedData) {
        return JSON.parse(savedData);
    }
    return {
        activeTabIndex: 0,
        tabCount: 1,
        tabs: [
            {
                title: "KPI 1",
                categories: [
                    {
                        title: "Category 1",
                        patterns: ["Sub Category 1", "Sub Category 2"]
                    },
                    {
                        title: "Category 2",
                        patterns: ["Sub Category 3", "Sub Category 4"]
                    }
                ]
            }
        ]
    };
}

export function clearSession() {
    localStorage.removeItem('kpiDashboardData');
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
        activeTabIndex,
        tabCount,
        tabs
    };
}
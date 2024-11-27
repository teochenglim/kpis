import jsyaml from 'js-yaml';

function getAllData() {
    const data = [];
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        const kpiName = tab.querySelector('.tab-text').textContent;
        const tabIndex = Array.from(tabs).indexOf(tab);
        const content = document.querySelector(`.tab-content[data-tab-index="${tabIndex}"]`);
        
        if (content) {
            const categories = content.querySelectorAll('.category');
            categories.forEach(category => {
                const categoryName = category.querySelector('.category-text').textContent;
                const patterns = category.querySelectorAll('.pattern');
                
                patterns.forEach(pattern => {
                    const subCategoryName = pattern.querySelector('.pattern-text').textContent;
                    data.push({
                        kpi: kpiName,
                        category: categoryName,
                        subCategory: subCategoryName
                    });
                });
            });
        }
    });
    
    return data;
}

function exportToCSV() {
    const data = getAllData();
    const csvContent = [
        ['KPI', 'Category', 'Sub Category'],
        ...data.map(row => [row.kpi, row.category, row.subCategory])
    ].map(row => row.join(',')).join('\n');
    
    downloadFile(csvContent, 'kpi-structure.csv', 'text/csv');
}

function exportToYAML() {
    const data = getAllData();
    const structuredData = {};
    
    data.forEach(({ kpi, category, subCategory }) => {
        if (!structuredData[kpi]) {
            structuredData[kpi] = {};
        }
        if (!structuredData[kpi][category]) {
            structuredData[kpi][category] = [];
        }
        structuredData[kpi][category].push(subCategory);
    });
    
    const yamlContent = jsyaml.dump(structuredData);
    downloadFile(yamlContent, 'kpi-structure.yaml', 'text/yaml');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export function initializeExportPanel() {
    const panel = document.createElement('div');
    panel.className = 'side-panel';
    
    const csvButton = document.createElement('button');
    csvButton.className = 'export-btn';
    csvButton.innerHTML = '📄 Export CSV';
    csvButton.onclick = exportToCSV;
    
    const yamlButton = document.createElement('button');
    yamlButton.className = 'export-btn';
    yamlButton.innerHTML = '📑 Export YAML';
    yamlButton.onclick = exportToYAML;
    
    panel.appendChild(csvButton);
    panel.appendChild(yamlButton);
    
    document.body.appendChild(panel);
}
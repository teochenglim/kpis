export function createCategory(title, patterns = []) {
    const category = document.createElement('div');
    category.className = 'category';
    
    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'category-title';
    categoryTitle.innerHTML = `
        <span class="category-text" onclick="window.editCategoryTitle(this)">${title}</span>
        <div class="button-group">
            <button onclick="window.showNewPatternInput(this)" class="add-btn" title="Add Sub Category">+</button>
            <button onclick="window.removeCategory(this)" class="remove-btn" title="Remove Category" ${isLastCategory() ? 'disabled' : ''}>×</button>
        </div>
    `;
    
    category.appendChild(categoryTitle);
    
    patterns.forEach(pattern => {
        category.appendChild(createPattern(pattern));
    });
    
    return category;
}

export function createPattern(text) {
    const pattern = document.createElement('div');
    pattern.className = 'pattern';
    pattern.innerHTML = `
        <span class="pattern-text" onclick="window.editPattern(this)">${text}</span>
        <div class="button-group">
            <button onclick="window.removePattern(this)" class="remove-btn" title="Remove Sub Category">×</button>
        </div>
    `;
    return pattern;
}

export function isLastCategory() {
    const container = document.querySelector('.tab-content:not([style*="display: none"])') || document.getElementById('patternsContainer');
    const categories = container.querySelectorAll('.category');
    return categories.length <= 1;
}

export function isLastPattern(pattern) {
    const category = pattern.closest('.category');
    const patterns = category.querySelectorAll('.pattern');
    return patterns.length <= 1;
}

export function updateRemoveButtons() {
    const container = document.querySelector('.tab-content:not([style*="display: none"])') || document.getElementById('patternsContainer');
    const categories = container.querySelectorAll('.category');
    const isLast = categories.length <= 1;
    
    categories.forEach(category => {
        const removeBtn = category.querySelector('.category-title .remove-btn');
        if (removeBtn) {
            removeBtn.disabled = isLast;
        }
        
        const patterns = category.querySelectorAll('.pattern');
        const isLastInCategory = patterns.length <= 1;
        patterns.forEach(pattern => {
            const removeBtn = pattern.querySelector('.remove-btn');
            if (removeBtn) {
                removeBtn.disabled = isLastInCategory;
            }
        });
    });
}
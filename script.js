// Categories data
const categories = [
    {
        title: "Category 1",
        patterns: [
            "Sub Category 1",
            "Sub Category 2"
        ]
    },
    {
        title: "Category 2",
        patterns: [
            "Sub Category 3",
            "Sub Category 4"
        ]
    }
];

let activeTabIndex = 0;
let tabCount = 1;

// Tab Management Functions
function createTab(index) {
    const tab = document.createElement('button');
    tab.className = `tab-btn ${index === activeTabIndex ? 'active' : ''}`;
    tab.onclick = () => switchTab(index);
    const title = index === 0 ? "KPI 1" : `KPI ${index + 1}`;
    tab.innerHTML = `
        <span class="tab-text" onclick="editTabTitle(event, this)">${title}</span>
        <span 
            class="tab-close" 
            onclick="removeTab(event, ${index})"
            ${index === 0 ? 'disabled' : ''}
            style="${index === 0 ? 'pointer-events: none;' : ''}"
        >×</span>
    `;
    return tab;
}

function editTabTitle(event, element) {
    event.stopPropagation();
    const currentText = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    
    input.onblur = () => {
        const newText = input.value.trim();
        if (newText) {
            element.textContent = newText;
        }
        element.style.display = '';
        input.remove();
    };
    
    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    };
    
    element.style.display = 'none';
    element.parentNode.insertBefore(input, element);
    input.focus();
}

function addTab() {
    const tabsContainer = document.querySelector('.tabs');
    const addButton = document.querySelector('.add-tab-btn');
    
    const newTab = createTab(tabCount);
    tabsContainer.insertBefore(newTab, addButton);
    
    // Create a new container for this tab
    const container = document.getElementById('patternsContainer');
    const newTabContent = document.createElement('div');
    newTabContent.className = 'tab-content';
    newTabContent.dataset.tabIndex = tabCount;
    container.appendChild(newTabContent);
    
    tabCount++;
    switchTab(tabCount - 1);
    updateTabCloseButtons();
}

function removeTab(event, index) {
    event.stopPropagation();
    if (index === 0) return;
    
    const tabs = document.querySelectorAll('.tab-btn');
    if (tabs.length <= 1) return;
    
    tabs[index].remove();
    
    // Remove corresponding content
    const content = document.querySelector(`.tab-content[data-tab-index="${index}"]`);
    if (content) content.remove();
    
    tabCount--;
    updateTabIndices();
    
    if (index === activeTabIndex) {
        switchTab(Math.max(0, index - 1));
    } else if (index < activeTabIndex) {
        activeTabIndex--;
    }
    
    updateTabCloseButtons();
}

function updateTabIndices() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab, index) => {
        tab.onclick = () => switchTab(index);
        const closeBtn = tab.querySelector('.tab-close');
        closeBtn.onclick = (e) => removeTab(e, index);
        const title = index === 0 ? "KPI 1" : `KPI ${index + 1}`;
        tab.innerHTML = `
            <span class="tab-text" onclick="editTabTitle(event, this)">${title}</span>
            <span 
                class="tab-close" 
                onclick="removeTab(event, ${index})"
                ${index === 0 ? 'disabled' : ''}
                style="${index === 0 ? 'pointer-events: none;' : ''}"
            >×</span>
        `;
    });
}

function updateTabCloseButtons() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab, index) => {
        const closeBtn = tab.querySelector('.tab-close');
        if (index === 0) {
            closeBtn.setAttribute('disabled', '');
            closeBtn.style.pointerEvents = 'none';
        } else {
            closeBtn.removeAttribute('disabled');
            closeBtn.style.pointerEvents = '';
        }
    });
}

function switchTab(index) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach((tab, i) => {
        if (i === index) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    contents.forEach((content, i) => {
        if (i === index) {
            content.style.display = '';
        } else {
            content.style.display = 'none';
        }
    });
    
    activeTabIndex = index;
}

// Category Management Functions
function createCategory(title, patterns = []) {
    const category = document.createElement('div');
    category.className = 'category';
    
    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'category-title';
    categoryTitle.innerHTML = `
        <span class="category-text" onclick="editCategoryTitle(this)">${title}</span>
        <div class="button-group">
            <button onclick="showNewPatternInput(this)" class="add-btn" title="Add Sub Category">+</button>
            <button onclick="removeCategory(this)" class="remove-btn" title="Remove Category" ${isLastCategory() ? 'disabled' : ''}>×</button>
        </div>
    `;
    
    category.appendChild(categoryTitle);
    
    patterns.forEach(pattern => {
        category.appendChild(createPattern(pattern));
    });
    
    return category;
}

function editCategoryTitle(element) {
    const currentText = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    
    input.onblur = () => {
        const newText = input.value.trim();
        if (newText) {
            element.textContent = newText;
        }
        element.style.display = '';
        input.remove();
    };
    
    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    };
    
    element.style.display = 'none';
    element.parentNode.insertBefore(input, element);
    input.focus();
}

function createPattern(text) {
    const pattern = document.createElement('div');
    pattern.className = 'pattern';
    pattern.innerHTML = `
        <span class="pattern-text" onclick="editPattern(this)">${text}</span>
        <div class="button-group">
            <button onclick="removePattern(this)" class="remove-btn" title="Remove Sub Category">×</button>
        </div>
    `;
    return pattern;
}

function editPattern(element) {
    const currentText = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    
    input.onblur = () => {
        const newText = input.value.trim();
        if (newText) {
            element.textContent = newText;
        }
        element.style.display = '';
        input.remove();
    };
    
    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    };
    
    element.style.display = 'none';
    element.parentNode.insertBefore(input, element);
    input.focus();
}

function showNewCategoryInput() {
    const container = document.querySelector('.tab-content:not([style*="display: none"])') || document.getElementById('patternsContainer');
    const newCategoryDiv = document.createElement('div');
    newCategoryDiv.className = 'new-category';
    newCategoryDiv.innerHTML = `
        <input type="text" placeholder="Enter category name" onkeypress="handleNewCategoryKeyPress(event, this)">
        <div class="button-row">
            <button onclick="saveNewCategory(this)" class="save-btn">Save</button>
            <button onclick="cancelNewCategory(this)" class="remove-btn">Cancel</button>
        </div>
    `;
    container.appendChild(newCategoryDiv);
    newCategoryDiv.querySelector('input').focus();
}

function showNewPatternInput(btn) {
    const category = btn.closest('.category');
    const newPatternDiv = document.createElement('div');
    newPatternDiv.className = 'new-item';
    newPatternDiv.innerHTML = `
        <input type="text" placeholder="Enter sub category name" onkeypress="handleNewPatternKeyPress(event, this)">
        <div class="button-row">
            <button onclick="saveNewPattern(this)" class="save-btn">Save</button>
            <button onclick="cancelNewPattern(this)" class="remove-btn">Cancel</button>
        </div>
    `;
    category.appendChild(newPatternDiv);
    newPatternDiv.querySelector('input').focus();
}

function handleNewCategoryKeyPress(event, input) {
    if (event.key === 'Enter') {
        saveNewCategory(input);
    }
}

function handleNewPatternKeyPress(event, input) {
    if (event.key === 'Enter') {
        saveNewPattern(input);
    }
}

function saveNewCategory(element) {
    const newCategoryDiv = element.closest('.new-category');
    const input = newCategoryDiv.querySelector('input');
    const title = input.value.trim();
    
    if (title) {
        const container = document.querySelector('.tab-content:not([style*="display: none"])') || document.getElementById('patternsContainer');
        const newCategory = createCategory(title);
        container.insertBefore(newCategory, newCategoryDiv);
        updateRemoveButtons();
    }
    newCategoryDiv.remove();
}

function saveNewPattern(element) {
    const newPatternDiv = element.closest('.new-item');
    const input = newPatternDiv.querySelector('input');
    const text = input.value.trim();
    
    if (text) {
        const category = newPatternDiv.closest('.category');
        category.insertBefore(createPattern(text), newPatternDiv);
        updateRemoveButtons();
    }
    newPatternDiv.remove();
}

function cancelNewCategory(element) {
    element.closest('.new-category').remove();
}

function cancelNewPattern(element) {
    element.closest('.new-item').remove();
}

function isLastCategory() {
    const container = document.querySelector('.tab-content:not([style*="display: none"])') || document.getElementById('patternsContainer');
    const categories = container.querySelectorAll('.category');
    return categories.length <= 1;
}

function isLastPattern(pattern) {
    const category = pattern.closest('.category');
    const patterns = category.querySelectorAll('.pattern');
    return patterns.length <= 1;
}

function updateRemoveButtons() {
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

function removeCategory(btn) {
    if (!isLastCategory()) {
        const category = btn.closest('.category');
        category.classList.add('fade-out');
        setTimeout(() => {
            category.remove();
            updateRemoveButtons();
        }, 300);
    }
}

function removePattern(btn) {
    const pattern = btn.closest('.pattern');
    if (!isLastPattern(pattern)) {
        pattern.remove();
        updateRemoveButtons();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.querySelector('.tabs');
    
    // Create initial tab
    const firstTab = createTab(0);
    tabsContainer.appendChild(firstTab);
    
    // Create add button
    const addButton = document.createElement('button');
    addButton.className = 'add-tab-btn';
    addButton.innerHTML = '+';
    addButton.onclick = addTab;
    tabsContainer.appendChild(addButton);
    
    // Create initial tab content
    const container = document.getElementById('patternsContainer');
    const firstTabContent = document.createElement('div');
    firstTabContent.className = 'tab-content';
    firstTabContent.dataset.tabIndex = '0';
    container.appendChild(firstTabContent);
    
    // Initialize categories
    categories.forEach(category => {
        firstTabContent.appendChild(createCategory(category.title, category.patterns));
    });
    
    // Add "Add Category" button to the container
    const addCategoryButton = document.createElement('button');
    addCategoryButton.className = 'add-category-btn';
    addCategoryButton.innerHTML = '+ Add Category';
    addCategoryButton.onclick = showNewCategoryInput;
    container.appendChild(addCategoryButton);
    
    // Initialize side panel collapse functionality
    const sidePanel = document.querySelector('.side-panel');
    if (sidePanel) {
        sidePanel.addEventListener('click', (e) => {
            if (!e.target.classList.contains('export-btn')) {
                sidePanel.classList.toggle('collapsed');
            }
        });
    }
    
    updateRemoveButtons();
});
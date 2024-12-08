import './style.css';
import { createTab, switchTab, updateTabIndices } from './components/TabManager';
import { createCategory, createPattern, updateRemoveButtons, isLastCategory, isLastPattern } from './components/CategoryManager';
import { editCategoryTitle, editPattern } from './components/EditManager';
import { exportToCSV, exportToYAML } from './utils/exportUtils';
import { saveSession, loadSession, getCurrentState, resetToDefaults } from './utils/sessionManager';

let activeTabIndex = 0;
let tabCount = 1;

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
            saveSession(getCurrentState(activeTabIndex, tabCount));
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
    
    const newTab = createTab(tabCount, activeTabIndex);
    tabsContainer.insertBefore(newTab, addButton);
    
    const container = document.getElementById('patternsContainer');
    const newTabContent = document.createElement('div');
    newTabContent.className = 'tab-content';
    newTabContent.dataset.tabIndex = tabCount;
    container.appendChild(newTabContent);
    
    tabCount++;
    activeTabIndex = switchTab(tabCount - 1);
    updateTabIndices();
    saveSession(getCurrentState(activeTabIndex, tabCount));
}

function removeTab(event, index) {
    event.stopPropagation();
    if (index === 0) return;
    
    const tabs = document.querySelectorAll('.tab-btn');
    if (tabs.length <= 1) return;
    
    tabs[index].remove();
    
    const content = document.querySelector(`.tab-content[data-tab-index="${index}"]`);
    if (content) content.remove();
    
    tabCount--;
    updateTabIndices();
    
    if (index === activeTabIndex) {
        activeTabIndex = switchTab(Math.max(0, index - 1));
    } else if (index < activeTabIndex) {
        activeTabIndex--;
    }
    
    saveSession(getCurrentState(activeTabIndex, tabCount));
}

function showNewPatternInput(btn) {
    const category = btn.closest('.category');
    const newPatternDiv = document.createElement('div');
    newPatternDiv.className = 'new-item';
    newPatternDiv.innerHTML = `
        <input type="text" placeholder="Enter sub category name" onkeypress="window.handleNewPatternKeyPress(event, this)">
        <div class="button-row">
            <button onclick="window.saveNewPattern(this)" class="save-btn">Save</button>
            <button onclick="window.cancelNewPattern(this)" class="remove-btn">Cancel</button>
        </div>
    `;
    category.appendChild(newPatternDiv);
    newPatternDiv.querySelector('input').focus();
}

function handleNewPatternKeyPress(event, input) {
    if (event.key === 'Enter') {
        saveNewPattern(input);
    }
}

function saveNewPattern(element) {
    const newPatternDiv = element.closest('.new-item');
    const input = newPatternDiv.querySelector('input');
    const text = input.value.trim();
    
    if (text) {
        const category = newPatternDiv.closest('.category');
        category.insertBefore(createPattern(text), newPatternDiv);
        updateRemoveButtons();
        saveSession(getCurrentState(activeTabIndex, tabCount));
    }
    newPatternDiv.remove();
}

function cancelNewPattern(element) {
    element.closest('.new-item').remove();
}

function showNewCategoryInput() {
    const container = document.querySelector('.tab-content:not([style*="display: none"])') || document.getElementById('patternsContainer');
    const newCategoryDiv = document.createElement('div');
    newCategoryDiv.className = 'new-category';
    newCategoryDiv.innerHTML = `
        <input type="text" placeholder="Enter category name" onkeypress="window.handleNewCategoryKeyPress(event, this)">
        <div class="button-row">
            <button onclick="window.saveNewCategory(this)" class="save-btn">Save</button>
            <button onclick="window.cancelNewCategory(this)" class="remove-btn">Cancel</button>
        </div>
    `;
    container.appendChild(newCategoryDiv);
    newCategoryDiv.querySelector('input').focus();
}

function handleNewCategoryKeyPress(event, input) {
    if (event.key === 'Enter') {
        saveNewCategory(input);
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
        saveSession(getCurrentState(activeTabIndex, tabCount));
    }
    newCategoryDiv.remove();
}

function cancelNewCategory(element) {
    element.closest('.new-category').remove();
}

function removeCategory(btn) {
    if (!isLastCategory()) {
        const category = btn.closest('.category');
        category.classList.add('fade-out');
        setTimeout(() => {
            category.remove();
            updateRemoveButtons();
            saveSession(getCurrentState(activeTabIndex, tabCount));
        }, 300);
    }
}

function removePattern(btn) {
    const pattern = btn.closest('.pattern');
    if (!isLastPattern(pattern)) {
        pattern.remove();
        updateRemoveButtons();
        saveSession(getCurrentState(activeTabIndex, tabCount));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const savedData = loadSession();
    activeTabIndex = savedData.activeTabIndex;
    tabCount = savedData.tabCount;
    
    const tabsContainer = document.querySelector('.tabs');
    const container = document.getElementById('patternsContainer');
    
    // Create tabs and their content
    savedData.tabs.forEach((tabData, index) => {
        const tab = createTab(index, activeTabIndex);
        tab.querySelector('.tab-text').textContent = tabData.title;
        tabsContainer.appendChild(tab);
        
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.dataset.tabIndex = index;
        tabContent.style.display = index === activeTabIndex ? '' : 'none';
        
        tabData.categories.forEach(category => {
            tabContent.appendChild(createCategory(category.title, category.patterns));
        });
        
        container.appendChild(tabContent);
    });
    
    // Create add button
    const addButton = document.createElement('button');
    addButton.className = 'add-tab-btn';
    addButton.innerHTML = '+';
    addButton.onclick = addTab;
    tabsContainer.appendChild(addButton);
    
    // Add "Add Category" button
    const addCategoryButton = document.createElement('button');
    addCategoryButton.className = 'add-category-btn';
    addCategoryButton.innerHTML = '+ Add Category';
    addCategoryButton.onclick = showNewCategoryInput;
    container.appendChild(addCategoryButton);
    
    // Initialize side panel
    initializeSidePanel();
    
    updateRemoveButtons();
});

function initializeSidePanel() {
    const sidePanel = document.querySelector('.side-panel');
    if (sidePanel) {
        sidePanel.addEventListener('click', (e) => {
            if (!e.target.classList.contains('export-btn') && !e.target.classList.contains('reset-btn')) {
                sidePanel.classList.toggle('collapsed');
            }
        });
    }
}

// Export all necessary functions to window object
Object.assign(window, {
    editTabTitle,
    editCategoryTitle,
    editPattern,
    exportToCSV,
    exportToYAML,
    resetToDefaults,
    addTab,
    removeTab,
    showNewCategoryInput,
    handleNewCategoryKeyPress,
    saveNewCategory,
    cancelNewCategory,
    showNewPatternInput,
    handleNewPatternKeyPress,
    saveNewPattern,
    cancelNewPattern,
    removeCategory,
    removePattern
});
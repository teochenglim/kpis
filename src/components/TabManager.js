export function createTab(index, activeTabIndex) {
    const tab = document.createElement('button');
    tab.className = `tab-btn ${index === activeTabIndex ? 'active' : ''}`;
    tab.onclick = () => switchTab(index);
    const title = index === 0 ? "KPI 1" : `KPI ${index + 1}`;
    tab.innerHTML = `
        <span class="tab-text" onclick="window.editTabTitle(event, this)">${title}</span>
        <span 
            class="tab-close" 
            onclick="window.removeTab(event, ${index})"
            ${index === 0 ? 'disabled' : ''}
            style="${index === 0 ? 'pointer-events: none;' : ''}"
        >×</span>
    `;
    return tab;
}

export function switchTab(index) {
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
    
    return index;
}

export function updateTabIndices() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab, index) => {
        tab.onclick = () => switchTab(index);
        const closeBtn = tab.querySelector('.tab-close');
        closeBtn.onclick = (e) => window.removeTab(e, index);
        const title = index === 0 ? "KPI 1" : `KPI ${index + 1}`;
        tab.innerHTML = `
            <span class="tab-text" onclick="window.editTabTitle(event, this)">${title}</span>
            <span 
                class="tab-close" 
                onclick="window.removeTab(event, ${index})"
                ${index === 0 ? 'disabled' : ''}
                style="${index === 0 ? 'pointer-events: none;' : ''}"
            >×</span>
        `;
    });
}
export function editCategoryTitle(element) {
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

export function editPattern(element) {
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
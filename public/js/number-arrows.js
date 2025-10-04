// Wspólny JavaScript dla niestandardowych strzałek w polach number
function setupNumberArrows() {
    document.querySelectorAll('.number-input-wrapper').forEach(wrapper => {
        const input = wrapper.querySelector('input[type="number"]');
        const arrowUp = wrapper.querySelector('.arrow-up');
        const arrowDown = wrapper.querySelector('.arrow-down');
        
        if (input && arrowUp && arrowDown) {
            // Usuń istniejące event listenery, aby uniknąć duplikatów
            arrowUp.replaceWith(arrowUp.cloneNode(true));
            arrowDown.replaceWith(arrowDown.cloneNode(true));
            
            // Pobierz nowe referencje po replaceWith
            const newArrowUp = wrapper.querySelector('.arrow-up');
            const newArrowDown = wrapper.querySelector('.arrow-down');
            
            newArrowUp.addEventListener('click', () => {
                input.stepUp();
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
            
            newArrowDown.addEventListener('click', () => {
                input.stepDown();
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    });
}

// Uruchom po załadowaniu DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNumberArrows);
} else {
    setupNumberArrows();
}

// Uruchom ponownie po zmianach w DOM (dla React)
const observer = new MutationObserver((mutations) => {
    let shouldSetup = false;
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    if (node.classList && node.classList.contains('number-input-wrapper') ||
                        node.querySelector && node.querySelector('.number-input-wrapper')) {
                        shouldSetup = true;
                    }
                }
            });
        }
    });
    
    if (shouldSetup) {
        setTimeout(setupNumberArrows, 100);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Eksportuj funkcję dla ręcznego wywołania
window.setupNumberArrows = setupNumberArrows;

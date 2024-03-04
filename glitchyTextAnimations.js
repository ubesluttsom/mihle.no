// glitchyTextAnimations.js

// Generic function to animate text with a glitchy effect
function animateTextGlitch(
    element,
    originalText,
    {
        glitchSpeedRatio = 100,
        realTextSpeedRatio = 50,
        delayBeforeStart = 500,
        spaceLikelihood = 0.9,
        glitchRevealDelay = 50,
        realTextRevealDelay = 100,
        characters = '—~±§|[].+$^@*()•x%!?#🌹💐🌸🌺🌷🌻🌼🪷🪻'
    } = {}
) {
    const totalLength = originalText.length;
    const glitchRevealSpeed = Math.max(1, Math.ceil(totalLength / glitchSpeedRatio));
    const realTextRevealSpeed = Math.max(1, Math.ceil(totalLength / realTextSpeedRatio));
    const charactersArray = Array.from((characters === '') ? originalText : characters);
    element.textContent = originalText.replace(/[^\n]/g, '\xa0'); // Replace non-newline chars

    let glitchyText = Array.from({length: totalLength}, () =>
        Math.random() < spaceLikelihood ? '\xa0' :
        charactersArray[Math.floor(Math.random() * charactersArray.length)]
    ).join('');

    setTimeout(() => {
        function revealText(step) {
            let revealedText = '';
            for (let i = 0; i < totalLength; i++) {
                revealedText += i < step ? originalText[i] : glitchyText[i];
            }
            element.textContent = revealedText;

            if (step < totalLength) {
                setTimeout(() => revealText(step + glitchRevealSpeed), glitchRevealDelay);
            }
        }

        revealText(0); // Start the animation without the reverse logic
    }, delayBeforeStart);
}

// Function to apply the glitch animation to elements within a container
function animateTextGlitchyElement(element, settings) {
    const processNodes = (node) => {
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() !== '') {
                const originalText = child.nodeValue;
                child.nodeValue = ' '; // Temporary, to make the text invisible
                setTimeout(() => {
                    animateTextGlitch(child, originalText, settings); // Pass the settings directly
                }, settings.delayBeforeStart || 0); // Default to 0 if undefined
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                processNodes(child); // Recursively process child elements
            }
        });
    };

    // Hide initially if required
    if (settings.hideInitially) {
        element.style.visibility = 'hidden'; // Use visibility to avoid layout shifts
        setTimeout(() => {
            element.style.visibility = 'visible';
            processNodes(element);
        }, settings.delayBeforeStart || 0);
    } else {
        processNodes(element);
    }
}

// Function to apply animation settings to different elements based on their selectors
function applyAnimationWithSettings(settingsArray) {
    settingsArray.forEach(setting => {
        document.querySelectorAll(setting.selector).forEach((el, index) => {
            animateTextGlitchyElement(el, {
                ...setting,
                delayBeforeStart: (setting.initialDelay || 0) + (index * (setting.staggerDelay || 0)) // Compute delay for staggered starts
            });
        });
    });
}

// Export the functions so they can be used in other files
export { animateTextGlitch, animateTextGlitchyElement, applyAnimationWithSettings };

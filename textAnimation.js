/**
 * Animate text with a glitchy effect.
 * 
 * @param {HTMLElement} element - The element to apply the glitch effect to.
 * @param {string} originalText - The original text to display after the glitch effect.
 * @param {number} glitchSpeedRatio - Determines the speed of the glitch animation.
 * @param {number} realTextSpeedRatio - Determines the speed of revealing the real text.
 * @param {number} delayBeforeStart - Delay before the glitch animation starts.
 * @param {number} spaceLikelihood - Likelihood of a character being replaced by a space.
 * @param {number} glitchRevealDelay - Time between each glitch text reveal step.
 * @param {number} realTextRevealDelay - Time between each real text reveal step.
 */
function animateTextGlitchy(
    element, 
    originalText, 
    glitchSpeedRatio = 100, 
    realTextSpeedRatio = 50, 
    delayBeforeStart = 500, 
    spaceLikelihood = 0.1,
    glitchRevealDelay = 50,
    realTextRevealDelay = 100
) {
    const totalLength = originalText.length;
    const glitchRevealSpeed = Math.max(1, Math.ceil(totalLength / glitchSpeedRatio));
    const realTextRevealSpeed = Math.max(1, Math.ceil(totalLength / realTextSpeedRatio));
    // const charactersArray = Array.from('—~±§|[].+$^@*()•x%!?#');
    // const charactersArray = Array.from('🌹💐🌸🌺🌷🌻🌼🪷🪻');
    const charactersArray = Array.from('—~±§|[].+$^@*()•x%!?#🌹💐🌸🌺🌷🌻🌼🪷🪻');
    element.textContent = originalText.replace(/[^\n]/g, '\xa0'); // Replace non-newline chars

    // Initialize glitchy text
    let glitchyText = Array.from({length: totalLength}, () => 
        Math.random() < spaceLikelihood ? '\xa0' : 
        charactersArray[Math.floor(Math.random() * charactersArray.length)]
    ).join('');

    // Start animation after initial delay
    setTimeout(() => {
        // Function to reveal glitchy text progressively
        function revealGlitchyText(step) {
            let textToShow = glitchyText.substring(0, step).padEnd(totalLength, '\xa0');
            element.textContent = textToShow;

            // Continue or switch to revealing real text
            if (step < totalLength) {
                setTimeout(() => revealGlitchyText(step + glitchRevealSpeed), glitchRevealDelay);
            } else {
                setTimeout(() => revealText(0), delayBeforeStart); // Start revealing real text
            }
        }

        // Function to reveal original text progressively
        function revealText(step) {
            let revealedText = '';
            for (let i = 0; i < totalLength; i++) {
                revealedText += i < step ? originalText[i] : glitchyText[i];
            }
            element.textContent = revealedText;

            if (step < totalLength) {
                setTimeout(() => revealText(step + realTextRevealSpeed), realTextRevealDelay);
            }
        }

        revealGlitchyText(0);
    }, delayBeforeStart);
}

/**
 * Applies the glitch animation to elements within a container.
 * 
 * @param {HTMLElement} element - The root element containing text nodes to animate.
 * @param {number} glitchSpeedRatio - Determines the speed of the glitch animation.
 * @param {number} realTextSpeedRatio - Determines the speed of revealing the real text.
 * @param {number} delayBeforeStart - Delay before the glitch animation starts.
 * @param {number} spaceLikelihood - Likelihood of a character being replaced by a space.
 * @param {number} glitchRevealDelay - Time between each glitch text reveal step.
 * @param {number} realTextRevealDelay - Time between each real text reveal step.
 */
function animateTextGlitchyElement(
    element, 
    glitchSpeedRatio = 100, 
    realTextSpeedRatio = 50, 
    delayBeforeStart = 500, 
    spaceLikelihood = 0.1, 
    glitchRevealDelay = 50, 
    realTextRevealDelay = 100
) {
    const processNodes = (node) => {
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const originalText = child.nodeValue;
                child.nodeValue = originalText.replace(/[^\n]/g, '\xa0');
                setTimeout(() => {
                    if (child.parentNode) {
                        child.parentNode.classList.remove('hidden');
                    }
                    animateTextGlitchy(
                        child, 
                        originalText, 
                        glitchSpeedRatio, 
                        realTextSpeedRatio, 
                        delayBeforeStart, 
                        spaceLikelihood, 
                        glitchRevealDelay, 
                        realTextRevealDelay
                    );
                }, delayBeforeStart);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                processNodes(child); // Recurse into child elements
            }
        });
    };

    processNodes(element);
}

/**
 * Apply animation settings to different elements based on their selectors.
 */
function applyAnimationWithSettings() {
    const settings = [
        {
            selector: 'h1, h2, h3, h4, td',
            glitchSpeedRatio: 4000,
            realTextSpeedRatio: 2000,
            initialDelay: 300,
            spaceLikelihood: 0.05,
            staggerDelay: 100,
            glitchRevealDelay: 10,
            realTextRevealDelay: 10
        }, {
            selector: 'p',
            glitchSpeedRatio: 10,
            realTextSpeedRatio: 10,
            initialDelay: 100,
            spaceLikelihood: 0.8,
            staggerDelay: 100,
            glitchRevealDelay: 10,
            realTextRevealDelay: 1
        }
    ];

    settings.forEach(setting => {
        document.querySelectorAll(setting.selector).forEach((el, index) => {
            el.classList.add('hidden'); // Hide elements initially
            setTimeout(() => {
                animateTextGlitchyElement(
                    el, 
                    setting.glitchSpeedRatio, 
                    setting.realTextSpeedRatio, 
                    setting.initialDelay, 
                    setting.spaceLikelihood,
                    setting.glitchRevealDelay,
                    setting.realTextRevealDelay
                );
            }, index * setting.staggerDelay);
        });
    });
}

applyAnimationWithSettings();

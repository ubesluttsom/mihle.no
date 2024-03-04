import { applyAnimationWithSettings, animateTextGlitchyElement } from './glitchyTextAnimations.js';

document.addEventListener('DOMContentLoaded', () => {
    const settings = [
        {
            selector: 'h1, h2, h3, h4, td',
            glitchSpeedRatio: 400,
            realTextSpeedRatio: 200,
            initialDelay: 0,
            spaceLikelihood: 0.05,
            staggerDelay: 50,
            glitchRevealDelay: 50,
            realTextRevealDelay: 50
        }, {
            selector: 'p',
            glitchSpeedRatio: 30,
            realTextSpeedRatio: 30,
            initialDelay: 0,
            spaceLikelihood: 0.8,
            staggerDelay: 50,
            glitchRevealDelay: 1,
            realTextRevealDelay: 1
        }
    ];
    applyAnimationWithSettings(settings);
});

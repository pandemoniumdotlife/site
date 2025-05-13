document.addEventListener('DOMContentLoaded', function() {
    const eyesContainer = document.getElementById('eerie-eyes-container');
    const headerElement = document.getElementById('header'); 

    if (!eyesContainer) {
        console.error('Eerie eyes container not found!');
        return;
    }
    if (!headerElement) {
        console.warn('Header element for safe zone not found. Eyes might overlap.');
    }

    const numberOfEyes = 25; 
    const minSizeSmall = 15;  
    const maxSizeSmall = 35;  
    const minSizeMedium = 36; 
    const maxSizeMedium = 65; 
    const minSizeLarge = 66;  
    const maxSizeLarge = 90;  

    const minOpacity = 0.1;
    const maxOpacity = 0.45;
    const eyeAspectRatio = 2; 

    let headerRect = null;
    
    function updateHeaderRect() {
        if (headerElement) {
            headerRect = headerElement.getBoundingClientRect();
        }
    }
    // Initial call and on resize/orientation change
    updateHeaderRect(); 
    window.addEventListener('resize', updateHeaderRect);
    window.addEventListener('orientationchange', updateHeaderRect);


    function isOverlappingHeader(eyeXPercent, eyeYPercent, eyeWidthPx, eyeHeightPx) {
        if (!headerRect) return false;

        // Convert percentage top/left to pixels relative to viewport
        const eyeTopPx = (eyeYPercent / 100) * window.innerHeight;
        const eyeLeftPx = (eyeXPercent / 100) * window.innerWidth;

        const eyeRightPx = eyeLeftPx + eyeWidthPx;
        const eyeBottomPx = eyeTopPx + eyeHeightPx;

        // Add a small buffer around the header for a clearer safe zone
        const buffer = 10; // 10px buffer

        return (
            eyeLeftPx < (headerRect.right + buffer) &&
            eyeRightPx > (headerRect.left - buffer) &&
            eyeTopPx < (headerRect.bottom + buffer) &&
            eyeBottomPx > (headerRect.top - buffer)
        );
    }


    for (let i = 0; i < numberOfEyes; i++) {
        const eye = document.createElement('div');
        eye.classList.add('eerie-eye');

        let size, topPercent, leftPercent, eyeWidthPx, eyeHeightPx;
        let attempts = 0;
        const maxAttempts = 30; 

        do {
            const sizeCategoryRoll = Math.random();
            if (sizeCategoryRoll < 0.4) { 
                size = Math.random() * (maxSizeSmall - minSizeSmall) + minSizeSmall;
            } else if (sizeCategoryRoll < 0.8) { 
                size = Math.random() * (maxSizeMedium - minSizeMedium) + minSizeMedium;
            } else { 
                size = Math.random() * (maxSizeLarge - minSizeLarge) + minSizeLarge;
            }
            eyeWidthPx = size;
            eyeHeightPx = size / eyeAspectRatio;

            // Ensure eyes are not too close to the very edges initially
            topPercent = Math.random() * 88 + 6; // 6% to 94% 
            leftPercent = Math.random() * 88 + 6; // 6% to 94%
            attempts++;
            if (attempts > 5 && headerRect === null) { // If headerRect is still null after a few tries, update it.
                updateHeaderRect();
            }
        } while (headerElement && isOverlappingHeader(leftPercent, topPercent, eyeWidthPx, eyeHeightPx) && attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            // console.warn("Max attempts reached for placing an eye outside header. Placing it at bottom.");
            topPercent = Math.random() * 10 + 85; // Fallback: Place at bottom
            leftPercent = Math.random() * 90 + 5;
        }

        const opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
        const wiggleDuration = Math.random() * 10 + 10; 
        const wiggleDelay = Math.random() * -15;    

        const blinkAnimationDuration = Math.random() * 5 + 8; 
        const blinkInitialDelay = Math.random() * blinkAnimationDuration;

        eye.style.width = `${eyeWidthPx}px`;
        eye.style.height = `${eyeHeightPx}px`;
        eye.style.top = `${topPercent}%`;
        eye.style.left = `${leftPercent}%`;
        eye.style.opacity = opacity.toFixed(2); // Set opacity with 2 decimal places

        eye.style.animation = `
            wiggle ${wiggleDuration.toFixed(1)}s ${wiggleDelay.toFixed(1)}s infinite ease-in-out,
            blink ${blinkAnimationDuration.toFixed(1)}s ${blinkInitialDelay.toFixed(1)}s infinite ease-in-out
        `;

        eyesContainer.appendChild(eye);
    }
});
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
    updateHeaderRect(); 
    window.addEventListener('resize', updateHeaderRect);
    window.addEventListener('orientationchange', updateHeaderRect);


    function isOverlappingHeader(eyeXPercent, eyeYPercent, eyeWidthPx, eyeHeightPx) {
        if (!headerRect) return false;

        const eyeTopPx = (eyeYPercent / 100) * window.innerHeight;
        const eyeLeftPx = (eyeXPercent / 100) * window.innerWidth;

        const eyeRightPx = eyeLeftPx + eyeWidthPx;
        const eyeBottomPx = eyeTopPx + eyeHeightPx;

        const buffer = 10; 

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

            topPercent = Math.random() * 88 + 6;  
            leftPercent = Math.random() * 88 + 6; 
            attempts++;
            if (attempts > 5 && headerRect === null) { 
                updateHeaderRect();
            }
        } while (headerElement && isOverlappingHeader(leftPercent, topPercent, eyeWidthPx, eyeHeightPx) && attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            topPercent = Math.random() * 10 + 85; 
            leftPercent = Math.random() * 90 + 5;
        }

        const opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
        const wiggleDuration = Math.random() * 10 + 10; 
        const wiggleDelay = Math.random() * -15;    

        // --- THIS IS THE LINE TO CHANGE FOR BLINK FREQUENCY ---
        const blinkAnimationDuration = Math.random() * 4 + 4; // Total cycle time for blink (NOW 4-8s)
        // --- END OF CHANGE ---
        const blinkInitialDelay = Math.random() * blinkAnimationDuration;

        eye.style.width = `${eyeWidthPx}px`;
        eye.style.height = `${eyeHeightPx}px`;
        eye.style.top = `${topPercent}%`;
        eye.style.left = `${leftPercent}%`;
        eye.style.opacity = opacity.toFixed(2); 

        eye.style.animation = `
            wiggle ${wiggleDuration.toFixed(1)}s ${wiggleDelay.toFixed(1)}s infinite ease-in-out,
            blink ${blinkAnimationDuration.toFixed(1)}s ${blinkInitialDelay.toFixed(1)}s infinite ease-in-out
        `;

        eyesContainer.appendChild(eye);
    }
});
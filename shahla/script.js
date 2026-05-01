document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    
    const stage1 = document.getElementById('stage-1');
    const stage2 = document.getElementById('stage-2');
    const stage3 = document.getElementById('stage-3');
    const stage4 = document.getElementById('stage-4');
    const stage5 = document.getElementById('stage-5');
    
    const heartPath = document.querySelector('.heart-path');
    const drawingText = document.getElementById('drawing-text');
    const wishCard = document.querySelector('.wish-card');
    const surpriseBtn = document.getElementById('surprise-btn');

    // Initialize custom confetti on our specific canvas so it stays in the background
    const confettiCanvas = document.getElementById('confetti-canvas');
    const myConfetti = confetti.create(confettiCanvas, {
        resize: true,
        useWorker: true
    });

    startBtn.addEventListener('click', () => {
        // Transition from Stage 1 to Stage 2
        stage1.classList.remove('active');
        
        setTimeout(() => {
            stage1.classList.add('hidden');
            stage2.classList.remove('hidden');
            
            // Allow display block to render before triggering opacity transition
            setTimeout(() => {
                stage2.classList.add('active');
                
                // Start drawing animation
                setTimeout(() => {
                    heartPath.classList.add('draw');
                    drawingText.classList.remove('hidden');
                    
                    // After drawing finishes (approx 2.5s), transition to Wish Stage
                    setTimeout(() => {
                        transitionToWish();
                    }, 2500);
                }, 500); // slight delay before drawing starts
            }, 50);
        }, 800); // matches CSS transition duration
    });

    function transitionToWish() {
        stage2.classList.remove('active');
        
        setTimeout(() => {
            stage2.classList.add('hidden');
            stage3.classList.remove('hidden');
            stage4.classList.remove('hidden');
            
            setTimeout(() => {
                stage3.classList.add('active');
                stage4.classList.add('active');
                wishCard.classList.add('animate');
            }, 50);
        }, 800);
    }

    surpriseBtn.addEventListener('click', () => {
        // Transition from Wish Stage to Photo Stage
        stage3.classList.remove('active');
        stage4.classList.remove('active');
        
        setTimeout(() => {
            stage3.classList.add('hidden');
            stage4.classList.add('hidden');
            stage5.classList.remove('hidden');
            
            setTimeout(() => {
                stage5.classList.add('active');
                // Fire more confetti for the photo reveal!
                fireConfetti();
            }, 50);
        }, 800);
    });

    function fireConfetti() {
        const mixedColors = ['#FFB6C1', '#FF69B4', '#FF1493', '#FFFFFF', '#FFD700', '#00FF00', '#00BFFF', '#9400D3', '#FF4500'];

        // A massive, full-screen 360-degree blast from the center
        myConfetti({
            particleCount: 250,
            spread: 360,
            startVelocity: 50,
            origin: { y: 0.5, x: 0.5 },
            colors: mixedColors,
            zIndex: 0
        });
        
        // Add a secondary pop for extra effect
        setTimeout(() => {
            myConfetti({
                particleCount: 150,
                spread: 360,
                startVelocity: 40,
                origin: { y: 0.6, x: 0.5 },
                colors: mixedColors,
                zIndex: 0
            });
        }, 300);
    }
});

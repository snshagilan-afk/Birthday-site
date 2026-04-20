// Background Particles (Floating Hearts)
const particleContainer = document.getElementById('particles');
const heartSymbols = ['❤️', '💖', '💗', '💓', '💕', '✨', '🎂', '🎉'];

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('bg-heart');
    heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 25 + 10) + 'px';
    heart.style.animationDuration = (Math.random() * 6 + 6) + 's';
    
    particleContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 12000); // Cleanup after animation completes
}

// Spawn initial hearts
for(let i=0; i<15; i++) {
    setTimeout(createHeart, Math.random() * 3000);
}
setInterval(createHeart, 400);

// Love Quotes Section
const quotes = [
    "I love you more than words can express. You're my everything. 💖",
    "Your smile is my absolute favorite reason to be happy. 😊",
    "Every day with you feels like a gift, but today is extra special. 🎁",
    "I didn't know what true love was until I met you. 🌟",
    "You are my today and all of my beautiful tomorrows. 🌅",
    "I am so incredibly lucky to have you as my partner in crime. 🕵️‍♀️",
    "To the world you might be one person, but to me you are the whole world. 🌍",
    "I look at you and see the rest of my life right in front of my eyes. 🥂",
    "You're the peanut butter to my jelly, the cheese to my macaroni! 🧀",
    "Falling in love with you was the easiest thing I've ever done. 💞"
];

const quoteText = document.getElementById('quote-text');
const nextBtn = document.getElementById('next-quote');
let currentQuoteIndex = 0;

// Shuffle quotes array to make it random but without repeats until exhausted
let shuffledQuotes = [...quotes].sort(() => 0.5 - Math.random());

nextBtn.addEventListener('click', () => {
    // Fade out
    quoteText.style.opacity = '0';
    quoteText.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        currentQuoteIndex++;
        if (currentQuoteIndex >= shuffledQuotes.length) {
            shuffledQuotes = [...quotes].sort(() => 0.5 - Math.random());
            currentQuoteIndex = 0;
        }
        quoteText.innerText = `"${shuffledQuotes[currentQuoteIndex]}"`;
        
        // Fade in
        quoteText.style.opacity = '1';
        quoteText.style.transform = 'translateY(0)';
    }, 400);
});

// Initialize first quote
quoteText.innerText = `"${shuffledQuotes[0]}"`;

// Game 1: Catch My Heart
const startHeartBtn = document.getElementById('start-heart-game');
const heartArea = document.getElementById('heart-game-area');
const scoreDisplay = document.getElementById('heart-score');
const timeDisplay = document.getElementById('heart-time');
const resultMessage1 = document.getElementById('heart-result');

let score = 0;
let timeLeft = 10;
let timerInterval;

startHeartBtn.addEventListener('click', startGame1);

function startGame1() {
    score = 0;
    timeLeft = 10;
    scoreDisplay.innerText = score;
    timeDisplay.innerText = timeLeft;
    startHeartBtn.style.display = 'none';
    resultMessage1.classList.add('hidden');
    resultMessage1.classList.remove('popIn');
    
    // Clear area of old hearts
    document.querySelectorAll('.target-heart').forEach(h => h.remove());

    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.innerText = timeLeft;
        if (timeLeft <= 0) {
            endGame1();
        }
    }, 1000);

    spawnHeart();
}

function spawnHeart() {
    if (timeLeft <= 0) return;

    const heart = document.createElement('div');
    heart.classList.add('target-heart');
    // mostly hearts, sometimes a present
    const isPresent = Math.random() > 0.8;
    heart.innerText = isPresent ? '🎁' : heartSymbols[Math.floor(Math.random() * 5)]; 
    if (isPresent) heart.style.fontSize = '4.5rem';
    
    // Bounds checking based on container size
    const maxX = heartArea.clientWidth - 80;
    const maxY = heartArea.clientHeight - 80;
    
    // Keep away from top borders where stats are (top 50px reserved)
    heart.style.left = Math.max(10, Math.random() * maxX) + 'px';
    heart.style.top = Math.max(50, Math.random() * (maxY - 50) + 50) + 'px';
    
    heart.addEventListener('mousedown', () => {
        score += isPresent ? 3 : 1; // Presents are worth 3 points!
        scoreDisplay.innerText = score;
        heart.remove();
        
        // Visual pop effect
        createFloatingText(heart, isPresent ? '+3' : '+1', heart.style.left, heart.style.top);
        
        spawnHeart(); // Spawn next immediately
    });

    heartArea.appendChild(heart);

    // Heart disappears if too slow (adaptive difficulty)
    const disappearTime = Math.max(700, 1500 - (score * 50)); // gets faster!
    
    setTimeout(() => {
        if(heart.parentNode === heartArea) {
            heart.remove();
            if(timeLeft > 0) spawnHeart();
        }
    }, disappearTime); 
}

function endGame1() {
    clearInterval(timerInterval);
    document.querySelectorAll('.target-heart').forEach(h => h.remove());
    startHeartBtn.style.display = 'block';
    startHeartBtn.innerText = 'Play Again';
    
    resultMessage1.classList.remove('hidden');
    
    // Trigger reflow to restart animation
    void resultMessage1.offsetWidth;
    
    if (score < 8) {
        resultMessage1.innerHTML = `You scored ${score}! Hmm... I think your reflexes are distracted by my beauty! 😉`;
    } else if (score < 20) {
        resultMessage1.innerHTML = `You scored ${score}! Not bad! Lots of love coming your way! 💖`;
    } else {
        resultMessage1.innerHTML = `Wow! ${score} points! Your love-catching reflexes are over 9000! 😍🎉🎂`;
        // Winner confetti!
        for(let i=0; i<30; i++) setTimeout(createHeart, i*100);
    }
}

// Game 2: Love Meter
const spamBtn = document.getElementById('spam-btn');
const meterFill = document.getElementById('love-meter-fill');
const loveAmount = document.getElementById('love-amount');
const resultMessage2 = document.getElementById('meter-result');

let clicks = 0;
let meterValue = 0;
let displayValue = 0;
let drainInterval = null;
let milestoneHit = false;

// Start draining the meter slightly to make them work for it
drainInterval = setInterval(() => {
    if (meterValue > 0 && !milestoneHit) {
        // Decrease slightly
        meterValue -= 0.3;
        if(meterValue < 0) meterValue = 0;
        
        // Recalculate display value if we drop below certain thresholds
        if(displayValue > 0 && clicks > 0) {
            updateMeterUI();
        }
    }
}, 50);

spamBtn.addEventListener('mousedown', () => {
    spamBtn.style.transform = "scale(0.92) translateY(5px)";
});

spamBtn.addEventListener('mouseup', () => {
    spamBtn.style.transform = "scale(1) translateY(0)";
});

spamBtn.addEventListener('click', (e) => {
    if (milestoneHit) return; // Stop if they already won
    
    clicks++;
    
    // Value increases fast
    meterValue += 6; 
    
    // The number shown grows exponentially crazy
    displayValue = Math.floor(meterValue * (1 + (clicks/15))); 
    
    updateMeterUI();
    
    // Add floating number effect
    if(clicks % 2 === 0) {
        createFloatingTextAtMouse(e, `+${displayValue}%`);
    }

    // Checking milestones
    if (displayValue > 1000 && !milestoneHit) {
        milestoneHit = true;
        resultMessage2.classList.remove('hidden');
        resultMessage2.innerHTML = "SYSTEM ERROR! 🚨 Love overload! It's over 1000%! <br><br>Seriously, I love you SO much! Have the best birthday ever! 🎂🥳🍾";
        
        meterFill.style.width = '100%';
        loveAmount.innerText = "MAX%";
        loveAmount.style.color = '#ffeb3b';
        loveAmount.style.textShadow = '0 0 20px #ffeb3b, 0 0 40px #ffeb3b';
        
        spamBtn.innerText = "OVERLOADED!";
        spamBtn.style.opacity = '0.5';
        spamBtn.style.cursor = 'not-allowed';
        
        // TONS of confetti
        for(let i=0; i<60; i++) setTimeout(createHeart, i*50);
    }
});

function updateMeterUI() {
    if (milestoneHit) return;
    let fillWidth = Math.min(meterValue, 100); // Visual bar caps at 100%
    meterFill.style.width = fillWidth + '%';
    loveAmount.innerText = displayValue + '%';
    
    // Change color as it gets higher
    if (fillWidth > 80) {
        meterFill.style.boxShadow = "0 0 30px #fff";
    }
}

function createFloatingText(parent, text, left, top) {
    const floatWrap = document.createElement('div');
    floatWrap.innerText = text;
    floatWrap.style.position = 'absolute';
    floatWrap.style.left = left;
    floatWrap.style.top = top;
    floatWrap.style.color = '#fff';
    floatWrap.style.fontWeight = 'bold';
    floatWrap.style.fontSize = '2rem';
    floatWrap.style.textShadow = '0 2px 5px rgba(0,0,0,0.8), 0 0 10px #ff3366';
    floatWrap.style.pointerEvents = 'none';
    floatWrap.style.zIndex = '1000';
    floatWrap.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    parent.parentNode.appendChild(floatWrap);
    
    requestAnimationFrame(() => {
        floatWrap.style.transform = `translateY(-60px) scale(1.5)`;
        floatWrap.style.opacity = '0';
    });
    
    setTimeout(() => {
        floatWrap.remove();
    }, 800);
}

function createFloatingTextAtMouse(e, text) {
    const floatWrap = document.createElement('div');
    floatWrap.innerText = text;
    floatWrap.style.position = 'fixed';
    floatWrap.style.left = (e.clientX + (Math.random() * 40 - 20)) + 'px';
    floatWrap.style.top = e.clientY + 'px';
    floatWrap.style.color = '#ffd700';
    floatWrap.style.fontWeight = 'bold';
    floatWrap.style.fontSize = '1.8rem';
    floatWrap.style.textShadow = '0 2px 5px rgba(0,0,0,0.8), 0 0 15px #ff4d79';
    floatWrap.style.pointerEvents = 'none';
    floatWrap.style.zIndex = '1000';
    floatWrap.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    document.body.appendChild(floatWrap);
    
    requestAnimationFrame(() => {
        floatWrap.style.transform = `translateY(-100px) scale(1.5) rotate(${Math.random()*30-15}deg)`;
        floatWrap.style.opacity = '0';
    });
    
    setTimeout(() => {
        floatWrap.remove();
    }, 1000);
}

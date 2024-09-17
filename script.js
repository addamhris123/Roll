let redeemCodes = [];

// Load redeem codes from redeem.txt
fetch('redeem.txt')
    .then(response => response.text())
    .then(data => {
        redeemCodes = data.split('\n').map(code => code.trim()).filter(Boolean); // Split by line and remove empty lines
    })
    .catch(error => console.error('Error fetching redeem codes:', error));

function startRoll() {
    const rollButton = document.getElementById('roll-button');
    const resultMessage = document.getElementById('result-message');

    // Disable roll button during animation
    rollButton.disabled = true;
    rollButton.style.pointerEvents = 'none';

    // Rolling animation (text moving)
    resultMessage.innerHTML = "Rolling...";
    setTimeout(() => {
        let isLucky = Math.random() < 0.1; // 10% chance of luck

        if (isLucky && redeemCodes.length > 0) {
            // Pick a random redeem code
            let redeemCode = redeemCodes.pop(); // Remove the last code
            resultMessage.innerHTML = `LUCK! Your code: ${redeemCode}`;
            showConfetti();

            // Simulate copy to clipboard
            navigator.clipboard.writeText(redeemCode).then(() => {
                alert("Code copied to clipboard!");
            });

        } else {
            resultMessage.innerHTML = "NO LUCK. Try Again!";
        }

        // Re-enable roll button after 3 seconds
        setTimeout(() => {
            rollButton.disabled = false;
            rollButton.style.pointerEvents = 'auto';
        }, 3000);

        // Show ads every 2 rolls
        if (Math.random() < 0.5) {
            showAd();
        }

    }, 2000); // 2 seconds delay for the rolling effect
}

// Confetti animation
function showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    for (let i = 0; i < 200; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 10 + 5, // radius
            d: Math.random() * 4 + 1, // density
            color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
            tilt: Math.random() * 10,
            tiltAngle: Math.random() * Math.PI * 2
        });
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < confetti.length; i++) {
            const c = confetti[i];
            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
            ctx.stroke();
        }

        updateConfetti();
    }

    function updateConfetti() {
        for (let i = 0; i < confetti.length; i++) {
            const c = confetti[i];
            c.y += Math.cos(c.d) + 1 + c.r / 2;
            c.tiltAngle += c.d / 10;
            c.tilt = Math.sin(c.tiltAngle) * 15;

            if (c.y > canvas.height) {
                confetti[i] = { x: Math.random() * canvas.width, y: 0, r: c.r, d: c.d, color: c.color, tilt: c.tilt };
            }
        }
    }

    (function loop() {
        drawConfetti();
        requestAnimationFrame(loop);
    })();
}

// Display an ad
function showAd() {
    // Here you could implement an ad display logic or use an existing ad library
    alert("Ad goes here! (This is a placeholder)");
}

// Add event listener to roll button
document.getElementById('roll-button').addEventListener('click', startRoll);

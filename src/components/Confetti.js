export function createConfetti() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const confettiColors = ['#4A90E2', '#FFD700', '#FF6B6B', '#4ECB71', '#9C27B0'];
    const confetti = [];

    function createConfettiPiece() {
        return {
            x: Math.random() * canvas.width,
            y: -10,
            size: Math.random() * 10 + 5,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            speedY: Math.random() * 5 + 2,
            speedX: Math.random() * 4 - 2
        };
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = confetti.length - 1; i >= 0; i--) {
            const piece = confetti[i];
            ctx.fillStyle = piece.color;
            ctx.fillRect(piece.x, piece.y, piece.size, piece.size);

            piece.y += piece.speedY;
            piece.x += piece.speedX;

            if (piece.y > canvas.height) {
                confetti.splice(i, 1);
            }
        }

        if (confetti.length > 0) {
            requestAnimationFrame(drawConfetti);
        } else {
            document.body.removeChild(canvas);
        }
    }

    for (let i = 0; i < 200; i++) {
        confetti.push(createConfettiPiece());
    }

    drawConfetti();
}

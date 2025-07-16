document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const blackScreen = document.getElementById("blackScreen");
  const celebrationText = document.getElementById("celebrationText");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let celebrationActive = false;

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
    
    // Check if all candles are blown out and we have candles
    if (activeCandles === 0 && candles.length > 0 && !celebrationActive) {
      triggerCelebration();
    }
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
    
    // Hide celebration if it was active
    if (celebrationActive) {
      hideCelebration();
    }
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 40; //
  }

  function blowOutCandles() {
    let blownOut = 0;

    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");
          blownOut++;
        }
      });
    }

    if (blownOut > 0) {
      updateCandleCount();
    }
  }

  function createBalloons() {
    const balloonEmojis = ["🎈", "🎈", "🎈", "🎈", "🎈"];
    const colors = ["#FF69B4", "#FFD700", "#00CED1", "#9370DB", "#FF1493"];
    
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const balloon = document.createElement("div");
        balloon.className = "balloon";
        balloon.textContent = balloonEmojis[i % balloonEmojis.length];
        balloon.style.left = Math.random() * 80 + 10 + "%";
        balloon.style.color = colors[i % colors.length];
        balloon.style.animationDelay = Math.random() * 2 + "s";
        blackScreen.appendChild(balloon);
        
        setTimeout(() => {
          if (balloon.parentNode) {
            balloon.parentNode.removeChild(balloon);
          }
        }, 5000);
      }, i * 400);
    }
  }

  function createConfetti() {
    const colors = ["#FFD700", "#FF69B4", "#00CED1", "#9370DB", "#FF1493", "#FFA500"];
    
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + "s";
        confetti.style.animationDuration = (Math.random() * 2 + 4) + "s";
        blackScreen.appendChild(confetti);
        
        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }, 6000);
      }, i * 200);
    }
  }

  function triggerCelebration() {
    celebrationActive = true;
    
    // Show black screen
    blackScreen.classList.add("active");
    
    // Start the celebration text animation
    setTimeout(() => {
      celebrationText.style.animationPlayState = "running";
    }, 500);
    
    // Create balloons and confetti
    setTimeout(() => {
      createBalloons();
      createConfetti();
    }, 1000);
    
    // Hide celebration after 8 seconds
    setTimeout(() => {
      hideCelebration();
    }, 8000);
  }

  function hideCelebration() {
    celebrationActive = false;
    blackScreen.classList.remove("active");
    
    // Clear all celebration elements
    const celebrationElements = blackScreen.querySelectorAll(".balloon, .confetti");
    celebrationElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    
    // Reset text animation
    celebrationText.style.animationPlayState = "paused";
    celebrationText.style.animation = "none";
    setTimeout(() => {
      celebrationText.style.animation = "floatUp 4s ease-out forwards";
    }, 10);
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});

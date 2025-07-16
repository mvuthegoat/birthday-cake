document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const blackScreen = document.getElementById("blackScreen");
  const celebrationText = document.getElementById("celebrationText");
  const returnButton = document.getElementById("returnButton");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let celebrationActive = false;
  
  // Birthday music - put your music file in the same directory
  const birthdayMusic = new Audio("birthday-song.mp3");
  birthdayMusic.loop = false;
  birthdayMusic.volume = 0.7;
  
  // Photo filenames - add your photos to the same directory
  const photoFiles = [
    "photo1.jpg",
    "photo2.jpg", 
    "photo3.jpg",
    "photo4.jpg",
    "photo5.jpg",
    "photo6.jpg",
    "photo7.jpg",
    "photo8.jpg",
    "photo9.jpg",
    "photo10.jpg"
  ];

  // Return button functionality
  returnButton.addEventListener("click", function() {
    console.log("🔄 Return button clicked");
    hideCelebration();
  });

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
      }, i * 200);
    }
  }

  function createFloatingPhotos() {
    // Show all 8 photos gradually and naturally
    const photosToShow = Math.min(photoFiles.length, 8);
    
    for (let i = 0; i < photosToShow; i++) {
      setTimeout(() => {
        const photo = document.createElement("img");
        photo.className = "floating-photo";
        photo.src = photoFiles[i % photoFiles.length];
        
        // Position photos more naturally across the screen
        const leftPosition = 10 + (i % 3) * 30 + Math.random() * 20;
        photo.style.left = leftPosition + "%";
        
        // Add slight delay for natural appearance
        photo.style.animationDelay = (Math.random() * 1 + 0.5) + "s";
        
        // Handle successful image load
        photo.onload = function() {
          console.log("Photo loaded successfully:", this.src);
          this.style.opacity = "1";
        };
        
        // Handle image load errors gracefully
        photo.onerror = function() {
          console.log("Photo failed to load:", this.src);
          if (this.parentNode) {
            this.parentNode.removeChild(this);
          }
        };
        
        blackScreen.appendChild(photo);
      }, i * 1000); // Stagger photos every 1 second for smoother appearance
    }
  }

  function playBirthdayMusic() {
    birthdayMusic.currentTime = 0; // Reset to beginning
    birthdayMusic.play().catch(error => {
      console.log("Could not play birthday music:", error);
    });
  }

  function stopBirthdayMusic() {
    birthdayMusic.pause();
    birthdayMusic.currentTime = 0;
  }

  function showReturnButton() {
    setTimeout(() => {
      returnButton.classList.add("show");
      console.log("🔄 Return button shown");
    }, 5000); // Show return button after 5 seconds
  }

  function triggerCelebration() {
    celebrationActive = true;
    console.log("🎉 Celebration triggered! Starting in 0.8 seconds...");
    
    // Wait 0.8 seconds before showing the black screen
    setTimeout(() => {
      console.log("🖤 Black screen activated");
      // Show black screen
      blackScreen.classList.add("active");
      
      // Play birthday music
      playBirthdayMusic();
      console.log("🎵 Music started");
      
      // Start the celebration text animation
      setTimeout(() => {
        console.log("📝 Text animation started");
        celebrationText.style.animationPlayState = "running";
      }, 500);
      
      // Create balloons, confetti, and photos
      setTimeout(() => {
        console.log("🎈 Creating balloons...");
        createBalloons();
        console.log("🎊 Creating confetti...");
        createConfetti();
        console.log("📸 Creating floating photos...");
        createFloatingPhotos();
      }, 1000);
      
      // Show return button after some time
      showReturnButton();
      
      // NO AUTO-HIDE - celebration runs indefinitely until return button is clicked
    }, 800);
  }

  function hideCelebration() {
    console.log("🔄 Hiding celebration...");
    celebrationActive = false;
    blackScreen.classList.remove("active");
    returnButton.classList.remove("show");
    
    // Stop birthday music
    stopBirthdayMusic();
    console.log("🔇 Music stopped");
    
    // Clear all celebration elements
    const celebrationElements = blackScreen.querySelectorAll(".balloon, .confetti, .floating-photo");
    console.log("🧹 Cleaning up", celebrationElements.length, "celebration elements");
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
    
    console.log("✅ Celebration cleanup complete");
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

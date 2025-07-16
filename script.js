document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const blackScreen = document.getElementById("blackScreen");
  const celebrationText = document.getElementById("celebrationText");
  const celebrationText2 = document.getElementById("celebrationText2");
  const celebrationText3 = document.getElementById("celebrationText3");
  const returnButton = document.getElementById("returnButton");
  const ageInput = document.getElementById("ageInput");
  const submitAgeButton = document.getElementById("submitAge");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let celebrationActive = false;
  let photoLoopInterval;
  let balloonLoopInterval;
  let confettiLoopInterval;
  
  // Configuration
  const MUSIC_DELAY = 500; // Configurable music delay in milliseconds
  
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
  
  // Frame styles for diverse photo frames
  const frameStyles = [
    "frame-golden",
    "frame-silver", 
    "frame-zigzag",
    "frame-ornate",
    "frame-vintage",
    "frame-modern"
  ];

  // Create a shuffled copy of photos for better randomization
  let shuffledPhotos = [...photoFiles];
  let currentPhotoIndex = 0;
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  function getRandomPhoto() {
    // If we've gone through all photos, reshuffle
    if (currentPhotoIndex >= shuffledPhotos.length) {
      shuffledPhotos = shuffleArray([...photoFiles]);
      currentPhotoIndex = 0;
      console.log("📸 Photos reshuffled for better randomization");
    }
    
    const selectedPhoto = shuffledPhotos[currentPhotoIndex];
    currentPhotoIndex++;
    return selectedPhoto;
  }

  // Return button functionality
  returnButton.addEventListener("click", function() {
    console.log("🔄 Return button clicked");
    hideCelebration();
  });

  // Age input submission functionality
  submitAgeButton.addEventListener("click", function() {
    const age = parseInt(ageInput.value);
    if (age && age > 0 && age <= 30) {
      console.log("🕯️ Auto-placing", age, "candles");
      clearAllCandles();
      autoPlaceCandles(age);
      ageInput.value = ""; // Clear input after submission
    } else {
      alert("Vui lòng nhập số tuổi từ 1 đến 30!");
    }
  });

  // Allow Enter key to submit
  ageInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      submitAgeButton.click();
    }
  });

  function clearAllCandles() {
    // Remove all existing candles
    candles.forEach(candle => {
      if (candle.parentNode) {
        candle.parentNode.removeChild(candle);
      }
    });
    candles = [];
    updateCandleCount();
    console.log("🧹 All candles cleared");
  }

  function autoPlaceCandles(count) {
    // Get cake dimensions and position
    const cakeRect = cake.getBoundingClientRect();
    const cakeWidth = 375; // CSS width
    const cakeHeight = 300; // CSS height
    
    // Top layer boundaries (relative to cake container)
    const topLayerTop = 0; // Top layer starts at top of cake
    const topLayerHeight = 150; // Top layer is 150px high
    const topLayerLeft = 0;
    const topLayerRight = cakeWidth;
    
    // Calculate safe zone for candles (avoid edges)
    const safeMargin = 30;
    const safeLeft = safeMargin;
    const safeRight = cakeWidth - safeMargin;
    const safeTop = topLayerTop + safeMargin;
    const safeBottom = topLayerTop + topLayerHeight - safeMargin;
    
    // Place candles randomly in the safe zone
    for (let i = 0; i < count; i++) {
      const randomLeft = safeLeft + Math.random() * (safeRight - safeLeft);
      const randomTop = safeTop + Math.random() * (safeBottom - safeTop);
      
      // Add small delay to make placement look more natural
      setTimeout(() => {
        addCandle(randomLeft, randomTop);
      }, i * 100); // 100ms delay between each candle
    }
    
    console.log("🕯️ Auto-placed", count, "candles on top layer");
  }

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    
    // Only update display if element exists (it might be commented out)
    if (candleCountDisplay) {
      candleCountDisplay.textContent = activeCandles;
    }
    
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

  function createSingleBalloon() {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.textContent = "🎈";
    balloon.style.left = Math.random() * 90 + 5 + "%";
    
    // Add random size variation
    const sizes = ["small", "", "big", "super-big"]; // "" is default size
    const sizeWeights = [0.3, 0.4, 0.2, 0.1]; // 30% small, 40% normal, 20% big, 10% super-big
    let randomSize = Math.random();
    let selectedSize = "";
    
    if (randomSize < 0.3) {
      selectedSize = "small";
    } else if (randomSize < 0.7) {
      selectedSize = ""; // normal size
    } else if (randomSize < 0.9) {
      selectedSize = "big";
    } else {
      selectedSize = "super-big";
    }
    
    if (selectedSize) {
      balloon.classList.add(selectedSize);
    }
    
    const colors = ["#FF69B4", "#FFD700", "#00CED1", "#9370DB", "#FF1493"];
    balloon.style.color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.animationDelay = Math.random() * 2 + "s";
    
    blackScreen.appendChild(balloon);
    
    // Remove balloon after animation completes
    setTimeout(() => {
      if (balloon.parentNode) {
        balloon.parentNode.removeChild(balloon);
      }
    }, 5000);
  }

  function createSingleConfetti() {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "%";
    
    const colors = ["#FFD700", "#FF69B4", "#00CED1", "#9370DB", "#FF1493", "#FFA500"];
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 2 + "s";
    
    blackScreen.appendChild(confetti);
    
    // Remove confetti after animation completes
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 6000);
  }

  function startContinuousBalloons() {
    // Create initial balloons
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        createSingleBalloon();
      }, i * 800);
    }
    
    // Then create balloons continuously every 1.5 seconds
    balloonLoopInterval = setInterval(() => {
      createSingleBalloon();
    }, 1500);
    
    console.log("🎈 Continuous balloon loop started");
  }

  function startContinuousConfetti() {
    // Create initial confetti
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createSingleConfetti();
      }, i * 300);
    }
    
    // Then create confetti continuously every 1 second
    confettiLoopInterval = setInterval(() => {
      createSingleConfetti();
    }, 1000);
    
    console.log("🎊 Continuous confetti loop started");
  }

  function stopContinuousBalloons() {
    if (balloonLoopInterval) {
      clearInterval(balloonLoopInterval);
      balloonLoopInterval = null;
      console.log("🎈 Continuous balloon loop stopped");
    }
  }

  function stopContinuousConfetti() {
    if (confettiLoopInterval) {
      clearInterval(confettiLoopInterval);
      confettiLoopInterval = null;
      console.log("🎊 Continuous confetti loop stopped");
    }
  }

  function createSingleFloatingPhoto() {
    const photo = document.createElement("img");
    photo.className = "floating-photo";
    
    // Add random frame style
    const randomFrameStyle = frameStyles[Math.floor(Math.random() * frameStyles.length)];
    photo.classList.add(randomFrameStyle);
    
    // Use shuffled random photo selection for better variety
    photo.src = getRandomPhoto();
    
    // Position photos naturally across the screen
    const leftPosition = 5 + Math.random() * 80;
    photo.style.left = leftPosition + "%";
    
    // Add slight delay for natural appearance
    photo.style.animationDelay = Math.random() * 2 + "s";
    
    // Handle successful image load
    photo.onload = function() {
      console.log("Photo loaded successfully:", this.src, "with frame:", randomFrameStyle);
    };
    
    // Handle image load errors gracefully
    photo.onerror = function() {
      console.log("Photo failed to load:", this.src);
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
    
    blackScreen.appendChild(photo);
    
    // Remove photo after animation completes
    setTimeout(() => {
      if (photo.parentNode) {
        photo.parentNode.removeChild(photo);
      }
    }, 8000);
  }

  function startContinuousPhotos() {
    // Create initial photos
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        createSingleFloatingPhoto();
      }, i * 1000);
    }
    
    // Then create photos continuously every 2 seconds
    photoLoopInterval = setInterval(() => {
      createSingleFloatingPhoto();
    }, 2000);
    
    console.log("📸 Continuous photo loop started");
  }

  function stopContinuousPhotos() {
    if (photoLoopInterval) {
      clearInterval(photoLoopInterval);
      photoLoopInterval = null;
      console.log("📸 Continuous photo loop stopped");
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

  function showSequentialMessages() {
    // First message: "Happy Birthday Nhím!"
    setTimeout(() => {
      celebrationText.style.animationPlayState = "running";
      console.log("📝 First message: Happy Birthday Nhím!");
    }, 500);
    
    // Second message: "Chúc mừng Nhím đã 20 tuổi!!"
    setTimeout(() => {
      celebrationText2.style.animationPlayState = "running";
      console.log("📝 Second message: Chúc mừng Nhím đã 20 tuổi!!");
    }, 2500);
    
    // Third message: "I love youuu <33"
    setTimeout(() => {
      celebrationText3.style.animationPlayState = "running";
      console.log("📝 Third message: I love youuu <33");
    }, 4500);
  }

  function showReturnButton() {
    setTimeout(() => {
      returnButton.classList.add("show");
      console.log("🔄 Return button shown");
    }, 2000); // Show return button after 2 seconds (quick access)
  }

  function triggerCelebration() {
    celebrationActive = true;
    console.log("🎉 Celebration triggered! Starting in 0.8 seconds...");
    
    // Wait 0.8 seconds before showing the black screen
    setTimeout(() => {
      console.log("🖤 Black screen activated");
      // Show black screen
      blackScreen.classList.add("active");
      
      // Play birthday music after configurable delay
      setTimeout(() => {
        playBirthdayMusic();
        console.log("🎵 Music started");
      }, MUSIC_DELAY);
      
      // Show sequential messages
      showSequentialMessages();
      
      // Start continuous balloons and confetti
      setTimeout(() => {
        console.log("🎈 Starting continuous balloons...");
        startContinuousBalloons();
        console.log("🎊 Starting continuous confetti...");
        startContinuousConfetti();
      }, 1000);
      
      // Start continuous photos
      setTimeout(() => {
        console.log("📸 Starting continuous floating photos...");
        startContinuousPhotos();
      }, 2000);
      
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
    
    // Stop all continuous elements
    stopContinuousPhotos();
    stopContinuousBalloons();
    stopContinuousConfetti();
    
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
    
    // Reset all text animations
    celebrationText.style.animationPlayState = "paused";
    celebrationText.style.animation = "none";
    celebrationText2.style.animationPlayState = "paused";
    celebrationText2.style.animation = "none";
    celebrationText3.style.animationPlayState = "paused";
    celebrationText3.style.animation = "none";
    
    setTimeout(() => {
      celebrationText.style.animation = "floatUp 4s ease-out forwards";
      celebrationText2.style.animation = "floatUp 4s ease-out forwards";
      celebrationText3.style.animation = "floatUp 4s ease-out forwards";
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

let sound;
let fft;
let pitchSlider;
let volumeSlider;
let shapeSlider;
let playButton;
let isPlaying = false;
let recButton;
let stopButton;
let mediaRecorder;
let chunks = [];
let bgImages = [];  // 배경 이미지 배열
let currentBgIndex = 0;  // 현재 배경 이미지의 인덱스
let classicSound, rockSound, jazzSound, rnbSound;
let audioContext = getAudioContext();
audioContext.resume();

function preload() {
    // 이미지를 로드
    for (let i = 1; i <= 35; i++) {
        bgImages.push(loadImage('image' + i + '.png'));
    }

    classicSound = loadSound('classic.mp3');
    rockSound = loadSound('rock.mp3');
    jazzSound = loadSound('jazz.mp3');
    rnbSound = loadSound('rnb.mp3');
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    fft = new p5.FFT();

    let audioContext = getAudioContext();
    audioContext.resume();

    // Create and style the Play Button
    playButton = createButton('PLAY MUSIC');
    playButton.position(35, 35);
    playButton.mousePressed(togglePlay);
    styleButton(playButton); // Apply the CSS styles

    // Create and position other UI elements
    pitchSlider = createSlider(0.2, 1.8, 1.0, 0.01);
    pitchSlider.position(35, 75);

    volumeSlider = createSlider(0.01, 1, 0.5, 0.01);
    volumeSlider.position(35, 105);

    shapeSlider = createSlider(0, 3, 0, 1);
    shapeSlider.position(35, 135);

    textAlign(LEFT, CENTER);
    textSize(15);
    fill(255, 255, 255);

    // Create, position, and style the Record Button
    recButton = createButton('RECORDING');
    recButton.position(35, 165);
    recButton.mousePressed(startRecording);
    styleButton(recButton);  // Apply the CSS styles

    // Create, position, and style the Stop Button
    stopButton = createButton('SAVE');
    stopButton.position(160, 165);
    stopButton.mousePressed(stopRecording);
    styleButton(stopButton);  // Apply the CSS styles

    // Background image changing logic
    setInterval(changeBackground, 1000);

    // Create, position, and style the Classic Button
    let classicButton = createButton('CLASSIC');
    classicButton.position(35, 225);
    classicButton.mousePressed(() => playGenre(classicSound));
    styleButton(classicButton);  // Apply the CSS styles

    // ... Repeat for other genre buttons and apply styles
    let rockButton = createButton('ROCK');
    rockButton.position(135, 225);
    rockButton.mousePressed(() => playGenre(rockSound));
    styleButton(rockButton);

    let jazzButton = createButton('JAZZ');
    jazzButton.position(220, 225);
    jazzButton.mousePressed(() => playGenre(jazzSound));
    styleButton(jazzButton);

    let rnbButton = createButton('R&B');
    rnbButton.position(300, 225);
    rnbButton.mousePressed(() => playGenre(rnbSound));
    styleButton(rnbButton);
}

function styleButton(btn) {
    // 하얀 배경을 설정
    btn.style('background-color', '#ffffff');
    // 그라디언트 효과를 배경 이미지로 추가
    btn.style('background-image', 'linear-gradient(to bottom, rgba(38, 38, 38, 0.5), #e6e6e6 25%, #ffffff 38%, #c5c5c5 63%, #f7f7f7 87%, rgba(38, 38, 38, 0.5))');
    btn.style('background-image', '-webkit-linear-gradient(top, rgba(38, 38, 38, 0.5), #e6e6e6 25%, #ffffff 38%, rgba(0, 0, 0, 0.25) 63%, #e6e6e6 87%, rgba(38, 38, 38, 0.4))');
    // 나머지 스타일 설정
    btn.style('font-family', 'Archivo, sans-serif');
    btn.style('font-size', '15px');
    btn.style('color', '#000000');
    btn.style('border-color', '#7c7c7c');
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    // Adjust the image to keep its aspect ratio and fill the canvas.
    let img = bgImages[currentBgIndex];
    let imgAspect = img.width / img.height;
    let canvasAspect = width / height;

    let newWidth, newHeight;

    if (imgAspect > canvasAspect) {
        // The image is wider than the canvas.
        newWidth = width;
        newHeight = width / imgAspect;
    } else {
        // The image is taller than the canvas.
        newHeight = height;
        newWidth = height * imgAspect;
    }

    let xOffset = (width - newWidth) / 2;
    let yOffset = (height - newHeight) / 2;

    image(img, xOffset, yOffset, newWidth, newHeight);

    let spectrum = fft.analyze();

    push();  // Save the current graphics state.
    translate(width / 2, height / 2);

    let pitchValue = pitchSlider.value();
    let volumeValue = volumeSlider.value();
    let shapeValue = shapeSlider.value();

    for (let i = 0; i < spectrum.length / 1; i++) {
        let amplitude = spectrum[i];
        let angle = random(TWO_PI);

        let distance = map(amplitude, 0, 300, 300, 300); 
        let outerDistance = distance + 50;  

        let x = cos(angle) * distance;
        let y = sin(angle) * distance;

        let outerX = cos(angle) * outerDistance;
        let outerY = sin(angle) * outerDistance;

        let shapeSize = map(amplitude, 0, 200, 0, 60);  

        drawShape(x, y, shapeSize, shapeValue);  
        drawShape(outerX, outerY, shapeSize, shapeValue);  
    }

    textFont('Archivo'); // Set the font.
    fill(150, 150, 150);
    textAlign(LEFT, CENTER);
    textSize(15);

    fill(150, 150, 150);
    text('Pitch: ' + pitchValue.toFixed(2), -790, -401);
    text('Volume: ' + volumeValue.toFixed(2), -790, -373);
    let shapeName = ['Circle', 'Square', 'Hexagon', 'Diamond'];
    text('Shape: ' + shapeName[shapeValue], -790, -343);
    
    pop();  // Restore the previous graphics state.
}

function playGenre(genreSound) {
    if (sound && sound.isPlaying()) {  
        sound.stop();
    }

    sound = genreSound;  
    sound.loop();  
    isPlaying = true;
    playButton.html('Pause');  
}
function drawShape(x, y, size, shapeValue) {
    noStroke();


    if (shapeValue === 0) {
        fill(25, 110, 255);
        ellipse(x, y, size, size);
    } else if (shapeValue === 1) {
        fill(255, 86, 255);
        rectMode(CENTER);
        rect(x, y, size, size);
    } else if (shapeValue === 2) {
        fill(134, 65, 255);
        drawHexagon(x, y, size);
    } else if (shapeValue === 3) {
        fill(0, 240, 255);
        drawDiamond(x, y, size);
    }
}


function drawHexagon(x, y, size) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let vertexX = x + cos(angle) * size;
    let vertexY = y + sin(angle) * size;
    vertex(vertexX, vertexY);
  }
  endShape(CLOSE);
}

function drawDiamond(x, y, size) {
  beginShape();
  vertex(x, y - size);
  vertex(x + size, y);
  vertex(x, y + size);
  vertex(x - size, y);
  endShape(CLOSE);
}

function togglePlay() {
    if (sound) {  
        if (isPlaying) {
            sound.pause();
            playButton.html('Play');
        } else {
            sound.loop();
            playButton.html('Pause');
        }
        isPlaying = !isPlaying;
    }
}
  
  function mousePressed() {

    sound.rate(pitchSlider.value());
    sound.setVolume(volumeSlider.value());
  }
  
  function startRecording() {
    
    navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(videoStream => {
            
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(audioStream => {
                    
                    let tracks = [...videoStream.getTracks(), ...audioStream.getTracks()];
                    let combinedStream = new MediaStream(tracks);

                    mediaRecorder = new MediaRecorder(combinedStream);
                    mediaRecorder.ondataavailable = event => {
                        chunks.push(event.data);
                    };
                    mediaRecorder.onstop = saveRecording;
                    mediaRecorder.start();

                    recButton.attribute('disabled', 'true');
                })
                .catch(err => {
                    console.error("Error capturing audio:", err);
                });
        })
        .catch(err => {
            console.error("Error capturing video:", err);
        });
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        recButton.removeAttribute('disabled');
    }
}

function saveRecording() {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = createA(url, 'Download Recording', '_blank');
    a.elt.download = 'recording.webm';
    a.elt.click();
    chunks = [];
}

function changeBackground() {
    currentBgIndex = (currentBgIndex + 1) % bgImages.length;
}


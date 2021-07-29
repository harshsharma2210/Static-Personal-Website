$(document).ready(function () {
  function hidePreloader() {
    $(".spinner-wrapper").fadeOut(1000);
  }
  hidePreloader();
});

$(".port-item").click(function () {
  $(".collapse").collapse("hide");
});

$(document).on("click", '[data-toggle="lightbox"]', function (e) {
  e.preventDefault();
  $(this).ekkoLightbox();
});
var MAX_PARTICLES = 1000,
  RADIUS = 100,
  MAX_LINES = 5,
  MAX_LIFE_SPAN = 600,
  MIN_DENSITY = 15,
  OFFSET_DENSITY = 15,
  _context,
  _mouseX,
  _mouseY,
  _particles,
  _canvasWidth,
  _canvasHalfWidth,
  _canvasHeight,
  _canvasHalfHeight;

init();

function init() {
  _particles = [];
  _context = c.getContext("2d");

  window.addEventListener("resize", onResize);
  window.addEventListener("mousemove", onMouseMove);

  onResize();

  createInitialParticles();

  redraw();
}

function createInitialParticles() {
  var x;

  for (x = 50; x < _canvasWidth - 50; x += 25) {
    _particles.push(
      new Particle(x - _canvasHalfWidth, -75 + Math.random() * 100)
    );
  }
}

function onMouseMove(e) {
  _mouseX = e.pageX;
  _mouseY = e.pageY;
}

function onResize() {
  _canvasWidth = c.offsetWidth;
  _canvasHalfWidth = Math.round(_canvasWidth / 2);
  (_canvasHeight = c.offsetHeight),
    (_canvasHalfHeight = Math.round(_canvasHeight / 2));

  c.width = _canvasWidth;
  c.height = _canvasHeight;
}

function redraw() {
  var copyParticles = _particles.slice(),
    particle,
    i;

  if (_particles.length < MAX_PARTICLES && _mouseX && _mouseY) {
    particle = new Particle(
      _mouseX - _canvasHalfWidth,
      _mouseY - _canvasHalfHeight
    );

    _particles.push(particle);
    _mouseX = false;
    _mouseY = false;
  }

  _context.clearRect(0, 0, _canvasWidth, _canvasHeight);

  for (i = 0; i < copyParticles.length; i++) {
    particle = copyParticles[i];
    particle.update();
  }

  drawLines();

  requestAnimationFrame(redraw);
}

function drawLines() {
  var particleA, particleB, distance, opacity, lines, i, j;

  _context.beginPath();

  for (i = 0; i < _particles.length; i++) {
    lines = 0;
    particleA = _particles[i];

    for (j = i + 1; j < _particles.length; j++) {
      particleB = _particles[j];
      distance = getDistance(particleA, particleB);

      if (distance < RADIUS) {
        lines++;

        if (lines <= MAX_LINES) {
          opacity =
            0.5 *
            Math.min(
              1 - distance / RADIUS,
              particleA.getOpacity(),
              particleB.getOpacity()
            );
          _context.beginPath();
          _context.moveTo(
            particleA.getX() + _canvasHalfWidth,
            particleA.getY() + _canvasHalfHeight
          );
          _context.lineTo(
            particleB.getX() + _canvasHalfWidth,
            particleB.getY() + _canvasHalfHeight
          );
          _context.strokeStyle = "rgba(255,255,255," + opacity + ")";
          _context.stroke();
        }
      }
    }
  }
}

function Particle(originX, originY) {
  var _this = this,
    _direction = -1 + Math.round(Math.random()) * 2,
    _angle = Math.random() * 10,
    _posX = originX,
    _posY = originY,
    _density = MIN_DENSITY + Math.random() * OFFSET_DENSITY,
    _lifeSpan = 0,
    _opacity = 1;

  function update() {
    _lifeSpan++;

    if (_lifeSpan % 3 === 0) {
      _opacity = 1 - _lifeSpan / MAX_LIFE_SPAN;

      _angle += 0.001 * _direction;
      _posY += (Math.cos(_angle + _density) + 1) * 0.75;
      _posX += Math.sin(_angle) * 0.75;

      if (_lifeSpan >= MAX_LIFE_SPAN) {
        destroy();
      }
    }
  }

  function destroy() {
    var particle, i;

    for (i = 0; i < _particles.length; i++) {
      particle = _particles[i];

      if (particle === _this) {
        _particles.splice(i, 1);
      }
    }
  }

  this.getOpacity = function () {
    return _opacity;
  };
  this.getX = function () {
    return _posX;
  };
  this.getY = function () {
    return _posY;
  };

  this.update = update;
}

function getDistance(particle1, particle2) {
  var deltaX = particle1.getX() - particle2.getX(),
    deltaY = particle1.getY() - particle2.getY();

  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

// TYPING

//speed at which text appears and disappears
const TEXT_UPDATING_SPEED = 55;

//duration of type cursor blink animation
const BLINK_ANIM_DURATION = 500;

//text array to show & loop through
const textArr = [
  "Hi! I am Harsh Sharma. 👋",
  "I am a Third Year Computer Science Engineering Student. 🎓",
  "I am a Full Stack Web Developer. 💻",
  "I am a Freelancer. 🏢",
  "I like Competitive Coding. ⌨️ ",
  "Fun fact: I like investing in Stocks! 📈",
];

//index of the current text of the textArr that is being animated
let currentTextIndex = -1;

const myText = document.querySelector(".text");
const typeCursor = document.querySelector(".cursor");

//add letter with recursion
const addLetter = (letterIndex) => {
  //if reached the end of the text stop adding letters and animate cursor blink
  if (letterIndex >= textArr[currentTextIndex].length) {
    blinkTypeCursor();
    return;
  }
  setTimeout(() => {
    //logic behind adding text
    myText.textContent += textArr[currentTextIndex][letterIndex];
    //recursion: call addLetter to add the next letter in the text
    addLetter(letterIndex + 1);
  }, TEXT_UPDATING_SPEED);
};

//remove letter with recursion
const removeLetter = (letterIndex) => {
  //if removed all stop removing letters and call updateText to start animating the next text
  if (letterIndex < 0) {
    updateText();
    return;
  }
  setTimeout(() => {
    //logic behind removing text with slice
    myText.textContent = textArr[currentTextIndex].slice(0, letterIndex);
    //recursion: call removeLetter to remove the previous letter in the text
    removeLetter(letterIndex - 1);
  }, TEXT_UPDATING_SPEED);
};

//blink the cursor when not updating text
const blinkTypeCursor = () => {
  //add blink by adding blink animation class from css
  typeCursor.classList.add("blinkAnim");
  setTimeout(() => {
    //stop blinking by removing blink class
    typeCursor.classList.remove("blinkAnim");
    // call removeLetter to start removing letter
    removeLetter(textArr[currentTextIndex].length);
  }, BLINK_ANIM_DURATION);
};

const updateText = () => {
  //change current text index to switch to next text
  currentTextIndex++;
  //loop back if reached the end
  if (currentTextIndex === textArr.length) {
    currentTextIndex = 0;
  }
  //call addLetter
  addLetter(0);
};

//initial text update after 1 seconds
setTimeout(() => updateText(), 1000);

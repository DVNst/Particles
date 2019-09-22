(function() {
  var canvasBody = document.getElementById('canvas'),
      canvas = canvasBody.getContext('2d'),

      w = canvasBody.width = window.innerWidth,
      h = canvasBody.height = window.innerHeight,

      opts = {
        particleAmount: 25,

        backgroundColor: '#222222',
        particleColor: '#fcfcfc',

        defaultRadius: 2,
        addedRadius: 2,

        defaultSpeed: 1,
        addedSpeed: 2,

        lineWidth: 0.5,
        lineColor: 'rgba(255, 255, 255, opacity)',

        communicationRadius: 170
      },

      particles = [],

      Particle = function(Xpos, Ypos) {
        this.x = Xpos ? Xpos : Math.random() * w;
        this.y = Ypos ? Ypos : Math.random() * h;

        this.speed = opts.defaultSpeed + Math.random() * opts.addedSpeed;
        this.directionAngle = Math.floor(Math.random() * 360);
        this.color = opts.particleColor;
        this.radius = opts.defaultRadius + Math.random() * opts.addedRadius;
        this.direction = {
          x: Math.cos(this.directionAngle) * this.speed,
          y: Math.sin(this.directionAngle) * this.speed
        };

        this.update = function() {
          this.border();
          this.x += this.direction.x;
          this.y += this.direction.y;
        };

        this.border = function() {
          if (this.x + this.radius>= w || this.x - this.radius<= 0) {
            this.direction.x *= -1;
          }

          if (this.y + this.radius>= h || this.y - this.radius<= 0) {
            this.direction.y *= -1;
          }

          this.x + this.radius > w ? this.x = w - this.radius: this.x;
          this.x - this.radius < 0 ? this.x = 0 + this.radius : this.x;
          this.y + this.radius > h ? this.y = h - this.radius : this.y;
          this.y - this.radius < 0 ? this.y = 0 + this.radius: this.y;
        };

        this.draw = function() {
          canvas.beginPath();
          canvas.arc(this.x, this.y, this.radius, 0, Math.PI*2);
          canvas.closePath();
          canvas.fillStyle = this.color;
          canvas.fill();
        };
      },

      checkDistance = function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      },

      communicationPoints = function(point, points) {
        for (var i = 0; i < points.length; i++) {
          var distance = checkDistance(point.x, point.y, points[i].x, points[i].y);
          var opacity = 1 - distance/opts.communicationRadius;
          if (opacity > 0) {
            canvas.lineWidth = opts.lineWidth;
            canvas.strokeStyle = opts.lineColor.replace('opacity', opacity);
            canvas.beginPath();
            canvas.moveTo(point.x, point.y);
            canvas.lineTo(points[i].x, points[i].y);
            canvas.closePath();
            canvas.stroke();
          }
        }
      }

  function setup() {
    for (var i = 0; i < opts.particleAmount; i++) {
      particles.push( new Particle() );
    }
    
    window.requestAnimationFrame(loop);
  };

  function loop() {
    canvas.fillStyle = opts.backgroundColor;
    canvas.fillRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
    }

    for (var i = 0; i < particles.length; i++) {
      communicationPoints(particles[i], particles);
    }

    window.requestAnimationFrame(loop);
  }

  setup();

  canvasBody.addEventListener('click', function(e) {
    particles.push( new Particle(e.pageX, e.pageY) );
  });

  canvasBody.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    particles.splice(particles.length - 1, 1);
  });
})();
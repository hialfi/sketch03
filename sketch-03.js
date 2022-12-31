const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({context, width, height}) => {
  const agents = [];

  for (let i = 0; i < 20; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const distance = agent.pos.getDistance(other.pos);

        if (distance > 250) continue;

        context.lineWidth = math.mapRange(distance, 0, 100, 6, 2);

        context.strokeStyle = 'white';
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }

    agents.forEach(agent => {
      agent.draw(context);
      agent.update(context);
      agent.bounce(context);
    });
  };
};

canvasSketch(sketch, settings);

//Classes
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx*dx + dy*dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(5, 20);
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  bounce() {
    if (this.pos.x <= 0 || this.pos.x >= 1080) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= 1080) this.vel.y *= -1;
  }

  draw(context) {
    context.fillStyle = 'white';

    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2);
    context.fill();
  }
}
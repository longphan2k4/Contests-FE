export class Firework {
  x: number;
  y: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  type: number;
  distanceToTarget: number;
  distanceTraveled: number;
  coordinates: [number, number][];
  coordinateCount: number;
  angle: number;
  speed: number;
  acceleration: number;
  brightness: number;
  targetRadius: number;

  constructor(sx: number, sy: number, tx: number, ty: number, type: number) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.type = type;
    this.distanceToTarget = this.calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = this.random(50, 70);
    this.targetRadius = 1;
  }

  update(index: number, createParticles: (x: number, y: number, type: number) => void, fireworks: Firework[]) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    if (this.targetRadius < 8) {
      this.targetRadius += 0.3;
    } else {
      this.targetRadius = 1;
    }
    this.speed *= this.acceleration;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = this.calculateDistance(
      this.sx,
      this.sy,
      this.x + vx,
      this.y + vy
    );
    if (this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.tx, this.ty, this.type);
      fireworks.splice(index, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  draw(ctx: CanvasRenderingContext2D, hue: number) {
    ctx.beginPath();
    ctx.moveTo(
      this.coordinates[this.coordinates.length - 1][0],
      this.coordinates[this.coordinates.length - 1][1]
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  private calculateDistance(p1x: number, p1y: number, p2x: number, p2y: number): number {
    const xDistance = p1x - p2x;
    const yDistance = p1y - p2y;
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
  }

  private random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
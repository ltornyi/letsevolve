export class Graphics {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private maxX: number;
  private maxY: number;

  constructor(canvas: HTMLCanvasElement, maxX: number, maxY: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.maxX = maxX;
    this.maxY = maxY;
  }

  getCursorPosition(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: Math.abs(event.clientX - rect.left),
      y: Math.abs(event.clientY - rect.top),
    }
  }

  calcWorldXY(x: number, y: number) {
    return {
      x: x / this.canvas.width * this.maxX,
      y: y / this.canvas.height * this.maxY,
    }
  }

  calcXY(x: number, y: number) {
    return {
      x: x / this.maxX * this.canvas.width,
      y: y / this.maxY * this.canvas.height
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  rawDot(x: number, y: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 2, 2);
  }

  dot(x: number, y: number, color: string) {
    const xy = this.calcXY(x, y);
    this.rawDot(xy.x, xy.y, color);
  }

  rawCircle(x: number, y: number, r: number, color: string, stroke: string) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2*Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    if (stroke) {
      this.ctx.strokeStyle = stroke;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  }

  circle(x: number, y: number, r: number, color: string, stroke: string) {
    const xy = this.calcXY(x, y);
    this.rawCircle(xy.x, xy.y, r, color, stroke);
  }

  resizeCanvasToDisplaySize(multiplier?: number) {
    multiplier = multiplier || 1;
    const width  = this.canvas.clientWidth  * multiplier | 0;
    const height = this.canvas.clientHeight * multiplier | 0;
    if (this.canvas.width !== width ||  this.canvas.height !== height) {
      this.canvas.width  = width;
      this.canvas.height = height;
      return true;
    }
    return false;
  }
}
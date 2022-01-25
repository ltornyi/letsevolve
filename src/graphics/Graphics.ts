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

  calcXY(x: number, y: number) {
    return {
      x: x / this.maxX * this.canvas.width,
      y: y / this.maxY * this.canvas.height
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  dot(x: number, y: number, color: string) {
    const xy = this.calcXY(x, y);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(xy.x, xy.y, 2, 2);
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
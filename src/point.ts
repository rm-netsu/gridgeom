import type { ICloneable, IEq, IMovable, IPoint2D, IVec2 } from '#interfaces'


const getRelativeMousePosition = (el: HTMLElement, e: MouseEvent): IVec2 => {
	const rect = el.getBoundingClientRect()
	return [
		(e.clientX - rect.left) / rect.width,
		(e.clientY - rect.top) / rect.height
	]
}
const getCanvasMousePosition = (
	canvas: HTMLCanvasElement,
	e: MouseEvent
) => {
	const [x, y] = getRelativeMousePosition(canvas, e)
	return <IVec2>[
		canvas.width * x,
		canvas.height * y
	].map(Math.floor)
}


export class Point2D implements
	IEq<IPoint2D>,
	IMovable<IPoint2D>,
	ICloneable<IPoint2D>
{
	#x: number
	#y: number

	get x() { return this.#x }
	get y() { return this.#y }

	constructor(x: number, y: number) {
		this.#x = x
		this.#y = y
	}

	static fromRelativeMousePosition(el: HTMLElement, e: MouseEvent) {
		return new Point2D(...getRelativeMousePosition(el, e))
	}
	static fromCanvasMousePosition(canvas: HTMLCanvasElement, e: MouseEvent) {
		return new Point2D(...getCanvasMousePosition(canvas, e))
	}

	delta(base: Point2D) {
		return new Point2D(this.#x - base.#x, this.#y - base.#y)
	}

	clone() {
		return new Point2D(this.#x, this.#y)
	}

	static midpoint(...points: Point2D[]): Point2D {
		const m = points.reduce(
			({x, y}, p) => ({
				x: x+(<Point2D>p).x,
				y: y+(<Point2D>p).y
			}),
			{ x: 0, y: 0 }
		)
		return new Point2D(m.x/points.length, m.y/points.length)
	}

	snap() {
		return new Point2D(
			Math.floor(this.#x),
			Math.floor(this.#y)
		)
	}

	move(delta: Point2D) {
		return new Point2D(this.#x + delta.#x, this.#y + delta.#y)
	}

	equals(other: Point2D) {
		return other.#x === this.#x && other.#y === this.#y
	}
}

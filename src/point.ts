import type { ICloneable, IEq, IMovable, IPoint2D } from '#interfaces'
import { getCanvasMousePosition, getRelativeMousePosition } from '#internal'


/** Immutable representation of a 2D point. */
export class Point2D implements
	IEq<IPoint2D>,
	IMovable<IPoint2D>,
	ICloneable<IPoint2D>
{
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
		Object.freeze(this)
	}

	/** Constructs a new Point2D from a Point2D-like object. */
	static from($: IPoint2D) {
		return new Point2D($.x, $.y)
	}

	/** Constructs a new Point2D from the current mouse position relative to
	 * the element. */
	static fromRelativeMousePosition(e: MouseEvent, el: HTMLElement) {
		return new Point2D(...getRelativeMousePosition(e, el))
	}
	/** Costructs a new Point2D from the current mouse position in the pixel
	 * coordinates of the canvas. */
	static fromCanvasMousePosition(e: MouseEvent, canvas: HTMLCanvasElement) {
		return new Point2D(...getCanvasMousePosition(e, canvas))
	}

	delta(base: Point2D) {
		return new Point2D(this.x - base.x, this.y - base.y)
	}

	clone() {
		return new Point2D(this.x, this.y)
	}

	static midpoint(...points: Point2D[]): Point2D {
		const m = points.reduce(
			({x, y}, p) => ({
				x: x + p.x,
				y: y + p.y
			}),
			{ x: 0, y: 0 }
		)
		return new Point2D(m.x/points.length, m.y/points.length)
	}

	floor() {
		return new Point2D(
			Math.floor(this.x),
			Math.floor(this.y)
		)
	}

	move(delta: Point2D) {
		return new Point2D(this.x + delta.x, this.y + delta.y)
	}

	equals(other: Point2D) {
		return other.x === this.x && other.y === this.y
	}
}

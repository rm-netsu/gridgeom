import type { ICloneable, IEq, IMovable, IRect } from '#interfaces'
import { minmax } from '#internal'
import { Point2D } from '#point'


export type RectIterator = (point: Point2D, rect: Rect) => void

export class Rect implements IEq<IRect>, IMovable<IRect>, ICloneable<IRect> {
	a: Point2D
	b: Point2D

	get center() {
		return Point2D.midpoint(this.a, this.b).floor()
	}
	get size() {
		const {x, y} = this.b.delta(this.a)
		return [x + 1, y + 1] as [number, number]
	}

	/** Costructs a new normalized Rect from two points */
	constructor(a: Point2D, b: Point2D) {
		const [ax, bx] = minmax(a.x, b.x)
		const [ay, by] = minmax(a.y, b.y)
		this.a = new Point2D(ax, ay)
		this.b = new Point2D(bx, by)
		Object.freeze(this)
	}

	static from($: IRect) {
		return new Rect(Point2D.from($.a), Point2D.from($.b))
	}

	clone() {
		const rect = new Rect(this.a.clone(), this.b.clone())
		return rect
	}

	static fromPosAndSize([x, y]: [number, number], [w, h]: [number, number]) {
		return new Rect(
			new Point2D(x, y),
			new Point2D(x + w-1*Math.sign(w), y + h-1*Math.sign(h))
		)
	}

	containsPoint(p: Point2D) {
		return (
			p.x >= this.a.x &&
			p.x <= this.b.x &&
			p.y >= this.a.y &&
			p.y <= this.b.y
		)
	}

	forEachPoint(fn: RectIterator) {
		const { x:ax, y:ay } = this.a
		const { x:bx, y:by } = this.b

		for(let y = ay; y <= by; ++y)
		for(let x = ax; x <= bx; ++x)
			fn(new Point2D(x, y), this)
	}

	isBorderline(p: Point2D) {
		return this.containsPoint(p) && (
			p.x - this.a.x === 0 ||
			p.x - this.b.x === 0 ||
			p.y - this.a.y === 0 ||
			p.y - this.b.y === 0
		)
	}

	forEachPointInHollowRect(fn: RectIterator) {
		this.forEachPoint((point, rect) => {
			if(rect.isBorderline(point)) fn(point, rect)
		})
	}

	move(delta: Point2D) {
		return new Rect(this.a.move(delta), this.b.move(delta))
	}

	floor() {
		const {x, y} = this.a
		const [w, h] = this.size
		const ax = Math.floor(x)
		const ay = Math.floor(y)
		const bxi = Math.floor(ax + w)
		const byi = Math.floor(ay + h)
		return Rect.fromPosAndSize([ax, ay], [bxi-ax, byi-ay])
	}

	/** @todo Formalize and clear logic */
	clamp(outer: Rect) {
		return new Rect(
			new Point2D(
				Math.max(this.a.x, outer.a.x),
				Math.max(this.a.y, outer.a.y)
			),
			new Point2D(
				Math.min(this.b.x, outer.b.x),
				Math.min(this.b.y, outer.b.y)
			)
		)
	}
	
	equals(other: Rect) {
		return other.a.equals(this.a) && other.b.equals(this.b)
	}

	/** @throws {Error} Inner rectangle cannot be larger than the outer rectangle. */
	moveRectGuarded(delta: Point2D, outer: Rect) {
		const [innerWidth, innerHeight] = this.size
		const [outerWidth, outerHeight] = outer.size

		if(innerWidth > outerWidth || innerHeight > outerHeight)
			throw new Error(
				'Inner rectangle cannot be larger than the outer rectangle.'
			)
		
		const movedRect = this.move(delta)
		const correctionDelta = new Point2D(
			(delta.x < 0 && movedRect.a.x < outer.a.x)
				? outer.a.x - movedRect.a.x
				: Math.min(0, outer.b.x - movedRect.b.x),
			(delta.y < 0 && movedRect.a.y < outer.a.y)
				? outer.a.y - movedRect.a.y
				: Math.min(0, outer.b.y - movedRect.b.y)
		)

		return movedRect.move(correctionDelta)
	}

	/** @throws {Error} Inner rectangle cannot be larger than the outer rectangle. */
	getMaximalPosition(outer: Rect) {
		const [innerWidth, innerHeight] = this.size
		const [outerWidth, outerHeight] = outer.size

		if(innerWidth > outerWidth || innerHeight > outerHeight)
			throw new Error(
				'Inner rectangle cannot be larger than the outer rectangle.'
			)

		const maxAx = outer.a.x + outerWidth - innerWidth
		const maxAy = outer.a.y + outerHeight - innerHeight

		return new Point2D(maxAx, maxAy)
	}

	/** @throws {Error} Outer rectangle must contain top left point of inner rectangle. */
	getMaximalSize(outer: Rect) {
		if(!outer.containsPoint(this.a))
			throw new Error(
				'Outer rectangle must contain top left point of inner rectangle.'
			)
	
		const maxWidth = outer.b.x - this.a.x + 1
		const maxHeight = outer.b.y - this.a.y + 1
	
		return new Point2D(maxWidth, maxHeight)
	}
}

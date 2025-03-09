import type { ICloneable, IEq, IMovable, IRect, IVec2 } from '#interfaces'
import { Point2D } from '#point'


const minmax = (a: number, b: number) =>
	[Math.min(a, b), Math.max(a, b)]

export type RectIterator = (point: Point2D, rect: Rect) => void

export class Rect implements IEq<IRect>, IMovable<IRect>, ICloneable<IRect> {
	#a; #b
	#isNormalized: boolean = false

	get a() { return this.#a }
	get b() { return this.#b }
	get isNormalized() { return this.#isNormalized }

	get center() {
		return Point2D.midpoint(this.#a, this.#b).snap()
	}
	get size(): IVec2 {
		const {x, y} = this.#b.delta(this.#a)
		return [x + 1, y + 1]
	}

	constructor(a: Point2D, b: Point2D) {
		this.#a = a
		this.#b = b
	}

	clone() {
		const rect = new Rect(this.#a.clone(), this.#b.clone())
		rect.#isNormalized = this.#isNormalized
		return rect
	}

	static fromPosAndSize([x, y]: IVec2, [w, h]: IVec2) {
		const [ax, bx] = minmax(x, x + w-1*Math.sign(w))
		const [ay, by] = minmax(y, y + h-1*Math.sign(h))
		const rect = new Rect(
			new Point2D(ax, ay),
			new Point2D(bx, by)
		)
		rect.#isNormalized = true
		return rect
	}

	normalize() {
		const a = this.#a
		const b = this.#b
		const [ax, bx] = minmax(a.x, b.x)
		const [ay, by] = minmax(a.y, b.y)
		const rect = new Rect(
			new Point2D(ax, ay),
			new Point2D(bx, by)
		)
		rect.#isNormalized = true
		return rect
	}

	containsPoint(p: Point2D): boolean {
		return this.#isNormalized
			? (
				p.x >= this.a.x &&
				p.x <= this.b.x &&
				p.y >= this.a.y &&
				p.y <= this.b.y
			)
			: this.normalize().containsPoint(p)
	}

	forEachPoint(fn: RectIterator) {
		const nrect = this.#isNormalized
			? this
			: this.normalize()
		
		const { x:ax, y:ay } = nrect.#a
		const { x:bx, y:by } = nrect.#b

		for(let y = ay; y <= by; ++y)
		for(let x = ax; x <= bx; ++x)
			fn(new Point2D(x, y), nrect)
	}

	isBorderline(p: Point2D) {
		return this.containsPoint(p) && (
			p.x - this.#a.x === 0 ||
			p.x - this.#b.x === 0 ||
			p.y - this.#a.y === 0 ||
			p.y - this.#b.y === 0
		)
	}

	forEachPointInHollowRect(fn: RectIterator) {
		this.forEachPoint((point, rect) => {
			if(rect.isBorderline(point)) fn(point, rect)
		})
	}

	move(delta: Point2D) {
		const rect = new Rect(this.#a.move(delta), this.#b.move(delta))
		rect.#isNormalized = this.#isNormalized
		return rect
	}

	snap() {
		const {x, y} = this.a
		const [w, h] = this.size
		const ax = Math.floor(x)
		const ay = Math.floor(y)
		const bxi = Math.floor(ax + w)
		const byi = Math.floor(ay + h)
		return Rect.fromPosAndSize([ax, ay], [bxi-ax, byi-ay])
	}

	clamp(outer: Rect): Rect {
		return outer.isNormalized
			? (
				this.#isNormalized
					? new Rect(
						new Point2D(
							Math.max(this.#a.x, outer.#a.x),
							Math.max(this.#a.y, outer.#a.y)
						),
						new Point2D(
							Math.min(this.#b.x, outer.#b.x),
							Math.min(this.#b.y, outer.#b.y)
						)
					)
					: this.normalize().clamp(outer)
			)
			: this.clamp(outer.normalize())
	}
	
	equals(other: Rect) {
		return other.#a.equals(this.#a) && other.#b.equals(this.#b)
	}

	moveRectGuarded(delta: Point2D, outer: Rect) {
		const movedRect = this.move(delta)
		const clampedRect = movedRect.clamp(outer)

		if(!clampedRect.equals(movedRect)) {
			const correctionDelta = new Point2D(
				(movedRect.#a.x < clampedRect.#a.x)
					? clampedRect.#a.x - movedRect.#a.x
					: clampedRect.#b.x - movedRect.#b.x,
				(movedRect.#a.y < clampedRect.#a.y)
					? clampedRect.#a.y - movedRect.#a.y
					: clampedRect.#b.y - movedRect.#b.y
			)

			return movedRect.move(correctionDelta)
		}

		return movedRect
	}

	getMaximalPosition(outer: Rect) {
		const [innerWidth, innerHeight] = this.size
		const [outerWidth, outerHeight] = outer.size

		if(innerWidth > outerWidth || innerHeight > outerHeight)
			throw new Error(
				'Inner rectangle cannot be larger than the outer rectangle.'
			)

		const maxAx = outer.#a.x + outerWidth - innerWidth
		const maxAy = outer.#a.y + outerHeight - innerHeight

		return new Point2D(maxAx, maxAy)
	}

	getMaximalSize(outer: Rect) {
		if(!outer.containsPoint(this.#a))
			return null
	
		const { a: outerA, b: outerB } = outer
	
		const maxWidth = outerB.x - this.#a.x + 1
		const maxHeight = outerB.y - this.#a.y + 1
	
		return new Point2D(maxWidth, maxHeight)
	}
}

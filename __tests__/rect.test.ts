import { minmax } from '#internal'
import { Point2D } from '#point'
import { Rect } from '#rect'


describe('Rect class', () => {
	describe('constructor()', () => {
		it.each([
			[ 20,100, 320,200],
			[320,200,  20,100],
			[-20,-80, 100,120],
		])(
			'should create a Rect instance',
			(ax,ay, bx,by) => {
				const a = new Point2D(ax, ay)
				const b = new Point2D(bx, by)
				const rect = new Rect(a, b)
				expect(rect).toBeInstanceOf(Rect)
				expect(rect.a.equals(
					new Point2D(Math.min(ax,bx), Math.min(ay,by))
				)).toBe(true)
				expect(rect.b.equals(
					new Point2D(Math.max(ax,bx), Math.max(ay,by))
				)).toBe(true)
			}
		)
	})

	describe('::center', () => {
		it('should calculate the center correctly', () => {
			const [ax,ay, bx,by] = [0,0, 10,8]

			const rect = new Rect(new Point2D(ax, ay), new Point2D(bx, by))
			expect(rect.center.equals(
				new Point2D(Math.floor((ax+bx)/2), Math.floor((ay+by)/2))
			)).toBe(true)
		})
	})

	describe('::size', () => {
		it.each([
			[  0, 0, 10,8],
			[  0,-8, 10,0],
			[-10, 0,  0,8],
			[-10,-8,  0,0],
		])('should calculate the size correctly', (ax,ay, bx,by) => {
			const rect = new Rect(new Point2D(ax, ay), new Point2D(bx, by))
			expect(rect.size).toEqual([Math.abs(bx-ax)+1, Math.abs(by-ay)+1])
		})
	})

	describe('clone()', () => {
		it('should clone a Rect instance', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(10, 10))
			const clonedRect = rect.clone()
			expect(clonedRect).toBeInstanceOf(Rect)
			expect(clonedRect.equals(rect)).toBe(true)
			expect(clonedRect).not.toBe(rect)
		})
	})
	
	describe('static fromPosAndSize()', () => {
		it.each([
			[  0, 0, 10,8],
			[  0,-8, 10,0],
			[-10, 0,  0,8],
			[-10,-8,  0,0],
		])('should create a Rect from position and size', (x,y, w,h) => {
			const rect = Rect.fromPosAndSize([x, y], [w, h])

			const [ax,bx] = minmax(x, x+w-1*Math.sign(w))
			const [ay,by] = minmax(y, y+h-1*Math.sign(h))
			expect(rect.a.equals(new Point2D(ax, ay))).toBe(true)
			expect(rect.b.equals(new Point2D(bx, by))).toBe(true)
		})
	})

	describe('static from()', () => {
		it('should create a Rect from Rect-like object', () => {
			const [ax,ay, bx,by] = [0,0, 10,8]

			const rect = Rect.from({
				a: { x: ax, y: ay },
				b: { x: bx, y: by },
			})
			expect(rect.a.equals(new Point2D(ax, ay))).toBe(true)
			expect(rect.b.equals(new Point2D(bx, by))).toBe(true)
		})
	})
	
	describe('containsPoint()', () => {
		it('should check if a point is contained within the Rect', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(10, 10))
			expect(rect.containsPoint(new Point2D(5, 5))).toBe(true)
			expect(rect.containsPoint(new Point2D(11, 11))).toBe(false)
		})
	})

	describe('forEachPoint()', () => {
		it('should iterate over each point in the Rect', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(2, 2))
			const points: Point2D[] = []
			rect.forEachPoint((point) => points.push(point))
			expect(points.length).toBe(9)

			expect(points.some(p => p.x === 0 && p.y === 0)).toBe(true)
			expect(points.some(p => p.x === 2 && p.y === 2)).toBe(true)
		})
	})

	describe('isBorderline()', () => {
		it('should check if a point is on the border of the Rect', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(2, 2))
			expect(rect.isBorderline(new Point2D(0, 0))).toBe(true)
			expect(rect.isBorderline(new Point2D(1, 1))).toBe(false)
		})
	})
	
	describe('forEachPointInHollowRect()', () => {
		it('should iterate over points in a hollow rect', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(2, 2))
			const points: Point2D[] = []
			rect.forEachPointInHollowRect((point) => points.push(point))
			expect(points.length).toBe(8)

			expect(points.some(p => p.x === 0 && p.y === 0)).toBe(true)
			expect(points.some(p => p.x === 2 && p.y === 2)).toBe(true)
			expect(points.some(p => p.x === 1 && p.y === 1)).toBe(false)
		})
	})

	describe('move()', () => {
		it('should move a Rect instance', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(10, 10))
			const movedRect = rect.move(new Point2D(5, 5))
			expect(movedRect.a.equals(new Point2D(5, 5))).toBe(true)
			expect(movedRect.b.equals(new Point2D(15, 15))).toBe(true)
		})
	})

	describe('floor()', () => {
		it('should snap the Rect to the nearest integer coordinates', () => {
			const rect = new Rect(new Point2D(5.7, 1.2), new Point2D(8.4, 15.3))
			const snappedRect = rect.floor()
			expect(snappedRect.a.equals(new Point2D(5, 1))).toBe(true)
			expect(snappedRect.b.equals(new Point2D(7, 15))).toBe(true)
		})
	})

	describe('clamp()', () => {
		it.each([
			[3,3, 10,10,  0,0, 7,7,  3,3, 7,7],
		])(
			'should clamp a Rect instance within another Rect',
			(iax,iay, ibx,iby,  oax,oay, obx,oby,  rax,ray, rbx,rby) => {
				const inner = new Rect(
					new Point2D(iax, iay),
					new Point2D(ibx, iby)
				)
				const outer = new Rect(
					new Point2D(oax, oay),
					new Point2D(obx, oby)
				)
				expect(inner.clamp(outer).equals(new Rect(
					new Point2D(rax, ray),
					new Point2D(rbx, rby)
				)))
			}
		)
	})

	describe('moveRectGuarded()', () => {
		it.each([
			[1,1, 2,2,  0,0, 2,2,  -4,-4,  0,0, 1,1],
			[0,0, 7,7,  0,0, 8,8,  10,10,  1,1, 8,8],
		])(
			'should move a Rect instance within another Rect',
			(iax,iay, ibx,iby,  oax,oay, obx,oby,  dx,dy,  rax,ray, rbx,rby) => {
				const innerRect = new Rect(
					new Point2D(iax, iay),
					new Point2D(ibx, iby)
				)
				const outerRect = new Rect(
					new Point2D(oax, oay),
					new Point2D(obx, oby)
				)
				const movedRect = innerRect.moveRectGuarded(
					new Point2D(dx, dy),
					outerRect
				)
				expect(movedRect.a.equals(new Point2D(rax, ray))).toBe(true)
				expect(movedRect.b.equals(new Point2D(rbx, rby))).toBe(true)
			}
		)
	})

	describe('getMaximalPosition()', () => {
		it('should get maximal correct position of Rect instance within another Rect', () => {
			const innerRect = new Rect(new Point2D(0, 0), new Point2D(7, 7))
			const outerRect = new Rect(new Point2D(0, 0), new Point2D(8, 8))
			const maxPos = innerRect.getMaximalPosition(outerRect)
			expect(maxPos.equals(new Point2D(1, 1))).toBe(true)
		})
		it('should throw error when inner Rect is bigger than outer', () => {
			const innerRect = new Rect(new Point2D(0, 0), new Point2D(7, 7))
			const outerRect = new Rect(new Point2D(0, 0), new Point2D(1, 1))
			expect(() => innerRect.getMaximalPosition(outerRect)).toThrow(Error)
		})
	})

	describe('getMaximalSize()', () => {
		it('should get maximal correct size of Rect instance within another Rect', () => {
			const innerRect = new Rect(new Point2D(0, 0), new Point2D(7, 7))
			const outerRect = new Rect(new Point2D(0, 0), new Point2D(8, 8))
			const maxSize = innerRect.getMaximalSize(outerRect)
			expect(maxSize).toBeInstanceOf(Point2D)
			expect(maxSize!.equals(new Point2D(9, 9))).toBe(true)
		})
	})
})

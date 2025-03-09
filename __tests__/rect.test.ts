import { Point2D } from '#point'
import { Rect } from '#rect'


describe('Rect class', () => {
	describe('Rect()::constructor()', () => {
		it('should create a Rect instance', () => {
			const a = new Point2D(20, 100)
			const b = new Point2D(320, 200)
			const rect = new Rect(a, b)
			expect(rect).toBeInstanceOf(Rect)
			expect(rect.a).toBe(a)
			expect(rect.b).toBe(b)
		})
	})

	describe('Rect()::center', () => {
		it('should calculate the center correctly', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(10, 8))
			expect(rect.center.equals(new Point2D(5, 4))).toBe(true)
		})
	})

	describe('Rect()::size', () => {
		it('should calculate the size correctly', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(10, 8))
			expect(rect.size).toEqual([11, 9])
		})
	})

	describe('Rect()::clone()', () => {
		it('should clone a Rect instance', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(10, 10))
			const clonedRect = rect.clone()
			expect(clonedRect).toBeInstanceOf(Rect)
			expect(clonedRect.equals(rect)).toBe(true)
			expect(clonedRect).not.toBe(rect)
		})
	})
	
	describe('Rect::fromPosAndSize()', () => {
		it('should create a Rect from position and size', () => {
			const rect = Rect.fromPosAndSize([0, 0], [10, 8]);
			expect(rect.a.equals(new Point2D(0, 0))).toBe(true)
			expect(rect.b.equals(new Point2D(9, 7))).toBe(true)
			expect(rect.isNormalized).toBe(true)
		})
	})

	describe('Rect()::normalize()', () => {
		it('should normalize a Rect instance', () => {
			const rect = new Rect(new Point2D(10, 10), new Point2D(0, 0))
			const normalizedRect = rect.normalize()
			expect(normalizedRect.a.equals(new Point2D(0, 0))).toBe(true)
			expect(normalizedRect.b.equals(new Point2D(10, 10))).toBe(true)
			expect(normalizedRect.isNormalized).toBe(true)
		})
	})
	
	describe('Rect()::containsPoint()', () => {
		it('should check if a point is contained within the Rect', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(10, 10))
			expect(rect.containsPoint(new Point2D(5, 5))).toBe(true)
			expect(rect.containsPoint(new Point2D(11, 11))).toBe(false)
		})
	})

	describe('Rect()::forEachPoint()', () => {
		it('should iterate over each point in the Rect', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(2, 2))
			const points: Point2D[] = []
			rect.forEachPoint((point) => points.push(point))
			expect(points.length).toBe(9)

			expect(points.some(p => p.x === 0 && p.y === 0)).toBe(true)
			expect(points.some(p => p.x === 2 && p.y === 2)).toBe(true)
		})
	})

	describe('Rect()::isBorderline()', () => {
		it('should check if a point is on the border of the Rect', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(2, 2))
			expect(rect.isBorderline(new Point2D(0, 0))).toBe(true)
			expect(rect.isBorderline(new Point2D(1, 1))).toBe(false)
		})
	})
	
	describe('Rect()::forEachPointInHollowRect()', () => {
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

	describe('Rect()::move()', () => {
		it('should move a Rect instance', () => {
			const rect = new Rect(new Point2D(0, 0), new Point2D(10, 10))
			const movedRect = rect.move(new Point2D(5, 5))
			expect(movedRect.a.equals(new Point2D(5, 5))).toBe(true)
			expect(movedRect.b.equals(new Point2D(15, 15))).toBe(true)
		})
	})

	describe('Rect()::snap()', () => {
		it('should snap the Rect to the nearest integer coordinates', () => {
			const rect = new Rect(new Point2D(5.7, 1.2), new Point2D(8.4, 15.3))
			const snappedRect = rect.snap()
			expect(snappedRect.a.equals(new Point2D(5, 1))).toBe(true)
			expect(snappedRect.b.equals(new Point2D(7, 15))).toBe(true)
		})
	})

	describe('Rect()::clamp()', () => {
		it('should clamp a Rect instance within another Rect', () => {
			const innerRect = new Rect(new Point2D(5, 5), new Point2D(15, 15))
			const outerRect = new Rect(new Point2D(0, 0), new Point2D(10, 10))
			const clampedRect = innerRect.clamp(outerRect)
			expect(clampedRect.a.equals(new Point2D(5, 5))).toBe(true)
			expect(clampedRect.b.equals(new Point2D(10, 10))).toBe(true)
		})
	})

	describe('Rect()::moveRectGuarded()', () => {
		it('should move a Rect instance within another Rect', () => {
			const innerRect = new Rect(new Point2D(0, 0), new Point2D(7, 7))
			const outerRect = new Rect(new Point2D(0, 0), new Point2D(8, 8))
			const movedRect = innerRect.moveRectGuarded(
				new Point2D(10, 10),
				outerRect
			)
			expect(movedRect.a.equals(new Point2D(1, 1))).toBe(true)
			expect(movedRect.b.equals(new Point2D(8, 8))).toBe(true)
		})
	})

	describe('Rect()::getMaximalPosition()', () => {
		it('should get maximal correct position of Rect instance within another Rect', () => {
			const innerRect = new Rect(new Point2D(0, 0), new Point2D(7, 7))
			const outerRect = new Rect(new Point2D(0, 0), new Point2D(8, 8))
			const maxPos = innerRect.getMaximalPosition(outerRect)
			expect(maxPos.equals(new Point2D(1, 1))).toBe(true)
		})
	})

	describe('Rect()::getMaximalSize()', () => {
		it('should get maximal correct size of Rect instance within another Rect', () => {
			const innerRect = new Rect(new Point2D(0, 0), new Point2D(7, 7))
			const outerRect = new Rect(new Point2D(0, 0), new Point2D(8, 8))
			const maxSize = innerRect.getMaximalSize(outerRect)
			expect(maxSize).toBeInstanceOf(Point2D)
			expect(maxSize!.equals(new Point2D(9, 9))).toBe(true)
		})
	})
})

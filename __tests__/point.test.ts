import { Point2D } from '#point'


describe('Point2D class', () => {
	let mockBoundingClientRect: DOMRect = new DOMRect(0, 0, 120, 120)
	const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect

	beforeAll(() => {
		Element.prototype.getBoundingClientRect = () => mockBoundingClientRect
	})
	afterAll(() => {
		Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
	})

	describe('Point2D()::constructor()', () => {
		it('should create a Point2D instance', () => {
			const p = new Point2D(3, 14)
			expect(p).toBeInstanceOf(Point2D)
			expect(p.x).toBe(3)
			expect(p.y).toBe(14)
		})
	})

	describe('Point2D::fromRelativeMousePosition()', () => {
		it('should create a Point2D from relative mouse position', () => {
			const el = document.createElement('div')
			mockBoundingClientRect = new DOMRect(20, 10, 320, 200)
			
			const event = new MouseEvent('mousemove', {
				clientX: 20+320*0.667,
				clientY: 10+200*0.25
			})

			const point = Point2D.fromRelativeMousePosition(el, event)
			expect(point.x).toBeCloseTo(0.667)
			expect(point.y).toBeCloseTo(0.25)
		})
	})
	
	describe('Point2D::fromCanvasMousePosition()', () => {
		it('should create a Point2D from canvas mouse position', () => {
			const scale = 0.667

			const canvas = document.createElement('canvas')
			canvas.width = 320
			canvas.height = 200
			mockBoundingClientRect = new DOMRect(
				20,
				10,
				canvas.width*scale,
				canvas.height*scale
			)

			const event = new MouseEvent('mousemove', {
				clientX: 20+160,
				clientY: 10+42
			})
	
			const point = Point2D.fromCanvasMousePosition(canvas, event)
			expect(point.x).toBe(Math.floor(160/scale))
			expect(point.y).toBe(Math.floor(42/scale))
		})
	})

	describe('Point2D()::delta()', () => {
		it('should calculate the delta between two points', () => {
			const p0 = new Point2D(5, 10)
			const pb = new Point2D(2, 3)
			const delta = p0.delta(pb)
			expect(delta.x).toBe(3)
			expect(delta.y).toBe(7)
		})
	})
	
	describe('Point2D()::clone()', () => {
		it('should clone a Point2D instance', () => {
			const point = new Point2D(5, 10)
			const clonedPoint = point.clone()
			expect(clonedPoint).toBeInstanceOf(Point2D)
			expect(clonedPoint.equals(point)).toBe(true)
			expect(clonedPoint).not.toBe(point)
		})
	})

	describe('Point2D::midpoint()', () => {
		it('should calculate the midpoint of multiple points', () => {
			const point1 = new Point2D(0, 2)
			const point2 = new Point2D(10, 42)
			const point3 = new Point2D(20, -16)
			const midpoint = Point2D.midpoint(point1, point2, point3)
			expect(midpoint.x).toBeCloseTo((0 + 10 + 20) /3)
			expect(midpoint.y).toBeCloseTo((2 + 42 - 16) /3)
		})
	})
	
	describe('Point2D()::snap()', () => {
		it('should snap the point to the nearest integer coordinates', () => {
			const point = new Point2D(5.7, 10.2)
			const snappedPoint = point.snap()
			expect(snappedPoint.x).toBe(5)
			expect(snappedPoint.y).toBe(10)
		})
	})
	
	describe('Point2D()::move()', () => {
		it('should move the point by a delta', () => {
			const point = new Point2D(5, 10)
			const delta = new Point2D(2, 3)
			const movedPoint = point.move(delta)
			expect(movedPoint.x).toBe(7)
			expect(movedPoint.y).toBe(13)
		})
	})
	
	describe('Point2D()::equals()', () => {
		it('should check if two points are equal', () => {
			const point1 = new Point2D(5, 10)
			const point2 = new Point2D(5, 10)
			const point3 = new Point2D(2, 3)
			expect(point1.equals(point2)).toBe(true)
			expect(point1.equals(point3)).toBe(false)
		})
	})
})

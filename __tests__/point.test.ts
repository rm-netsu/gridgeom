import { Point2D } from '#point'


describe('Point2D class', () => {
	let mockBoundingClientRect: DOMRect = new DOMRect()
	const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect

	beforeAll(() => {
		Element.prototype.getBoundingClientRect = () => mockBoundingClientRect
	})
	afterAll(() => {
		Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
	})

	describe('constructor()', () => {
		it('should create a Point2D instance', () => {
			const [x, y] = [3, 14]

			const p = new Point2D(x, y)
			expect(p).toBeInstanceOf(Point2D)
			expect(p.x).toBe(x)
			expect(p.y).toBe(y)
		})
	})

	describe('static from()', () => {
		it('should create a Point2D instance from Point2D-like object', () => {
			const [x, y] = [3, 14]

			const p = Point2D.from({ x, y })
			expect(p).toBeInstanceOf(Point2D)
			expect(p.x).toBe(x)
			expect(p.y).toBe(y)
		})
	})

	describe('static fromRelativeMousePosition()', () => {
		it('should create a Point2D from relative mouse position', () => {
			const [x,y, w,h, u,v] = [20,10, 320,200, 0.667,0.25]
			
			const el = document.createElement('div')
			mockBoundingClientRect = new DOMRect(x,y, w,h)
			
			const event = new MouseEvent('mousemove', {
				clientX: x + w*u,
				clientY: y + h*v
			})

			const point = Point2D.fromRelativeMousePosition(event, el)
			expect(point.x).toBeCloseTo(u)
			expect(point.y).toBeCloseTo(v)
		})
	})
	
	describe('static fromCanvasMousePosition()', () => {
		it.each([
			[20,10, 320,200, 160,42, 0.667],
			[ 0, 0, 160,140, 159, 0, 1.333],
		])(
			'should create a Point2D from canvas mouse position',
			(x,y, w,h, dx,dy, scale) => {
				const canvas = document.createElement('canvas')
				canvas.width = w
				canvas.height = h
				mockBoundingClientRect = new DOMRect(
					x,
					y,
					canvas.width * scale,
					canvas.height * scale
				)

				const event = new MouseEvent('mousemove', {
					clientX: x + dx,
					clientY: y + dy
				})
		
				const point = Point2D.fromCanvasMousePosition(event, canvas)
				expect(point.x).toBe(Math.floor(dx/scale))
				expect(point.y).toBe(Math.floor(dy/scale))
			}
		)
	})

	describe('delta()', () => {
		it.each([
			[ 5, 10,  2, 3],
			[ 5, 10, -2,-3],
			[-5,-10,  2, 3],
			[-5,-10, -2,-3],
		])(
			'should calculate the delta between two points',
			(p0x,p0y, pbx,pby) => {
				const p0 = new Point2D(p0x, p0y)
				const pb = new Point2D(pbx, pby)
				const delta = p0.delta(pb)
				expect(delta.x).toBe(p0x-pbx)
				expect(delta.y).toBe(p0y-pby)
			}
		)
	})
	
	describe('clone()', () => {
		it('should clone a Point2D instance', () => {
			const point = new Point2D(5, 10)
			const clonedPoint = point.clone()
			expect(clonedPoint).toBeInstanceOf(Point2D)
			expect(clonedPoint.equals(point)).toBe(true)
			expect(clonedPoint).not.toBe(point)
		})
	})

	describe('static midpoint()', () => {
		it('should calculate the midpoint of multiple points', () => {
			const [p1x,p1y, p2x,p2y, p3x,p3y] = [0,2, 10,42, 20,-16]

			const point1 = new Point2D(p1x, p1y)
			const point2 = new Point2D(p2x, p2y)
			const point3 = new Point2D(p3x, p3y)
			const midpoint = Point2D.midpoint(point1, point2, point3)
			expect(midpoint.x).toBeCloseTo((p1x + p2x + p3x) /3)
			expect(midpoint.y).toBeCloseTo((p1y + p2y + p3y) /3)
		})
	})
	
	describe('floor()', () => {
		it('should snap the point to the nearest integer coordinates', () => {
			const [x, y] = [5.7, 10.2]

			const point = new Point2D(x, y)
			const snappedPoint = point.floor()
			expect(snappedPoint.x).toBe(Math.floor(x))
			expect(snappedPoint.y).toBe(Math.floor(y))
		})
	})
	
	describe('move()', () => {
		it('should move the point by a delta', () => {
			const [x,y, dx,dy] = [5,10, 2,3]

			const point = new Point2D(x, y)
			const delta = new Point2D(dx, dy)
			const movedPoint = point.move(delta)
			expect(movedPoint.x).toBe(x+dx)
			expect(movedPoint.y).toBe(y+dy)
		})
	})
	
	describe('equals()', () => {
		it('should check if two points are equal', () => {
			const point1 = new Point2D(5, 10)
			const point2 = new Point2D(5, 10)
			const point3 = new Point2D(2, 3)
			expect(point1.equals(point2)).toBe(true)
			expect(point1.equals(point3)).toBe(false)
		})
	})
})

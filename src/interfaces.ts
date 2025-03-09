export interface IPoint2D {
	x: number
	y: number
}
export interface IRect {
	a: IPoint2D
	b: IPoint2D
}
export type IVec2 = [number, number]


export interface IMovable<T> {
	move(delta: IPoint2D): T
	snap(): T
}
export interface IEq<T> {
	equals(other: T): boolean
}
export interface ICloneable<T> {
	clone(): T
}

export type Constructor<T = {}> = new (...args: any[]) => T

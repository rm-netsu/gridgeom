export const getRelativeMousePosition = (
	e: MouseEvent,
	el: HTMLElement
): [number, number] => {
	const rect = el.getBoundingClientRect()
	return [
		(e.clientX - rect.left) / rect.width,
		(e.clientY - rect.top) / rect.height
	]
}
export const getCanvasMousePosition = (
	e: MouseEvent,
	canvas: HTMLCanvasElement
) => {
	const [x, y] = getRelativeMousePosition(e, canvas)
	return [
		canvas.width * x,
		canvas.height * y
	].map(Math.floor) as [number, number]
}

export const minmax = (a: number, b: number) =>
	[Math.min(a, b), Math.max(a, b)] as [number, number]

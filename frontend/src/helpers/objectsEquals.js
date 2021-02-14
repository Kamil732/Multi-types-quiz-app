const objectsEquals = (obj1, obj2) =>
	Object.keys(obj1).length === Object.keys(obj2).length &&
	Object.keys(obj1).every((p) => obj1[p] === obj2[p])

export default objectsEquals

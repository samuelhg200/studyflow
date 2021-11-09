export const BUY_PRODUCT = "BUY_PRODUCT"

export const buyProduct = (id) => {
	return {
		type: BUY_PRODUCT,
		id: id,
	}
}
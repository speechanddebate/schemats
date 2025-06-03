
export type Webpage = {
	id          : number,
	title       : string,
	slug?       : string,
	content     : string,
	published   : boolean,
	sitewide?   : boolean,
	special?    : string,
	sidebar?    : string,
	page_order? : number,
};
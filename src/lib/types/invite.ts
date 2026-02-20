import type { Webpage } from '$indexcards/schemas/webPage.ts';

export type TournInvite = {
	id           : number  ,
	name         : string  ,
	city         : string  ,
	state?       : string  ,
	country?     : string  ,
	tz           : string  ,
	webname      : string  ,
	start        : string  ,
	end          : string  ,
	regStart    : string  ,
	regEnd      : string  ,
	webpages : Array<Webpage>,
	files    : Array<File>,
	events   : Array<EventInvite>,
	contacts : Array<TournContact>,
};
export type TournContact = {
	id       : number,
	first: string,
	middle: string,
	last: string,
	email: string,
}

export type Tourn = {
	id        : number,
	name      : string,
	webpage   : string,
	start     : Date,
	end       : Date,
	reg_start : Date,
	reg_end   : Date,
	hidden?   : boolean,
}

export type EventInvite = {
	id              : number,
	abbr            : string,
	name            : string,
	fee             : number,
	currency         : string,
	type            : string,
	categoryId?     : number,
	categoryName?   : string,
	categoryAbbr?   : string,
	cap?            : number,
	schoolCap?      : number,
	topicSource?    : string,
	topicEventType? : string,
	topicTag?       : string,
	topicText?      : string,
	fieldReport?    : boolean,
	description?    : string,
	nsdaCode?        : string,
	nsdaName?        : string,
}

export type PublishedRound = {
	id         : number,
	label      : string,
	name       : number,
	eventId    : number,
	eventAbbr  : string,
	eventName  : string,
	entryList? : boolean
}

export type File = {
	id          : number,
	tag         : string,
	type        : string,
	label       : string,
	filename    : string,
	published?  : boolean,
	pageOrder? : number,
	uploaded: Date,
	updatedAt: Date,

}
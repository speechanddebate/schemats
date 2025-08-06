import type { Webpage } from './public';

export type Tournament = {
		id           : number  ,
		webname      : string  ,
		name         : string  ,
		tz           : string  ,
		tzCode       : string  ,
		districts?   : number  ,
		weekendName? : string  ,
		location?    : string | undefined ,
		state?       : string  ,
		country?     : string  ,
		site?        : string  ,
		start        : string  ,
		end          : string  ,
		reg_end      : string  ,
		reg_start    : string  ,
		schoolcount  : number  ,
		year         : number  ,
		week         : number  ,
		sortweek     : string  ,
		sortnumeric  : number  ,
		signup?      : string  ,
		online       : number ,
		in_person    : number ,
		hybrid       : number ,
		closed       : boolean ,
		nats?        : boolean ,
		msnats?      : boolean ,
		dates?       : string  ,
};

export type Invite = {
	tourn  : object,
	events : Array<Event>,
	files  : Array<File>,
	pages  : Array<Webpage>,
	rounds : Array<PublishedRound>,
};

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

export type Event = {
	id              : number,
	abbr            : string,
	name            : string,
	fee             : number,
	type            : string,
	cap?            : number,
	schoolCap?      : number,
	topicSource?    : string,
	topicEventType? : string,
	topicTag?       : string,
	topicText?      : string,
	fieldReport?    : boolean,
	description?    : string,
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
	coach?      : boolean,
	page_order? : number,
	parent?     : number,
	webpage     : string,
}
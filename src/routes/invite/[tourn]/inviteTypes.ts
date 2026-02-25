
export type Webname = {
	tournId   : number,
	webname   : string,
	name      : string,
	start     : string,
	multiYear : boolean
};

export type RoundData = {
	id    : number,
	name  : number,
	label : string,
	type  : string,
};

export type EventData = {
	id        : number,
	abbr      : string,
	name      : string,
	type      : 'speech' | 'debate' | 'congress' | 'wsdc' | 'mocktrial',
	rounds?   : Array<RoundData>,
	waitlist? : boolean,
};

export type FieldData = {
	id           : number,
	name         : string,
	code         : string,
	active       : boolean,
	schoolName   : string,
	schoolCode   : string,
	studentIds   : string,
	studentNames : string,
	waitlist     : boolean,
}

export type SidebarProps = {
	currentEvent? : string,
	rounds        : Array<PublishedRound>,
	webname       : Webname,
	schools?      : Array<T>,
};

export type PublishedRound = {
    roundId             : number,
    roundName           : number,
    roundLabel?         : string,
    roundType           : 'prelim' | 'highlow' | 'highhigh' | 'elim' | 'final' | 'runoff' | 'snaked_prelim',
    published?          : number,
    roundPostPrimary?   : number,
    roundPostSecondary? : number,
    roundPostFeedback?  : number,
    eventId             : number,
    eventName           : string,
    eventAbbr           : string,
    eventLevel          : string,
    eventType           : 'speech' | 'congress' | 'debate' | 'mocktrial' | 'wsdc' | 'wudc' | 'attendee',
    eventNSDACategory?  : number
};
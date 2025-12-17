
export type Webname = {
	tournId   : number,
	webname   : string,
	multiYear : boolean
};

export type RoundData = {
	roundId     : number,
	roundNumber : number,
	roundLabel  : string,
	roundType   : string,
};

export type EventData = {
	eventId   : number,
	eventAbbr : string,
	eventType : 'speech' | 'debate' | 'congress' | 'wsdc' | 'mocktrial',
	rounds?   : Array<RoundData>,
};

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
    eventNSDACode?      : number
};
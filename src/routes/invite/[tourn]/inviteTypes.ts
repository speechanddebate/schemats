
export type Webname = {
	tournId   : number,
	webname   : string,
	multiYear : boolean
};

export type SidebarProps = {
	currentEvent?: string,
	rounds       : Array<T>,
	webname      : Webname,
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
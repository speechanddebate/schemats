
export type Webname = {
	tournId   : number,
	webname   : string,
	name      : string,
	start     : string,
	multiYear : boolean
};

export type RoundTypes =
	'prelim' |
	'highlow' |
	'highhigh' |
	'elim' |
	'final' |
	'snaked_prelim' |
	'runoff';

export type EventTypes =
	'speech' |
	'debate' |
	'congress' |
	'wsdc' |
	'wudc' |
	'mocktrial' |
	'attendee';

export type EventLevels =
	'open' |
	'novice' |
	'jv' |
	'champ' |
	'es-novice' |
	'es-open' |
	'middle';

export type EventData = {
	id            : number,
	abbr          : string,
	name          : string,
	type          : EventTypes,
	level ?       : EventLevels,
	rounds?       : Array<RoundData>,
	nsdaCategory? : number,
	waitlist?     : boolean,
	settings? : {
		[key : string]: string,
	},
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
	rounds        : Array<RoundData>,
	webname       : Webname,
	schools?      : Array<unknown>,
};

export type RoundData = {
    id             : number,
    name           : number,
    label?         : string,
    type           : RoundTypes,
    published?     : number,
    postPrimary?   : number,
    postSecondary? : number,
    postFeedback?  : number,
    eventId        : number,
	Event?         : EventData,
};
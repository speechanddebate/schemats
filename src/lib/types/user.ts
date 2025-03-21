// Types related to accounts and session trackers

export type Session = {
	id           : number,
	userkey      : string,
	ip?          : string,
	defaults?    : object,
	su?          : number,
	push_notify? : string,
	agent_data?  : string,
	geoip?       : string,
	last_access? : Date,
	Person?      : Person,
	name?        : string,
	email?       : string,
	perms        : Array<Permission>,
}

export type Person = {
	id           : number,
	email        : string,
	first        : string,
	middle?      : string,
	last         : string,
	site_admin   : string,
	no_email     : boolean,
	phone?       : string,
	accesses?    : number,
	timestamp    : Date,
	nsda?        : number,
}

export type Permission = {
	id          : number,
	tag         : string,
	tourn?      : number,
	chapter?    : number,
	region?     : number,
	district?   : number,
	category?   : number,
	event?      : number,
	created_by? : number,
}

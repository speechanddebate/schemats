// Types related to accounts and session trackers

export type Session = {
	id            : number,
	key           : string,
	defaults?     : object,
	su?           : number,
	push_notify?  : boolean,
	person        : number,
	personFirst   : string,
	personMiddle? : string,
	personLast    : string,
	email         : string,
	site_admin?   : boolean,
	nsda?         : number
}

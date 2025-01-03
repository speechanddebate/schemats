import type { PageData } from './$types';

export const load:PageData = async ({ fetch } ) => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/public/invite/upcoming`);
    const rawTournData = await response.json();

	interface Tourn {
		url          : string,
		webname      : string,
		id           : number,
		dates        : string,
		state        : string,
		regStatus    : string,
		location     : string,
		tz           : string,
		tzHover      : string,
		hidden       : boolean,
		country      : string,
		start        : Date,
		end          : Date,
		type         : string,
		reg_start    : Date,
		reg_end      : Date,
		online       : string,
		in_person    : string,
		hybrid       : string,
		registration : string,
	}

	const tournList = rawTournData.flatMap( (tourn: Tourn) => {

		if (tourn.hidden) {
			return [];
		}

		if (tourn.webname) {
			tourn.url = `${import.meta.env.VITE_WEB_URL}/t/${tourn.webname}`;
		} else {
			tourn.url = `${import.meta.env.VITE_WEB_URL}/tid/${tourn.id}`;
		}

		tourn.start = new Date(tourn.start);
		tourn.end = new Date(tourn.end);

		tourn.dates = `${tourn.start?.toLocaleDateString('en-us', {month: "numeric", day:"numeric"})}`;

		if (tourn.start?.getDay() !== tourn.end?.getDay()) {
			tourn.dates += `-${tourn.end?.toLocaleDateString('en-us', {month: "numeric", day:"numeric"})}`;
		}

		if (
			tourn.location?.toLowerCase() === 'online'
			|| tourn.location?.toLowerCase() === 'nsda campus'
		) {

			tourn.tzHover = tourn.tz;

			const tz = new Date().toLocaleDateString('en-US', {
				timeZoneName: 'short',
				timeZone: tourn.tz,
			}).slice(10);

			tourn.state = tz;
		}

		if (!tourn.state) {
			tourn.state = tourn.country;
		}

		tourn.type = '';

		if (tourn.in_person) {
			tourn.type += ' <i class="fas fas-sm fa-user bluetext"></i>';
		}
		if (tourn.online) {
			tourn.type += '<i class="fas fas-sm fa-signal greentext"></i>';
		}
		if (tourn.hybrid) {
			tourn.type += ' <i class="fas fas-sm fa-solid fa-handshake orangetext"></i>';
		}

		const regStart = new Date(tourn.reg_start);
		const regEnd = new Date(tourn.reg_end);
		const now = new Date();

		if (regStart > now) {
			tourn.registration = `Opens ${
				regStart.toLocaleDateString('en-us',
					{
						month    : 'numeric',
						day      : 'numeric',
						timeZone : tourn.tz
					}
				)
			} at ${
				regStart.toLocaleTimeString('en-us',
					{
						hour     : 'numeric',
						minute   : 'numeric',
						timeZone : tourn.tz
					}
				)
			}`;
		} else if (regEnd < now) {
			tourn.registration = `Closed`;
		} else {
			tourn.registration = `Due ${
				regEnd.toLocaleDateString('en-us',
					{
						month    : 'numeric',
						day      : 'numeric',
						timeZone : tourn.tz
					}
				)
			} at ${
				regEnd.toLocaleTimeString('en-us',
					{
						hour         : 'numeric',
						minute       : 'numeric',
						timeZone     : tourn.tz,
						timeZoneName : 'short',
					}
				)
			}`;
		}
		return tourn;
	});

	const columns = [
        {
			title     : "Dates",
			field     : 'dates',
			sorter    : 'string',
			hozAlign  : 'left',
			resizable : 'header',
		},{
			title     : 'Tournament',
			field     : 'name',
			sorter    : 'string',
			minWidth  : '256',
			resizable : 'header',
		},{
			title     : 'Location',
			field     : 'location',
			sorter    : 'string',
			resizable : 'header',
		},{
			title     : 'ST',
			field     : 'state',
			sorter    : 'string',
			hozAlign  : 'center',
			maxWidth  : '64',
			resizable : 'header',
		},{
			title     : 'Mode',
			field     : 'mode',
			sorter    : 'string',
			hozAlign  : 'center',
			resizable : 'header',
			maxWidth  : '64',
		},{
			title     : 'Registration',
			field     : 'registration',
			sorter    : 'string',
			resizable : 'header',
			maxWidth  : '128',
		},{
			title     : 'Judge Signups',
			field     : 'signup',
			sorter    : 'string',
			hozAlign  : 'center',
			resizable : 'header',
		},
    ];

    return {
        tourns : tournList,
		columns,
    };
};
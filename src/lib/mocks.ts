import grab from 'grab-url';
import { faker } from '@faker-js/faker';
import type { TournData } from './invite/invite.d.ts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mock = (grab as any).mock;
const setMock = (path: string, value: any) => {
	mock[path] = value;
	mock[`/${path}`] = value;
};

// ─── Demo tournament constants ────────────────────────────────────────────────

const DEMO_TOURN_ID = 4242;
const DEMO_WEBNAME = 777;

// ─── Events that exist in the demo tournament ─────────────────────────────────

const demoEvents = [
	{ id: 101, abbr: 'LD',  name: 'Lincoln-Douglas Debate',     type: 'debate'  as const, fee: 25, cap: 64,  schoolCap: 4,  fieldReport: true,  entryCount: 48, nsdaCode: 'LD',  nsdaName: 'Lincoln-Douglas',    nsdaCategory: 1, description: 'One-on-one value debate format.' },
	{ id: 102, abbr: 'PF',  name: 'Public Forum Debate',        type: 'debate'  as const, fee: 30, cap: 128, schoolCap: 6,  fieldReport: true,  entryCount: 96, nsdaCode: 'PFD', nsdaName: 'Public Forum',       nsdaCategory: 1, description: 'Two-on-two current events debate.' },
	{ id: 103, abbr: 'CX',  name: 'Policy Debate',              type: 'debate'  as const, fee: 35, cap: 48,  schoolCap: 3,  fieldReport: true,  entryCount: 32, nsdaCode: 'POL', nsdaName: 'Policy',             nsdaCategory: 1, topicTag: 'NSDA 2025-2026', topicSource: 'NSDA', topicEventType: 'Policy', topicText: 'Resolved: The United States federal government should substantially reform its foreign policy toward the Middle East.' },
	{ id: 104, abbr: 'OO',  name: 'Original Oratory',           type: 'speech'  as const, fee: 15, cap: 80,  schoolCap: 3,  fieldReport: true,  entryCount: 62, nsdaCode: 'OO',  nsdaName: 'Original Oratory',   nsdaCategory: 2 },
	{ id: 105, abbr: 'DI',  name: 'Dramatic Interpretation',    type: 'speech'  as const, fee: 15, cap: 80,  schoolCap: 3,  fieldReport: false, entryCount: 55, nsdaCode: 'DI',  nsdaName: 'Dramatic Interp',    nsdaCategory: 2 },
	{ id: 106, abbr: 'HI',  name: 'Humorous Interpretation',    type: 'speech'  as const, fee: 15, cap: 80,  schoolCap: 3,  fieldReport: false, entryCount: 44, nsdaCode: 'HI',  nsdaName: 'Humorous Interp',    nsdaCategory: 2 },
	{ id: 107, abbr: 'CON', name: 'Congressional Debate',       type: 'congress' as const, fee: 20, cap: 60, schoolCap: 4,  fieldReport: true,  entryCount: 40, nsdaCode: 'CNG', nsdaName: 'Congressional',      nsdaCategory: 3 },
	{ id: 108, abbr: 'EXT', name: 'Extemporaneous Speaking',    type: 'speech'  as const, fee: 15, cap: 60,  schoolCap: 3,  fieldReport: false, entryCount: 38, nsdaCode: 'USX', nsdaName: 'US Extemp',          nsdaCategory: 2 },
];

// ─── Rounds for the demo tournament ───────────────────────────────────────────

const demoRounds = demoEvents.flatMap((event) => {
	const numRounds = event.type === 'debate' ? 6 : 4;
	return Array.from({ length: numRounds }, (_, i) => ({
		id: event.id * 100 + i + 1,
		name: i + 1,
		label: i < numRounds - 1 ? `Round ${i + 1}` : (event.type === 'debate' ? 'Finals' : `Round ${i + 1}`),
		type: i < numRounds - 2 ? 'prelim' : (i === numRounds - 1 ? 'final' : 'elim'),
		published: i < 3 ? 1 : 0,
		postPrimary: i < 2 ? 1 : 0,
		postSecondary: 0,
		postFeedback: 0,
		eventId: event.id,
		eventAbbr: event.abbr,
		eventName: event.name,
		Event: { id: event.id, abbr: event.abbr, name: event.name, type: event.type, nsdaCategory: event.nsdaCategory },
	}));
});

// ─── Webpages for the demo tournament ─────────────────────────────────────────

const demoWebpages = [
	{ id: 1001, title: 'Welcome',          slug: 'main',      content: '<p>Welcome to the Demo Championship Tournament! We are thrilled to host you in Las Vegas, NV for three days of competitive speech and debate.</p><p>Please review the event schedule, register your school, and check back here for updates.</p><p>Contact the tournament director with any questions.</p>', published: true, special: 'main', page_order: 1 },
	{ id: 1002, title: 'Events',           slug: 'events',    content: '<p>We offer a full range of speech and debate events for competitors of all experience levels.</p>', published: true, page_order: 2 },
	{ id: 1003, title: 'Judging Requirements', slug: 'judging', content: '<p>Each school must provide one judge per four entries. Judges must be 18 years or older and have completed the NSDA judge certification.</p><p>Judge assignments will be posted 48 hours before the tournament begins.</p>', published: true, page_order: 3 },
	{ id: 1004, title: 'Travel & Lodging', slug: 'travel',    content: '<p>The tournament will be held at the Las Vegas Convention Center. A block of rooms has been reserved at the Marriott next door at a discounted rate. Use code DEMO2026 when booking.</p>', published: true, page_order: 4 },
	{ id: 1005, title: 'Code of Conduct',  slug: 'conduct',   content: '<p>All participants are expected to uphold the highest standards of sportsmanship and academic integrity. Violations may result in disqualification.</p>', published: true, page_order: 5 },
];

// ─── Contacts for the demo tournament ─────────────────────────────────────────

const demoContacts = [
	{ first: 'Jane',  last: 'Smith',    email: 'jane.smith@demo-tournament.org' },
	{ first: 'Robert', last: 'Johnson', email: 'robert.j@demo-tournament.org' },
	{ first: 'Maria', last: 'Garcia',   email: 'maria.g@demo-tournament.org' },
];

// ─── Field report entries ─────────────────────────────────────────────────────

const generateFieldEntries = (eventId: number, count: number) => {
	const schools = ['Lincoln High', 'Washington Academy', 'Jefferson Prep', 'Roosevelt School', 'Adams Academy', 'Madison High', 'Monroe School', 'Jackson Prep'];
	return Array.from({ length: count }, (_, i) => ({
		id: eventId * 1000 + i + 1,
		name: `${faker.person.lastName()} & ${faker.person.lastName()}`,
		code: `${schools[i % schools.length].substring(0, 3).toUpperCase()}${String(i + 1).padStart(2, '0')}`,
		active: true,
		schoolName: schools[i % schools.length],
		schoolCode: schools[i % schools.length].substring(0, 3).toUpperCase(),
		schoolId: (i % schools.length) + 1,
		studentIds: `${i * 2 + 1},${i * 2 + 2}`,
		studentNames: `${faker.person.firstName()} ${faker.person.lastName()}, ${faker.person.firstName()} ${faker.person.lastName()}`,
		waitlist: i >= count - 3,
	}));
};

// ─── Schedule data ────────────────────────────────────────────────────────────

const tournStart = new Date('2026-04-10T08:00:00-05:00');
const generateSchedule = () => {
	return demoRounds.map((round, idx) => {
		const dayOffset = Math.floor(idx / 8);
		const hourOffset = (idx % 8) * 1.5;
		const startTime = new Date(tournStart.getTime() + (dayOffset * 24 + 8 + hourOffset) * 60 * 60 * 1000);
		return {
			...round,
			startTime: startTime.toISOString(),
			timeslotStart: startTime.toISOString(),
		};
	});
};

// ─── Registered schools (mySchools) ───────────────────────────────────────────

const demoMySchools = [
	{
		id: 501,
		name: 'Lincoln High School',
		entries: {
			1: { id: 1, code: 'LHS01' },
			2: { id: 2, code: 'LHS02' },
			3: { id: 3, code: 'LHS03' },
		},
		events: {
			101: { id: 101, abbr: 'LD', name: 'Lincoln-Douglas Debate' },
			104: { id: 104, abbr: 'OO', name: 'Original Oratory' },
		},
		students: [
			{ id: 1, first: 'Alice',   last: 'Chen',     eventId: 101, code: 'LHS01' },
			{ id: 2, first: 'Bob',     last: 'Williams', eventId: 101, code: 'LHS02' },
			{ id: 3, first: 'Charlie', last: 'Davis',    eventId: 104, code: 'LHS03' },
		],
		judges: {
			1: { id: 1, first: 'Patricia', last: 'Moore',   categoryAbbr: 'DB', code: 'J-LHS01' },
			2: { id: 2, first: 'David',    last: 'Taylor',  categoryAbbr: 'IE', code: 'J-LHS02' },
		},
	},
];

// ─── Non-registered schools (myChapters) ──────────────────────────────────────

const demoMyChapters = [
	{ id: 601, name: 'Washington Academy' },
	{ id: 602, name: 'Jefferson Preparatory School' },
];

// ─── User tourn data (for rounds sidebar) ─────────────────────────────────────

const demoMyTourn = {
	me: {
		events: [101, 104],
		rounds: [10101, 10102, 10103],
	},
	mine: {
		events: [102],
	},
};

// ─── Generate a mock tournament ──────────────────────────────────────────────

const generateTournament = (overrides: Partial<TournData> = {}): TournData => {
	const start = faker.date.future();
	const end = new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000);

	return {
		id: faker.string.uuid(),
		tournId: faker.number.int({ min: 1000, max: 9999 }),
		webname: faker.number.int({ min: 100, max: 999 }),
		name: faker.company.name() + ' Invitational',
		tz: 'America/New_York',
		location: faker.location.city() + ', ' + faker.location.state({ abbreviated: true }),
		district: 'National',
		state: faker.location.state({ abbreviated: true }),
		country: 'USA',
		start: start.toISOString(),
		end: end.toISOString(),
		regEnd: start.toISOString(),
		regStart: faker.date.past().toISOString(),
		schoolCount: faker.number.int({ min: 5, max: 50 }),
		year: new Date().getFullYear(),
		week: faker.number.int({ min: 1, max: 52 }),
		events: 'LD, PF, CX, Congress',
		circuits: 'National',
		eventTypes: 'Speech, Debate, Congress',
		nsdaCategories: 'Debate',
		online: faker.datatype.boolean() ? 1 : 0,
		inPerson: faker.datatype.boolean() ? 1 : 0,
		hybrid: 0,
		sortnumeric: start.getTime(),
		signup: undefined,
		...overrides
	};
};

// Demo tournament used across the app
export const demoTournament = generateTournament({
	tournId: DEMO_TOURN_ID,
	webname: DEMO_WEBNAME,
	name: 'Demo Championship Tournament',
	location: 'Las Vegas, NV',
	state: 'NV',
	eventTypes: 'Speech, Debate, Congress, Worlds',
	nsdaCategories: 'Speech, Debate',
	inPerson: 1,
	online: 0,
	start: '2026-04-10T08:00:00.000Z',
	end: '2026-04-12T18:00:00.000Z',
	regEnd: '2026-04-08T23:59:00.000Z',
	regStart: '2026-01-15T00:00:00.000Z',
	schoolCount: 42,
});

const tournamentList = [
	demoTournament,
	...Array.from({ length: 15 }, () => generateTournament())
].sort((a, b) => a.sortnumeric - b.sortnumeric);

// ─── Register all mocks ──────────────────────────────────────────────────────

// 1. Upcoming tournaments list
setMock('pages/invite/upcoming', {
	response: (params: any) => {
		const limit = params.limit ? parseInt(params.limit as string) : 256;
		return tournamentList.slice(0, limit);
	},
	delay: 0.3,
});

// 2. NSDA categories
setMock('pages/invite/nsdaCategories', {
	response: [
		{ code: 'IE', name: 'Speech' },
		{ code: 'DB', name: 'Debate' },
		{ code: 'CON', name: 'Congress' },
		{ code: 'WS', name: 'Worlds' },
		{ code: 'MT', name: 'Mock Trial' },
		{ code: 'BP', name: 'BP' }
	],
	delay: 0.1,
});

// 3. User session
setMock('user/session', {
	response: {
		id: 12345,
		userkey: 'mock-user-key',
		email: 'demo@example.com',
		Person: {
			id: 67890,
			email: 'demo@example.com',
			first: 'Demo',
			last: 'User',
			firstName: 'Demo',
			lastName: 'User',
			site_admin: 'No',
			no_email: false,
			timestamp: new Date()
		},
		perms: []
	},
	delay: 0.1,
});

// 4-13. Register mocks for EVERY tournament so all are clickable
const registerTournamentMocks = (tourn: TournData) => {
	const tournId = tourn.tournId;
	const webname = tourn.webname;
	const city = tourn.location?.split(',')[0]?.trim() || 'Unknown City';

	// Webname lookup (used by invite layout)
	setMock(`pages/invite/webname/${webname}`, {
		response: {
			tournId,
			webname: String(webname),
			name: tourn.name,
			start: tourn.start,
			multiYear: false,
		},
		delay: 0.1,
	});

	// Main invite data
	setMock(`rest/tourns/${tournId}/invite`, {
		response: {
			id: tournId,
			name: tourn.name,
			webname: String(webname),
			city,
			state: tourn.state,
			country: tourn.country,
			tz: tourn.tz,
			start: tourn.start,
			end: tourn.end,
			regEnd: tourn.regEnd,
			regStart: tourn.regStart,
			inPerson: tourn.inPerson,
			online: tourn.online,
			hybrid: tourn.hybrid,
			currency: '$',
			events: demoEvents,
			webpages: demoWebpages,
			contacts: demoContacts,
		},
		delay: 0.2,
	});

	// Rounds list
	setMock(`rest/tourns/${tournId}/rounds`, {
		response: demoRounds,
		delay: 0.2,
	});

	// Published invite (results page)
	setMock(`pages/invite/${tournId}`, {
		response: {
			tournId,
			name: tourn.name,
			events: demoEvents.map(e => ({ id: e.id, abbr: e.abbr, name: e.name })),
			rounds: demoRounds.filter(r => r.published === 1),
			files: [],
			pages: demoWebpages,
		},
		delay: 0.2,
	});

	// My schools (registration page)
	setMock(`user/chapter/byTourn/${tournId}/mySchools`, {
		response: demoMySchools,
		delay: 0.2,
	});

	// Non-registered schools
	setMock(`user/chapter/byTourn/${tournId}/nonSchools`, {
		response: demoMyChapters,
		delay: 0.2,
	});

	// User tourn data (rounds sidebar)
	setMock(`user/tourn/${tournId}`, {
		response: demoMyTourn,
		delay: 0.2,
	});

	// Schedule
	setMock(`rest/tourns/${tournId}/schedule`, {
		response: generateSchedule(),
		delay: 0.2,
	});

	// Field reports for each event
	for (const event of demoEvents) {
		setMock(`rest/tourns/${tournId}/events/${event.abbr}/field`, {
			response: {
				id: event.id,
				name: event.name,
				abbr: event.abbr,
				entries: generateFieldEntries(event.id, event.entryCount),
			},
			delay: 0.2,
		});
	}

	// Round schematics (individual rounds)
	for (const round of demoRounds) {
		const event = demoEvents.find(e => e.id === round.eventId)!;
		const sections = Array.from({ length: event.type === 'debate' ? 8 : 4 }, (_, si) => {
			const entries = event.type === 'debate'
				? [
					{ id: si * 2 + 1, code: `${event.abbr}${String(si * 2 + 1).padStart(2, '0')}`, name: `${faker.person.lastName()} & ${faker.person.lastName()}`, side: 'Aff', schoolName: faker.company.name() + ' HS' },
					{ id: si * 2 + 2, code: `${event.abbr}${String(si * 2 + 2).padStart(2, '0')}`, name: `${faker.person.lastName()} & ${faker.person.lastName()}`, side: 'Neg', schoolName: faker.company.name() + ' HS' },
				]
				: Array.from({ length: 6 }, (_, ei) => ({
					id: si * 6 + ei + 1,
					code: `${event.abbr}${String(si * 6 + ei + 1).padStart(2, '0')}`,
					name: `${faker.person.firstName()} ${faker.person.lastName()}`,
					schoolName: faker.company.name() + ' HS',
				}));

			return {
				id: round.id * 100 + si + 1,
				letter: String.fromCharCode(65 + si),
				room: `Room ${100 + si}`,
				entries,
				judges: [
					{ id: si + 1, first: faker.person.firstName(), last: faker.person.lastName(), schoolName: faker.company.name() + ' HS' },
				],
			};
		});

		const startTime = new Date(tournStart.getTime() + round.name * 2 * 60 * 60 * 1000);
		setMock(`pages/invite/${tournId}/${event.abbr}/${round.name}`, {
			response: {
				id: round.id,
				name: round.name,
				label: round.label,
				type: round.type,
				published: round.published,
				tz: 'America/Los_Angeles',
				Event: { id: event.id, abbr: event.abbr, name: event.name, type: event.type },
				sections,
				times: {
					start: startTime.toISOString(),
					end: new Date(startTime.getTime() + 90 * 60 * 1000).toISOString(),
				},
				message: round.type === 'final' ? 'Final Round - Please arrive 15 minutes early' : undefined,
				motion: event.type === 'congress' ? 'A Bill to Reform Federal Student Loan Programs' : undefined,
			},
			delay: 0.2,
		});
	}
};

// Register mocks for every tournament in the list
for (const tourn of tournamentList) {
	registerTournamentMocks(tourn);
}

// 14. General pages (/page/[slug])
const generalPages: Record<string, any> = {
	help: {
		id: 2001,
		title: 'Help & Support',
		slug: 'help',
		content: '<h5>Getting Started</h5><p>Tabroom.com is the premier online tournament management platform for speech and debate.</p><p>For tournament directors: create your tournament, set up events, and manage registration all in one place.</p><p>For coaches: register your school, enter competitors, and track results.</p><h5>Need More Help?</h5><p>Email us at support@tabroom.com or visit our FAQ section.</p>',
		published: true,
	},
};
setMock('pages/pages', {
	response: () => {
		return generalPages['help'];
	},
	delay: 0.2,
});
// Also mock specific slug lookups
for (const [slug, pageData] of Object.entries(generalPages)) {
	setMock(`pages/pages/${slug}`, {
		response: pageData,
		delay: 0.2,
	});
}

console.log(`Mock API initialized: ${Object.keys(mock).length} endpoints registered`);

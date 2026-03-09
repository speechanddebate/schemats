import type { ParadigmDetailsCertificationsItemBadge } from '$indexcards/schemas/paradigmDetailsCertificationsItemBadge';
import type { JudgeRecord } from '$indexcards/schemas/judgeRecord';
import { faker } from '@faker-js/faker';

export function fakeParadigmCertBadge(): ParadigmDetailsCertificationsItemBadge  {
	return {
		altText: faker.lorem.words(3),
		link: faker.internet.url(),
		imageUrl: faker.image.url({width: 100, height: 100}),
	};
}

export function fakeJudgeRecord(): JudgeRecord {
	// Randomly choose between Pro/Con or Aff/Neg convention
	const useProCon = faker.datatype.boolean();
	const labels = useProCon ? ['Pro', 'Con'] : ['Aff', 'Neg'];
	const affLabel = labels[0];
	const negLabel = labels[1];
	const possibleVotes = [...labels];

	return {
		tournName: faker.lorem.words(3),
		roundDate: faker.date.past().toISOString(),
		roundLabel: `R${faker.number.int({min: 1, max: 6})}`,
		eventAbbr: faker.helpers.arrayElement(['PF', 'LD', 'CX']),
		affTeam: `${faker.location.city()} ${faker.string.alpha({ length: 2, casing: 'upper' })}`,
		affLabel: affLabel,
		negTeam: `${faker.location.city()} ${faker.string.alpha({ length: 2, casing: 'upper' })}`,
		negLabel: negLabel,
		vote: faker.helpers.arrayElement(possibleVotes),
		panelVote: faker.helpers.arrayElement(possibleVotes),
		record: `${faker.number.int({min: 0, max: 5})}-${faker.number.int({min: 0, max: 5})}`,
	};
}
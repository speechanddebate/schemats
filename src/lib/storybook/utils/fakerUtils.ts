import type { ParadigmDetailsCertificationsItemBadge } from '$indexcards/schemas/paradigmDetailsCertificationsItemBadge';
import { faker } from '@faker-js/faker';

export function fakeParadigmCertBadge(): ParadigmDetailsCertificationsItemBadge  {
	return {
		altText: faker.lorem.words(3),
		link: faker.internet.url(),
		imageUrl: faker.image.url({width: 100, height: 100}),
	};
}
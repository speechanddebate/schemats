<script lang="ts">
    import TabItem from '$lib/layouts/TabItem.svelte';
    import Tabs from '$lib/layouts/Tabs.svelte';
	import { showDateRange } from '$lib/helpers/dt';
    import { Skeleton } from 'flowbite-svelte';
    import IconButton from '$lib/components/IconButton.svelte';
    import { FileText } from '@lucide/svelte';
    import { SvelteDate } from 'svelte/reactivity';

	const { roles }: { roles: string[] } = $props();
type Tourn = {
	id: number,
	name: string;
	webname: string;
	start: string,
	end: string,
	tz: string,
	livedoc: {
		url: string,
		caption: string,
		},
};

const tourn: Tourn = {
	id: 1,
	name: 'Example Tournament Invitational',
	webname: 'example',
	start: new SvelteDate().toISOString(),
	end: new SvelteDate(new SvelteDate().setDate(new SvelteDate().getDate() + 2)).toISOString(),
	tz: 'America/Chicago',
	livedoc: {
		url: 'fakeurl',
		caption: 'Live Doc',
	},
};

const { dateOutput, timeOutput } = showDateRange({
	startISO: tourn.start,
	endISO: tourn.end,
	tz: tourn.tz,
	showTz: true,
});

</script>
<div class="w-full border-2 rounded-md p-2 border-surface-500">
	<div class="pb-2">
		<div class="flex flex-row flex-wrap">
		<div class="text-xl font-medium flex-grow-1">{tourn.name}</div>
		<a class="flex-grow-1 text-right hover:underline text-primary-600" href="/index/tourn/index.mhtml?tourn_id={tourn.id}">https://{tourn.webname}.tabroom.com</a>
		</div>
		<div>{dateOutput} {timeOutput}</div>
		<!-- TODO
		livedoc
		coach dashboard
		coach regisration
		spaces?
-->
		<div class="flex flex-row flex-wrap">
			{#if (roles.includes('judge'))}
				<div class="flex-grow-1 text-surface-900 font-semibold">Category: JVPF</div>
				<div class="flex-grow-1 text-surface-900 font-semibold text-right">School: Example High School</div>
			{/if}
			{#if (roles.includes('student'))}
				<div class="flex-grow-1 text-surface-900 font-semibold">Event: JVPF</div>
				<div class="flex-grow-1 text-surface-900 font-semibold text-right">Code: 1336</div>
			{/if}
		</div>
		<div class="flex flex-wrap">
			{#if (tourn.livedoc !== null)}
				<div class="relative shadow-sm border border-primary-700 rounded-lg px-2 py-2 m-2 basis-3xs grow">
					<div class="flex justify-center">
						<a class="font-semibold text-center" href={tourn.livedoc.url}>
							{tourn.livedoc.caption ?? 'Live Doc'}
						</a>
					</div>

					<div class="absolute right-2 top-1/2 -translate-y-1/2">
						<IconButton color="primary" label="Live Doc">
							<FileText size="20" />
						</IconButton>
					</div>
</div>
				<div class="shadow-sm border-1 border-primary-700 rounded-lg px-2 py-1 m-2 basis-3xs grow">
				</div>
				<div class="shadow-sm border-1 border-primary-700 rounded-lg px-2 py-1 m-2 basis-3xs grow">
				</div>
			{/if}

		</div>
	</div>
	<Tabs>
		<TabItem title="Info"><Skeleton/></TabItem>
		<TabItem title="Schedule"/>
		{#if (roles.includes('judge'))}
		<TabItem title="Current Ballots"/>
		<TabItem title="Past Ballots"/>
		<TabItem title="Fines"/>
		{/if}
		{#if (roles.includes('student'))}
			<TabItem title= 'Rounds' />
		{/if}
	</Tabs>
</div>

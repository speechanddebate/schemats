<script lang="ts">
	import {
		createRestJudgesUnlinkedSearch,
		createUserJudgesLinkRequests,
		createUserJudgesClaim,
	} from '$indexcards';
	import type {
		UnlinkedJudge,
		RestJudgesUnlinkedSearchParams,
	} from '$indexcards/schemas';
	import { Button } from 'flowbite-svelte';
	import { renderSnippet } from '@tanstack/svelte-table';

	import QueryTable from '$lib/components/utils/QueryTable.svelte';
	import { createAppColumnHelper } from '$lib/components/utils/table.hook';
	import { getPerson } from '$lib/helpers/SessionContext.svelte';
	import { handleOrval } from '$lib/helpers/query';
	import { toast } from '$lib/helpers/toasts';

	let firstInput = $state('');
	let lastInput = $state('');
	let submittedFirst = $state('');
	let submittedLast = $state('');

	const person = $derived(getPerson());

	const unlinkedSearchQuery = createRestJudgesUnlinkedSearch(() => {
		const first = submittedFirst.trim();
		const last = submittedLast.trim();
		const params: RestJudgesUnlinkedSearchParams = {};
		if (first.length > 0) params.first = first;
		if (last.length > 0) params.last = last;
		return params;
	});

	const linkRequestsQuery = createUserJudgesLinkRequests();

	const claimRequest = createUserJudgesClaim();

	// determine if a given row has an active link request by checking if its id is in the lookup sets
	const linkRequests = $derived(handleOrval(linkRequestsQuery) ?? []);
	const isRequested = (row: UnlinkedJudge) => {
		return linkRequests.some((request) => row.type === request.type && row.id === request.id);
	};
	//build the table
	const rows = $derived(handleOrval(unlinkedSearchQuery) ?? []);
	const columnHelper = createAppColumnHelper<UnlinkedJudge>();
	const columns = columnHelper.columns([
		columnHelper.accessor((row) => `${row.first?.trim() ?? ''} ${row.last?.trim() ?? ''}`.trim(), {
			id: 'name',
			header: 'Name',
			size: 220,
		}),
		columnHelper.accessor((row) =>  row.schoolName?.trim() || 'Unaffiliated', {
			id: 'school',
			header: 'School/Team',
			size: 230,
		}),
		columnHelper.accessor((row) => row.tournName ? `${row.tournName ?? 'N/A'}` : `${row.tournCount ?? 0} tournament(s)`, {
			id: 'tournament',
			header: 'Tournament(s)',
			size: 220,
		}),
		columnHelper.display({
			id: 'request',
			header: '',
			enableSorting: false,
			size: 280,
			cell: (info) => renderSnippet(requestCell, info.row.original),
		}),
	]);

	const requestLink = async (row: UnlinkedJudge) => {
		void row;
		const res = await claimRequest.mutateAsync({ params: {
			judgeId: row.type === 'judge' ? row.id : undefined,
			chapterJudgeId: row.type === 'chapter_judge' ? row.id : undefined,
		}});
		if (res.status === 200) {
			toast.success({ message: res.data.message, detail: res.data.detail });
		} else {
			toast.error({ message: 'Failed to submit link request', detail: res.data?.detail });
		}
		unlinkedSearchQuery.refetch();
		linkRequestsQuery.refetch();
	};

	const handleSearchSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		submittedFirst = firstInput;
		submittedLast = lastInput;
		await unlinkedSearchQuery.refetch();
	};

	const searchName = $derived.by(() => {
		const first = submittedFirst.trim();
		const last = submittedLast.trim();
		const joined = `${first} ${last}`.trim();

		if (joined.length > 0) {
			return joined;
		}

		const personFirst = person?.first?.trim() ?? '';
		const personLast = person?.last?.trim() ?? '';
		const accountName = `${personFirst} ${personLast}`.trim();

		return accountName;
	});

	const emptyResultsMessage = $derived.by(
		() => `There are no judges named ${searchName} who are not connected to an account already. If this is in error, ask your team administrator or the tournament director to link your email to your judge record. Or, search for a different name.`,
	);
</script>

{#snippet requestCell(row: UnlinkedJudge)}
	{#if isRequested(row)}
		<span class="block text-center text-sm font-semibold text-red-700">
			Request made, awaiting coach/tournament approval.
		</span>
	{:else}
		<div class="flex justify-center">
			<Button
				class="min-w-[10rem]"
				color="light"
				onclick={() => requestLink(row)}
				type="button"
			>
				Request Link
			</Button>
		</div>
	{/if}
{/snippet}

<div class="flex flex-1 flex-col bg-slate-50 p-3 sm:p-4">
	<section class="rounded-md border border-slate-200 bg-white px-4 py-4 shadow-sm">
		<h2 class="text-xl font-semibold text-slate-900">Unlinked Judges named {searchName}</h2>
		<p class="mt-2 text-sm text-slate-700">
			Link a judge record to your account to be notified of pairings and ballot assignments, and to
			access online ballots. The administrators of your team or school will need to approve claim
			requests before you can access them.
		</p>

		<p class="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
			Do NOT link your account to your school's other judges. That can prevent them from
			accessing online ballots, getting texts, or being contacted by tournaments. If you want
			updates for one of your team's judges, sign up on the tournament's online updates page
			instead.
		</p>
	</section>

	<section class="mt-3 rounded-md border border-slate-200 bg-white px-4 py-4 shadow-sm">
		<h3 class="text-base font-semibold text-slate-900">Name Search</h3>
		<p class="mt-1 text-sm text-slate-700">
			If your judge record name is spelled differently from your account profile, search alternate
			spellings below.
		</p>

		<form class="mt-3 grid pb-3 gap-3 sm:grid-cols-[1fr_1fr_auto]" onsubmit={handleSearchSubmit}>
			<input
				name="first"
				class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
				placeholder="First name"
				type="text"
				bind:value={firstInput}
			/>
			<input
				name="last"
				class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
				placeholder="Last name"
				type="text"
				bind:value={lastInput}
			/>
			<Button class="sm:self-end" color="primary" type="submit">
				{unlinkedSearchQuery.isFetching ? 'Searching...' : 'Search'}
			</Button>
		</form>

		<QueryTable
			{columns}
			containerClass="bg-back w-full"
			data={rows}
			emptyMessage={emptyResultsMessage}
			query={unlinkedSearchQuery}
		/>
	</section>
</div>
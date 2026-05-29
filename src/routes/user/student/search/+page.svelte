<script lang="ts">
	import {
		createRestStudentsUnlinkedSearch,
		createUserStudentsLinkRequests,
		createUserStudentsClaim,
	} from '$indexcards';
	import type {
		UnlinkedStudentSearch,
		RestStudentsUnlinkedSearchParams,
	} from '$indexcards/schemas';
	import { Button } from 'flowbite-svelte';
	import { renderSnippet } from '@tanstack/svelte-table';

	import QueryTable from '$lib/components/utils/QueryTable.svelte';
	import { createAppColumnHelper } from '$lib/components/utils/table.hook';
	import { getPerson } from '$lib/helpers/SessionContext.svelte';
	import { handleRequest } from '$lib/helpers/query';
	import { toast } from '$lib/helpers/toasts';

	let firstInput = $state('');
	let lastInput = $state('');
	let submittedFirst = $state('');
	let submittedLast = $state('');

	const person = $derived(getPerson());

	const unlinkedSearchQuery = createRestStudentsUnlinkedSearch(() => {
		const first = submittedFirst.trim();
		const last = submittedLast.trim();
		const params: RestStudentsUnlinkedSearchParams = {};
		if (first.length > 0) params.first = first;
		if (last.length > 0) params.last = last;
		return params;
	});

	const linkRequestsQuery = createUserStudentsLinkRequests();

	const claimRequest = createUserStudentsClaim();

	// determine if a given row has an active link request by checking if its id is in the lookup sets
	const linkRequests = $derived.by(() => handleRequest(linkRequestsQuery) ?? []);
	const isRequested = (row: UnlinkedStudentSearch) => {
		return linkRequests.some((request) =>  row.id === request.id);
	};

	//build the table
	const rows = $derived.by(() => handleRequest(unlinkedSearchQuery) ?? []);
	const columnHelper = createAppColumnHelper<UnlinkedStudentSearch>();
	const columns = columnHelper.columns([
		columnHelper.accessor((row) => `${row.first?.trim() ?? ''} ${row.last?.trim() ?? ''}`.trim(), {
			id: 'name',
			header: 'Student',
			size: 220,
		}),
		columnHelper.accessor((row) =>  row.Chapter?.name?.trim() || 'Unknown', {
			id: 'chapter',
			header: 'School',
			size: 230,
		}),
		columnHelper.accessor((row) =>  row.Chapter?.state?.trim() || 'Unknown', {
			id: 'state',
			header: 'State',
			size: 20,
		}),
		columnHelper.accessor((row) => `${row.tournCount ?? 0} tournament(s)`, {
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

	const requestLink = async (row: UnlinkedStudentSearch) => {
		void row;
		const res = await claimRequest.mutateAsync({ params: {
			studentId: row.id,
		}});
		if (res.status === 200) {
			toast.success({ message: res.data.message, detail: res.data.detail });
			await linkRequestsQuery.refetch();
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

	const emptyResultsMessage = $derived(`
		There are no unlinked students named ${searchName} who
		are not connected to a Tabroom account already. If this is in
		error, ask your team administrator or the tournament director to
		link your email to your student record.  Or, search for a
		different name.
	`);
</script>
{#snippet requestCell(row: UnlinkedStudentSearch)}
	{#if isRequested(row)}
		<span class="block text-center text-sm font-semibold text-red-700">
			Request made, awaiting coach approval.
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
		<h2 class="text-xl font-semibold text-slate-900">Unlinked Students named {searchName}</h2>
		<p class="mt-2 text-sm text-slate-700">
			Link these students to your persons for updates &amp; ballot
			assignments.  Note: the adminstrators of your team/school will
			have to approve requests to claim a student record before you
			can access them.  Team admins will be notified of requests by
			email.
		</p>

		<p class="semibold bluetext">
			Link only if you are the actual student.
		</p>

		<p>
			Parents/coaches should not link to student records; that will
			interfere with the student's ability to see their ballots,
			enter prefs, or get updates. Parents or coaches should instead
			click "Live Updates" on tournaments to follow along.
		</p>

		<p class="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
			Please only link to your OWN person.  Do not link to a
			teammate or partner's person; you can sign up for updates on a
			per-tournament basis for other entrants.
		</p>
	</section>

	<section class="mt-3 rounded-md border border-slate-200 bg-white px-4 py-4 shadow-sm">
		<h3 class="text-base font-semibold text-slate-900">Name Search</h3>
		<p class="mt-1 text-sm text-slate-700">
			If your student record name is spelled differently from your account profile, search alternate
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
<script lang="ts">
	const messages = [
		{ id: 1, from: 'Demo Championship Tournament', subject: 'Registration Confirmed', date: 'Mar 4, 2026', read: true, body: 'Your registration for 3 entries and 2 judges has been confirmed.' },
		{ id: 2, from: 'State Qualifier Committee', subject: 'Judge Assignment Updated', date: 'Mar 3, 2026', read: false, body: 'You have been assigned to judge Lincoln-Douglas rounds 1-4.' },
		{ id: 3, from: 'Tabroom.com', subject: 'New Features Available', date: 'Mar 1, 2026', read: true, body: 'Check out the new tournament dashboard and improved results viewer.' },
		{ id: 4, from: 'District Tournament', subject: 'Entry Deadline Reminder', date: 'Feb 28, 2026', read: false, body: 'Registration closes in 7 days. Please complete your entries.' },
		{ id: 5, from: 'Winter Invitational', subject: 'Results Posted', date: 'Feb 25, 2026', read: true, body: 'Final results and speaker awards have been posted.' },
		{ id: 6, from: 'NSDA', subject: 'Points Updated', date: 'Feb 20, 2026', read: true, body: 'Your school NSDA points have been updated for the current season.' },
	];
</script>

<h4 class="border-b-2 border-primary-600 pb-2 mb-4">Notifications</h4>

<div class="border border-back-400 rounded">
	{#each messages as msg (msg.id)}
		<div class="flex items-center border-b border-back-300 px-4 py-3 hover:bg-back-100 cursor-pointer
			{msg.read ? '' : 'bg-primary-50 font-medium'}">
			<span class="w-[8px] h-[8px] rounded-full mr-3 {msg.read ? 'bg-back-400' : 'bg-primary-500'}"></span>
			<div class="w-1/4">
				<span class="text-sm {msg.read ? 'text-back-700' : 'text-primary-800'}">{msg.from}</span>
			</div>
			<div class="w-1/2 grow">
				<span class="text-sm">{msg.subject}</span>
				<span class="text-xs text-back-600 ps-2">&mdash; {msg.body}</span>
			</div>
			<div class="w-[100px] text-right text-xs text-back-600">
				{msg.date}
			</div>
		</div>
	{/each}
</div>

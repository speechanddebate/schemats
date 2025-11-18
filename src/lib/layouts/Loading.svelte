<script lang='ts'>

	// An attempt to not have to write the same looping loading/etc code every
	// time. I suspect this is not best practice but haven't found a good
	// example that does it better yet -CLP

	let { tanstackJob, tanstackJobs } = $props();

	if (!tanstackJobs && tanstackJob) {
		tanstackJobs = [tanstackJob];
	} else if (tanstackJob) {
		tanstackJobs.push(tanstackJob);
	}

</script>

	{#each tanstackJobs as job (job) }
		{#if job.status === 'pending'}
			<div class="main">
				<h4>Hold, please</h4>
				<div class='text-success-500 font-semibold'>
					Accessing Data from Indexcards...
				</div>
			</div>
		{:else if job.status === 'error'}
			<div class="main">
				<h4>Oh noes!</h4>
				<p>An error was encountered loading that data</p>
				<h5>Error contents:</h5>
				<pre>{JSON.stringify(job.error, null, 2)}</pre>
			</div>
		{:else if job.isFetching}
			<div class="main">
				<h4>Hold, please</h4>
				<div class='text-success-500 font-semibold'>
					Data Updating...
				</div>
			</div>
		{/if}
	{/each}
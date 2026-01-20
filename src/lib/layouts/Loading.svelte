<script lang='ts'>
	import type { QueryObserverResult } from '@tanstack/svelte-query';
	import { CompletionTriggerKind } from 'typescript';

	/* An attempt to not have to write the same looping loading/etc code every
	time. I suspect this is not best practice but haven't found a good example
	that does it better yet -CLP */

	interface LoaderProps {
		tanstackJob?  : QueryObserverResult,
		tanstackJobs? : Array<QueryObserverResult>,
	};

	interface loaderState {
		tag        : string,
		error      : string,
		isFetching : boolean,
	}

	let {tanstackJob = '', tanstackJobs = [] }:LoaderProps = $props();

	let loadStatus:loaderState = $derived.by( () => {

		let jobStatus:loaderState = {
			tag        : '',
			error      : '',
			isFetching : false,
		};

		[...tanstackJobs, tanstackJob].forEach( (job) => {

			if (jobStatus.tag === 'error') {
				return;
			}

			if (job.status === 'error') {
				jobStatus.tag = 'error';
				jobStatus.error = job.error;
				jobStatus.isFetching = false;
			} else {
				if (jobStatus.tag !== 'ready') {
					jobStatus.tag = job.status;
					jobStatus.isFetching = job.isFetching;
				}
			}
		});

		return jobStatus;
	});

</script>

	{#if loadStatus.tag === 'pending'}
		<div class="main pt-4 ps-4">
			<h4>Hold, please</h4>
			<div class='text-success-500 font-semibold'>
				Accessing Data from Indexcards...
			</div>
		</div>
	{:else if loadStatus.tag === 'error'}
		<div class="main pt-4 ps-4">
			<h4>Oh noes!</h4>
			<p>An error was encountered loading that data</p>
			<h5>Error contents:</h5>
			<pre>{JSON.stringify(loadStatus.error, null, 2)}</pre>
		</div>
	{:else if loadStatus.isFetching}
		<div class="main pt-4 ps-4">
			<h4>Just a minute</h4>
			<div class='text-success-500 font-semibold'>
				Data Updating...
			</div>
		</div>
	{/if}
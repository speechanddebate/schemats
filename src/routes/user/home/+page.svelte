<script lang="ts">
	import { CLASSIC_URL } from '$app/env/public';
</script>

<div class="flex flex-col gap-4">
	<div class="rounded-md border border-yellow-200 bg-yellow-50 p-4">
		<h2 class="text-lg font-semibold text-yellow-900">Page Under Development</h2>
		<p class="mt-2 text-sm text-yellow-800">
			This page is still in progress. If you don't see what you need, please visit the
			<a
				class="font-semibold underline hover:text-yellow-900"
				href={`${CLASSIC_URL}/user/setup.mhtml`}
				rel="noopener noreferrer"
				target="_blank"
			>
				legacy user home page
			</a>.
		</p>
	</div>
</div>

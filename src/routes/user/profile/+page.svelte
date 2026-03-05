<script lang="ts">
	import { indexFetch } from '$lib/indexfetch';

	const sessionData = indexFetch('/user/session');

	const profile = {
		first: 'Demo',
		middle: '',
		last: 'User',
		email: 'demo@example.com',
		phone: '(555) 123-4567',
		nsda: 1234567,
		school: 'Lincoln High School',
		city: 'Las Vegas',
		state: 'NV',
	};
</script>

<h4 class="border-b-2 border-primary-600 pb-2 mb-4">Profile Settings</h4>

<div class="max-w-lg">
	<div class="flex border-b border-back-300 py-3">
		<span class="w-1/3 font-semibold text-sm">First Name</span>
		<span class="w-2/3">
			<input class="w-full p-1 border border-back-400 rounded text-sm" value={profile.first} type="text" />
		</span>
	</div>
	<div class="flex border-b border-back-300 py-3">
		<span class="w-1/3 font-semibold text-sm">Middle Name</span>
		<span class="w-2/3">
			<input class="w-full p-1 border border-back-400 rounded text-sm" value={profile.middle} type="text" />
		</span>
	</div>
	<div class="flex border-b border-back-300 py-3">
		<span class="w-1/3 font-semibold text-sm">Last Name</span>
		<span class="w-2/3">
			<input class="w-full p-1 border border-back-400 rounded text-sm" value={profile.last} type="text" />
		</span>
	</div>
	<div class="flex border-b border-back-300 py-3">
		<span class="w-1/3 font-semibold text-sm">Email</span>
		<span class="w-2/3">
			<input class="w-full p-1 border border-back-400 rounded text-sm" value={profile.email} type="email" />
		</span>
	</div>
	<div class="flex border-b border-back-300 py-3">
		<span class="w-1/3 font-semibold text-sm">Phone</span>
		<span class="w-2/3">
			<input class="w-full p-1 border border-back-400 rounded text-sm" value={profile.phone} type="tel" />
		</span>
	</div>
	<div class="flex border-b border-back-300 py-3">
		<span class="w-1/3 font-semibold text-sm">NSDA ID</span>
		<span class="w-2/3 text-sm text-back-700">{profile.nsda}</span>
	</div>
	<div class="flex border-b border-back-300 py-3">
		<span class="w-1/3 font-semibold text-sm">School</span>
		<span class="w-2/3 text-sm">{profile.school} &mdash; {profile.city}, {profile.state}</span>
	</div>

	<div class="mt-4">
		<button class="bg-primary-700 text-white px-4 py-2 rounded text-sm hover:bg-primary-600">
			Save Changes
		</button>
	</div>
</div>

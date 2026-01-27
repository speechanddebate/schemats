<script lang="ts">
    import { indexFetchOnce } from "$lib/indexfetch";

    let firstName = $state("");
    let lastName = $state("");

    async function lookup(event: SubmitEvent) {
        event.preventDefault();
        (document.getElementById("p-search") as HTMLButtonElement).disabled =
            true;

        const judgeInfo = indexFetchOnce(
            `/user/judge?first=${firstName}&last=${lastName}`,
        );
    }
</script>

<div class="w-full h-full justify-center grid p-8">
    <h1 class="px-1 text-6xl md:text-4xl font-semibold text-black mt-2 mb-4">
        Paradigm Lookup
    </h1>
    <form class="grid space-y-4" onsubmit={lookup}>
        <label class="sr-only" for="first-name">First Name</label>
        <input
            id="first-name"
            class="rounded-lg px-4 py-3 text-lg"
            placeholder="First Name"
            required
            type="text"
            bind:value={firstName}
        />
        <label class="sr-only" for="last-name">Last Name</label>
        <input
            id="last-name"
            class="rounded-lg px-4 py-3 text-lg"
            placeholder="Last Name"
            required
            type="text"
            bind:value={lastName}
        />
        <button
            id="p-search"
            class="disabled:bg-gray-500 text-white bg-blue-400 rounded-md px-6 py-3 text-lg"
            type="submit">Search</button
        >
    </form>
</div>

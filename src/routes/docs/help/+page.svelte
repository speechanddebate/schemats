<script lang="ts">
  import Page from '$lib/layouts/Page.svelte';
  // import Loading from '$lib/layouts/Loading.svelte';
  import content from './help.content.html?raw';
  const pageData = {
    title: "Getting Help with Tabroom",
    // description: "Learn about the goals, history, and help resources for Tabroom.com.",
    content,
  }
</script>

<svelte:head>
  <title>Help - Tabroom</title>
</svelte:head>

<!-- <Loading tanstackJob={pageData} />

{#if pageData} -->
  <Page pageData={pageData} />
<!-- {/if} -->
  
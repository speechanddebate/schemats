<script lang="ts">
	import { indexFetch } from '$lib/indexfetch';

	import Loading from '$lib/layouts/Loading.svelte';
	import ResultSet from './ResultSet.svelte';

    import type { PageProps } from './$types';
    import { createGetResultSet } from '$indexcards';
	import { parse } from '$lib/helpers/query';
    import { goto } from '$app/navigation';
    import { toast } from '$lib/helpers/toasts';

	//if tourn is already set by a parent and is required for page load why use context? just get it from the page data.
	//while we're here, get params from the pageProps not app/state. makes it easier to test and a change of params will change the route anyways.
	//one less import
	const { data, params }: PageProps = $props();
	//const tourn:Tourn = getContext('webnameTourn');

	// I am of the opinion that this should also be set and passed as PageData or context. maybe even in the same place we set the webname.
	// yes tanstack lets us declare a call anywhere but in cases like this where it already is hierarchical usage, just declaring the
	//query once and being able to use it anywhere with data.myTourn or something seems like less code than creating the query
	// over and over. It also enables easy changes to the options for all usages rather than hunting down every call
	let myTourn = $derived.by( () => {
		return indexFetch(`/user/tourn/${data.tourn.id}`);
	});

	/** the function call and typed indexfetch do functionally the same thing. A few reasons I prefer the function call
	 *  1) typing. The function call is strongly typed to the possible responses of that endpoint without actually having to know what that type is.
	 *  with indexfetch you'd have to lookup/know what the type is. and if that endpoint ever changed it's type (maybe we decided to take
	 * 2 endpoints with the same type and make them separate) you would have to remember to find and update the usages and you can't easily use grep
	 * or an LSP to find them. with the functions, you just update the endpoints, run npm run orval then npm run typecheck and it will tell
	 * you if the new type causes any problem or if it'll just work.
	 * 2) easy overrides. the example I wrote below doesn't actually need it but all query options can be easily overridden. you can also supply
	 * a different fetch function which is needed to work in svelte load functions. also generates prefetch functions which will be handy
	 * when we get to an 'optimizing' stage.
	 *  3) makes indexcards pretty flexible. I can change type, endpoints, response and as long as i don't change the operationId, I
	 * know it will just work. I like that schemats doesn't need to know much about how indexcards is structured.
	 * 4) testing. orval also generates msw mocks for all the endpoints and while the data itself is nonsense. it matches the types
	 * can be easily overridden on a case by case basis if i need it to say something specific. nice time saver.
	 * **/
	let resultSetQuery = createGetResultSet(
		() => data.tourn.id,
		() => Number(params.resultSetId),
		undefined,
		() => ({
			query: {
				enabled: 'pigs can fly' !== 'true',
			},
		})
	);
	//let resultSetFetch = $derived(indexFetch<ResultSet>(`/rest/tourns/${data.tourn.id}/results/${params.resultSetId}`));

	/** Regardless of which method we choose, we need to talk about standard error handling because I've done a bit more experimenting
	 * and I don't think our current solution covers all of our use cases.
	 * there are 2 main types of errors we can get 1) query error thrown by tanstack when it couldn't even make the request and
	 * 2) problem responses from the API.
	 * Query errors are the easier bit. I think we can have global handler logic for those in something but the tricky bit is that
	 * because we are not using page load functions, errors do not enter the +error.svelte handler and must be handled in each page.
	 * The implication of that there is ALWAYS a chance the data is undefined and must be checked for every call. or we could use load
	 * functions but that has another set of tradeoffs.
	 * for problem responses, indexfetch and the handleOrval function I wrote handle them in different ways and I think both are
	 * insufficient. indexfetch throws the problem as an error but A) this isn't guaranteed to be caught by anything and B) sometimes
	 * a non 2XX response is expected and should be handled by the page. When I wrote handleOrval, I had default toast messages and
	 * allowed overriding the handlers but the handlers don't play nice in a $derived which is kinda the point.
	 *
	 * I think something like this may be the happy middle. this function returns either the res or a problem object and this can
	 * be used by the page however it sees fit. We could write something that uses an effect() to display a message if needed or
	 * the page could handle the problem inline. a parse method could also be the place to handle query errors globally.
	 */
	const { res, problem } = $derived(parse(resultSetQuery));

	/** if custom actions need to be preformed on specific problem, they can then be handled like so.
	 * these could for sure be wrapped in a function for better reusability. eg:
	 * toastProblem(problem)
	*/
	$effect(() => {
		if (problem) {
			if(problem.status === 401) {
				goto('/auth/login');
			}
			else{
				toast.error({ message: 'There was a problem getting the results' });
			}
		}
	});
	//no idea why it's an array
	const resultSet = $derived(res?.[0]);

/**
 * Also made some changes to how the page renders to give a bit better UX. Before, on every nav the entire screen would rerender,
 * sidebar and all. I refactored it to maintain as much on screen as possible between renders
*/
</script>
	<div class="main">
		<div class="
			flex
			bt-0 mt-0
			border-b-2 border-primary-600
			pb-2 mb-2
		">
			<span class="w-3/5 justify-around flex flex-col">
				<h4 class='pb-1 my-0 leading-8'>
					{ resultSet?.Event.name }
				</h4>
			</span>

			<span class="w-2/5 content-right m-0 p-0 flex flex-col justify-around">
				<h6 class='py-0 leading-3 pb-0.5 text-right font-semibold'>
					{ data.tourn.start.toString().substring(0, 4) }
					{ data.tourn.name }
				</h6>
			</span>
		</div>
		<!--I think loading could be extended by utilizing children. I think it should have a default component but allow a
		custom child component. we may also be able to wrap the whole if loading else blah blah blah action in it with named
		slots and such.
		-->
		{#if resultSetQuery.isPending}
		<Loading tanstackJobs={ [myTourn, resultSetQuery] }></Loading>
		{:else if problem}
			<div class="flex justify-center py-6">
				<div class="max-w-3xl w-full rounded border border-primary-300 bg-base-100 p-4">
					<p class="font-semibold mb-2">There was a problem getting the results</p>
					<pre class="text-sm whitespace-pre-wrap break-words">{JSON.stringify(problem, null, 2)}</pre>
				</div>
			</div>
		{:else if resultSet}
			{#if resultSet?.tag === 'bracket' || resultSet?.tag === 'table' }

				<p>I haven't done the {resultSet.tag} report on the beta; it's
				kind of tricky code, if fun.  For now, look at Tabroom Classic.</p>

			{:else}
				<ResultSet
					resultSet = {resultSet}
					tourn     = {data.tourn}
				/>
			{/if}
		{/if}
	</div>
<script lang="ts">

	import {
		Footer,
		FooterCopyright,
		FooterLink,
		FooterLinkGroup,
	} from 'flowbite-svelte';

	const footerLinkClass = `
		hover:text-secondary-300
		hover:bg-primary-400
		text-center
		p-4
		radius-lg
		hover:underline
		hover:decoration-solid decoration underline-offset-4 hover:decoration-secondary-300
	`;

</script>

<div class='min-h-[96px] bg-primary-500 px-6 rounded-t-none'>

	<Footer
		class="bg-primary-700"
	>
		<div class='items-center py- w-full block'>
			<div class='md:w-3/4 content-center mx-auto'>
				<FooterLinkGroup
					class = "flex flex-wrap items-center mt-2
						text-md text-secondary-400 w-full
						sm:mt-0 font-semibold sm:items-center sm:justify-between
					"
				>
				<FooterLink
					class={footerLinkClass}
					href="https://www.speechanddebate.org/join/">Join the NSDA</FooterLink>
				<FooterLink
					class={footerLinkClass}
					href="https://www.speechanddebate.org/mission">Mission</FooterLink>
				<FooterLink
					class={footerLinkClass}
					href="/page/about">About</FooterLink>
				<FooterLink
					class={footerLinkClass}
					href="/page/help">Help</FooterLink>
				<FooterLink
					class={footerLinkClass}
					href="https://www.speechanddebate.org/privacy-policy">Privacy</FooterLink>
				<FooterLink
					class={footerLinkClass}
					href="https://www.speechanddebate.org/terms-conditions">Terms</FooterLink>

				</FooterLinkGroup>
			</div>

			<div class='mx-auto w-full py-4'>
				<FooterCopyright
					class = "text-primary-100 hover:text-primary-400 font-medium mx-auto text-center pt-4"
					by    = "National Speech & Debate Assocation™"
					href  = "https://www.speechanddebate.org"
					year  = {new Date().getFullYear()}
				/>
			</div>
		</div>
	</Footer>

</div>
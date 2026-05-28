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
		role="contentinfo"
	>
		<div class='items-center py- w-full block'>
			<div class='md:w-3/4 content-center mx-auto'>
			<nav aria-label="Footer links">
				<FooterLinkGroup
					class = "flex flex-wrap items-center mt-2
						text-md text-secondary-300 w-full
						sm:mt-0 font-semibold sm:items-center sm:justify-between
					"
				>
				<FooterLink
					class={footerLinkClass}
					href="https://www.speechanddebate.org/join/"
					rel="noopener noreferrer"
				>Join the NSDA</FooterLink>
				<FooterLink
					class={footerLinkClass}
					href="https://www.speechanddebate.org/mission"
					rel="noopener noreferrer"
				>Mission</FooterLink>
				<FooterLink
					class={footerLinkClass}
					href="/page/about">About</FooterLink>
				<FooterLink
					class={footerLinkClass}
					href="/page/help">Help</FooterLink>
				<FooterLink
					class={footerLinkClass}
					href="https://www.speechanddebate.org/privacy-policy"
					rel="noopener noreferrer"
				>Privacy</FooterLink>
				<FooterLink
					class={footerLinkClass}
					href="https://www.speechanddebate.org/terms-conditions"
					rel="noopener noreferrer"
				>Terms</FooterLink>

				</FooterLinkGroup>
			</nav>
			</div>

			<div class='mx-auto w-full py-4'>
				<FooterCopyright
					class = "text-primary-50 hover:text-primary-200 font-medium mx-auto text-center pt-4"
					by    = "National Speech & Debate Assocation™"
					href  = "https://www.speechanddebate.org"
					rel   = "noopener noreferrer"
					year  = {new Date().getFullYear()}
				/>
			</div>
		</div>
	</Footer>

</div>
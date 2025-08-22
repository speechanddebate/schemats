<script lang="ts">

	import {
		Footer,
		FooterCopyright,
		FooterLink,
		FooterLinkGroup,
	} from 'flowbite-svelte';

	const footerLinkClass = `
		hover:text-warning-400
		hover:underline
		hover:decoration-solid decoration underline-offset-4 hover:decoration-warning-400
	`;

</script>

<div class='min-h-[128px] bg-primary-1000 px-4'>

	<Footer
	>
		<div class='items-center py-6 w-full block'>
			<div class='md:w-3/4 content-center mx-auto'>
				<FooterLinkGroup
					class = "flex flex-wrap items-center mt-3
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

			<div class='mx-auto w-full pt-6'>
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
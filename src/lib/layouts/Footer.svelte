<script lang="ts">

	import {
		Footer,
		FooterCopyright,
		FooterLink,
		FooterLinkGroup,
	} from 'flowbite-svelte';

</script>

<div class='min-h-[128px] bg-primary-1000 px-4'>

	<Footer
	>
		<div class='items-center pt-4 block'>
			<div class='md:w-3/4 content-center mx-auto'>
				<FooterLinkGroup
					ulClass="flex flex-wrap sm:items-center sm:justify-between items-center mt-3
						text-md text-secondary-400 w-full sm:mt-0 font-semibold
					"
				>
				  <FooterLink
				  	classA="hover:text-warning-400"
				  	href="https://www.speechanddebate.org/join/">Join the NSDA</FooterLink>
				  <FooterLink
				  	classA="hover:text-warning-400"
				  	href="https://www.speechanddebate.org/mission">Mission</FooterLink>
				  <FooterLink
				  	classA="hover:text-warning-400"
					href="/about">About</FooterLink>
				  <FooterLink
				  	classA="hover:text-warning-400"
				  	href="/help">Help</FooterLink>
				  <FooterLink
				  	classA="hover:text-warning-400"
				  	href="https://www.speechanddebate.org/privacy-policy">Privacy</FooterLink>
				  <FooterLink
				  	classA="hover:text-warning-400"
				  	href="https://www.speechanddebate.org/terms-conditions">Terms</FooterLink>

				</FooterLinkGroup>
			</div>

			<div class='mx-auto'>
				<FooterCopyright
					classSpan = "text-neutral-400 hover:text-primary-400 font-medium mx-auto text-center pt-4"
					href      = "https://www.speechanddebate.org"
					by        = "National Speech & Debate Assocation™"
					year      = {2025}
				/>
			</div>
		</div>
	</Footer>

</div>
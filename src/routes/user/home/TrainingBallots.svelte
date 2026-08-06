<script lang="ts">

type Training = {
	id: number,
	training_label: string,
	training_room: string,
	training_time: string,
	event_type: string,
	aff_label: string,
	neg_label: string,
	start_text: string,
	start: string,
	event_id: number,
	judge_id: number,
};

const { trainings }: { trainings: Training[] } = $props();
</script>
		{#if (trainings.length > 0)}
			<span class="half padright">

				<h5>
					Training Ballots
				</h5>

				{#each trainings as training (training.id)}
					<div class = "bluebordertop odd marbottom" title = "Training Ballot">

						<div class='full flexrow'>
							<span class='quarter semibold padleft'>
								Round
							</span>
							<span class="threequarters flexrow">
								<span class='fourfifths padvertless'>
									{training.training_label}
								</span>
								<span class='fifth rightalign'>
									<a
										class  = "buttonwhite bluetext fa fa-table fa-sm"
										target = "_blank"
										title  = "Public Round Schematic"
									></a>
								</span>
							</span>
						</div>

						<div class='full flexrow ltbordertop padvert'>
							<span class='quarter semibold padleft'>
								Room
							</span>
							<span class='threequarters'>
								{training.training_room}
							</span>
						</div>

						<div class='full flexrow ltbordertop'>
							<span class='quarter semibold padvert padleft'>
								Start
							</span>
							<span class='threequarters nospace'>
								{training.training_time ? training.training_time : 'TBA'}
							</span>
						</div>

						<div class='full flexrow ltborderbottom ltbordertop'>
							<span class='quarter semibold padleft'>
								Entries
							</span>

							<span class='threequarters padvertless smallish'>

							{#if (training.event_type === 'debate')}

								<div class="leftalign full padvertless flexrow">
									<span class="fifth semibold nospace">
										{training.aff_label}
									</span>
									<span class="fourfifths nospace">
										South High School A
									</span>
								</div>

								<div class="leftalign full padvertless flexrow">
									<span class="fifth nospace semibold">
										{training.neg_label}
									</span>
									<span class="fourfifths nospace">
										North High School Z
									</span>
								</div>
							{:else}
								{#each Array.from({length: 6}, (_, i) => i + 1) as order (order)}
									<span class="threetenths padvertless smallish flexrow wrap">
										<span class="fifth semibold">
											{training.event_type === 'speech' ? order : ''}
										</span>
										<span class="fourfifths">
											{`${order}${order}${order}${order}`}
										</span>
									</span>
								{/each}
							{/if}
							</span>
						</div>

						<div class='full ltbordertop flexrow wrap'>
							{#if (training.start_text)}
								<div class="full padvert padleftmore nospace explain semibold leftalign graytext padbottom">
									{training.start_text}
								</div>
							{/if}

							<div class="full flexrow padbottom">

								<span class="half centeralign">
								</span>

								<span class="half centeralign padright">
									<a
										class="greentext buttonwhite invert marno padmore"
										href="training.mhtml?sample=1&event_id={training.event_id}&judge_id={training.judge_id}"
									>
										{training.start}
									</a>
								</span>
							</div>
						</div>
					</div>
				{/each}
			</span>
		{/if}
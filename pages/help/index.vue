<template>
	<div class="grid grid--small">
		<div class="grid__container">
			<h1 class="heading">FAQS</h1>

			<section class="block">
				<div
					v-for="faq in faqs"
					:key="faq.problem"
					class="slab"
				>
					<div class="slab__header">
						<p class="heading2">{{ faq.problem }}</p>
						<div class="cross">
							<span class="line line-top"></span>
							<span class="line line-bottom"></span>
						</div>
					</div>

					<div class="slab__txt">
						<!-- solution -->
						<div class="slab-solution">
							{{ faq.solution }}
						</div>

						<!-- options -->
						<div
							v-if="faq.options"
							class="slab-options"
						>
							<ul>
								<li
									v-for="option in faq.options"
									:key="option"
								>
									{{ option }}
								</li>
							</ul>
						</div>

						<!-- links -->
						<div
							v-if="faq.links"
							class="slab-links"
						>
							<ul>
								<li
									v-for="link in faq.links"
									:key="link.name"
								>
									<a
										:href="link.link"
										target="_blank"
									>{{
										link.name
									}}</a>
								</li>
							</ul>
						</div>

						<!-- note -->
						<div
							v-if="faq.note"
							class="slab-note"
						>
							{{ faq.note }}
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from '@nuxtjs/composition-api'
const faqs = [
	{
		problem: "I can't receive invites from my friends",
		solution:
			"Make sure you have enabled notifications for the app. You can trigger the browser's notification permission prompt by toggling the notifications switch within the app. if it doesn't work, try the following:",
		options: [
			'If you are using Chrome, click on the lock icon in the address bar and select permissions. Then enable notifications.',
			'If you are using Firefox, click on the lock icon in the address bar and then enable notifications.',
			'If you are using Opera, click on the shield icon in the address bar and select permissions. Then enable notifications.',
			'If you are using Opera mini, have some shame and switch to a real browser.',
		],
		note: "Currently, the app only supports background notifications. Make sure you don't have the app open in a tab in your browser.",
	},
	{
		problem: "I can't see the app icon on my app drawer",
		solution:
			"Open the app in your browser and click on the menu button (often appears as three dots) in the top or bottom right corner, then click on 'Add to home screen'.",
	},
	{
		problem: 'The colours look funny on my phone',
		solution:
			'The app is not optimized for dark mode. Switch to light mode while using the app.',
	},
	{
		problem: 'The wait time is too long',
		solution:
			'The wait time is determined by the number of people currently playing the game. The less the number of people, the longer the wait time as there are less chances of finding a match.',
	},
	{
		problem: 'Is the source code available?',
		solution: 'Yes, the source code is available on:',
		links: [
			{
				name: 'frontend repository',
				link: 'https://github.com/AustinMusiku/xoisland',
			},
			{
				name: 'backend repository',
				link: 'https://github.com/AustinMusiku/XOserver',
			},
		],
	},
]
onMounted(() => {
	const crosses = document.querySelectorAll('.cross')
	const slabs = document.querySelectorAll('.slab')
	const slabHeaders = document.querySelectorAll('.slab__header')
	const slabTxts = document.querySelectorAll('.slab__txt')

	slabHeaders.forEach((slabHeader, index) => {
		slabHeader.addEventListener('click', () => {
			slabs[index].classList.toggle('active')
			crosses[index].classList.toggle('active')
			slabTxts[index].classList.toggle('active')
		})
	})
})
</script>

<style lang="scss" scoped>
.layout-wrapper {
	background-color: $clr-light !important;
}
.grid {
	.grid__container {
		height: fit-content;
		min-height: 105vh !important;
	}
}
.heading {
	margin: 1em 0 0;
}
.block {
	width: 100%;
	padding: 1em 0 2.5em;

	.slab {
		padding: 2em 0;
		display: flex;
		flex-direction: column;
		gap: 1em;
		border-bottom: 1px solid $clr-dark;

		.slab__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			cursor: pointer;

			.heading2 {
				max-width: 90%;
				font-size: 1.8em;
			}

			.cross {
				position: relative;
				width: 25px;
				height: 25px;

				.line {
					position: absolute;
					width: 2px;
					height: 100%;
					background-color: $clr-dark;
					transition: all 0.25s ease;

					&.line-top {
						top: 0;
						left: 50%;
						transform: translateX(-50%) rotate(0deg);
					}

					&.line-bottom {
						top: 0%;
						left: 50%;
						transform: translateX(-25%) rotate(-90deg);
					}
				}

				&.active {
					.line {
						&.line-top {
							transform: translateX(-25%) rotate(90deg);
						}
						&.line-bottom {
							transform: translateX(-25%) rotate(90deg);
						}
					}
				}
			}
		}

		.slab__txt {
			display: none;
			padding: 0;
			max-width: 75ch;
			line-height: 1.6;

			&.active {
				display: flex;
				flex-direction: column;
				gap: 0.25em;
			}

			* {
				font-family: $ff-alt;
			}

			.slab-options,
			.slab-links {
				margin: 0 0 0 1.2em;

				ul {
					list-style: disc;
					margin: 0;
					padding: 0;

					li {
						margin: 0;
						padding: 0;
						line-height: 1.6;
					}
				}
			}

			.slab-links {
				ul {
					li {
						text-decoration: underline;
						line-height: 1.6;
					}
				}
			}

			.slab-note {
				padding: 0.5em;
				font-size: 0.9em;
				font-style: italic;
			}
		}
	}
}
@media screen and(max-width: 768px) {
	.block {
		padding-top: 2em;
		.slab {
			padding: 1.25em 0;

			.slab__header {
				.heading2 {
					max-width: 80%;
					font-size: 1.5em;
				}

				.cross {
					width: 25px;
					height: 25px;
				}
			}
		}
	}
}
</style>

import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import { schematsTheme } from './schemats-theme.ts';

// Why is this fucking getter automatically created?
delete schematsTheme.schematsTheme;

export default {
	darkMode : 'selector',
	content  : [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/svelte-5-ui-lib/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}',
		'./node_modules/svelte-animated-icons/**/*.{html,js,svelte,ts}',
	],
	theme: {
		extend: {
			colors: {
				//Primary is NSDA Blue: #00abe8;
				'primary' : {
					DEFAULT : '#00abe8',
					50  : '#d9f2fc',
					100 : '#cceefa',
					200 : '#bfeaf9',
					300 : '#99ddf6',
					400 : '#4dc4ef',
					500 : '#00abe8',
					600 : '#009ad1',
					700 : '#0080ae',
					800 : '#00678b',
					900 : '#005472',
				},

				// Secondary NSDA Yellow Sparky #fec937
				secondary : {
					DEFAULT : '#fec937',
					50 	: '#fff7e1',
					100	: '#fff4d7',
					200	: '#fff2cd',
					300	: '#ffe9af',
					400	: '#fed973',
					500	: '#fec937',
					600	: '#e5b532',
					700	: '#bf9729',
					800	: '#987921',
					900	: '#7c621b',
				},
				// tertiary | #85198C' Deep Purple Rarely Used
				tertiary : {
					50	: '#edddee',
					100	: '#e7d1e8',
					200	: '#e1c6e2',
					300	: '#cea3d1',
					400	: '#aa5eaf',
					500	: '#85198C',
					600	: '#78177e',
					700	: '#641369',
					800	: '#500f54',
					900	: '#410c45',
				},
				// success | #4C8D00' Green Compliment to Sparky Orange
				success : {
					50	: '#e4eed9',
					100	: '#dbe8cc',
					200	: '#d2e3bf',
					300	: '#b7d199',
					400	: '#82af4d',
					500	: '#4C8D00',
					600	: '#447f00',
					700	: '#396a00',
					800	: '#2e5500',
					900	: '#254500',
				},
				// warning | #da6110' NSDA Sparky Orange
				warning : {
					50	: '#f9e7db',
					100	: '#f8dfcf',
					200	: '#f6d8c3',
					300	: '#f0c09f',
					400	: '#e59058',
					500	: '#da6110',
					600	: '#c4570e',
					700	: '#a4490c',
					800	: '#833a0a',
					900	: '#6b3008',
				},
				// error | #c20000' Deep Red compliment of Primary
				error : {
					50	: '#f6d9d9',
					100	: '#f3cccc',
					200	: '#f0bfbf',
					300	: '#e79999',
					400	: '#d44d4d',
					500	: '#c20000',
					600	: '#af0000',
					700	: '#920000',
					800	: '#740000',
					900	: '#5f0000',
				},
				// surface | #fafafa' Light Neutral Gray
				surface : {
					50	: '#fefefe',
					100	: '#fefefe',
					200	: '#fefefe',
					300	: '#fdfdfd',
					400	: '#fcfcfc',
					500	: '#fafafa',
					600	: '#e1e1e1',
					700	: '#bcbcbc',
					800	: '#969696',
					900	: '#7b7b7b',
				},
			},
		},
	},
	plugins: [typography, forms, containerQueries],
} satisfies Config;


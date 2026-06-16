<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import TextAlign from '@tiptap/extension-text-align';
	import {
		Undo,
		Redo,
		Bold,
		Italic,
		Strikethrough,
		RemoveFormatting,
		Underline,
		TextAlignStart,
		TextAlignCenter,
		TextAlignEnd,
	} from '@lucide/svelte';

	let {
		content = $bindable(''),
		autoSaveFn = () => {},
		autoSaveDelay = 5000,
	}: {
		content?: string,
		autoSaveFn?: (content: string) => void,
		autoSaveDelay?: number
	} = $props();

	let editorElement: HTMLDivElement;
	let editorState = $state({ editor: null as Editor | null });
	let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null;

	onMount(() => {
		editorState.editor = new Editor({
			element: editorElement,
			extensions: [
				StarterKit,
				TextAlign.configure({
					types: ['heading', 'paragraph'],
				}),
			],
			content,
			editorProps: {
				attributes: {
					// Make sure the editor is announced as a rich text editor
					'aria-label': 'Rich Text Editor',
					// editor accepts multiline input
					'aria-multiline': 'true',
					'aria-readonly': 'false',
				},
			},
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editorState = { editor: editorState.editor };
			},
			onUpdate: ({ editor }) => {
				// Update the bindable content when editor changes
				content = editor.getHTML();

				// Debounce auto-save
				if (autoSaveTimeout) {
					clearTimeout(autoSaveTimeout);
				}
				autoSaveTimeout = setTimeout(() => {
					autoSaveFn(content);
				}, autoSaveDelay);
			},
		});
	});
	onDestroy(() => {
		if (autoSaveTimeout) {
			clearTimeout(autoSaveTimeout);
		}
		editorState.editor?.destroy();
	});

	function clearFormatting() {
		editorState.editor?.chain()
			.focus()
			.unsetAllMarks()
			.clearNodes()
			.run();
	}
</script>

<!-- Toolbar -->
{#if editorState.editor !== null }
	<div class="toolbar">

		<button
			disabled={!editorState.editor?.can().undo()}
			onclick={() => editorState.editor?.commands.undo()}
			title="Undo"
		>
			<Undo size="16" />
		</button>
		<button
			disabled={!editorState.editor?.can().redo()}
			onclick={() => editorState.editor?.commands.redo()}
			title="Redo"
		>
			<Redo size="16" />
		</button>

		<div class='divider'></div>

		<button
			class:active={editorState.editor?.isActive('bold')}
			onclick={() => editorState.editor?.chain().focus().toggleBold().run()}
			title="Bold"
		>
			<Bold size="16" />
		</button>

		<button
			class:active={editorState.editor?.isActive('italic')}
			onclick={() => editorState.editor?.chain().focus().toggleItalic().run()}
			title="Italic"
		>
			<Italic size="16" />
		</button>

		<button
			class:active={editorState.editor?.isActive('strike')}
			onclick={() => editorState.editor?.chain().focus().toggleStrike().run()}
			title="Strikethrough"
		>
			<Strikethrough size="16" />
		</button>

		<button
			class:active={editorState.editor?.isActive('underline')}
			onclick={() => editorState.editor?.chain().focus().toggleUnderline().run()}
			title="Underline"
		>
			<Underline size="16" />
		</button>

		<div class="divider"></div>

		<button
			class:active={editorState.editor?.isActive({ textAlign: 'left' })}
			onclick={() => editorState.editor?.chain().focus().setTextAlign('left').run()}
			title="Align Left"
		>
			<TextAlignStart size="16" />
		</button>

		<button
			class:active={editorState.editor?.isActive({ textAlign: 'center' })}
			onclick={() => editorState.editor?.chain().focus().setTextAlign('center').run()}
			title="Align Center"
		>
			<TextAlignCenter size="16" />
		</button>
		<button
			class:active={editorState.editor?.isActive({ textAlign: 'right' })}
			onclick={() => editorState.editor?.chain().focus().setTextAlign('right').run()}
			title="Align Right"
		>
			<TextAlignEnd size="16" />
		</button>
		<div class="divider"></div>
		<button onclick={clearFormatting} title="Clear formatting">
			<RemoveFormatting size="16" />
		</button>
	</div>
{/if}

<!-- Editor -->
<div bind:this={editorElement} class="editor"></div>

<style>
	.toolbar {
		display: flex;
		gap: 6px;
		padding: 8px;
		border: 1px solid #ddd;
		border-bottom: none;
		border-radius: 6px 6px 0 0;
		background: #fafafa;
		flex-wrap: wrap;
	}

	button {
		padding: 8px;
		min-width: 24px;
		min-height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #ddd;
		background: white;
		cursor: pointer;
		border-radius: 4px;
		font-size: 13px;
	}

	button.active {
		background: var(--color-primary-500);
		color: white;
		border-color: var(--color-primary-600);
	}

	button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		background: #f5f5f5;
	}

	.divider {
		width: 1px;
		background: #ddd;
		margin: 0 4px;
	}

	.editor {
		border: 1px solid #ddd;
		border-radius: 0 0 6px 6px;
		padding: 12px;
		min-height: 300px;
	}

	:global(.ProseMirror) {
		outline: none;
		min-height: 300px;
	}

	:global(.ProseMirror img) {
		max-width: 100%;
		height: auto;
	}
</style>
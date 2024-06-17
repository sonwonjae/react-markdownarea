import { getMarkdownSelectionStartWithMarkdownList } from './selection';
import { MarkdownType } from './types';

export const parseValueToMarkdownList = (value: string) => {
	return value.split('\n');
};

export const parseMarkdownListToValue = (markdownList: Array<string>) => {
	return markdownList.join('\n');
};

export const getMarkdownTabCount = (markdown: string) => {
	return markdown.match(/^\t+/)?.[0]?.length ?? 0;
};

export const parseToPureMarkdown = (markdown: string) => {
	return markdown.replace(/^\t+/, '');
};

export const parseTabCountToTab = (tabCount: number) => {
	return '\t'.repeat(tabCount);
};

export const getMarkdownType = (markdown: string) => {
	const purebMarkdown = parseToPureMarkdown(markdown);

	switch (true) {
		case /^(# )/.test(purebMarkdown):
			return 'h1';
		case /^(## )/.test(purebMarkdown):
			return 'h2';
		case /^(### )/.test(purebMarkdown):
			return 'h3';
		case /^(#### )/.test(purebMarkdown):
			return 'h4';
		case /^(##### )/.test(purebMarkdown):
			return 'h5';
		case /^(###### )/.test(purebMarkdown):
			return 'h6';
		case /^(- \[x\] )/.test(purebMarkdown):
			return 'cli-f';
		case /^(- \[ \] )/.test(purebMarkdown):
			return 'cli-e';
		case /^(- )/.test(purebMarkdown):
			return 'uli';
		case /^([0-9]+\. )/.test(purebMarkdown):
			return 'oli';
		case /^(---)$/.test(purebMarkdown):
			return 'horizon';
		case /^(>+ )/.test(markdown):
			return 'blockquote';
		// case /^\|(?:[^|]*\|)+$/.test(markdown):
		// 	return 'table';
		default:
			return 'paragraph';
	}
};

export const splitMarkdownOfSyntax = (markdown: string) => {
	const pureMarkdown = parseToPureMarkdown(markdown);
	const markdownType = getMarkdownType(pureMarkdown);

	let REGEXP = null;

	switch (markdownType) {
		case 'h1':
			REGEXP = /^(# )/;
			break;
		case 'h2':
			REGEXP = /^(## )/;
			break;
		case 'h3':
			REGEXP = /^(### )/;
			break;
		case 'h4':
			REGEXP = /^(#### )/;
			break;
		case 'h5':
			REGEXP = /^(##### )/;
			break;
		case 'h6':
			REGEXP = /^(###### )/;
			break;
		case 'cli-f':
			REGEXP = /^(- \[x\] )/;
			break;
		case 'cli-e':
			REGEXP = /^(- \[ \] )/;
			break;
		case 'uli':
			REGEXP = /^(- )/;
			break;
		case 'oli':
			REGEXP = /^([0-9]+\. )/;
			break;
		case 'blockquote':
			REGEXP = /^(>+ )/;
			break;
		default:
			break;
	}

	if (!REGEXP) {
		return {
			syntax: '',
			text: markdown,
		};
	}
	// eslint-disable-next-line no-unused-vars
	const [_, syntax = '', text = ''] = markdown.split(REGEXP);

	return {
		syntax,
		text,
	};
};

export const getIsEmptyMarkdown = ({
	markdown,
	markdownType,
}: {
	markdown: string;
	markdownType: MarkdownType;
}) => {
	const purebMarkdown = parseToPureMarkdown(markdown);

	switch (markdownType) {
		case 'h1':
			return /(# )$/.test(purebMarkdown);
		case 'h2':
			return /(## )$/.test(purebMarkdown);
		case 'h3':
			return /(### )$/.test(purebMarkdown);
		case 'h4':
			return /(#### )$/.test(purebMarkdown);
		case 'h5':
			return /(##### )$/.test(purebMarkdown);
		case 'h6':
			return /(###### )$/.test(purebMarkdown);
		case 'cli-f':
			return /(- \[x\] )$/.test(purebMarkdown);
		case 'cli-e':
			return /(- \[ \] )$/.test(purebMarkdown);
		case 'uli':
			return /(- )$/.test(purebMarkdown);
		case 'oli':
			return /([0-9]+\. )$/.test(purebMarkdown);
		case 'blockquote':
			return /(>+ )$/.test(purebMarkdown);
		default:
			return purebMarkdown.length === 0;
	}
};

export const reorderOli = ({
	value,
	selectionStart,
}: {
	value: string;
	selectionStart: number;
}) => {
	const { indexInMarkdownList } = getMarkdownSelectionStartWithMarkdownList({
		value,
		selectionIndex: selectionStart,
	});
	const markdownList = parseValueToMarkdownList(value);

	let prevMarkdown: string | null = null;
	const oliIndexArray: Array<number> = [];

	let prevMarkdownInBlockquote: string | null = null;
	const oliIndexArrayInBlockquote: Array<number> = [];

	const newMarkdownList = markdownList.map((markdown) => {
		const prevMarkdownTabCount = prevMarkdown
			? getMarkdownTabCount(prevMarkdown)
			: null;

		const markdownType = getMarkdownType(markdown);
		const pureMarkdown = parseToPureMarkdown(markdown);
		const markdownTabCount = getMarkdownTabCount(markdown);
		const markdownTab = parseTabCountToTab(markdownTabCount);

		if (markdownType !== 'blockquote') {
			oliIndexArrayInBlockquote[1] = 0;
		}

		if (markdownType === 'blockquote') {
			const prevBlockquoteCount = prevMarkdownInBlockquote
				? prevMarkdownInBlockquote.match(/^>+/)?.[0]?.length ?? 0
				: null;

			const { syntax: blockquoteSyntax, text: remainedMarkdown } =
				splitMarkdownOfSyntax(markdown);
			const blockquoteCount = markdown.match(/^>+/)?.[0]?.length ?? 0;
			const remainedPureMarkdown = parseToPureMarkdown(remainedMarkdown);
			const remainedMarkdownTabCount =
				getMarkdownTabCount(remainedPureMarkdown);
			const remainedMarkdownTab = parseTabCountToTab(
				remainedMarkdownTabCount,
			);

			if (
				typeof prevBlockquoteCount === 'number' &&
				blockquoteCount !== 0 &&
				prevBlockquoteCount < blockquoteCount
			) {
				oliIndexArrayInBlockquote[blockquoteCount] = 0;
			}

			if (
				typeof oliIndexArrayInBlockquote[blockquoteCount] !== 'number'
			) {
				oliIndexArrayInBlockquote[blockquoteCount] = 1;
			} else {
				oliIndexArrayInBlockquote[blockquoteCount] += 1;
			}

			const finalOliNumber = oliIndexArrayInBlockquote[blockquoteCount];
			const newMarkdown = `${blockquoteSyntax}${remainedMarkdownTab}${remainedPureMarkdown.replace(/^([0-9]+\. )/, `${finalOliNumber}. `)}`;

			prevMarkdownInBlockquote = markdown;

			return newMarkdown;
		}

		if (markdownType !== 'oli') {
			oliIndexArray[markdownTabCount] = -1;
		}

		if (
			typeof prevMarkdownTabCount === 'number' &&
			markdownTabCount !== 0 &&
			prevMarkdownTabCount < markdownTabCount
		) {
			oliIndexArray[markdownTabCount] = 0;
		}

		if (typeof oliIndexArray[markdownTabCount] !== 'number') {
			oliIndexArray[markdownTabCount] = 1;
		} else {
			oliIndexArray[markdownTabCount] += 1;
		}

		const finalOliNumber = oliIndexArray[markdownTabCount];
		const newMarkdown = `${markdownTab}${pureMarkdown.replace(/^([0-9]+\. )/, `${finalOliNumber}. `)}`;

		prevMarkdown = markdown;

		return newMarkdown;
	});

	const reorderdValue = parseMarkdownListToValue(newMarkdownList);

	const selectionStartGap = markdownList.reduce((acc, markdown, index) => {
		if (indexInMarkdownList < index) {
			return acc;
		}

		return acc + ((newMarkdownList[index]?.length ?? 0) - markdown.length);
	}, 0);
	return {
		reorderdValue,
		nextSelectionStart: selectionStart + selectionStartGap,
	};
};

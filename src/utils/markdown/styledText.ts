import { STYLED_SYNTAX_MAP, StyledTextType } from '@/constants';

import {
	getMarkdownTabCount,
	parseToPureMarkdown,
	parseTabCountToTab,
	splitMarkdownOfSyntax,
} from './markdown';

export const makeStyledTextConfig = (styledSyntax: string) => {
	const escapedStyledSyntax = styledSyntax.replace(
		/[.*+?^${}()|[\]\\]/g,
		'\\$&',
	);

	return {
		styledSyntax,
		styledSyntaxLength: styledSyntax.length,
		toggleStyleRegExp: new RegExp(
			`^(${escapedStyledSyntax})(.*)(${escapedStyledSyntax})$`,
		),
	};
};

export const getStyledTextType = (markdown: string) => {
	const pureMarkdown = parseToPureMarkdown(markdown);
	const { text } = splitMarkdownOfSyntax(pureMarkdown);

	switch (true) {
		case /^\*\*\*.*\*\*\*$/.test(text):
			return 'bold-italic';
		case /^\*\*.*\*\*$/.test(text):
			return 'bold';
		case /^\*.*\*$/.test(text):
			return 'italic';
		case /^~~.*~~$/.test(text):
			return 'strike-through';
		case /^`.*`$/.test(text):
			return 'code';
		case /^==.*==$/.test(text):
			return 'highlight';
		case /^(!\[.*?\]\(.*?\))$/.test(text):
			return 'image';
		case /^(\[.*?\]\(.*?\))$/.test(text):
			return 'link';
		default:
			return null;
	}
};

export const toggleStyledText = ({
	styledTextType,
	markdown,
}: {
	styledTextType: StyledTextType;
	markdown: string;
}) => {
	const { styledSyntax, toggleStyleRegExp } = makeStyledTextConfig(
		STYLED_SYNTAX_MAP[styledTextType],
	);

	const currentMarkdownStyledTextType = getStyledTextType(markdown);
	const isStyledText = !!currentMarkdownStyledTextType;

	const markdownTabCount = getMarkdownTabCount(markdown);
	const markdownTab = parseTabCountToTab(markdownTabCount);
	const pureMarkdown = parseToPureMarkdown(markdown);
	const { syntax, text } = splitMarkdownOfSyntax(pureMarkdown);

	if (currentMarkdownStyledTextType === 'italic') {
		if (styledTextType === 'bold') {
			return `${markdownTab}${syntax}**${text}**`;
		}
		if (styledTextType === 'strike-through') {
			return `${markdownTab}${syntax}~~${text}~~`;
		}
		if (styledTextType === 'code') {
			return `${markdownTab}${syntax}\`${text}\``;
		}
		if (styledTextType === 'highlight') {
			return `${markdownTab}${syntax}==${text}==`;
		}
	}

	if (currentMarkdownStyledTextType === 'bold') {
		if (styledTextType === 'italic') {
			return `${markdownTab}${syntax}*${text}*`;
		}
		if (styledTextType === 'strike-through') {
			return `${markdownTab}${syntax}~~${text}~~`;
		}
		if (styledTextType === 'code') {
			return `${markdownTab}${syntax}\`${text}\``;
		}
		if (styledTextType === 'highlight') {
			return `${markdownTab}${syntax}==${text}==`;
		}
	}

	if (currentMarkdownStyledTextType === 'bold-italic') {
		if (styledTextType === 'italic') {
			return `${markdownTab}${syntax}${text.replace(
				/\*\*\*(.*?)\*\*\*/,
				'**$1**',
			)}`;
		}
		if (styledTextType === 'bold') {
			return `${markdownTab}${syntax}${text.replace(
				/\*\*\*(.*?)\*\*\*/,
				'*$1*',
			)}`;
		}
		if (styledTextType === 'strike-through') {
			return `${markdownTab}${syntax}~~${text}~~`;
		}
		if (styledTextType === 'code') {
			return `${markdownTab}${syntax}\`${text}\``;
		}
		if (styledTextType === 'highlight') {
			return `${markdownTab}${syntax}==${text}==`;
		}
	}

	if (currentMarkdownStyledTextType === 'strike-through') {
		if (styledTextType === 'italic') {
			return `${markdownTab}${syntax}*${text}*`;
		}
		if (styledTextType === 'bold') {
			return `${markdownTab}${syntax}**${text}**`;
		}
		if (styledTextType === 'code') {
			return `${markdownTab}${syntax}\`${text}\``;
		}
		if (styledTextType === 'highlight') {
			return `${markdownTab}${syntax}==${text}==`;
		}
	}
	if (currentMarkdownStyledTextType === 'code') {
		if (styledTextType === 'italic') {
			return `${markdownTab}${syntax}*${text}*`;
		}
		if (styledTextType === 'bold') {
			return `${markdownTab}${syntax}**${text}**`;
		}
		if (styledTextType === 'strike-through') {
			return `${markdownTab}${syntax}~~${text}~~`;
		}
		if (styledTextType === 'highlight') {
			return `${markdownTab}${syntax}==${text}==`;
		}
	}
	if (currentMarkdownStyledTextType === 'highlight') {
		if (styledTextType === 'italic') {
			return `${markdownTab}${syntax}*${text}*`;
		}
		if (styledTextType === 'bold') {
			return `${markdownTab}${syntax}**${text}**`;
		}
		if (styledTextType === 'strike-through') {
			return `${markdownTab}${syntax}~~${text}~~`;
		}
		if (styledTextType === 'code') {
			return `${markdownTab}${syntax}\`${text}\``;
		}
	}

	if (isStyledText) {
		return `${markdownTab}${syntax}${text.replace(
			toggleStyleRegExp,
			'$2',
		)}`;
	}
	return `${markdownTab}${syntax}${styledSyntax}${text}${styledSyntax}`;
};

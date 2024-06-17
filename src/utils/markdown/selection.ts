export const getMarkdownSelectionStartWithMarkdownList = ({
	value,
	selectionIndex,
}: {
	value: string;
	selectionIndex: number;
}) => {
	let indexInMarkdownList = 0;
	let indexInMarkdown = 0;

	for (let i = 0; i < selectionIndex; i += 1) {
		if (value[i] === '\n') {
			indexInMarkdownList += 1;
			indexInMarkdown = -1;
		}
		indexInMarkdown += 1;
	}

	return {
		indexInMarkdownList, // value를 parsing한 markdownList에서 현재 focuse된 markdown이 속한 배열 index
		indexInMarkdown, // 현재 foucs된 markdown기준 selectionIndex index
	};
};

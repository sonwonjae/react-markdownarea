import { mount } from 'cypress/react18';
import { useState } from 'react';

import Markdownarea from './Markdownarea';

const MarkdownareaTest = () => {
	const [value, setValue] = useState('');

	return (
		<Markdownarea
			style={{
				width: '100%',
				height: '50vh',
			}}
			value={value}
			onChange={(e) => {
				setValue(e.target.value);
			}}
			onKeyDown={(e) => {
				setValue(e.currentTarget.value);
			}}
		/>
	);
};

describe('blockquote test', () => {
	it('enter', () => {
		mount(<MarkdownareaTest />)
			.get('textarea')
			// NOTE: textarea 진입
			.focus()
			.focused()
			// NOTE: 초기 text 입력
			.type('> content 1')
			.should('have.text', '> content 1')
			// NOTE: blockquote에 text가 존재할 경우 enter 기능 확인
			.type('{enter}')
			.should('have.text', '> content 1\n> ')
			// NOTE: blockquote에서 tab 입력 시 indent+1 되는지 확인
			.tab()
			.should('have.text', '> content 1\n>> ')
			// NOTE: 채워진 blockquote가 indent+1 되어있는 상황에서 enter 입력 시 아래쪽에 동일한 indent의 blockquote 생성 확인
			.type('content 2')
			.type('{enter}')
			.should('have.text', '> content 1\n>> content 2\n>> ')
			// NOTE: 비어있는 blockquote가 indent+1 되어있는 상황에서 enter 입력 시 blockquote 제거 확인
			.type('{enter}')
			.should('have.text', '> content 1\n>> content 2\n');
	});

	it('tab, shift+tab', () => {
		mount(<MarkdownareaTest />)
			.get('textarea')
			// NOTE: textarea 진입
			.focus()
			.focused()
			// NOTE: 초기 text 입력
			.type('> content 1')
			.should('have.text', '> content 1')
			// NOTE: blockquote에서 tab 입력 시 indent+1 되는지 확인
			.tab()
			.should('have.text', '>> content 1')
			// NOTE: blockquote에서 shift+tab 입력 시 indent-1 되는지 확인
			.tab({ shift: true })
			.should('have.text', '> content 1')
			// NOTE: blockquote에서 indent가 0일때 shift+tab 입력 시 indent-0 되는지 확인
			.tab({ shift: true })
			.should('have.text', '> content 1');
	});
});

describe('order list test', () => {
	it('reorder', () => {
		mount(<MarkdownareaTest />)
			.get('textarea')
			// NOTE: textarea 진입
			.focus()
			.focused()
			// NOTE: 초기 text 입력 (의도적으로 1 이외의 숫자를 삽입)
			.type('325. content 1')
			.should('have.text', '1. content 1');
	});

	it('enter', () => {
		mount(<MarkdownareaTest />)
			.get('textarea')
			// NOTE: textarea 진입
			.focus()
			.focused()
			// NOTE: 초기 text 입력
			.type('1. content 1')
			.should('have.text', '1. content 1')
			// NOTE: order list에 text가 존재할 경우 enter 기능 확인
			.type('{enter}')
			.should('have.text', '1. content 1\n2. ')
			// NOTE: order list에서 tab 입력 시 indent+1 되는지 확인
			.tab()
			.should('have.text', '1. content 1\n\t1. ')
			// NOTE: 비어있는 order list에서 enter 입력 시 indent-1 되는지 확인
			.type('{enter}')
			.should('have.text', '1. content 1\n2. ')
			// NOTE: order list에 text가 존재하지 않을 경우 enter 기능 확인
			.type('{enter}')
			.should('have.text', '1. content 1\n')
			// NOTE: order list를 벗어난 경우 enter가 원래대로 동작하는지 확인
			.type('{enter}')
			.should('have.text', '1. content 1\n\n');
	});

	it('tab, shift+tab', () => {
		mount(<MarkdownareaTest />)
			.get('textarea')
			// NOTE: textarea 진입
			.focus()
			.focused()
			// NOTE: 초기 text 입력
			.type('1. content 1')
			.should('have.text', '1. content 1')
			// NOTE: order list에서 tab 입력 시 indent+1 되는지 확인
			.type('{enter}')
			.tab()
			.should('have.text', '1. content 1\n\t1. ')
			// NOTE: order list에서 shift+tab 입력 시 indent-1 되는지 확인
			.tab({ shift: true })
			.should('have.text', '1. content 1\n2. ')
			// NOTE: order list에서 indent가 0일때 shift+tab 입력 시 indent-0 되는지 확인
			.tab({ shift: true })
			.should('have.text', '1. content 1\n2. ');
	});
});

describe('unorder list test', () => {
	it('enter', () => {
		mount(<MarkdownareaTest />)
			.get('textarea')
			// NOTE: textarea 진입
			.focus()
			.focused()
			// NOTE: 초기 text 입력
			.type('- content 1')
			.should('have.text', '- content 1')
			// NOTE: unorder list에 text가 존재할 경우 enter 기능 확인
			.type('{enter}')
			.should('have.text', '- content 1\n- ')
			// NOTE: unorder list에서 tab 입력 시 indent+1 되는지 확인
			.tab()
			.should('have.text', '- content 1\n\t- ')
			// NOTE: 비어있는 unorder list에서 enter 입력 시 indent-1 되는지 확인
			.type('{enter}')
			.should('have.text', '- content 1\n- ')
			// NOTE: unorder list에 text가 존재하지 않을 경우 enter 기능 확인
			.type('{enter}')
			.should('have.text', '- content 1\n')
			// NOTE: unorder list를 벗어난 경우 enter가 원래대로 동작하는지 확인
			.type('{enter}')
			.should('have.text', '- content 1\n\n');
	});

	it('tab, shift+tab', () => {
		mount(<MarkdownareaTest />)
			.get('textarea')
			// NOTE: textarea 진입
			.focus()
			.focused()
			// NOTE: 초기 text 입력
			.type('- content 1')
			.should('have.text', '- content 1')
			// NOTE: unorder list에서 tab 입력 시 indent+1 되는지 확인
			.type('{enter}')
			.tab()
			.should('have.text', '- content 1\n\t- ')
			// NOTE: unorder list에서 shift+tab 입력 시 indent-1 되는지 확인
			.tab({ shift: true })
			.should('have.text', '- content 1\n- ')
			// NOTE: unorder list에서 indent가 0일때 shift+tab 입력 시 indent-0 되는지 확인
			.tab({ shift: true })
			.should('have.text', '- content 1\n- ');
	});
});

describe('task list test', () => {
	it('enter', () => {
		mount(<MarkdownareaTest />)
			.get('textarea')
			// NOTE: textarea 진입
			.focus()
			.focused()
			// NOTE: 초기 text 입력
			.type('- [')
			.should('have.text', '- []')
			.type(' ')
			.should('have.text', '- [ ]')
			.type('{moveToEnd}')
			.type(' ')
			.type('content 1')
			.should('have.text', '- [ ] content 1')
			// NOTE: task list에 text가 존재할 경우 enter 기능 확인
			.type('{enter}')
			.should('have.text', '- [ ] content 1\n- [ ] ')
			// NOTE: task list에서 tab 입력 시 indent+1 되는지 확인
			.tab()
			.should('have.text', '- [ ] content 1\n\t- [ ] ')
			// NOTE: 비어있는 task list에서 enter 입력 시 indent-1 되는지 확인
			.type('{enter}')
			.should('have.text', '- [ ] content 1\n- [ ] ')
			// NOTE: task list에 text가 존재하지 않을 경우 enter 기능 확인
			.type('{enter}')
			.should('have.text', '- [ ] content 1\n')
			// NOTE: task list를 벗어난 경우 enter가 원래대로 동작하는지 확인
			.type('{enter}')
			.should('have.text', '- [ ] content 1\n\n');
	});

	it('tab, shift+tab', () => {
		mount(<MarkdownareaTest />)
			.get('textarea')
			// NOTE: textarea 진입
			.focus()
			.focused()
			// NOTE: 초기 text 입력
			.type('- [')
			.should('have.text', '- []')
			.type(' ')
			.should('have.text', '- [ ]')
			.type('{moveToEnd}')
			.type(' ')
			.type('content 1')
			.should('have.text', '- [ ] content 1')
			// NOTE: task list에서 tab 입력 시 indent+1 되는지 확인
			.type('{enter}')
			.tab()
			.should('have.text', '- [ ] content 1\n\t- [ ] ')
			// NOTE: task list에서 shift+tab 입력 시 indent-1 되는지 확인
			.tab({ shift: true })
			.should('have.text', '- [ ] content 1\n- [ ] ')
			// NOTE: task list에서 indent가 0일때 shift+tab 입력 시 indent-0 되는지 확인
			.tab({ shift: true })
			.should('have.text', '- [ ] content 1\n- [ ] ');
	});
});

# react-markdownarea

## Getting Started

```bash
npm i @sonwonjae/react-markdownarea
```

## Adding Markdownarea

```jsx
import { Markdownarea } from '@sonwonjae/react-markdownarea';

export default function Component() {
	const [value, setValue] = useState('');

	return (
		<Markdownarea
			value={value}
			onChange={(e) => {
				setValue(e.target.value);
			}}
			onKeyDown={(e) => {
				setValue(e.currentTarget.value);
			}}
		/>
	);
}
```

## What is Markdownarea?

> Markdownarea is just textarea.
>
> but you can use textarea with **markdown syntax**

## This is the syntax supported by Markdownarea.

### Element Markdown Syntax

| Element         | Markdown Syntax                  | Shortcut     |
| :-------------- | :------------------------------- | :----------- |
| Heading 1       | # H1                             | -            |
| Heading 2       | ## H2                            | -            |
| Heading 3       | ### H3                           | -            |
| Bold            | \*\*bold text\*\*                | CMD/CTRL + B |
| Italic          | \*italicized text\*              | CMD/CTRL + I |
| Bold-Italic     | \*\*\*bold italicized text\*\*\* | -            |
| Blockquote      | > blockquote                     | -            |
| Ordered List    | 1. First item                    | -            |
| Unordered List  | - First item                     | -            |
| Code            | `code`                           | CMD/CTRL + E |
| Horizontal Rule | ---                              | -            |
| Link            | [title](https://www.example.com) | CMD/CTRL + K |
| Image           | ![empty image](image.jpg)        | -            |

### Extended Syntax

| Element       | Markdown Syntax             | Shortcut     |
| :------------ | :-------------------------- | :----------- |
| Code Block    | \`\`\` ... \`\`\`           | -            |
| Strikethrough | \~\~strike through text\~\~ | CMD/CTRL + D |
| Task List     | - [ ] task item             | -            |
| Highlight     | ==highlight text==          | -            |

> [ref: Markdown Guide](https://www.markdownguide.org/cheat-sheet/)

## Special Action

### Blockquote

-   tab

    ```
    // 1. make blockquote
    > content

    // 2. press tab key
    >> content

    // 3. press tab key
    >>> content
    ```

-   shift tab

    ```
    // 1. make blockquote
    >> content

    // 2. press shift+tab key
    > content

    // 3. press shift+tab key
    // The shift+tab only works until only one blockquote remains.
    > content
    ```

-   enter with blockquote has content

    ```
    // 1. make blockquote
    > content

    // 2. press enter key
    // If you press Enter when you have content, a blockquote will be created at the bottom.
    > content
    >
    ```

-   enter with blockquote has not content

    ```
    // 1. make blockquote
    > content

    // 2. press enter key
    // If you press Enter when you have content, a blockquote will be created at the bottom.
    > content
    >

    // 3. press enter key
    // If you press Enter when you have not content, remove the blockquote from the current row.
    > content

    ```

### Ordered List

> Markdownarea provides the automatic ordering function of the order list.

-   tab

    ```
    // 1. make ordered list
    1. content 1
    2. content 2
    3. content 3

    // 2. press tab key with second row
    1. content 1
        1. content 2
    2. content 3

    // 3. press tab key with third row
    1. content 1
        1. content 2
        2. content 3
    ```

-   shift tab

    ```
    // 1. make ordered list
    1. content 1
        1. content 2
        2. content 3

    // 2. press shift+tab key with second row
    1. content 1
    2. content 2
        1. content 3

    // 3. press tab key with third row
    1. content 1
    2. content 2
    3. content 3
    ```

-   enter with order list has content

    ```
    // 1. make ordered list
    1. content 1

    // 2. press enter key
    1. content 1
    2. content 2

    // 3. press enter key
    1. content 1
    2. content 2
    3. content 3

    // 4. press tab key
    1. content 1
    2. content 2
        1. content 3

    // 5. press enter key
    1. content 1
    2. content 2
        1. content 3
        2. content 4

    // 6. press enter key
    1. content 1
    2. content 2
        1. content 3
    3. content 4

    // 7. press enter key
    1. content 1
    2. content 2
        1. content 3
    3. content 4
    4. content 5
    ```

-   enter with order list has not content

    ```
    // 1. make ordered list
    1. content 1

    // 2. press enter key
    1. content 1
    2.

    // 3. press enter key
    // If you press Enter when you have not content, remove the order list from the current row.
    1. content 1

    ```

### Unordered List

> An Unordered List behaves similarly to an Ordered List.

-   tab

    ```
    // 1. make ordered list
    - content 1
    - content 2
    - content 3

    // 2. press tab key with second row
    - content 1
        - content 2
    - content 3

    // 3. press tab key with third row
    - content 1
        - content 2
        - content 3
    ```

-   shift tab

    ```
    // 1. make ordered list
    - content 1
        - content 2
        - content 3

    // 2. press shift+tab key with second row
    - content 1
    - content 2
        - content 3

    // 3. press tab key with third row
    - content 1
    - content 2
    - content 3
    ```

-   enter with order list has content

    ```
    // 1. make ordered list
    - content 1

    // 2. press enter key
    - content 1
    - content 2

    // 3. press enter key
    - content 1
    - content 2
    - content 3

    // 4. press tab key
    - content 1
    - content 2
        - content 3

    // 5. press enter key
    - content 1
    - content 2
        - content 3
        - content 4

    // 6. press enter key
    - content 1
    - content 2
        - content 3
    - content 4

    // 7. press enter key
    - content 1
    - content 2
        - content 3
    - content 4
    - content 5
    ```

-   enter with order list has not content

    ```
    // 1. make ordered list
    - content 1

    // 2. press enter key
    - content 1
    -

    // 3. press enter key
    // If you press Enter when you have not content, remove the order list from the current row.
    - content 1

    ```

### Task List

> An Task List behaves similarly to an Unordered list.

-   tab

    ```
    // 1. make ordered list
    - [ ] content 1
    - [ ] content 2
    - [ ] content 3

    // 2. press tab key with second row
    - [ ] content 1
        - [ ] content 2
    - [ ] content 3

    // 3. press tab key with third row
    - [ ] content 1
        - [ ] content 2
        - [ ] content 3
    ```

-   shift tab

    ```
    // 1. make ordered list
    - [ ] content 1
        - [ ] content 2
        - [ ] content 3

    // 2. press shift+tab key with second row
    - [ ] content 1
    - [ ] content 2
        - [ ] content 3

    // 3. press tab key with third row
    - [ ] content 1
    - [ ] content 2
    - [ ] content 3
    ```

-   enter with order list has content

    ```
    // 1. make ordered list
    - [ ] content 1

    // 2. press enter key
    - [ ] content 1
    - [ ] content 2

    // 3. press enter key
    - [ ] content 1
    - [ ] content 2
    - [ ] content 3

    // 4. press tab key
    - [ ] content 1
    - [ ] content 2
        - [ ] content 3

    // 5. press enter key
    - [ ] content 1
    - [ ] content 2
        - [ ] content 3
        - [ ] content 4

    // 6. press enter key
    - [ ] content 1
    - [ ] content 2
        - [ ] content 3
    - [ ] content 4

    // 7. press enter key
    - [ ] content 1
    - [ ] content 2
        - [ ] content 3
    - [ ] content 4
    - [ ] content 5
    ```

-   enter with order list has not content

    ```
    // 1. make ordered list
    - [ ] content 1

    // 2. press enter key
    - [ ] content 1
    - [ ]

    // 3. press enter key
    // If you press Enter when you have not content, remove the order list from the current row.
    - [ ] content 1

    ```

## License

Licensed under the [MIT license](https://github.com/sonwonjae/react-markdownarea/blob/main/LICENSE.md).

import * as assert from 'assert';
import { compactFormat, humanFormat } from '../../markdownFormatter';

suite('Markdown Formatter Test Suite', () => {
	
	suite('Compact Format', () => {
		test('Should remove extra blank lines', () => {
			const input = `# Title\n\n\n\nSome text\n\n\n\nMore text`;
			const output = compactFormat(input);
			assert.ok(!output.includes('\n\n\n'));
		});

		test('Should preserve single blank lines between sections', () => {
			const input = `# Title\n\nParagraph one\n\nParagraph two`;
			const output = compactFormat(input);
			const blankLines = (output.match(/\n\n/g) || []).length;
			assert.ok(blankLines >= 2);
		});

		test('Should condense list spacing', () => {
			const input = `- Item 1\n\n- Item 2\n\n- Item 3`;
			const output = compactFormat(input);
			assert.ok(output.includes('- Item 1\n- Item 2'));
		});

		test('Should preserve code blocks', () => {
			const input = '```javascript\nconst x = 1;\n\nconst y = 2;\n```';
			const output = compactFormat(input);
			assert.ok(output.includes('const x = 1;\n\nconst y = 2;'));
		});

		test('Should preserve blockquotes', () => {
			const input = '> Quote line 1\n> \n> Quote line 2';
			const output = compactFormat(input);
			assert.ok(output.includes('> Quote line 1'));
			assert.ok(output.includes('> Quote line 2'));
		});

		test('Should handle empty input', () => {
			const output = compactFormat('');
			assert.strictEqual(output, '');
		});

		test('Should handle input with only whitespace', () => {
			const output = compactFormat('   \n\n   \n   ');
			assert.ok(output.length < 10);
		});
	});

	suite('Human Format', () => {
		test('Should add blank lines after headers', () => {
			const input = `# Title\nSome text`;
			const output = humanFormat(input);
			assert.ok(output.includes('# Title\n\n'));
		});

		test('Should add spacing around lists', () => {
			const input = `Paragraph\n- Item 1\n- Item 2\nNext paragraph`;
			const output = humanFormat(input);
			assert.ok(output.includes('\n\n- Item 1'));
		});

		test('Should preserve code blocks', () => {
			const input = '```javascript\nconst x = 1;\nconst y = 2;\n```';
			const output = humanFormat(input);
			assert.ok(output.includes('```javascript'));
			assert.ok(output.includes('```'));
		});

		test('Should handle empty input', () => {
			const output = humanFormat('');
			assert.strictEqual(output, '');
		});

		test('Should add spacing between paragraphs', () => {
			const input = `Paragraph 1\nParagraph 2`;
			const output = humanFormat(input);
			// Should have more spacing than input
			assert.ok(output.length >= input.length);
		});
	});

	suite('Format Roundtrip', () => {
		test('Compact then human should not lose content', () => {
			const input = `# Title\n\nParagraph 1\n\nParagraph 2\n\n- Item 1\n- Item 2`;
			const compacted = compactFormat(input);
			const expanded = humanFormat(compacted);
			
			assert.ok(expanded.includes('# Title'));
			assert.ok(expanded.includes('Paragraph 1'));
			assert.ok(expanded.includes('Paragraph 2'));
			assert.ok(expanded.includes('- Item 1'));
			assert.ok(expanded.includes('- Item 2'));
		});
	});
});

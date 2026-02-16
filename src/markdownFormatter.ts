/**
 * Markdown Formatter
 * Provides functions for converting markdown between compact (AI-optimized) and human-readable modes
 */

export type MarkdownMode = 'compact' | 'human';

export interface FormatOptions {
    preserveCodeBlocks?: boolean;
    preserveBlockquotes?: boolean;
    maxConsecutiveBlankLines?: number;
}

interface CodeBlock {
    start: number;
    end: number;
    content: string;
}

interface Blockquote {
    start: number;
    end: number;
    content: string;
}

/**
 * Converts markdown to compact mode (AI-optimized)
 * - Removes extra blank lines (max 1 between sections)
 * - Condenses list spacing
 * - Minimizes whitespace around headers
 * - Keeps code blocks compact
 * - Removes trailing spaces
 */
export function compactFormat(markdown: string, options: FormatOptions = {}): string {
    const {
        preserveCodeBlocks = true,
        preserveBlockquotes = true,
        maxConsecutiveBlankLines = 1
    } = options;

    if (!markdown || markdown.trim().length === 0) {
        return markdown;
    }

    try {
        let result = markdown;

        // Extract and preserve code blocks
        const codeBlocks: CodeBlock[] = [];
        const codeBlockPlaceholder = (index: number) => `__CODE_BLOCK_${index}__`;
        
        if (preserveCodeBlocks) {
            const codeBlockRegex = /```[\s\S]*?```|`[^`\n]+`/g;
            let match;
            let index = 0;
            
            while ((match = codeBlockRegex.exec(result)) !== null) {
                codeBlocks.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    content: match[0]
                });
                index++;
            }

            // Replace code blocks with placeholders (in reverse to maintain indices)
            for (let i = codeBlocks.length - 1; i >= 0; i--) {
                result = result.substring(0, codeBlocks[i].start) +
                         codeBlockPlaceholder(i) +
                         result.substring(codeBlocks[i].end);
            }
        }

        // Extract and preserve blockquotes
        const blockquotes: Blockquote[] = [];
        const blockquotePlaceholder = (index: number) => `__BLOCKQUOTE_${index}__`;
        
        if (preserveBlockquotes) {
            const lines = result.split('\n');
            let inBlockquote = false;
            let blockquoteStart = -1;
            let blockquoteLines: string[] = [];
            let index = 0;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const isQuoteLine = /^\s*>/.test(line);

                if (isQuoteLine) {
                    if (!inBlockquote) {
                        inBlockquote = true;
                        blockquoteStart = i;
                        blockquoteLines = [];
                    }
                    blockquoteLines.push(line);
                } else if (inBlockquote && line.trim() === '') {
                    blockquoteLines.push(line);
                } else if (inBlockquote) {
                    blockquotes.push({
                        start: blockquoteStart,
                        end: i,
                        content: blockquoteLines.join('\n')
                    });
                    lines.splice(blockquoteStart, i - blockquoteStart, blockquotePlaceholder(index));
                    i = blockquoteStart;
                    index++;
                    inBlockquote = false;
                    blockquoteLines = [];
                }
            }

            if (inBlockquote) {
                blockquotes.push({
                    start: blockquoteStart,
                    end: lines.length,
                    content: blockquoteLines.join('\n')
                });
                lines.splice(blockquoteStart, lines.length - blockquoteStart, blockquotePlaceholder(index));
            }

            result = lines.join('\n');
        }

        // Remove trailing spaces from each line
        result = result.split('\n').map(line => line.trimEnd()).join('\n');

        // Minimize whitespace around headers (max 1 blank line before, 0 after)
        result = result.replace(/\n{2,}(#{1,6}\s+)/g, '\n\n$1');
        result = result.replace(/(#{1,6}\s+[^\n]+)\n{2,}/g, '$1\n');

        // Condense list spacing (remove blank lines between list items)
        result = result.replace(/(\n\s*[-*+]\s+[^\n]+)\n{2,}(\s*[-*+]\s+)/g, '$1\n$2');
        result = result.replace(/(\n\s*\d+\.\s+[^\n]+)\n{2,}(\s*\d+\.\s+)/g, '$1\n$2');

        // Remove blank lines inside lists
        const listItemRegex = /^(\s*)([-*+]|\d+\.)\s+/;
        const resultLines = result.split('\n');
        const compactedLines: string[] = [];
        let inList = false;

        for (let i = 0; i < resultLines.length; i++) {
            const line = resultLines[i];
            const isListItem = listItemRegex.test(line);
            const isBlankLine = line.trim() === '';

            if (isListItem) {
                inList = true;
                compactedLines.push(line);
            } else if (inList && isBlankLine) {
                // Check if next line is also a list item
                const nextLine = i + 1 < resultLines.length ? resultLines[i + 1] : '';
                if (!listItemRegex.test(nextLine)) {
                    inList = false;
                    compactedLines.push(line);
                }
                // Skip blank line between list items
            } else {
                if (!isListItem && !isBlankLine) {
                    inList = false;
                }
                compactedLines.push(line);
            }
        }
        result = compactedLines.join('\n');

        // Limit consecutive blank lines
        const blankLineRegex = new RegExp(`\\n{${maxConsecutiveBlankLines + 2},}`, 'g');
        result = result.replace(blankLineRegex, '\n'.repeat(maxConsecutiveBlankLines + 1));

        // Remove leading/trailing blank lines from document
        result = result.replace(/^\n+/, '').replace(/\n+$/, '\n');

        // Restore blockquotes
        if (preserveBlockquotes) {
            for (let i = 0; i < blockquotes.length; i++) {
                result = result.replace(blockquotePlaceholder(i), blockquotes[i].content);
            }
        }

        // Restore code blocks
        if (preserveCodeBlocks) {
            for (let i = 0; i < codeBlocks.length; i++) {
                result = result.replace(codeBlockPlaceholder(i), codeBlocks[i].content);
            }
        }

        return result;
    } catch (error) {
        console.error('Error in compactFormat:', error);
        return markdown;
    }
}

/**
 * Converts markdown to human-readable mode
 * - Adds spacing between sections (2 blank lines)
 * - Adds spacing in lists
 * - Proper indentation
 * - Better visual hierarchy
 */
export function humanFormat(markdown: string, options: FormatOptions = {}): string {
    const {
        preserveCodeBlocks = true,
        preserveBlockquotes = true
    } = options;

    if (!markdown || markdown.trim().length === 0) {
        return markdown;
    }

    try {
        let result = markdown;

        // Extract and preserve code blocks
        const codeBlocks: CodeBlock[] = [];
        const codeBlockPlaceholder = (index: number) => `__CODE_BLOCK_${index}__`;
        
        if (preserveCodeBlocks) {
            const codeBlockRegex = /```[\s\S]*?```|`[^`\n]+`/g;
            let match;
            let index = 0;
            
            while ((match = codeBlockRegex.exec(result)) !== null) {
                codeBlocks.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    content: match[0]
                });
                index++;
            }

            // Replace code blocks with placeholders (in reverse to maintain indices)
            for (let i = codeBlocks.length - 1; i >= 0; i--) {
                result = result.substring(0, codeBlocks[i].start) +
                         codeBlockPlaceholder(i) +
                         result.substring(codeBlocks[i].end);
            }
        }

        // Extract and preserve blockquotes
        const blockquotes: Blockquote[] = [];
        const blockquotePlaceholder = (index: number) => `__BLOCKQUOTE_${index}__`;
        
        if (preserveBlockquotes) {
            const lines = result.split('\n');
            let inBlockquote = false;
            let blockquoteStart = -1;
            let blockquoteLines: string[] = [];
            let index = 0;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const isQuoteLine = /^\s*>/.test(line);

                if (isQuoteLine) {
                    if (!inBlockquote) {
                        inBlockquote = true;
                        blockquoteStart = i;
                        blockquoteLines = [];
                    }
                    blockquoteLines.push(line);
                } else if (inBlockquote && line.trim() === '') {
                    blockquoteLines.push(line);
                } else if (inBlockquote) {
                    blockquotes.push({
                        start: blockquoteStart,
                        end: i,
                        content: blockquoteLines.join('\n')
                    });
                    lines.splice(blockquoteStart, i - blockquoteStart, blockquotePlaceholder(index));
                    i = blockquoteStart;
                    index++;
                    inBlockquote = false;
                    blockquoteLines = [];
                }
            }

            if (inBlockquote) {
                blockquotes.push({
                    start: blockquoteStart,
                    end: lines.length,
                    content: blockquoteLines.join('\n')
                });
                lines.splice(blockquoteStart, lines.length - blockquoteStart, blockquotePlaceholder(index));
            }

            result = lines.join('\n');
        }

        // Remove trailing spaces from each line
        result = result.split('\n').map(line => line.trimEnd()).join('\n');

        // First, normalize to single spacing
        result = result.replace(/\n{3,}/g, '\n\n');

        // Add 2 blank lines before headers (except at document start)
        result = result.replace(/([^\n])\n+(#{1,6}\s+)/g, '$1\n\n\n$2');

        // Add 1 blank line after headers
        result = result.replace(/(#{1,6}\s+[^\n]+)(\n)([^\n#])/g, '$1\n\n$3');

        // Add blank lines between list items for better readability
        const listItemRegex = /^(\s*)([-*+]|\d+\.)\s+/;
        const resultLines = result.split('\n');
        const spacedLines: string[] = [];
        let prevWasListItem = false;

        for (let i = 0; i < resultLines.length; i++) {
            const line = resultLines[i];
            const isListItem = listItemRegex.test(line);

            if (isListItem && prevWasListItem) {
                // Add blank line between list items
                if (spacedLines[spacedLines.length - 1]?.trim() !== '') {
                    spacedLines.push('');
                }
            }

            spacedLines.push(line);
            prevWasListItem = isListItem;
        }
        result = spacedLines.join('\n');

        // Add spacing around horizontal rules
        result = result.replace(/([^\n])\n*([-*_]{3,})\n*/g, '$1\n\n$2\n\n');

        // Add blank lines between paragraphs and other block elements
        result = result.replace(/([^\n])\n([^\n#\-*+>`\s])/g, '$1\n\n$2');

        // Clean up excessive blank lines (max 2)
        result = result.replace(/\n{4,}/g, '\n\n\n');

        // Ensure document ends with single newline
        result = result.replace(/\n*$/, '\n');

        // Restore blockquotes
        if (preserveBlockquotes) {
            for (let i = 0; i < blockquotes.length; i++) {
                result = result.replace(blockquotePlaceholder(i), blockquotes[i].content);
            }
        }

        // Restore code blocks
        if (preserveCodeBlocks) {
            for (let i = 0; i < codeBlocks.length; i++) {
                result = result.replace(codeBlockPlaceholder(i), codeBlocks[i].content);
            }
        }

        return result;
    } catch (error) {
        console.error('Error in humanFormat:', error);
        return markdown;
    }
}

/**
 * Detects which mode a markdown document is likely in
 * Returns 'compact', 'human', or null if unable to determine
 */
export function detectCurrentMode(markdown: string): MarkdownMode | null {
    if (!markdown || markdown.trim().length === 0) {
        return null;
    }

    try {
        const lines = markdown.split('\n');
        let blankLineCount = 0;
        let totalLines = 0;
        let consecutiveBlankLines = 0;
        let maxConsecutiveBlankLines = 0;
        let headerBlankLinesAfter = 0;
        let headerCount = 0;
        let listItemSpacing = 0;
        let consecutiveListItems = 0;
        let listBlankLines = 0;

        let prevWasHeader = false;
        let prevWasListItem = false;
        const listItemRegex = /^\s*([-*+]|\d+\.)\s+/;
        const headerRegex = /^#{1,6}\s+/;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            totalLines++;

            const isBlankLine = trimmedLine === '';
            const isHeader = headerRegex.test(trimmedLine);
            const isListItem = listItemRegex.test(line);

            if (isBlankLine) {
                blankLineCount++;
                consecutiveBlankLines++;
                
                if (prevWasHeader) {
                    headerBlankLinesAfter++;
                }
                
                if (prevWasListItem || (consecutiveListItems > 0 && i + 1 < lines.length && listItemRegex.test(lines[i + 1]))) {
                    listBlankLines++;
                }
            } else {
                if (consecutiveBlankLines > maxConsecutiveBlankLines) {
                    maxConsecutiveBlankLines = consecutiveBlankLines;
                }
                consecutiveBlankLines = 0;
            }

            if (isHeader) {
                headerCount++;
                prevWasHeader = true;
                prevWasListItem = false;
                consecutiveListItems = 0;
            } else {
                prevWasHeader = false;
            }

            if (isListItem) {
                if (prevWasListItem) {
                    consecutiveListItems++;
                } else {
                    consecutiveListItems = 1;
                }
                prevWasListItem = true;
            } else if (!isBlankLine) {
                if (consecutiveListItems > 1) {
                    listItemSpacing += listBlankLines;
                }
                consecutiveListItems = 0;
                listBlankLines = 0;
                prevWasListItem = false;
            }
        }

        // Calculate metrics
        const blankLineRatio = totalLines > 0 ? blankLineCount / totalLines : 0;
        const avgHeaderSpacing = headerCount > 0 ? headerBlankLinesAfter / headerCount : 0;
        const avgListSpacing = consecutiveListItems > 1 ? listItemSpacing / consecutiveListItems : 0;

        // Decision logic
        // Compact mode characteristics:
        // - Lower blank line ratio (< 0.2)
        // - Max 1-2 consecutive blank lines
        // - Minimal spacing after headers (< 0.5)
        // - Minimal list item spacing (< 0.3)
        
        // Human mode characteristics:
        // - Higher blank line ratio (> 0.25)
        // - Max 2-3 consecutive blank lines
        // - More spacing after headers (> 0.7)
        // - More list item spacing (> 0.5)

        const compactScore = 
            (blankLineRatio < 0.2 ? 2 : 0) +
            (maxConsecutiveBlankLines <= 2 ? 2 : 0) +
            (avgHeaderSpacing < 0.5 ? 1 : 0) +
            (avgListSpacing < 0.3 ? 1 : 0);

        const humanScore = 
            (blankLineRatio > 0.25 ? 2 : 0) +
            (maxConsecutiveBlankLines >= 2 ? 2 : 0) +
            (avgHeaderSpacing > 0.7 ? 1 : 0) +
            (avgListSpacing > 0.5 ? 1 : 0);

        if (compactScore > humanScore) {
            return 'compact';
        } else if (humanScore > compactScore) {
            return 'human';
        } else {
            // Default to compact if unclear
            return 'compact';
        }
    } catch (error) {
        console.error('Error in detectCurrentMode:', error);
        return null;
    }
}

/**
 * Formats markdown based on the target mode
 */
export function formatMarkdown(markdown: string, mode: MarkdownMode, options?: FormatOptions): string {
    if (mode === 'compact') {
        return compactFormat(markdown, options);
    } else {
        return humanFormat(markdown, options);
    }
}

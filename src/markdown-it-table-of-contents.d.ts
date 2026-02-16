declare module 'markdown-it-table-of-contents' {
    import MarkdownIt from 'markdown-it';
    
    interface TocOptions {
        includeLevel?: number[];
        containerClass?: string;
        listType?: 'ul' | 'ol';
    }
    
    const toc: (md: MarkdownIt, options?: TocOptions) => void;
    export default toc;
}

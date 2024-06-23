export function createFiraCodeProgressBar(percentage: number, length: number, animationFrame: number): string {
    const filledLength = Math.round(length * (percentage / 100));
    const emptyLength = length - filledLength;

    const blocks = ['▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];
    const animatedBlock = blocks[animationFrame];

    let filledBar = '█'.repeat(Math.max(0, filledLength - 1)) + animatedBlock;
    if (filledLength === 0) {
        filledBar = animatedBlock + '░'.repeat(emptyLength - 1);
    } else if (filledLength >= length) {
        filledBar = '█'.repeat(length);
    }

    const emptyBar = '░'.repeat(emptyLength);

    return filledBar + emptyBar;
}

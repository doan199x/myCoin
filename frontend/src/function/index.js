
import Block from './../models/Block';

const isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        return false;
    } else if (Block.calculateHash(newBlock.index,newBlock.previousHash,newBlock.timestamp,newBlock.nonce,newBlock.transaction) !== newBlock.hash) {
        return false;
    }
    return true;
};

const minePendingTransactions = (pendingTransactions, difficulty, lastBlock) => {
    const index = lastBlock.index + 1;
    const block = new Block(
        index,
        Date.now(),
        pendingTransactions,
        lastBlock.hash
    );
    return block.mineBlock(difficulty);
}

export { isValidNewBlock, minePendingTransactions };
export class Block {
  constructor(x, y) {
    this.health = 3;
    this.container = document.getElementById("block-container");
    this.element = this.createBlock();
  }

  createBlock() {
    const block = document.createElement("div");
    block.classList.add("blocks");
    this.block.style.left = `${x}px`;
    this.block.style.top = `${y}px`;
    this.container.appendChild(block);
    return block;
  }
}

export class Block {
  constructor() {
    this.health = 3;
    this.element = this.createBlock();
    this.container = document.getElementById("block-container");
  }
  createBlock() {
    const blocks = document.createElement("div");
    blocks.classList.add("block");
    this.container.appendChild(blocks);
    return blocks;
  }
}

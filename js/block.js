export class Block {
  constructor() {
    this.element = this.createElement();
  }

  createElement() {
    const block = document.createElement("div");
    block.classList.add("block");
    document.getElementById("block-container").appendChild(block);

    return block;
  }
}

export class Block {
  constructor(x) {
    this.x = x;
    this.element = this.createElement();
  }

  createElement() {
    console.log(this.x);
    const container = document.getElementById("block-container");
    const block = document.createElement("div");
    block.classList.add("block");
    this.x = (container.offsetWidth / 4) * this.x;
    console.log("xxxxxxx", this.x)
    console.log({ container: container.offsetWidth, x: this.x })
    block.style.left = `${this.x}px`;
    document.getElementById("block-container").appendChild(block);
    return block;
  }
}

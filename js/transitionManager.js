// export class SceneTransition {
//     constructor() {
//         this.element = null;
//     }

//     createElement() {
//         this.element = document.createElement("div");
//         this.element.classList.add("SceneTransition");
//         document.body.appendChild(this.element);
//     }

//     async play(type = 'fade') {
//         if (!this.element) this.createElement();

//         this.element.className = 'SceneTransition';

//         switch (type) {
//             case 'fade':
//                 this.element.classList.add('transition-fade');
//                 break;
//             case 'slide':
//                 this.element.classList.add('transition-slide');
//                 break;
//             case 'zoom':
//                 this.element.classList.add('transition-zoom');
//                 break;
//             default:
//                 this.element.classList.add('transition-fade');
//         }

//         this.element.classList.add('active');

//         return new Promise(resolve => {
//             const transitionEndHandler = () => {
//                 this.element.classList.remove('active');
//                 this.element.removeEventListener('transitionend', transitionEndHandler);
//                 resolve();
//             };

//             this.element.addEventListener('transitionend', transitionEndHandler);
//         });
//     }

//     cleanup() {
//         if (this.element) {
//             this.element.remove();
//             this.element = null;
//         }
//     }
// }
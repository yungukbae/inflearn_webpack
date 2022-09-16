import * as math from './math.js';
import './app.css';
import nyan from './assets/nyancat.jpg'

console.log(math.sum(1,3));

document.addEventListener('DOMContentLoaded',() => {
    document.body.innerHTML = `<img src="${nyan}" />`
})
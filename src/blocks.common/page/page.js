/*
 * fix Google Chrome bug: prevent firing css transition on page loading
 * the bug happens whenever you don’t have any script tags on the page
 */
const page__preload = document.querySelector('.page__preload');

window.addEventListener('load', e => {
  page__preload.classList.remove('page__preload');
});

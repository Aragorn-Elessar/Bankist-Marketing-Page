'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////

const openModal = function (e) {
  // Prevent page from scrolling up on button click
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Learn more button scrolling
btnScrollTo.addEventListener('click', function (e) {
  // Scrolling
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // Prevent auto scroll to anchors
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Gaurd clause
  if (!clicked) return;

  // Remove active classes tab/content area
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    // Suppose we have several other images
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

// TODO: use bind method
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

// Sticky navigation: Intersection Observer API
const header = document.querySelector('.header');
// calculate height dynamically for different devices
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  entries[0].isIntersecting
    ? nav.classList.remove('sticky')
    : nav.classList.add('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections on scroll
const sections = document.querySelectorAll('.section');

const revealEl = function (entries, observer) {
  entries.forEach(ent => {
    // Guard clause
    if (!ent.isIntersecting) return;

    ent.target.classList.remove('section--hidden');
    observer.unobserve(ent.target);
  });
};

const sectObserver = new IntersectionObserver(revealEl, {
  root: null,
  threshold: 0.15,
});

sections.forEach(sect => {
  sectObserver.observe(sect);
  sect.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  entries.forEach(ent => {
    // Guard clause
    if (!ent.isIntersecting) return;

    // Replace src with data-src
    ent.target.src = ent.target.dataset.src;

    ent.target.addEventListener('load', () =>
      ent.target.classList.remove('lazy-img')
    );

    observer.unobserve(ent.target);
  });
};

const imageObs = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imageObs.observe(img));

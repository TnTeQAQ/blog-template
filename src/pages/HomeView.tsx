import { useMemo, useRef, type MouseEvent } from 'react';
import { utils } from 'animejs';
import { getPosts } from '../lib/content';
import { useParallax, useScrollTransform } from '../lib/motion';
import { HERO_FLY_RUNWAY_VH } from '../lib/scroll';
import { isPlainClick, usePageReveal } from '../components/page-reveal-context';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSnapScroll } from '../hooks/useSnapScroll';
import ThreeHero from '../components/ThreeHero';
import PostCard from '../components/PostCard';
import Reveal from '../components/Reveal';
import Fx from '../components/Fx';
import FlipIn from '../components/FlipIn';
import { siteConfig } from '../config';
import './HomeView.css';

// paged-scroll snap points: home hero / Latest posts / About (land 20px above
// the sections so their headings aren't flush with the viewport top)
const SNAP_OFFSETS = [0, -20, -20];

export default function HomeView() {
  // home teaser: only the most recent posts
  const posts = getPosts().slice(0, 2);
  const startReveal = usePageReveal();
  const pinRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const titleParallaxRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useParallax(titleParallaxRef, 0.03);

  // paged scrolling: wheel / keyboard move one module at a time. The first
  // snap point is the non-sticky pin wrapper (document top = 0), NOT the
  // sticky hero whose rect moves with the pin — that used to break landing.
  const snapRefs = useMemo(() => [pinRef, latestRef, aboutRef], []);
  useSnapScroll(snapRefs, SNAP_OFFSETS);

  // During the pinned fly-through, the hero text fades and lifts out…
  useScrollTransform(heroInnerRef, {
    fn: (el, p) => {
      const inP = Math.min(1, p / 0.6);
      utils.set(el, {
        opacity: 1 - inP,
        translateY: -40 * inP,
        scale: 1 + 0.05 * inP,
      });
    },
  });
  // …and the whole hero fades away at the tail of the runway.
  useScrollTransform(heroRef, {
    fn: (el, p) => {
      const outP = Math.max(0, Math.min(1, (p - 0.85) / 0.15));
      utils.set(el, { opacity: 1 - outP });
    },
  });

  const go = (id: string, e: MouseEvent<HTMLElement>) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    startReveal(id, e.clientX, e.clientY);
  };

  return (
    <div className="home">
      {/* pin wrapper bounds the sticky range: hero stays pinned for exactly
          the runway height (0 under reduced motion), then releases */}
      <div
        className="home__pin"
        ref={pinRef}
        style={{ height: `calc(100svh + ${reduced ? 0 : HERO_FLY_RUNWAY_VH}vh)` }}
      >
        <section className="home__hero" ref={heroRef}>
          <ThreeHero />
          <div className="home__hero-inner" ref={heroInnerRef}>
            <Reveal delay={80}>
              <Fx as="h1" drag bounce className="home__title">
                <span className="home__title-parallax" ref={titleParallaxRef}>
                  {siteConfig.name}
                </span>
              </Fx>
            </Reveal>
            <Reveal delay={160}>
              <p className="home__subtitle">{siteConfig.subtitle}</p>
            </Reveal>
          </div>
        </section>
      </div>

      <section className="home__section" ref={latestRef}>
        <Reveal>
          <div className="home__section-head">
            <h2 className="home__section-title">Latest posts</h2>
            <button
              type="button"
              className="home__section-view"
              onClick={(e) => go('archive', e)}
            >
              View all →
            </button>
          </div>
        </Reveal>
        <div className="home__posts">
          {posts.map((post, index) => (
            <FlipIn
              key={post.slug}
              side={index === 0 ? 'left' : 'right'}
              delay={index * 120}
            >
              <PostCard post={post} reveal={false} />
            </FlipIn>
          ))}
          {posts.length === 0 ? <p className="home__empty">No posts yet.</p> : null}
        </div>
      </section>

      <section className="home__section" ref={aboutRef}>
        <Reveal>
          <h2 className="home__section-title">About</h2>
        </Reveal>
        <Reveal delay={60}>
          <p className="home__about">
            {siteConfig.about}
            <button type="button" className="home__link" onClick={(e) => go('about', e)}>
              Read more →
            </button>
          </p>
        </Reveal>
      </section>
    </div>
  );
}

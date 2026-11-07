'use client';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

/* ---- EDIT YOUR FRIEND'S DETAILS HERE ---- */
const PROFILE = {
  name: 'Krishna Nangre',
  role: 'Director and motion designer',
  email: 'nangrekrishna7@gmail.com',
  phone: '+91 888289 11695',
  statement:
    'I make short films and motion pieces for brands that want to be felt, not just seen. Every frame is built by hand, from the first sketch to the final grade.',
};
const HERO_VIDEO = '/videos/hero.mp4';
const WORK = [
  {
    title: 'Raj Shamani', tag: 'Podcast content editing', src: '/videos/work-1.mp4', ratio: 'wide',
    overview: 'A short-form podcast editing sample based on a conversation, adapted into a standalone social media video. The objective was to turn a longer discussion into a focused piece of content that could capture attention and communicate its central idea quickly.',
    approach: 'I focused on identifying the most engaging part of the conversation and building the edit around that moment. I structured the opening to establish curiosity, removed unnecessary pauses and used visual elements to support the speaker’s message without distracting from it.',
    delivered: ['Selection of an engaging conversation segment', 'Hook development and narrative structure', 'Pacing and removal of unnecessary pauses', 'Captions and visual emphasis', 'Supporting visuals and sound design'],
    objective: 'Transform long-form conversations into concise, engaging content suitable for short-form platforms.',
    note: 'Independent editing sample; not an official collaboration or endorsement.',
  },
  {
    title: 'BJJ Athlete', tag: 'Personal brand content', src: '/videos/work-2.mp4', ratio: 'tall',
    overview: 'A short-form video created for a Brazilian Jiu-Jitsu athlete and coach, designed to communicate his expertise and personal brand through engaging social media content.',
    approach: 'I approached the video with a storytelling-first editing style, combining the speaker’s message with relevant training footage, supporting visuals and product shots. Rather than relying entirely on talking-head footage, I used visual elements to reinforce the message and maintain viewer interest.',
    delivered: ['Engaging opening hook and structured storytelling', 'Relevant B-roll and supporting footage', 'Captions and visual enhancements', 'Sound design and music', 'Motion graphics and transitions', 'Product visuals integrated into the narrative'],
    objective: 'Make personal-brand content more engaging, visually appealing and easier to follow.',
  },
  {
    title: 'Personal introduction', tag: 'Motion design and visual storytelling', src: '/videos/work-3.mp4', ratio: 'tall',
    overview: 'A self-introduction video designed to present my editing style, creative identity and approach to visual storytelling. Instead of a conventional talking-head introduction, I used motion design to make the presentation itself part of the experience.',
    approach: 'I combined spoken content with animated typography, graphic elements and carefully timed visual transitions. Each visual element was designed to complement the message, creating a presentation that feels dynamic while keeping the communication clear.',
    delivered: ['Motion graphics and typography animation', 'Visual composition and graphic elements', 'Animated transitions and visual sequencing', 'Sound design and editing rhythm', 'Integration of talking-head footage with motion design'],
    objective: 'Introduce my creative identity through a visually engaging presentation that demonstrates both editing and motion design capabilities.',
  },
];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function Video({ src, poster, className, active = true }) {
  const ref = useRef(null);
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <div className="fallback" />
      {ok && (
        <video ref={ref} src={src} muted loop playsInline preload="metadata" className={className} onError={() => setOk(false)} />
      )}
    </>
  );
}

function Word({ children, p, range }) {
  const o = useTransform(p, range, [0.18, 1]);
  return <motion.span className="w" style={{ opacity: o }}>{children}</motion.span>;
}

function ReelCard({ w, i, s, onOpen }) {
  const o = useTransform(s, (v) => 1 - clamp(Math.abs(v - i)) * 0.6);
  const sc = useTransform(s, (v) => 1 - clamp(Math.abs(v - i)) * 0.06);
  return (
    <motion.article className={`card ${w.ratio}`} style={{ opacity: o, scale: sc }} onClick={() => onOpen(i)}>
      <Video src={w.src} />
      <div className="meta">
        <div><h3>{w.title}</h3><small>{w.tag}</small></div>
      <button className="plus" aria-label={`Read about ${w.title}`} onClick={(e) => { e.stopPropagation(); onOpen(i); }} />``
      </div>
    </motion.article>
  );
}

function Dot({ s, i, label, go }) {
  const bg = useTransform(s, [i - 0.6, i], ['rgba(241,239,255,0.3)', 'rgba(255,217,194,1)']);
  const sc = useTransform(s, (v) => 1 + (1 - clamp(Math.abs(v - i))) * 0.35);
  return (
    <button className="dot" aria-label={`Go to ${label}`} onClick={() => go(i)}>
      <motion.span style={{ backgroundColor: bg, scale: sc }} />
    </button>
  );
}

function Seg({ s, i }) {
  const fill = useTransform(s, (v) => clamp(v - i));
  return <div className="seg"><motion.span style={{ scaleX: fill }} /></div>;
}

function Dots({ s, go }) {
  return (
    <div className="dots">
      {WORK.map((w, i) => (
        <Fragment key={w.title}>
          <Dot s={s} i={i} label={w.title} go={go} />
          {i < WORK.length - 1 && <Seg s={s} i={i} />}
        </Fragment>
      ))}
    </div>
  );
}

function Sheet({ w, onClose }) {
  const btn = useRef(null);
  useEffect(() => {
    btn.current?.focus();
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="sheet" role="dialog" aria-modal="true" aria-label={w.title} onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
        <header>
          <div><h3>{w.title}</h3><small>{w.tag}</small></div>
          <button className="x" ref={btn} aria-label="Close" onClick={onClose} />
        </header>
        <div className="cols">
          <div>
            <h4>Project overview</h4><p>{w.overview}</p>
            <h4>My creative approach</h4><p>{w.approach}</p>
          </div>
          <div>
            <h4>What I delivered</h4>
            <ul>{w.delivered.map((d) => <li key={d}>{d}</li>)}</ul>
            <h4>Project objective</h4><p>{w.objective}</p>
            {w.note && <p className="note">{w.note}</p>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Page() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState('top');

  /* cursor glow */
  const glow = useRef(null);
  useEffect(() => {
    const m = (e) => glow.current && (glow.current.style.transform = `translate(${e.clientX - 260}px,${e.clientY - 260}px)`);
    window.addEventListener('pointermove', m);
    return () => window.removeEventListener('pointermove', m);
  }, []);

  /* hero: a small window opens into a full-bleed film */
  const heroRef = useRef(null);
  const { scrollYProgress: hp } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  const inset = useTransform(hp, [0, 0.7], [26, 0]);
  const radius = useTransform(hp, [0, 0.7], [40, 0]);
  const clip = useTransform([inset, radius], ([i, r]) => `inset(${i * 0.6}% ${i}% round ${r}px)`);
  const scale = useTransform(hp, [0, 1], [1.25, 1]);
  const titleY = useTransform(hp, [0, 1], ['0vh', '-18vh']);
  const subO = useTransform(hp, [0.55, 0.85], [0, 1]);

  /* statement words */
  const stRef = useRef(null);
  const { scrollYProgress: sp } = useScroll({ target: stRef, offset: ['start 80%', 'end 45%'] });
  const words = PROFILE.statement.split(' ');

  /* reel: pinned horizontal scroll with one stop per video */
  const reelRef = useRef(null);
  const { scrollYProgress: rp } = useScroll({ target: reelRef, offset: ['start start', 'end end'] });
  const trackRef = useRef(null);
  const stops = useRef([0]);
  const s = useTransform(rp, (v) => clamp((v - 0.08) / 0.84) * (WORK.length - 1));
  const x = useMotionValue(0);
  const place = () => {
    const a = stops.current, v = s.get();
    if (a.length < 2) return x.set(a[0] || 0);
    const i = Math.min(a.length - 2, Math.floor(v));
    x.set(a[i] + (a[i + 1] - a[i]) * (v - i));
  };
  useMotionValueEvent(s, 'change', place);
  useLayoutEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      stops.current = [...t.children].map((c) => innerWidth / 2 - (c.offsetLeft + c.offsetWidth / 2));
      place();
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const [open, setOpen] = useState(null);
  const go = (i) => {
    const el = reelRef.current;
    scrollTo({ top: el.offsetTop + ((i / (WORK.length - 1)) * 0.84 + 0.08) * (el.offsetHeight - innerHeight), behavior: 'smooth' });
  };

  /* nav highlight */
  useMotionValueEvent(scrollYProgress, 'change', () => {
    const ids = ['top', 'about', 'work', 'contact'];
    let cur = 'top';
    ids.forEach((id) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.4) cur = id; });
    setActive(cur);
  });

  const [copied, setCopied] = useState('');
  const copy = (v) => navigator.clipboard?.writeText(v).then(() => { setCopied(v); setTimeout(() => setCopied(''), 1800); });

  return (
    <main>
      <div className="glow" ref={glow} aria-hidden />
      <motion.div className="bar" style={{ scaleX: bar }} />
      <nav className="nav" aria-label="Main">
        {[['top', 'Home'], ['about', 'About'], ['work', 'Work']].map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'on' : ''}>{label}</a>
        ))}
        <a href="#contact" className="cta">Contact</a>
      </nav>

      <section id="top" className="hero" ref={heroRef}>
        <div className="stick">
          <motion.div style={{ position: 'absolute', inset: 0, clipPath: clip, scale }}>
            <Video src={HERO_VIDEO} />
          </motion.div>
          <motion.h1 style={{ y: titleY }}>
            {PROFILE.name.split(' ').map((w, i) => (
              <span key={i} style={{ display: 'block' }}>
                {w.split('').map((c, j) => (
                  <motion.span key={j} initial={{ y: '110%', rotate: 6 }} animate={{ y: 0, rotate: 0 }}
                    transition={{ delay: 0.15 + j * 0.05 + i * 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>{c}</motion.span>
                ))}
              </span>
            ))}
          </motion.h1>
          <motion.p className="sub" style={{ opacity: subO }}>{PROFILE.role}</motion.p>
        </div>
      </section>

      <section id="about" className="statement" ref={stRef}>
        <p>{words.map((w, i) => <Word key={i} p={sp} range={[i / words.length * 0.85, Math.min(1, i / words.length * 0.85 + 0.12)]}>{w}</Word>)}</p>
      </section>

      <section id="work" className="reel" ref={reelRef}>
        <div className="stick">
          <div className="head"><h2>Selected work</h2><p>Scroll to browse. Tap + for the story behind each edit.</p></div>
          <motion.div className="track" ref={trackRef} style={{ x }}>
            {WORK.map((w, i) => <ReelCard key={w.title} w={w} i={i} s={s} onOpen={setOpen} />)}
          </motion.div>
          <Dots s={s} go={go} />
        </div>
      </section>
      <AnimatePresence>{open !== null && <Sheet key={open} w={WORK[open]} onClose={() => setOpen(null)} />}</AnimatePresence>

      <section id="contact" className="contact">
        <h2>Have a story to tell? Let’s make it move.</h2>
        <div>
          <div className="links">
            <div>
              <a className="big" href={`mailto:${PROFILE.email}`}><span>Email</span><b>{PROFILE.email}</b></a>
              <button className="copy" onClick={() => copy(PROFILE.email)}>{copied === PROFILE.email ? 'Copied' : 'Copy email'}</button>
            </div>
            <div>
              <a className="big" href={`tel:${PROFILE.phone.replace(/\s/g, '')}`}><span>Phone</span><b>{PROFILE.phone}</b></a>
              <button className="copy" onClick={() => copy(PROFILE.phone)}>{copied === PROFILE.phone ? 'Copied' : 'Copy number'}</button>
            </div>
          </div>
          <footer style={{ marginTop: '10vh' }}><span>© 2026 {PROFILE.name}</span><span>Built by *Jarymedia</span><a href="#top">Back to top</a></footer>
        </div>
      </section>
    </main>
  );
}

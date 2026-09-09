import { type ReactNode } from 'react';
import ArticleImage from '../components/ArticleImage';
import { getPost, resolveAsset } from '../lib/content';
import { Button, Label, Card, List } from '../components/elements';
import {
  Magnetic,
  Tilt,
  Drag,
  Flip,
  Reveal,
} from '../components/effects';
import './LabView.css';

/* --- page-element samples ------------------------------------------------ */

function ButtonSample() {
  return (
    <div className="lab__stack">
      <div className="lab__row">
        <Button>Solid</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="lab__row">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  );
}

function LabelSample() {
  return (
    <div className="lab__stack">
      <div className="lab__row">
        <Label variant="text">Plain label</Label>
        <Label variant="eyebrow">Eyebrow</Label>
        <Label variant="badge">Badge</Label>
      </div>
      <div className="lab__row">
        <Label variant="badge" tone="muted">
          Draft
        </Label>
        <Label variant="badge" tone="accent">
          New
        </Label>
        <Label variant="eyebrow" tone="muted">
          2025 · notes
        </Label>
      </div>
    </div>
  );
}

function CardSample() {
  return (
    <div className="lab__cards">
      <Card>
        <Label variant="eyebrow" tone="muted">
          Outlined
        </Label>
        <h3 className="lab__card-title">A bordered surface</h3>
        <p className="lab__card-text">
          Cards are pure layout — attach any effect component to give them
          motion.
        </p>
      </Card>
      <Card variant="outlined" padded={false}>
        <div className="lab__pad">
          <Label variant="eyebrow" tone="muted">
            Flush
          </Label>
          <h3 className="lab__card-title">No padding</h3>
          <p className="lab__card-text">
            Pass <code>padded={'{false}'}</code> when content manages its own
            padding.
          </p>
        </div>
      </Card>
    </div>
  );
}

function ListSample() {
  return (
    <div className="lab__lists">
      <List>
        <List.Item>Plain unordered row</List.Item>
        <List.Item>Another row</List.Item>
        <List.Item>One more</List.Item>
      </List>
      <List ordered>
        <List.Item>First</List.Item>
        <List.Item>Second</List.Item>
      </List>
      <List divided unstyled>
        <List.Item>
          <strong>Divided row</strong> — hairline separators
        </List.Item>
        <List.Item>
          <strong>Divided row</strong> — no marker
        </List.Item>
        <List.Item>
          <strong>Divided row</strong> — compact lists
        </List.Item>
      </List>
    </div>
  );
}

/* --- effect-element samples ---------------------------------------------- */

function MagneticSample() {
  return (
    <div className="lab__row">
      <Magnetic>
        <Button>Follow me</Button>
      </Magnetic>
      <Magnetic offset={22}>
        <div className="lab__tile">stronger</div>
      </Magnetic>
    </div>
  );
}

function TiltSample() {
  return (
    <div className="lab__row lab__row--tiles">
      <Tilt max={12}>
        <div className="lab__tile">tilt</div>
      </Tilt>
      <Tilt max={20}>
        <Card className="lab__tile-card">a tilted card</Card>
      </Tilt>
    </div>
  );
}

function DragSample() {
  return (
    <div className="lab__row lab__row--tiles">
      <Drag>
        <div className="lab__tile lab__tile--wide">drag me</div>
      </Drag>
      <Drag>
        <Card className="lab__tile-card">a draggable card</Card>
      </Drag>
    </div>
  );
}

function FlipSample() {
  const face = (text: string, sub: string) => (
    <div className="lab__flip-face">
      <span className="lab__flip-text">{text}</span>
      <span className="lab__flip-sub">{sub}</span>
    </div>
  );
  return (
    <div className="lab__row lab__row--tiles">
      <Flip
        front={face('Hover', 'front face')}
        back={face('Hello', 'back face')}
      />
      <Flip
        trigger="click"
        front={face('Click me', 'keyboard accessible')}
        back={face('Flipped!', 'click to return')}
      />
      <Flip
        axis="x"
        front={face('Hover', 'horizontal axis')}
        back={face('Upside', 'rotateX flip')}
      />
    </div>
  );
}

/* effects can stack on a single element — wrap outside-in */
function ComboSample() {
  return (
    <div className="lab__row">
      <Magnetic offset={14}>
        <Tilt max={10}>
          <Drag>
            <Button size="lg">magnetic + tilt + drag</Button>
          </Drag>
        </Tilt>
      </Magnetic>
    </div>
  );
}

/* --- existing content sample --------------------------------------------- */

function ImageDemo() {
  const post = getPost('hello-world');
  const src = post ? resolveAsset(post, './hello-world/generated.png') : null;
  return (
    <div className="lab__images">
      <ArticleImage src={src} alt="Generated PNG" caption="A generated PNG" />
      <ArticleImage src={null} alt="missing-image.png" />
    </div>
  );
}

function Section({
  index,
  title,
  intro,
  children,
}: {
  index: number;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <Reveal delay={index * 60}>
      <section className="lab__section">
        <h2 className="lab__section-title">{title}</h2>
        {intro ? <p className="lab__section-intro">{intro}</p> : null}
        {children}
      </section>
    </Reveal>
  );
}

export default function LabView() {
  return (
    <div className="lab">
      <Reveal>
        <h1 className="lab__title">Lab</h1>
        <p className="lab__lede">
          The component library has two layers:{' '}
          <strong>page elements</strong> render structure, and{' '}
          <strong>effect elements</strong> wrap them to attach motion.
        </p>
      </Reveal>

      <Section index={1} title="Button" intro="Sizes and variants.">
        <ButtonSample />
      </Section>

      <Section index={2} title="Label" intro="Text, eyebrow and badge treatments.">
        <LabelSample />
      </Section>

      <Section index={3} title="Card" intro="Surfaces with the site border language.">
        <CardSample />
      </Section>

      <Section index={4} title="List" intro="Plain, ordered and divided lists.">
        <ListSample />
      </Section>

      <Section
        index={5}
        title="Magnetic"
        intro="Effect element — the wrapped element follows the cursor and springs back."
      >
        <MagneticSample />
      </Section>

      <Section
        index={6}
        title="Tilt"
        intro="Effect element — 3D rotation toward the cursor (perspective built in)."
      >
        <TiltSample />
      </Section>

      <Section
        index={7}
        title="Drag"
        intro="Effect element — press and drag to move it; release and it springs back home (same physics as the home title)."
      >
        <DragSample />
      </Section>

      <Section
        index={8}
        title="Flip"
        intro="Effect element — two faces flip on hover or click."
      >
        <FlipSample />
      </Section>

      <Section
        index={9}
        title="Combined"
        intro="Effects compose — nest wrappers to stack motion on one element."
      >
        <ComboSample />
      </Section>

      <Section index={10} title="Images">
        <ImageDemo />
      </Section>
    </div>
  );
}

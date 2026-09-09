import ArticleImage from '../components/ArticleImage';
import Button from '../components/Button';
import Fx from '../components/Fx';
import Reveal from '../components/Reveal';
import { getPost, resolveAsset } from '../lib/content';
import './LabView.css';

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

export default function LabView() {
  return (
    <div className="lab">
      <Reveal>
        <h1 className="lab__title">Lab</h1>
      </Reveal>

      <Reveal delay={60}>
        <section className="lab__section">
          <h2 className="lab__section-title">Buttons</h2>
          <div className="lab__row">
            <Button>Solid</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button magnetic>Magnetic</Button>
          </div>
        </section>
      </Reveal>

      <Reveal delay={120}>
        <section className="lab__section">
          <h2 className="lab__section-title">Fx</h2>
          <div className="lab__row">
            <Fx magnetic className="lab__tile">
              magnetic
            </Fx>
            <Fx tilt className="lab__tile lab__tile--tilt">
              tilt
            </Fx>
            <Fx click="about" className="lab__tile">
              click
            </Fx>
          </div>
        </section>
      </Reveal>

      <Reveal delay={180}>
        <section className="lab__section">
          <h2 className="lab__section-title">Images</h2>
          <ImageDemo />
        </section>
      </Reveal>
    </div>
  );
}

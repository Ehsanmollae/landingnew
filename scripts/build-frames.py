"""Pack the hand-drawn animation frames into one WebP strip per animation.

Input:  art/frames/<anim>/<cat>/frame-01.png, frame-02.png, ... (same canvas size, transparent)
Output: public/cats/<cat>/<anim>.webp  (frames side by side)
        src/cats/frames.json           (frame count + foot line per animation, scale reference)

    pip install pillow numpy
    python3 scripts/build-frames.py
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'art/frames'
OUT = ROOT / 'public/cats'
SIZE = 256  # frame size in the output strips
ALPHA = 40  # pixels more transparent than this count as empty


def opaque_rows(img):
    a = np.array(img)[..., 3] > ALPHA
    return np.nonzero(a.any(axis=1))[0]


def main():
    meta = {}
    for anim_dir in sorted(p for p in SRC.iterdir() if p.is_dir()):
        for cat_dir in sorted(p for p in anim_dir.iterdir() if p.is_dir()):
            files = sorted(cat_dir.glob('frame-*.png'))
            if not files:
                continue
            frames = [Image.open(f).convert('RGBA').resize((SIZE, SIZE), Image.LANCZOS) for f in files]
            # one foot line for the whole animation so the cat doesn't jitter between frames
            foot = max(int(opaque_rows(f)[-1]) + 1 for f in frames)
            strip = Image.new('RGBA', (SIZE * len(frames), SIZE))
            for i, f in enumerate(frames):
                strip.paste(f, (i * SIZE, 0))
            dest = OUT / cat_dir.name
            dest.mkdir(parents=True, exist_ok=True)
            strip.save(dest / f'{anim_dir.name}.webp', 'WEBP', quality=86, method=6)
            entry = meta.setdefault(cat_dir.name, {'anims': {}})
            entry['anims'][anim_dir.name] = {'n': len(frames), 'foot': foot}
            if anim_dir.name == 'sitting':
                rows = opaque_rows(frames[0])
                entry['ref'] = int(rows[-1] - rows[0] + 1)  # sitting height = one "cat size"
    for cat, entry in meta.items():
        assert 'ref' in entry, f'{cat} needs a sitting animation (used as the size reference)'
    (ROOT / 'src/cats/frames.json').write_text(json.dumps({'size': SIZE, 'cats': meta}, indent=2))
    print({cat: sorted(e['anims']) for cat, e in meta.items()})


if __name__ == '__main__':
    main()

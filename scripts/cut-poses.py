"""Cut the cat pose sheets in art/ into one transparent WebP per pose.

Each sheet is a 3 x 4 grid: columns = black, white, orange cat; rows = poses.
Output: public/cats/<cat>/<pose>.webp and src/cats/poses.json (size + foot anchor).

    pip install pillow numpy scipy
    python3 scripts/cut-poses.py
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SHEETS = {
    'art/poses-1.webp': ['reach', 'groom', 'sleep', 'startled'],
    'art/poses-2.webp': ['sit', 'walk', 'stretch', 'hopAway'],
    'art/poses-3.webp': ['run', 'pounceUp', 'crouch', 'roll'],
}
CATS = ['black', 'white', 'orange']
PAD = 4


def foreground_alpha(img):
    """Alpha channel for the figures, whether the sheet is transparent or on white."""
    rgba = np.array(img.convert('RGBA')).astype(np.int16)
    alpha = rgba[..., 3]
    if (alpha < 40).mean() > 0.3:  # already cut out
        a = alpha.copy()
        a[a < 40] = 0
        return rgba, a
    # White background: flood-fill near-white pixels connected to the border.
    near_white = rgba[..., :3].min(axis=2) >= 232
    labels, _ = ndimage.label(near_white)
    border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    background = np.isin(labels, border[border > 0])
    a = np.where(background, 0, 255).astype(np.int16)
    # soften the edge a little
    edge = ndimage.binary_dilation(background) & ~background
    a[edge] = 160
    return rgba, a


def main():
    out_meta = {}
    for sheet, poses in SHEETS.items():
        rgba, alpha = foreground_alpha(Image.open(ROOT / sheet))
        H, W = alpha.shape
        mask = alpha > 0
        labels, n = ndimage.label(ndimage.binary_dilation(mask, iterations=2))
        labels[~mask] = 0
        areas = ndimage.sum(mask, labels, index=range(1, n + 1))
        centres = ndimage.center_of_mass(mask, labels, index=range(1, n + 1))
        big = [i for i in range(n) if areas[i] > areas.max() * 0.15]
        # each big blob is a cat: it goes to the grid cell of its centre
        cells = {}
        for i in big:
            cy, cx = centres[i]
            cells.setdefault((min(3, int(cy // (H / 4))), min(2, int(cx // (W / 3)))), []).append(i + 1)
        # small blobs (tail tufts, "!" marks) belong to the nearest cat
        for i in range(n):
            if i in big or areas[i] < 20:
                continue
            cy, cx = centres[i]
            nearest = min(big, key=lambda b: (centres[b][0] - cy) ** 2 + (centres[b][1] - cx) ** 2)
            for ids in cells.values():
                if nearest + 1 in ids:
                    ids.append(i + 1)

        for (row, col), ids in sorted(cells.items()):
            cat, pose = CATS[col], poses[row]
            figure = np.isin(labels, ids)
            ys, xs = np.nonzero(figure)
            y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
            crop = rgba[y0:y1, x0:x1].copy()
            crop[..., 3] = np.where(figure[y0:y1, x0:x1], alpha[y0:y1, x0:x1], 0)
            h, w = crop.shape[:2]
            canvas = np.zeros((h + PAD * 2, w + PAD * 2, 4), dtype=np.uint8)
            canvas[PAD:PAD + h, PAD:PAD + w] = crop.clip(0, 255)
            # foot anchor: centre of the opaque pixels in the lowest 12% of the figure
            a = canvas[..., 3] > 0
            rows = np.nonzero(a.any(axis=1))[0]
            band = a[rows[-1] - max(3, int(h * 0.12)):rows[-1] + 1]
            fx = np.nonzero(band.any(axis=0))[0]
            anchor_x = (fx.min() + fx.max()) / 2
            dest = ROOT / 'public/cats' / cat
            dest.mkdir(parents=True, exist_ok=True)
            Image.fromarray(canvas).save(dest / f'{pose}.webp', 'WEBP', quality=88, method=6)
            out_meta.setdefault(cat, {})[pose] = {
                'w': int(canvas.shape[1]),
                'h': int(canvas.shape[0]),
                'ax': round(float(anchor_x), 1),
                'ay': int(rows[-1] + 1),
            }
    (ROOT / 'src/cats/poses.json').write_text(json.dumps(out_meta, indent=2))
    print({c: sorted(p) for c, p in out_meta.items()})


if __name__ == '__main__':
    main()

from PIL import Image
from pathlib import Path

root = Path(r"C:\Users\USER\Desktop\준모웹이미지\하람보호소\public")
src = Path(r"C:\Users\USER\.cursor\projects\c-Users-USER-Desktop\assets\favicon-source.png")
img = Image.open(src).convert("RGBA")

def save_png(path: Path, size: int) -> None:
    out = img.resize((size, size), Image.Resampling.LANCZOS)
    out.save(path, format="PNG", optimize=True)
    print(f"wrote {path.name} {size}x{size}")

save_png(root / "favicon.png", 32)
save_png(root / "apple-touch-icon.png", 180)
save_png(root / "logo.png", 512)
save_png(root / "icon-512.png", 512)

sizes = [(16, 16), (32, 32), (48, 48)]
icons = [img.resize(s, Image.Resampling.LANCZOS) for s in sizes]
icons[0].save(root / "favicon.ico", format="ICO", sizes=sizes)
print("wrote favicon.ico")

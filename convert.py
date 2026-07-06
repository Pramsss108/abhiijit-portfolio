#!/usr/bin/env python3
"""
Madquick clone -> Abhijit Pramanik solo portfolio converter.

Runs a single set of literal string replacements across every canonical page.
All replaceable values live in the CONFIG block below — edit there, never inline.

Source of truth for identity: career-dashboard/data/experience_graph.json
  (agent_fast_context.identity)
"""
import os, sys, re, shutil, glob

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(HERE, "public")
BACKUP = os.path.join(HERE, "_backup_before_convert")

# ---------------------------------------------------------------------------
# CONFIG — every literal that changes. Case-sensitive; longer forms first.
# ---------------------------------------------------------------------------
REPLACEMENTS = [
    # ---- WhatsApp / contact deep links (do BEFORE plain brand swap) ----
    ("https://wa.link/o9hvuo", "https://wa.me/918777849865"),

    # ---- Phone numbers (every spacing variant found in markup) ----
    ("+91-96919 00629", "+91 87778 49865"),
    ("+91-9691900629", "+91 87778 49865"),
    ("91-9691900629", "87778 49865"),
    ("91-96919 00629", "87778 49865"),
    ("tel:+91-96919 00629", "tel:+918777849865"),
    ("tel:+91-9691900629", "tel:+918777849865"),

    # ---- Email ----
    ("support@madquick.com", "growabhiii@gmail.com"),

    # ---- Map address (Sagar MP -> Kolkata WB) — every variant ----
    ("maps?q=Infront%20of%20Khare%20Classes%2C%205%2C%20Civil%20Line%2C%20Behind%20Hanuman%20Mandir%2C%20Sagar%2C%20Madhya%20Pradesh%2C%20India",
     "maps?q=Kolkata%2C%20West%20Bengal%2C%20India"),
    ("Infront of Khare Classes, 5, Civil Line, Behind Hanuman Mandir, Sagar, Madhya Pradesh, India",
     "Kolkata, West Bengal, India"),
    ("of Khare Classes, 5, Civil Line, Behind Hanuman Mandir, Sagar, Madhya Pradesh.",
     "Kolkata, West Bengal."),
    ("5, Civil Line, Behind Hanuman Mandir, Sagar 470001",
     "Kolkata, West Bengal"),
    ("https://maps.app.goo.gl/BZh7zHVZgqcc4cxNA", "https://maps.app.goo.gl/kolkata-wb-india"),
    ("Based in Madhya Pradesh, India", "Based in Kolkata, West Bengal"),
    ("Madhya Pradesh", "West Bengal"),
    ("Sagar 470001", "Kolkata 700001"),
    ("Sagar", "Kolkata"),

    # ---- Company legal / founding claims -> truthful ----
    ("CIN no. U72200MP2021PTC057243", "Based in Kolkata, West Bengal"),
    ("U72200MP2021PTC057243", ""),  # any stray bare CIN

    # ---- FAQ founding + staff (must become truthful) ----
    ("Our company has been established since August 25, 2021, making it over three years old.",
     "I've been delivering client work for over three years, starting in 2019."),
    ("since August 25, 2021", "since 2019"),
    ("Our company has 25 dedicated staff members working to deliver top-notch web development services.",
     "I work solo and personally handle every project end-to-end, so you always deal directly with the person doing the work."),

    # ---- Domain references ----
    ("madquick.in", "abhijitpramanik.com"),

    # ---- Brand word (run AFTER specific phrases above) ----
    # Upper-cased first letter
    ("Madquick", "Abhijit Pramanik"),
    # All caps
    ("MADQUICK", "ABHIJIT PRAMANIK"),
    # Lowercase (urls/filenames handled separately)
    ("madquick", "abhijit"),
]

# ---------------------------------------------------------------------------
def backup_once():
    if os.path.exists(BACKUP):
        return
    os.makedirs(BACKUP, exist_ok=True)
    for f in glob.glob(os.path.join(PUBLIC, "*.html")):
        shutil.copy2(f, os.path.join(BACKUP, os.path.basename(f)))
    print(f"[backup] saved {len(glob.glob(os.path.join(BACKUP,'*.html')))} files -> {BACKUP}")

def convert_file(path):
    with open(path, encoding="utf-8") as fh:
        src = fh.read()
    orig_len = len(src)
    counts = {}
    out = src
    for old, new in REPLACEMENTS:
        if not old:
            continue
        n = out.count(old)
        if n:
            counts[old] = n
            out = out.replace(old, new)
    changed = out != src
    if changed:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(out)
    return changed, counts, orig_len, len(out)

def main():
    backup_once()
    pages = sorted(glob.glob(os.path.join(PUBLIC, "*.html")))
    print(f"[run] {len(pages)} html files\n")
    grand = {}
    for p in pages:
        changed, counts, a, b = convert_file(p)
        name = os.path.basename(p)
        if not counts:
            print(f"  --  {name}  (no matches)")
            continue
        total = sum(counts.values())
        flag = "OK " if changed else "   "
        print(f"  {flag} {name}  {total} swaps")
        for k, v in counts.items():
            grand[k] = grand.get(k, 0) + v
    print("\n[per-string totals]")
    for k, v in sorted(grand.items(), key=lambda x: -x[1]):
        disp = k if len(k) <= 48 else k[:45] + "..."
        print(f"   {v:>4}  {disp}")

if __name__ == "__main__":
    main()

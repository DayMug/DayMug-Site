# DayMug-Site

Static landing site for [DayMug](https://github.com/DayMug/DayMug), served at daymug.com.

Plain HTML/CSS/JS — no build step, deployed by Cloudflare Pages' Git integration on every push to `main`. Open `index.html` locally, or serve the directory:

```bash
python3 -m http.server 8000
```

The real installer and `config.example.yaml` ship as assets of every DayMug GitHub Release. `install.sh` here only forwards to the latest one, so the short `https://daymug.com/install.sh` link keeps working.

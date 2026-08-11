# HER WORLD - 3D Interactive Birthday Web Experience ✨

"HER WORLD" is a high-fidelity, interactive 3D WebGL birthday web experience crafted specifically to celebrate a special person. It features a rotating 3D Earth, 7 continents, 70 iconic world landmarks with dedicated 3D inspection scenes, procedural audio, secret easter eggs, and a climax secret sanctuary with a personalized message.

---

## ⚡ QUICK CUSTOMIZATION (How to Customize for Her)

You can customize the entire experience **without touching any 3D or code logic**!

Open the single configuration file:
👉 **`/src/config/birthday.ts`**

In that file, edit these fields:

```typescript
export const BIRTHDAY_CONFIG = {
  HER_NAME: "BENEDICTA",          // Her first name
  HER_NICKNAME: "Benny",          // Her nickname
  BIRTHDAY: "August 12",          // Her birthday
  YOUR_NAME: "HAMZAH QUICKSILVER",  // Your name

  FAVORITE_COLOR: "#e0a96d",      // Warm gold / favorite accent color
  FAVORITE_PLACE: "Paris & Swiss Alps",
  
  SPECIAL_TITLE: "Happy Birthday, BENEDICTA! ✨",
  SPECIAL_MESSAGE: `To Benedicta, ...`, // Your personal letter / wishes
};
```

---

## 🌟 Key Features

1. **Cinematic Opening**: Mysterious invitation leading into an interactive WebGL space universe.
2. **Interactive 3D Globe**: Built with Three.js, procedural high-res canvas Earth textures, clouds, atmosphere glow, and orbiting Moon.
3. **70 Iconic World Landmarks**: 10 destinations per continent (Europe, Africa, Asia, North America, South America, Oceania, Antarctica).
4. **3D Landmark Scenes**: Interactive 3D models with day/sunset/night/aurora lighting, particle effects, auto-rotate, and postcard photo capture.
5. **Secret Sanctuary ("ONE MORE PLACE...")**: Climax scene with cosmic 3D floating island, celebration fireworks, and personalized message.
6. **Hidden Easter Eggs**: Clickable Moon quote, Santa's Sleigh flight check-in, and Stargazing Constellation mode connecting visited places.
7. **Procedural Web Audio API Synthesizer**: Space ambient pads, travel chimes, and celebration fanfare without external MP3 files.
8. **100% Free & Open-Source**: Zero paid backends or API keys required.

---

## 🚀 Setup & Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run dev server**:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## 🌐 Deployment (Free Hosting)

This project is a static React single-page application and can be hosted for **free** on:
- **Cloud Run / Vercel**: Connect repository and deploy using default Vite build settings.
- **GitHub Pages**: Run `npm run build` and publish the `dist/` folder.
- **Netlify**: Drag and drop the `dist/` directory.

---

## 🛡️ Legal & Asset Attributions
All assets, icons, and libraries are 100% free, open-source, and legally compliant (MIT/ISC licenses). See `/ATTRIBUTIONS.md` or click "Credits & Sources" in the app header for full details.

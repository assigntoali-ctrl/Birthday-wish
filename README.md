# Fareha Birthday Surprise

A mobile-first, single-page React + TypeScript birthday experience.

## Run locally
1. Install Node.js 20 or later.
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL shown by Vite.

## Production build
Run `npm run build`. The deployable website is created in `dist/`.

## Deploy free with Cloudflare Pages
1. Create a GitHub repository and push this project.
2. In Cloudflare Pages, choose **Create a project** → **Connect to Git**.
3. Select the repository.
4. Set build command to `npm run build` and output directory to `dist`.
5. Deploy. Cloudflare will provide the public URL.

Alternative: import the repository into Vercel or Netlify; use `npm run build` and `dist`.

## Personalisation
The recipient/sender names, age, letter, and five reasons are currently in `src/main.tsx`.
The ambient sound is a subtle generated tone bed (Web Audio API), not a downloaded music track. Replace it with a licensed audio file if a specific song is desired.

## Notes
- Mobile-first layout with safe-area spacing and responsive typography.
- Audio begins only after tapping the sound control due to browser autoplay restrictions.
- No photos are included, per the approved requirements.
- Test the deployed site on a real mobile browser before sharing.

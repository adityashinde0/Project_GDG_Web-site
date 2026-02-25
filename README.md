# GDG Site + Backend

## Project structure
- `site_gdg/`: frontend pages and assets
- `Backend2/`: OAuth starter backend

## Run frontend
Open `site_gdg/index.html` with Live Server or any static server.

## Run backend
1. Create `Backend2/.env` from `Backend2/.env.example`
2. Install dependencies in `Backend2`:
   `npm install`
3. Start backend:
   `npm start`
4. Add `VIDEO_SOURCE_URL` in backend `.env` to keep raw video URL out of frontend code/repo.
5. Set `FRONTEND_ORIGIN` to your exact frontend domain (for example, your Netlify URL).

## Security notes
- Never commit `.env` files.
- Keep OAuth client secrets only in local environment.
- Video is now served via backend proxy route (`/media/hero-video`), so OneDrive link is not exposed in frontend source.
- Video endpoint allows only requests originating from `FRONTEND_ORIGIN`.

## Demo video
<video src="https://github.com/adityashinde0/Project_GDG_Web-site/raw/main/site_gdg/Video_Project%203.mp4" controls width="900"></video>

[Open video directly](https://github.com/adityashinde0/Project_GDG_Web-site/blob/main/site_gdg/Video_Project%203.mp4)

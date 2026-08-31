# Deploy steps

1. Push this whole folder to your `jaysonai` GitHub repo (replace everything currently there).
2. On Render: go to your existing `jaysonai` service settings, or create a new one.
   - **Important:** this must be a **Web Service**, not a Static Site.
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
3. Deploy. Video will now stream correctly since Express serves it with proper Range/Accept-Ranges support.

If your current Render service is set up as a Static Site, you cannot just redeploy —
Static Site and Web Service are different service types on Render. You'll need to
create a new Web Service pointing at this repo (or check Render's docs on changing
an existing service's type).

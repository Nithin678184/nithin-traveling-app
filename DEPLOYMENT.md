# Public Hosting Guide

This project needs three public services:

- MongoDB Atlas for the database
- Render or another Node hosting service for `server`
- Vercel or Netlify for `client`

## 1. Upload Project to GitHub

Create a GitHub repository and upload the full `nithin-traveling-app` folder.

## 2. MongoDB Atlas

1. Create a MongoDB Atlas account.
2. Create a free/shared cluster.
3. Create a database user and password.
4. In Network Access, allow access for your deployment service. For college demo use, you can temporarily allow `0.0.0.0/0`.
5. Copy your connection string.

Example:

```text
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/nithin_traveling_app
```

## 3. Deploy Backend

Deploy the `server` folder as a Node web service.

Use these settings:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Environment variables:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=use_a_long_secret_key
HOST=0.0.0.0
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
```

After deploy, your backend URL will look like:

```text
https://your-backend-domain.onrender.com
```

Test:

```text
https://your-backend-domain.onrender.com
```

It should show:

```json
{ "message": "Nithin Traveling App API is running" }
```

## 4. Deploy Frontend

Deploy the `client` folder as a Vite React app.

Use these settings:

```text
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

Environment variable:

```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

After deploy, your frontend URL will look like:

```text
https://your-frontend-domain.vercel.app
```

## 5. Update Backend CORS

After frontend deployment, update the backend environment variable:

```env
CLIENT_URL=https://your-frontend-domain.vercel.app
```

Redeploy/restart the backend.

## 6. Seed Admin and Sample Buses

Use the same MongoDB Atlas `MONGO_URI` locally, then run:

```bash
cd server
npm run seed:admin
npm run seed:buses
```

Or run those commands from your hosting provider shell if available.

Default admin:

```text
Email: admin@nithintraveling.com
Password: admin123
```

## 7. Google Search

After the site is public:

1. Open Google Search Console.
2. Add your frontend URL.
3. Submit the sitemap:

```text
https://your-frontend-domain.com/sitemap.xml
```

Google search listing is not instant. It can take days or weeks.

Before submitting, replace `your-frontend-domain.com` in:

- `client/public/robots.txt`
- `client/public/sitemap.xml`

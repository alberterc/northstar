# Northstar
Website to gamify life tasks and routines with quests.

## How to start local development?
### Frontend
Run inside _./frontend/_
1. Install packages with ```npm install```.
2. Run backend server with ```npm run dev```.

### Backend
Run inside _./backend/_
1. Install packages with ```npm install```.
2. Check and change Wrangler configuration (wrangler.tomc or wrangler.jsonc) as needed.
3. Create D1 database table with Wrangler with ```npm run db:create```.
4. Add D1 database with dummy data with ```npm run dev:insert```.
5. Run backend server with ```npm run dev```.

## How to deploy to Cloudflare Workers using Wrangler?
Run in root (_./_)
1. Connect to Cloudflare account through Wrangler with ```npx wrangler login```. Check current logged in account with ```npx wrangler whoami```.
2. Check and change Wrangler configuration (wrangler.tomc or wrangler.jsonc) as needed.
3. D1 database data can be inserted in the Cloudflare dashboard or through cli with ```npx wrangler d1 execute <database_name> --remote --file=<sql_file>``` (examples are in _./backend/package.json_ with ```npm run db-remote:*```).
4. Deploy worker (Wrangler backend) with ```npm run deploy```.

<details>
  <summary>
    <h2><code>[Click to show]</code> Tech Stack</h2>
  </summary>

  ### Frontend:
  - [Node.js](https://nodejs.org/) - Node.js is an open-source, cross-platform JavaScript runtime environment.
  - [Vite](https://vite.dev/) - Vite is a blazing fast frontend build tool powering the next generation of web applications.
  - [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
  ### Backend:
  - [Wrangler](https://developers.cloudflare.com/workers/wrangler/) - Wrangler, the Cloudflare Developer Platform command-line interface (CLI), allows you to manage Worker projects.
</details>

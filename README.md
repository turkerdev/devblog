# Blog

Your personal blog app.

## Details

Home page is a static page, that contains your blog posts, on every new post home page will be regenerated. Blog posts are also static page. Post creation page is SSR page that guarded by `ADMIN_KEY`. APIs are also guarded by `ADMIN_KEY`.

## Endpoints

All your blogs @ `example.com/`\
Create your blogs @ `example.com/create`\
View a specific blog @ `example.com/{slug}`

## Development

- set `DATABASE_URL`(mongo) to `.env` file
- set `ADMIN_KEY` to `.env` file
- `yarn dev`

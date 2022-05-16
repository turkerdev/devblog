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

## Screenshots

![image](https://user-images.githubusercontent.com/48413508/168506741-09cdcc20-d345-45c2-b694-857b45707daf.png)
![image](https://user-images.githubusercontent.com/48413508/168506760-b522663f-f3db-4b84-b5cc-6f1650478939.png)


# Frontend Mentor - Social media dashboard with theme switcher

![Design preview for the Social media dashboard with theme switcher coding challenge](preview.jpg)

## Welcome! 👋

Thanks for checking out this front-end coding challenge.

[Frontend Mentor](https://www.frontendmentor.io) challenges help you improve your coding skills by building realistic projects.

**To do this challenge, you need a basic understanding of HTML, CSS and a tiny bit of JavaScript.**

## The challenge

Your challenge is to build out this Social Media Dashboard and get it looking as close to the design as possible.

You can use any tools you like to help you complete the challenge. So if you've got something you'd like to practice, feel free to give it a go.

Your users should be able to:

- View the optimal layout for the site depending on their device's screen size
- See hover states for all interactive elements on the page
- Toggle color theme to their preference

Want some support on the challenge? [Join our community](https://www.frontendmentor.io/community) and ask questions in the **#help** channel.

## Where to find everything

Your task is to build out the project to the designs inside the `/design` folder. You will find both a mobile and a desktop version of the design.

The designs are in JPG static format. Using JPGs will mean that you'll need to use your best judgment for styles such as `font-size`, `padding` and `margin`.

If you would like the Figma design file to inspect the design in more detail, you can [subscribe as a PRO member](https://www.frontendmentor.io/pro).

You will find all the required assets in the `/images` folder. The assets are already optimized.

There is also a `style-guide.md` file containing the information you'll need, such as color palette and fonts.

## Building your project

Feel free to use any workflow that you feel comfortable with. Below is a suggested process, but do not feel like you need to follow these steps:

1. Initialize your project as a public repository on [GitHub](https://github.com/). Creating a repo will make it easier to share your code with the community if you need help. If you're not sure how to do this, [have a read-through of this Try Git resource](https://try.github.io/).
2. Configure your repository to publish your code to a web address. This will also be useful if you need some help during a challenge as you can share the URL for your project with your repo URL. There are a number of ways to do this, and we provide some recommendations below.
3. Look through the designs to start planning out how you'll tackle the project. This step is crucial to help you think ahead for CSS classes to create reusable styles.
4. Before adding any styles, structure your content with HTML. Writing your HTML first can help focus your attention on creating well-structured content.
5. Write out the base styles for your project, including general content styles, such as `font-family` and `font-size`.
6. Start adding styles to the top of the page and work down. Only move on to the next section once you're happy you've completed the area you're working on.

## Deploying your project

As mentioned above, there are many ways to host your project for free. Our recommended hosts are:

- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)

You can host your site using one of these solutions or any of our other trusted providers. [Read more about our recommended and trusted hosts](https://medium.com/frontend-mentor/frontend-mentor-trusted-hosting-providers-bf000dfebe).

## Create a custom `README.md`

We strongly recommend overwriting this `README.md` with a custom one. We've provided a template inside the [`README-template.md`](./README-template.md) file in this starter code.

The template provides a guide for what to add. A custom `README` will help you explain your project and reflect on your learnings. Please feel free to edit our template as much as you like.

Once you've added your information to the template, delete this file and rename the `README-template.md` file to `README.md`. That will make it show up as your repository's README file.

## Submitting your solution

Submit your solution on the platform for the rest of the community to see. Follow our ["Complete guide to submitting solutions"](https://medium.com/frontend-mentor/a-complete-guide-to-submitting-solutions-on-frontend-mentor-ac6384162248) for tips on how to do this.

Remember, if you're looking for feedback on your solution, be sure to ask questions when submitting it. The more specific and detailed you are with your questions, the higher the chance you'll get valuable feedback from the community.

## Sharing your solution

There are multiple places you can share your solution:

1. Share your solution page in the **#finished-projects** channel of the [community](https://www.frontendmentor.io/community).
2. Tweet [@frontendmentor](https://twitter.com/frontendmentor) and mention **@frontendmentor**, including the repo and live URLs in the tweet. We'd love to take a look at what you've built and help share it around.
3. Share your solution on other social channels like LinkedIn.
4. Blog about your experience building your project. Writing about your workflow, technical choices, and talking through your code is a brilliant way to reinforce what you've learned. Great platforms to write on are [dev.to](https://dev.to/), [Hashnode](https://hashnode.com/), and [CodeNewbie](https://community.codenewbie.org/).

We provide templates to help you share your solution once you've submitted it on the platform. Please do edit them and include specific questions when you're looking for feedback.

The more specific you are with your questions the more likely it is that another member of the community will give you feedback.

## Got feedback for us?

We love receiving feedback! We're always looking to improve our challenges and our platform. So if you have anything you'd like to mention, please email hi@frontendmentor.io.

This challenge is completely free. Please share it with anyone who will find it useful for practice.

**Have fun building!** 🚀
<!--
	README for the student project: Social Media Dashboard with Theme Switcher
	Replaced the original Frontend Mentor starter README with a project-specific README
-->

# Social Media Dashboard with Theme Switcher

This repository contains a small React (Vite) frontend and an Express prototype backend that serves a lowdb JSON database. The app is a Frontend Mentor coding challenge implementation that shows social media follower counts and overview metrics with a light/dark theme toggle.

Live preview: (this is a local project — run it locally; see "Run locally" below)

Key features
- React + Vite frontend
- Express backend (Node) with lowdb JSON datastore
- Theme switch (light / dark)
- Dashboard cards for followers and overview stats

Project structure

```
/
	Client/                # Vite React app
		src/
			components/       # UI components (Header, FollowerCard, OverviewCard, ThemeToggle)
			App.jsx
			main.jsx
			styles.css
		package.json
	Server/                # Prototype API
		index.js             # Express routes: /api/followers, /api/overview, /api/total-followers
		db.js                # lowdb initialization
		db.json              # sample data
		package.json
	images/                # assets
	README-template.md
	README.md              # this file
```

Requirements
- Node.js 16+ (recommended 18+)

Run locally (development)

1) Start the backend API

```bash
cd Server
npm install
npm run dev    # starts nodemon -> node index.js
```

You should see: "API running on http://localhost:5174"

Quick API checks

```bash
curl -i http://localhost:5174/
curl -i http://localhost:5174/api/overview
curl -i http://localhost:5174/api/followers
curl -i http://localhost:5174/api/total-followers
```

2) Start the client

```bash
cd Client
npm install
npm run dev    # starts Vite dev server (default port 5173)
```

Open the app in your browser at the Vite URL (usually http://localhost:5173).

Notes on development
- The client uses `VITE_API_BASE` to configure the API base URL. For local development the project provides `Client/.env` with `VITE_API_BASE=/api` and a Vite proxy in `Client/vite.config.js` that forwards `/api/*` to `http://localhost:5174`.
- If you change environment variables or Vite config, restart the Vite dev server so the new config takes effect.
- If you see proxy errors like `ECONNREFUSED` in the Vite terminal, make sure the backend is started and listening on port 5174.

Testing & debugging
- Server logs incoming requests (timestamp, method, path, status and Content-Type) to help debug API calls.
- Client API helpers (Client/src/api.js) check `Content-Type` and will throw detailed errors if the API returns non-JSON responses.

Git & deployment
- This project is intended to be submitted from a feature/dev branch (for example `dev-malachi`). Make sure your branch is pushed to a public GitHub repo for submission.
- To deploy the client, build the Vite app (`npm run build` in `Client`) and host the `dist/` output on Vercel, Netlify, or GitHub Pages. The backend can be deployed to platforms that support Node (Heroku, Render, Railway). For production, replace lowdb with a proper database and secure environment variables.

What to improve (suggestions)
- Add an About route and navigation if you want multiple pages.
- Add authentication or a real database for a production-ready backend.
- Add unit tests and a CI workflow if you want a stronger submission.

Contact / Author
- Project coded by Malachi Anderson & Evan Bellig (as provided in the challenge template).

License
- This project is provided as-is for the Frontend Mentor challenge.

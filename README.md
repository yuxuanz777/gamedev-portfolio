# Yuxuan Zhang — Game Developer Portfolio

A bilingual, dark-fantasy portfolio for showcasing game development, engine work, and research projects.

## Stack

- Vue 3 and Vue Router 4
- TypeScript
- Vite
- Less
- GitHub Pages-compatible hash routing

## Local development

```bash
npm install
npm run dev
```

The development server prints its local URL in the terminal.

## Quality checks

Run the complete validation suite before publishing:

```bash
npm run check
```

This runs TypeScript checking, ESLint, public-asset validation, and a production build.

Individual commands are also available:

```bash
npm run typecheck
npm run lint
npm run check:assets
npm run build
npm run preview
```

## Content

- Shared English and Chinese interface copy: `src/i18n.ts`
- Game project content: `src/data/GameProjectsData.ts`
- Other project content: `src/data/OtherProjectsData.ts`
- Static images, videos, PDFs, and icons: `public/`
- High-resolution editable artwork sources: `artwork-source/` (not copied into the production build)

The selected language is stored locally in the browser. Project detail state is represented by a URL query parameter so a selected project can be shared or restored.

## Deployment

`npm run build` creates the production site in `dist/`.

The included `deploy.sh` rebuilds the site and force-pushes the generated `dist` content to `yuxuanz777/yuxuanz777.github.io`. Review the Git status and destination carefully before running it.

## Credits

The project began from the open-source `schouffy/gamedev-portfolio` template and has since been substantially redesigned and migrated.

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

## Visual text editor

Start the local point-and-click editor with:

```bash
npm run edit
```

The command opens the local portfolio in the default browser. While editing is active, click ordinary visible English or Chinese text, choose its source location if the same copy appears more than once, and type directly on the page. Links, buttons, filters, language controls, and project cards keep their normal behavior so you can navigate to nested routes and open project details without pausing the editor. Hold Alt (Option on macOS) while clicking an interactive element to edit its label instead.

The editor is available only on the local URL started by `npm run edit`; the published GitHub Pages URL does not include editing controls.

The editor uses two explicit confirmations:

1. **Save locally** writes all pending text changes back to their real files under `src/`. It does not create a Git commit.
2. **Commit and publish** runs `npm run check`, commits only files saved by the editor, pushes the current source branch to `origin`, copies the production build into the sibling `../yuxuanz777.github.io` repository, and pushes that repository's `main` branch.

Publishing is blocked when Git already has unrelated staged files. Commit or unstage them first so the editor cannot accidentally include unrelated work. The editor and its local API are only loaded by `npm run edit`; they are excluded from normal development and production builds.

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

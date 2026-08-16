# Webpack & Angular — remote microfrontend template

Starter template for the [MFE Orchestrator](https://github.com/mfe-orchestrator), listed in the
marketplace as `webpack-remote-angular`. Webpack 5 + Angular 21, wired as a **remote**.

## Requirements

- Node.js 20 or newer
- [pnpm](https://pnpm.io) 10 or newer

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3001
pnpm build      # production build into dist/
```

## Project structure

```
.
├── .github/workflows/build-and-deploy.yml   # build + upload to the orchestrator
├── public/index.html                        # standalone dev page
├── src/
│   ├── app/
│   │   ├── app.component.ts                 # dev only shell
│   │   └── button.component.ts              # the exposed component
│   ├── bootstrap.ts
│   └── index.ts                             # webpack entry, defers to bootstrap
├── package.json
├── tsconfig.json
└── webpack.config.js                        # federation config
```

## What this remote exposes

| module | source |
| --- | --- |
| `./Button` | `src/app/button.component.ts` |

Federation name `remote`, entry file `dist/remoteEntry.js`.

Add more in the `exposes` map of `webpack.config.js`. Anything you expose there becomes importable from a
host as `<remote-name>/<key>`.

A host does not hardcode this remote's URL: it asks the orchestrator for it by slug. See the host
templates for the other side of the wiring.

## Build output

`pnpm build` writes to `dist/`. The federation entry lands at **`dist/remoteEntry.js`**, which is the `entryPoint` the marketplace entry declares.

Check it after any change to `webpack.config.js`: the orchestrator serves exactly that path, so a build that
puts the entry somewhere else is broken.

## Deploying

### Upload to the orchestrator

`.github/workflows/build-and-deploy.yml` builds the app and uploads `dist/` with
[`mfe-orchestrator/github-action`](https://github.com/mfe-orchestrator/github-action). It runs on
any pushed tag, or manually via *Run workflow*.

Configure these once, in the repository settings:

| kind | name | value |
| --- | --- | --- |
| secret | `MICROFRONTEND_ORCHESTRATOR_API_KEY` | your orchestrator API key |
| variable | `MICROFRONTEND_SLUG` | the slug of this remote in the orchestrator |
| variable | `MICROFRONTEND_ORCHESTRATOR_DOMAIN` | your console URL, optional, defaults to `https://console.mfe-orchestrator.dev` |

The API key is a **secret**, never a variable and never a literal in the workflow file. If you
prefer hardcoding the two per project values instead of using repository variables, replace the
expressions in the `env:` block at the top of the workflow.

## Notes

- Angular is compiled ahead of time by `AngularWebpackPlugin` from [`@ngtools/webpack`](https://npmjs.com/package/@ngtools/webpack) — the same compiler the Angular CLI drives, wired into a plain webpack config. There is no `angular.json` and no CLI builder here, which is what keeps `remoteEntry.js` at the root of `dist/`.
- Change detection is zoneless, so `zone.js` is never loaded. Drop `provideZonelessChangeDetection()` from `src/bootstrap.ts` and add `import 'zone.js'` if you want the zone based scheduler back.
- The entry point only does `import('./bootstrap')`. That indirection lets Module Federation negotiate the shared scope before any Angular code runs — keep it.

## License

MIT

# cx-amazon-seller

A [pi](https://pi.dev) package that tells the model who it is talking with: someone who runs a business selling on Amazon.

It is one extension. Before every run it adds one section, named for the package, to pi's own system prompt:

```
<cx-amazon-seller>
The person you talk with runs a business selling on Amazon and comes to you for the work of that business.
</cx-amazon-seller>
```

One sentence, on every request. It names no tool, data source or command: what the model can do for that seller comes from the other packages installed beside this one. The section is added through pi's structured prompt options, so pi's own sections and any other package's stay as they are and nothing is forced. A package for another marketplace sets a section named for itself and replaces nothing.

Why a section and not a skill: a section is in the prompt from the first message, where a skill's body is read only when the model judges it relevant.

## What it needs

Nothing but pi. It reaches no network, reads no file and holds no setting.

## Install

```bash
pi install npm:cx-amazon-seller        # for you, in ~/.pi/agent/settings.json
pi install -l npm:cx-amazon-seller     # for one project, in .pi/settings.json
pi remove npm:cx-amazon-seller
```

On [ComChatX](https://comchatx.com), a seller installs it from the Plugins page.

## Develop

```bash
npm ci
npm run typecheck
npm test               # builds dist/ and loads it with the pinned pi
```

The source is `src/extensions/`; `npm run build` bundles each file there into `dist/extensions/`, the directory the package's `pi` manifest names, leaving pi's own packages for pi to supply. Tests live under `test/`: pi loads every module in an extensions directory, so the build refuses anything there that is not an extension.

## Licence

MIT. See [LICENSE](LICENSE).

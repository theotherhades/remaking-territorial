# Remaking Territorial.io
Feel free to contribute via issues or pull requests. Oh, and you should join our [Discord](https://discord.gg/S9GEnVU8Wz) for updates and stuff.

You can try it out at [https://theotherhades.github.io/remaking-territorial](https://theotherhades.github.io/remaking-territorial)

## Developing
1. Clone the repo: `git clone https://github.com/theotherhades/remaking-territorial.git`
2. Run an HTTP server locally in the cloned directory. I use `py -m http.server 8000` (which requires [Python](https://python.org)) but feel free to use any you prefer.
3. You can now open the code in your browser at `localhost:8000` (or whatever port you ran the server on)

If you want, you can copy/paste this into your terminal:
```
git clone https://github.com/theotherhades/remaking-territorial.git
cd remaking-territorial
py -m http.server 8000
```

## Debug Mode
When developing it's recommended you enable debug mode. Just pass `true` as a second argument to the GameEngine in `src/main.js`, like so:
```js
const engine = new GameEngine("gameCanvas", true);
```
You should get a `Debug mode is enabled` message in your browser console to confirm that it's enabled.

## Sister Repositories
- [TomfoolerousGitHub/remaking-territorial-server](https://github.com/TomfoolerousGitHub/remaking-territorial-server)

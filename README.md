# Remaking Territorial.io
Feel free to contribute via issues or pull requests.

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

> **Note**
> 
> To ~~flood the console~~ enable helpful debugging tools, add `engine.debugMode = true;` to the bottom of `src/main.js`.
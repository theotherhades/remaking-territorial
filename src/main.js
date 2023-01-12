import GameEngine from "./engine.js";

const engine = new GameEngine("gameCanvas");
window.engine = engine;

engine.drawPixel(100, 100);
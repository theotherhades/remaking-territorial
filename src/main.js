import GameEngine from "./engine.js";

const engine = new GameEngine("gameCanvas");
window.engine = engine;

engine.debugMode = true;
engine.registerNation("hi", "orange", true, 100, 100);
engine.registerNation("hmm", "blue", true, 200, 200);
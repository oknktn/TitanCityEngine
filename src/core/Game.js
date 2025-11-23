import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { CameraManager } from './CameraManager.js';
import { InteractionManager } from './InteractionManager.js';
import { UIManager } from './UIManager.js'; // YENİ
import { Grid } from '../world/Grid.js';
import { BuildingManager } from '../world/BuildingManager.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.isRunning = false;
        
        // Varsayılan Alet
        this.activeTool = 'residential'; 

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        console.log("Titan Engine: Sistemler Yükleniyor...");
        
        this.sceneManager = new SceneManager(this);
        this.cameraManager = new CameraManager(this);
        this.grid = new Grid(200);
        
        this.buildingManager = new BuildingManager(this);
        this.interactionManager = new InteractionManager(this);
        
        // UI Manager en son (HTML elementlerine erişeceği için)
        this.uiManager = new UIManager(this);
        
        window.addEventListener('resize', () => this.onResize());
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        const loader = document.getElementById('loading-screen');
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }

        this.renderer.setAnimationLoop(() => this.loop());
        console.log("Titan Engine: Hazır.");
    }

    loop() {
        if (!this.isRunning) return;

        this.cameraManager.update();
        this.buildingManager.update();
        this.renderer.render(this.sceneManager.scene, this.cameraManager.camera);
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.cameraManager.onResize(width, height);
    }
}

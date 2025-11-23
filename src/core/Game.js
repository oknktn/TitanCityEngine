import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { InputManager } from './InputManager.js';
import { CameraManager } from './CameraManager.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.isRunning = false;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // --- SİSTEMLERİN BAŞLATILMASI ---
        console.log("Sistemler yükleniyor...");
        
        // 1. Kamera (Göz)
        this.cameraManager = new CameraManager(this);
        
        // 2. Girdi (Eller)
        this.inputManager = new InputManager(this);
        
        // 3. Sahne (Dünya)
        this.sceneManager = new SceneManager(this);
        
        // Event Listeners
        window.addEventListener('resize', () => this.onResize());
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        // Loading ekranını kaldır
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

        // Güncellemeler
        this.cameraManager.update();
        
        // Render
        this.renderer.render(this.sceneManager.scene, this.cameraManager.camera);
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.cameraManager.onResize(width, height);
    }
}

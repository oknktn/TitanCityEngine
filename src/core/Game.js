import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { CameraManager } from './CameraManager.js';
import { InteractionManager } from './InteractionManager.js';
import { UIManager } from './UIManager.js';
import { Grid } from '../world/Grid.js';
import { BuildingManager } from '../world/BuildingManager.js';
import { TrafficSystem } from '../systems/TrafficSystem.js'; // YENİ

export class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.isRunning = false;
        
        this.activeTool = 'residential'; 
        this.lastTime = 0; // DeltaTime için

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
        
        // SİSTEM KURULUMU (Sıralama Önemli!)
        this.sceneManager = new SceneManager(this);
        this.cameraManager = new CameraManager(this);
        this.grid = new Grid(200);
        this.buildingManager = new BuildingManager(this);
        this.interactionManager = new InteractionManager(this);
        
        // YENİ: TRAFİK SİSTEMİ
        this.trafficSystem = new TrafficSystem(this);
        
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

        this.renderer.setAnimationLoop((time) => this.loop(time)); // Loop'a zaman değişkeni veriyoruz
        console.log("Titan Engine: Hazır.");
    }

    loop(time) {
        if (!this.isRunning) return;

        // Delta Time Hesapla (Animasyon hızını sabit tutmak için kritik)
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.cameraManager.update();
        this.buildingManager.update();
        
        // TRAFİK GÜNCELLEMESİ
        this.trafficSystem.update(dt);
        
        this.renderer.render(this.sceneManager.scene, this.cameraManager.camera);
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.cameraManager.onResize(width, height);
    }
}

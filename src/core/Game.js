import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { CameraManager } from './CameraManager.js';
import { Grid } from '../world/Grid.js'; // Yeni
import { InteractionManager } from './InteractionManager.js'; // Yeni

export class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.isRunning = false;

        // Renderer Ayarları
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // --- SİSTEM KURULUMU ---
        console.log("Titan Engine: Sistemler Başlatılıyor...");
        
        // 1. Temel Yöneticiler
        this.sceneManager = new SceneManager(this);
        this.cameraManager = new CameraManager(this);
        
        // 2. Dünya ve Mantık
        this.grid = new Grid(200); // 200 birimlik harita
        
        // 3. Etkileşim (En son eklenmeli çünkü grid ve sahneye ihtiyaç duyar)
        this.interactionManager = new InteractionManager(this);
        
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
        console.log("Titan Engine: Hazır ve Çalışıyor.");
    }

    loop() {
        if (!this.isRunning) return;

        // Tüm yöneticilerin güncelleme fonksiyonlarını çağır
        this.cameraManager.update();
        
        // Render Al
        this.renderer.render(this.sceneManager.scene, this.cameraManager.camera);
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.cameraManager.onResize(width, height);
    }
}

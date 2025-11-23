import * as THREE from 'three';
// İleride eklenecek modüller için import yerleri
// import { SceneManager } from './SceneManager.js';
// import { InputManager } from './InputManager.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        
        // Motor Durumu
        this.isRunning = false;
        this.isPaused = false;
        
        // Three.js Temel Kurulumu (Daha sonra RenderSystem'e taşınabilir ama çekirdek burada kalsın)
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true, // Kenar yumuşatma
            powerPreference: "high-performance",
            stencil: false,
            depth: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Retina ekran optimizasyonu
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Managers (Yöneticiler) - Şimdilik null, sırayla yazacağız
        this.sceneManager = null;
        this.inputManager = null;
        
        // Event Listeners
        window.addEventListener('resize', () => this.onResize());
        
        console.log("Çekirdek sistemler yüklendi.");
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        
        // Şimdilik test için basit bir sahne kuralım (Boş siyah ekran görme diye)
        this.testSetup();

        // Loading ekranını kaldır
        setTimeout(() => {
            const loader = document.getElementById('loading-screen');
            if(loader) loader.style.opacity = '0';
            setTimeout(() => loader?.remove(), 500);
        }, 1000);

        // Döngüyü başlat
        this.renderer.setAnimationLoop((time) => this.loop(time));
    }

    testSetup() {
        // NOT: Bu fonksiyonu ileride SceneManager yazdığımızda sileceğiz.
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00d2d3, wireframe: true });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    loop(time) {
        // Oyun Döngüsü (Game Loop)
        // 1. Delta Time Hesapla
        // 2. Input Güncelle
        // 3. Oyun Mantığını Güncelle
        // 4. Render Al

        if (!this.isRunning) return;

        // Test Küpünü döndür (Çalıştığını görmek için)
        if (this.cube) {
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
        }

        if (this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onResize() {
        // Pencere boyutu değişirse adaptasyon
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        if (this.camera) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }
}

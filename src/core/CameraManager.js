import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraManager {
    constructor(game) {
        this.game = game;
        
        // Kamera Oluştur
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(50, 50, 50); // Kuş bakışı başlangıç

        // Kontroller
        this.controls = new OrbitControls(this.camera, this.game.renderer.domElement);
        
        // PROFESYONEL AYARLAR (Başyapıt Hissi)
        this.controls.enableDamping = true; // Kameraya "ağırlık" ve "sürtünme" hissi verir
        this.controls.dampingFactor = 0.05; 
        this.controls.screenSpacePanning = false;
        
        // Sınırlar (Oyuncu haritanın altına bakamasın)
        this.controls.minDistance = 20;
        this.controls.maxDistance = 150;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.1; // Yerin altına girmeyi engelle
    }

    update() {
        this.controls.update();
    }

    onResize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
}

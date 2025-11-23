import * as THREE from 'three';

export class SceneManager {
    constructor(game) {
        this.game = game;
        this.scene = new THREE.Scene();
        
        // ATMOSFER
        this.scene.background = new THREE.Color(0x222222); // Koyu gri arka plan (Profesyonel Editor Havası)
        this.scene.fog = new THREE.Fog(0x222222, 50, 200); // Derinlik hissi için sis

        this.setupLights();
        this.setupGrid();
    }

    setupLights() {
        // Ortam Işığı (Gölgelerin zifiri karanlık olmaması için)
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);

        // Güneş Işığı (Gölgeler için)
        const sun = new THREE.DirectionalLight(0xffffff, 1.5);
        sun.position.set(100, 150, 50);
        sun.castShadow = true;
        
        // Gölge Kalite Ayarları
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        sun.shadow.camera.near = 0.5;
        sun.shadow.camera.far = 500;
        const d = 100; // Gölge alan genişliği
        sun.shadow.camera.left = -d; sun.shadow.camera.right = d;
        sun.shadow.camera.top = d; sun.shadow.camera.bottom = -d;
        
        this.scene.add(sun);
    }

    setupGrid() {
        // Sonsuz hissi veren Grid
        const gridHelper = new THREE.GridHelper(200, 50, 0x444444, 0x333333);
        this.scene.add(gridHelper);
        
        // Merkez noktası (Referans için)
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }
}

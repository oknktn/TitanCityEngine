import * as THREE from 'three';

export class SceneManager {
    constructor(game) {
        this.game = game;
        this.scene = new THREE.Scene();
        
        // --- ATMOSFER ---
        // Siyah yerine yumuşak bir gökyüzü mavisi
        this.scene.background = new THREE.Color(0xa8d8ea); 
        // Derinlik hissi için sis (Uzaklar flulaşır)
        this.scene.fog = new THREE.Fog(0xa8d8ea, 30, 150); 

        this.setupLights();
        this.setupEnvironment();
    }

    setupLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambient);

        const sun = new THREE.DirectionalLight(0xffffff, 1.2);
        sun.position.set(50, 100, 50); // Güneş açısı
        sun.castShadow = true;
        
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        sun.shadow.camera.near = 0.5;
        sun.shadow.camera.far = 500;
        const d = 100;
        sun.shadow.camera.left = -d; sun.shadow.camera.right = d;
        sun.shadow.camera.top = d; sun.shadow.camera.bottom = -d;
        
        this.scene.add(sun);
    }

    setupEnvironment() {
        // ZEMİN (ÇİM)
        // Grid'in altına yeşil bir düzlem koyuyoruz
        const groundGeo = new THREE.PlaneGeometry(500, 500);
        const groundMat = new THREE.MeshStandardMaterial({ 
            color: 0x57c276, // Tatlı bir çim yeşili
            roughness: 0.8 
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01; // Grid çizgilerinin çok az altında
        ground.receiveShadow = true;
        this.scene.add(ground);

        // GRID (Rehber Çizgiler)
        // Grid rengini çimin üzerinde görünecek şekilde açıyoruz
        const gridHelper = new THREE.GridHelper(200, 100, 0xffffff, 0xffffff);
        gridHelper.position.y = 0;
        gridHelper.material.opacity = 0.15; // Çok silik beyaz
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }
}

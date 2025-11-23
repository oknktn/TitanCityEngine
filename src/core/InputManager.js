import * as THREE from 'three';

export class InputManager {
    constructor(game) {
        this.game = game;
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        
        // Raycasting için zemin düzlemi (Görünmez sonsuz bir zemin)
        this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        
        this.isPointerDown = false;

        this.initEvents();
    }

    initEvents() {
        // Pointer events hem Mouse hem Dokunmatik ekranı kapsar
        window.addEventListener('pointermove', (e) => this.onPointerMove(e));
        window.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        window.addEventListener('pointerup', () => { this.isPointerDown = false; });
    }

    onPointerMove(e) {
        // Ekran koordinatlarını (-1 ile +1 arasına) normalize et
        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    onPointerDown(e) {
        this.isPointerDown = true;
        // İleride buraya tıklama olaylarını ekleyeceğiz
    }

    // Ekranda nereye baktığımızı (3D Dünyada) döndüren fonksiyon
    getIntersection() {
        this.raycaster.setFromCamera(this.pointer, this.game.cameraManager.camera);
        const target = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(this.plane, target);
        return target; // X, Y, Z koordinatı döner
    }
}

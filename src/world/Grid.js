import * as THREE from 'three';

export class Grid {
    constructor(size = 100) {
        this.size = size; // Harita genişliği
        this.cellSize = 2; // Her karenin boyutu (Three.js birim cinsinden)
        this.cells = new Map(); // Dolu kareleri tutacak veritabanı
    }

    // Dünya koordinatını (x: 10.5, z: 5.2) -> Izgara koordinatına (x: 5, z: 2) çevirir
    worldToGrid(vector3) {
        const x = Math.floor(vector3.x / this.cellSize);
        const z = Math.floor(vector3.z / this.cellSize);
        return { x, z };
    }

    // Izgara koordinatını -> Dünya koordinatına (Merkezlenmiş) çevirir
    gridToWorld(x, z) {
        return new THREE.Vector3(
            (x * this.cellSize) + (this.cellSize / 2),
            0,
            (z * this.cellSize) + (this.cellSize / 2)
        );
    }

    getKey(x, z) {
        return `${x},${z}`;
    }

    // Bir kareye bina ekle
    set(x, z, data) {
        this.cells.set(this.getKey(x, z), data);
    }

    // Kareden veri sil
    remove(x, z) {
        this.cells.delete(this.getKey(x, z));
    }

    // Kare dolu mu?
    get(x, z) {
        return this.cells.get(this.getKey(x, z));
    }
}

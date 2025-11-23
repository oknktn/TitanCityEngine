import * as THREE from 'three';

export class InteractionManager {
    constructor(game) {
        this.game = game;
        
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        
        // Görsel İmleç
        const geometry = new THREE.BoxGeometry(
            this.game.grid.cellSize, 0.5, this.game.grid.cellSize
        );
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00d2d3, transparent: true, opacity: 0.5 
        });
        
        this.cursor = new THREE.Mesh(geometry, material);
        this.cursor.visible = false;
        this.game.sceneManager.scene.add(this.cursor);
        
        // Hoverlanan son koordinat
        this.hoveredGrid = null;

        // Eventler
        window.addEventListener('pointermove', (e) => this.onPointerMove(e));
        window.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    }

    onPointerMove(e) {
        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.updateCursor();
    }

    onPointerDown(e) {
        // Eğer UI üzerinde değilse ve geçerli bir grid üzerindeysek
        if (this.cursor.visible && this.hoveredGrid) {
            // Şimdilik sadece 'residential' (konut) dikiyoruz.
            // İleride UI'dan seçilen tipi dikeceğiz.
            this.game.buildingManager.placeBuilding(
                this.hoveredGrid.x, 
                this.hoveredGrid.z, 
                'residential'
            );
        }
    }

    updateCursor() {
        this.raycaster.setFromCamera(this.pointer, this.game.cameraManager.camera);
        const target = new THREE.Vector3();
        const hit = this.raycaster.ray.intersectPlane(this.plane, target);

        if (hit) {
            this.cursor.visible = true;
            const gridPos = this.game.grid.worldToGrid(hit);
            this.hoveredGrid = gridPos; // Hafızaya al
            
            const snapPos = this.game.grid.gridToWorld(gridPos.x, gridPos.z);
            this.cursor.position.copy(snapPos);
        } else {
            this.cursor.visible = false;
            this.hoveredGrid = null;
        }
    }
}

import * as THREE from 'three';

export class InteractionManager {
    constructor(game) {
        this.game = game;
        
        // Raycasting (Işın yollama) hazırlığı
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Sonsuz zemin
        
        // Görsel İmleç (Cursor Mesh)
        // Yarı saydam, neon mavi bir kutu
        const geometry = new THREE.BoxGeometry(
            this.game.grid.cellSize, 
            0.5, 
            this.game.grid.cellSize
        );
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00d2d3, 
            transparent: true, 
            opacity: 0.5,
            wireframe: false 
        });
        
        this.cursor = new THREE.Mesh(geometry, material);
        this.cursor.visible = false; // Başlangıçta gizli
        this.game.sceneManager.scene.add(this.cursor);

        // Mouse/Touch olaylarını dinle
        window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    }

    onPointerMove(e) {
        // Ekran koordinatlarını hesapla
        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        this.updateCursor();
    }

    updateCursor() {
        // Kameradan mouse'un olduğu yere ışın at
        this.raycaster.setFromCamera(this.pointer, this.game.cameraManager.camera);
        
        const target = new THREE.Vector3();
        // Işın bizim sanal zeminimize çarptı mı?
        const hit = this.raycaster.ray.intersectPlane(this.plane, target);

        if (hit) {
            this.cursor.visible = true;
            
            // Grid sistemine sor: "Bu koordinat hangi kutuya denk geliyor?"
            const gridPos = this.game.grid.worldToGrid(hit);
            
            // O kutunun tam merkezini bul
            const snapPos = this.game.grid.gridToWorld(gridPos.x, gridPos.z);
            
            // İmleci oraya ışınla (Grid Snapping)
            this.cursor.position.copy(snapPos);
        } else {
            this.cursor.visible = false;
        }
    }
}

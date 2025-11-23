import * as THREE from 'three';
import { AssetFactory } from '../systems/AssetFactory.js';

export class BuildingManager {
    constructor(game) {
        this.game = game;
        this.factory = new AssetFactory();
        this.buildings = []; 
    }

    placeBuilding(x, z, type) {
        // Grid kontrolü: Dolu mu?
        if (this.game.grid.get(x, z)) return; 

        const building = this.factory.createBuilding(type);
        
        // Grid'e kaydet (mesh referansıyla birlikte)
        this.game.grid.set(x, z, { type, mesh: building });
        
        const worldPos = this.game.grid.gridToWorld(x, z);
        building.position.copy(worldPos);
        building.position.y = 20; 
        
        building.userData = {
            targetY: 0,
            isLanded: false
        };

        this.game.sceneManager.scene.add(building);
        this.buildings.push(building);
    }

    removeBuilding(x, z) {
        // Grid'den veriyi al
        const cell = this.game.grid.get(x, z);
        if (!cell) return; // Boşsa işlem yapma

        // 1. Sahneden sil (Görsel)
        this.game.sceneManager.scene.remove(cell.mesh);
        
        // 2. Grid'den sil (Mantık)
        this.game.grid.remove(x, z);

        // 3. Array'den temizle (Opsiyonel ama temizlik için iyi)
        this.buildings = this.buildings.filter(b => b !== cell.mesh);
        
        // İleride buraya "Patlama Efekti" ekleyeceğiz
    }

    update() {
        // Animasyonlar
        this.buildings.forEach(b => {
            if (!b.userData.isLanded) {
                b.position.y += (b.userData.targetY - b.position.y) * 0.15;
                if (Math.abs(b.position.y - b.userData.targetY) < 0.05) {
                    b.position.y = b.userData.targetY;
                    b.userData.isLanded = true;
                }
            }
        });
    }
}

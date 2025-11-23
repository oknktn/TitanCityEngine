import * as THREE from 'three';
import { AssetFactory } from '../systems/AssetFactory.js';

export class BuildingManager {
    constructor(game) {
        this.game = game;
        this.factory = new AssetFactory();
        this.buildings = []; // Tüm binaların listesi
    }

    placeBuilding(x, z, type = 'residential') {
        // 1. Grid kontrolü: Dolu mu?
        if (this.game.grid.get(x, z)) return; // Doluysa çık

        // 2. Modeli üret
        const building = this.factory.createBuilding(type);
        
        // 3. Grid'e kaydet
        this.game.grid.set(x, z, { type, mesh: building });
        
        // 4. Sahneye ekle (Animasyonlu başlangıç pozisyonu)
        const worldPos = this.game.grid.gridToWorld(x, z);
        building.position.copy(worldPos);
        building.position.y = 20; // Havadan başlasın
        
        // Hedef Yükseklik ve Hız verisi ekle (Animasyon için)
        building.userData = {
            targetY: 0,
            velocity: 0,
            isLanded: false
        };

        this.game.sceneManager.scene.add(building);
        this.buildings.push(building);
    }

    update() {
        // Düşme Animasyonu (Fizik tabanlı bounce efekti)
        this.buildings.forEach(b => {
            if (!b.userData.isLanded) {
                // Yerçekimi
                b.position.y += (b.userData.targetY - b.position.y) * 0.15;

                // Yere çok yaklaştıysa oturt
                if (Math.abs(b.position.y - b.userData.targetY) < 0.05) {
                    b.position.y = b.userData.targetY;
                    b.userData.isLanded = true;
                    // Burada ileride "Toz efekti" tetikleyeceğiz
                }
            }
        });
    }
}

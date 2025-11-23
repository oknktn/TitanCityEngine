import * as THREE from 'three';

export class TrafficSystem {
    constructor(game) {
        this.game = game;
        this.cars = [];
        this.carGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.8); // Arabanın ana gövdesi
        this.materials = this.getMaterials();
        
        // Simülasyon Ayarları
        this.spawnTimer = 0;
        this.spawnRate = 5; // Her 5 saniyede bir araba yaratmaya çalış
        this.maxCars = 30; // Maksimum araba limiti
    }

    getMaterials() {
        return [
            new THREE.MeshStandardMaterial({ color: 0xeb4d4b }), // Kırmızı
            new THREE.MeshStandardMaterial({ color: 0x1dd1a1 }), // Yeşil
            new THREE.MeshStandardMaterial({ color: 0x48dbfb }), // Mavi
            new THREE.MeshStandardMaterial({ color: 0xfeca57 })  // Sarı
        ];
    }

    update(dt) {
        this.spawnTimer += dt;

        // Araba Üretimi
        if (this.spawnTimer >= this.spawnRate && this.cars.length < this.maxCars) {
            this.trySpawnCar();
            this.spawnTimer = 0;
        }

        // Arabaların Hareketi
        for (let i = this.cars.length - 1; i >= 0; i--) {
            this.moveCar(this.cars[i], dt);
        }
    }

    trySpawnCar() {
        const grid = this.game.grid;
        // Rastgele bir başlangıç noktası bul
        const startX = Math.floor(Math.random() * grid.size) - grid.size / 2;
        const startZ = Math.floor(Math.random() * grid.size) - grid.size / 2;
        
        // Eğer başlangıç noktası yol ise
        if (grid.get(startX, startZ) && grid.get(startX, startZ).type === 'road') {
            const car = this.createCarMesh();
            const startPos = grid.gridToWorld(startX, startZ);
            car.position.copy(startPos);
            car.position.y = 0.5; // Yoldan biraz yüksekte dursun

            car.userData = { 
                currentGridX: startX, 
                currentGridZ: startZ,
                targetPos: startPos, // İlk hedef kendisi
                speed: 6 // Hız (birim/saniye)
            };

            this.cars.push(car);
            this.game.sceneManager.scene.add(car);
        }
    }

    createCarMesh() {
        // Rastgele bir renk seç
        const mat = this.materials[Math.floor(Math.random() * this.materials.length)];
        const car = new THREE.Mesh(this.carGeometry, mat);
        car.castShadow = true;
        car.receiveShadow = false;
        return car;
    }

    moveCar(car, dt) {
        const grid = this.game.grid;
        const target = car.userData.targetPos;
        const currentPos = car.position;

        // 1. Hedefe İlerleme (Lerp ile yumuşak hareket)
        const moveDistance = car.userData.speed * dt;
        currentPos.lerp(target, moveDistance / currentPos.distanceTo(target));

        // 2. Hedefe Ulaşma Kontrolü
        if (currentPos.distanceTo(target) < 0.1) {
            
            // Yeni hedefi bul
            const newTarget = this.findNextRoadTile(car.userData.currentGridX, car.userData.currentGridZ);
            
            if (newTarget) {
                // Yeni hedefi ayarla
                car.userData.currentGridX = newTarget.x;
                car.userData.currentGridZ = newTarget.z;
                car.userData.targetPos = grid.gridToWorld(newTarget.x, newTarget.z);
                car.userData.targetPos.y = 0.5; // Yükseklik

                // Arabayı hedefe doğru döndür (Smooth Rotation)
                car.lookAt(car.userData.targetPos);

            } else {
                // Yolun Sonu: Arabayı Sil
                this.game.sceneManager.scene.remove(car);
                this.cars = this.cars.filter(c => c !== car);
            }
        }
    }

    // --- YOL YAPAY ZEKASI (RANDOM WALK) ---
    findNextRoadTile(x, z) {
        const grid = this.game.grid;
        const directions = [
            { dx: 1, dz: 0 }, { dx: -1, dz: 0 }, 
            { dx: 0, dz: 1 }, { dx: 0, dz: -1 }
        ];

        // Mümkün olan yol noktalarını topla
        let possiblePaths = [];
        for (const dir of directions) {
            const nx = x + dir.dx;
            const nz = z + dir.dz;
            
            // Yol mu? Ve halihazırda üstünde durduğumuz yer değilse
            if (grid.get(nx, nz) && grid.get(nx, nz).type === 'road') {
                possiblePaths.push({ x: nx, z: nz });
            }
        }

        if (possiblePaths.length === 0) return null;

        // Rastgele bir yol seç
        return possiblePaths[Math.floor(Math.random() * possiblePaths.length)];
    }
}

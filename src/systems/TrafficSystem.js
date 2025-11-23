import * as THREE from 'three';

export class TrafficSystem {
    constructor(game) {
        this.game = game;
        this.cars = [];
        this.carGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.8);
        this.materials = this.getMaterials();
        
        this.spawnTimer = 0;
        this.spawnRate = 3; // Daha hızlı deneriz
        this.maxCars = 30; 
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

        if (this.spawnTimer >= this.spawnRate && this.cars.length < this.maxCars) {
            this.trySpawnCar();
            this.spawnTimer = 0;
        }

        for (let i = this.cars.length - 1; i >= 0; i--) {
            this.moveCar(this.cars[i], dt);
        }
    }

    // --- HATA DÜZELTİLMİŞ ÜRETİM MANTIĞI ---
    trySpawnCar() {
        const grid = this.game.grid;
        
        // Bütün yolları tarayarak rastgele bir başlangıç yolu bul
        const roadKeys = [];
        grid.cells.forEach((data, key) => {
            if (data.type === 'road') {
                roadKeys.push(key);
            }
        });

        if (roadKeys.length === 0) return; // Yol yoksa araba üretme

        // Rastgele bir yol seç
        const randomKey = roadKeys[Math.floor(Math.random() * roadKeys.length)];
        // Key'i (örneğin "5,10") koordinata (5, 10) çevir
        const [x, z] = randomKey.split(',').map(Number); 
        
        
        const car = this.createCarMesh();
        const startPos = grid.gridToWorld(x, z);
        
        car.userData = { 
            currentGridX: x, 
            currentGridZ: z,
            targetPos: startPos, 
            speed: 6
        };
        
        car.position.copy(startPos);
        car.position.y = 0.5;

        this.cars.push(car);
        this.game.sceneManager.scene.add(car);
    }

    createCarMesh() {
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

        // 1. Hedefe İlerleme (Lerp)
        const moveDistance = car.userData.speed * dt;
        currentPos.lerp(target, moveDistance / currentPos.distanceTo(target));
        
        // 2. Hedefe Ulaşma Kontrolü
        if (currentPos.distanceTo(target) < 0.1) {
            
            const newTarget = this.findNextRoadTile(car.userData.currentGridX, car.userData.currentGridZ);
            
            if (newTarget) {
                // Yeni hedefi ayarla
                car.userData.currentGridX = newTarget.x;
                car.userData.currentGridZ = newTarget.z;
                car.userData.targetPos = grid.gridToWorld(newTarget.x, newTarget.z);
                car.userData.targetPos.y = 0.5; 

                // Arabayı döndür (LookAt)
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

        let possiblePaths = [];
        for (const dir of directions) {
            const nx = x + dir.dx;
            const nz = z + dir.dz;
            
            // Eğer yol ise VE boş değilse (Yani binanın üstünde yol yoksa)
            if (grid.get(nx, nz) && grid.get(nx, nz).type === 'road') {
                possiblePaths.push({ x: nx, z: nz });
            }
        }

        if (possiblePaths.length === 0) return null;

        // Rastgele bir yol seç
        return possiblePaths[Math.floor(Math.random() * possiblePaths.length)];
    }
}

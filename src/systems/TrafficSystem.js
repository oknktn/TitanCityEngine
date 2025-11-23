import * as THREE from 'three';

export class TrafficSystem {
    constructor(game) {
        this.game = game;
        this.cars = [];
        this.carGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.8);
        this.materials = this.getMaterials();
        
        this.spawnTimer = 0;
        this.spawnRate = 3; 
        this.maxCars = 30; 
    }

    getMaterials() {
        return [
            new THREE.MeshStandardMaterial({ color: 0xeb4d4b }),
            new THREE.MeshStandardMaterial({ color: 0x1dd1a1 }), 
            new THREE.MeshStandardMaterial({ color: 0x48dbfb }),
            new THREE.MeshStandardMaterial({ color: 0xfeca57 })
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

    trySpawnCar() {
        const grid = this.game.grid;
        
        const roadKeys = [];
        grid.cells.forEach((data, key) => {
            if (data.type === 'road') {
                roadKeys.push(key);
            }
        });

        if (roadKeys.length === 0) return;

        const randomKey = roadKeys[Math.floor(Math.random() * roadKeys.length)];
        const [x, z] = randomKey.split(',').map(Number); 
        
        // 1. Arabayı Oluştur
        const car = this.createCarMesh();
        const startPos = grid.gridToWorld(x, z);
        
        // 2. İlk Hedefi Seç (Arabayı hemen hareket ettirmek için)
        // Kendi pozisyonunu önceki pozisyon olarak veriyoruz ki geri dönmesin
        const initialTarget = this.findNextRoadTile(x, z, x, z); 
        
        if (!initialTarget) {
            this.game.sceneManager.scene.remove(car);
            return;
        }

        const nextPos = grid.gridToWorld(initialTarget.x, initialTarget.z);
        nextPos.y = 0.5;

        // USER DATA: Arabaya hafıza ekliyoruz
        car.userData = { 
            currentGridX: initialTarget.x, // Şu anki hedefi başlangıç yap
            currentGridZ: initialTarget.z,
            previousGridX: x, // Bir önceki konumu kaydet
            previousGridZ: z, 
            targetPos: nextPos, 
            speed: 6
        };
        
        car.position.copy(startPos);
        car.position.y = 0.5;

        // Arabayı ilk hedefe doğru döndür
        car.lookAt(nextPos);

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

        // Lerp ile yumuşak hareket
        const moveDistance = car.userData.speed * dt;
        currentPos.lerp(target, moveDistance / currentPos.distanceTo(target));
        
        // Hedefe Ulaşma Kontrolü
        if (currentPos.distanceTo(target) < 0.1) {
            
            const px = car.userData.currentGridX;
            const pz = car.userData.currentGridZ;

            // Önceki konumu ve şu anki konumu gönder
            const newTarget = this.findNextRoadTile(px, pz, car.userData.previousGridX, car.userData.previousGridZ);
            
            if (newTarget) {
                // Pozisyonları güncelle
                car.userData.previousGridX = px; 
                car.userData.previousGridZ = pz;
                car.userData.currentGridX = newTarget.x;
                car.userData.currentGridZ = newTarget.z;

                // Yeni hedef pozisyonunu hesapla
                car.userData.targetPos = grid.gridToWorld(newTarget.x, newTarget.z);
                car.userData.targetPos.y = 0.5; 

                // Arabayı yeni hedefe doğru döndür
                car.lookAt(car.userData.targetPos);

            } else {
                // Çıkmaz sokak: Arabayı Sil
                this.game.sceneManager.scene.remove(car);
                this.cars = this.cars.filter(c => c !== car);
            }
        }
    }

    // --- YOL YAPAY ZEKASI (RANDOM WALK) ---
    findNextRoadTile(x, z, prevX, prevZ) {
        const grid = this.game.grid;
        const directions = [
            { dx: 1, dz: 0 }, { dx: -1, dz: 0 }, 
            { dx: 0, dz: 1 }, { dx: 0, dz: -1 }
        ];

        let possiblePaths = [];
        for (const dir of directions) {
            const nx = x + dir.dx;
            const nz = z + dir.dz;
            
            const isRoad = grid.get(nx, nz) && grid.get(nx, nz).type === 'road';
            const isPrevious = (nx === prevX && nz === prevZ); // Geri dönmeyi engelle

            if (isRoad && !isPrevious) {
                possiblePaths.push({ x: nx, z: nz });
            }
        }

        if (possiblePaths.length === 0) {
            // Eğer hiçbir yere gidemiyorsa, çıkmaz sokaktadır. Geri döndür.
            if (grid.get(prevX, prevZ)) {
                 return { x: prevX, z: prevZ }; // Geldiği yere dön
            } else {
                 return null; // Yokuşun dibi (Haritadan silinir)
            }
        }

        // Rastgele bir yol seç
        return possiblePaths[Math.floor(Math.random() * possiblePaths.length)];
    }
}

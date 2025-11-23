import * as THREE from 'three';

export class AssetFactory {
    constructor() {
        // Profesyonel Renk Paleti (Flat UI Colors)
        this.colors = {
            resWall: 0xff6b6b, resRoof: 0xee5253,
            comGlass: 0x48dbfb, comFrame: 0x22a6b3,
            indWall: 0x576574, indDark: 0x222f3e,
            door: 0x2d3436
        };
        
        // Materyal Önbelleği (Performans için)
        this.materials = {
            resMat: new THREE.MeshStandardMaterial({ color: this.colors.resWall, roughness: 0.8 }),
            roofMat: new THREE.MeshStandardMaterial({ color: this.colors.resRoof, roughness: 0.9 }),
            glassMat: new THREE.MeshStandardMaterial({ color: this.colors.comGlass, metalness: 0.8, roughness: 0.1, transparent: true, opacity: 0.9 }),
            indMat: new THREE.MeshStandardMaterial({ color: this.colors.indWall, roughness: 0.7 })
        };
    }

    createBuilding(type) {
        const group = new THREE.Group();
        
        if (type === 'residential') {
            this._buildHouse(group);
        } else if (type === 'commercial') {
            this._buildOffice(group);
        } else if (type === 'industrial') {
            this._buildFactory(group);
        }

        // Gölgelendirme Ayarları
        group.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        return group;
    }

    _buildHouse(group) {
        // Ana Gövde
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 1.2), this.materials.resMat);
        body.position.y = 0.5;
        group.add(body);

        // Çatı (Piramit)
        const roof = new THREE.Mesh(new THREE.ConeGeometry(1, 0.8, 4), this.materials.roofMat);
        roof.position.y = 1.4;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        // Kapı Detayı
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.1), new THREE.MeshStandardMaterial({color: this.colors.door}));
        door.position.set(0, 0.25, 0.6);
        group.add(door);
    }

    _buildOffice(group) {
        // Gökdelen Gövdesi
        const height = 2 + Math.random();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, height, 1.4), this.materials.glassMat);
        body.position.y = height / 2;
        group.add(body);

        // Çelik İskelet (Detay)
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1.5), new THREE.MeshStandardMaterial({color: this.colors.comFrame}));
        frame.position.y = 0.1;
        group.add(frame);
    }

    _buildFactory(group) {
        // Ana Fabrika
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.2), this.materials.indMat);
        body.position.y = 0.4;
        group.add(body);

        // Bacalar
        const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), new THREE.MeshStandardMaterial({color: this.colors.indDark}));
        s1.position.set(0.4, 0.75, 0);
        group.add(s1);
    }
}

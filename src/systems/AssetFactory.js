import * as THREE from 'three';

export class AssetFactory {
    constructor() {
        // Renk Paleti
        this.colors = {
            resWall: 0xff6b6b, resRoof: 0xee5253,
            comGlass: 0x48dbfb, comFrame: 0x22a6b3,
            indWall: 0x576574, indDark: 0x222f3e,
            door: 0x2d3436,
            road: 0x2d3436, roadLine: 0xf5f6fa, curb: 0x95a5a6,
            treeTrunk: 0x8d6e63, treeLeaves: 0x2ecc71 // Yeni ağaç renkleri
        };
        
        this.materials = {
            resMat: new THREE.MeshStandardMaterial({ color: this.colors.resWall, roughness: 0.8 }),
            roofMat: new THREE.MeshStandardMaterial({ color: this.colors.resRoof, roughness: 0.9 }),
            glassMat: new THREE.MeshStandardMaterial({ color: this.colors.comGlass, metalness: 0.8, roughness: 0.1, transparent: true, opacity: 0.9 }),
            indMat: new THREE.MeshStandardMaterial({ color: this.colors.indWall, roughness: 0.7 }),
            roadMat: new THREE.MeshStandardMaterial({ color: this.colors.road, roughness: 1.0 }),
            lineMat: new THREE.MeshBasicMaterial({ color: this.colors.roadLine }),
            curbMat: new THREE.MeshStandardMaterial({ color: this.colors.curb }),
            // Ağaç Materyalleri
            trunkMat: new THREE.MeshStandardMaterial({ color: this.colors.treeTrunk }),
            leavesMat: new THREE.MeshStandardMaterial({ color: this.colors.treeLeaves })
        };
    }

    createBuilding(type) {
        const group = new THREE.Group();
        
        if (type === 'residential') this._buildHouse(group);
        else if (type === 'commercial') this._buildOffice(group);
        else if (type === 'industrial') this._buildFactory(group);
        else if (type === 'road') this._buildRoad(group);
        else if (type === 'tree') this._buildTree(group); // Yeni

        group.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        return group;
    }

    _buildTree(group) {
        // Rastgelelik: Ağaçlar birbirinin aynısı olmasın
        const scale = 0.8 + Math.random() * 0.4;
        
        // Gövde
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * scale, 0.25 * scale, 0.8 * scale), this.materials.trunkMat);
        trunk.position.y = 0.4 * scale;
        group.add(trunk);

        // Yapraklar (Dodecahedron - Geometrik top)
        const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6 * scale), this.materials.leavesMat);
        leaves.position.y = 1.2 * scale;
        group.add(leaves);
        
        // Zemin detayı (Kök çevresi toprağı)
        const soil = new THREE.Mesh(new THREE.CircleGeometry(0.6, 8), new THREE.MeshStandardMaterial({color: 0x5d4037}));
        soil.rotation.x = -Math.PI/2;
        soil.position.y = 0.02;
        group.add(soil);
    }

    _buildRoad(group) {
        const road = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 2), this.materials.roadMat);
        road.position.y = 0.05; 
        group.add(road);

        const line = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.8), this.materials.lineMat);
        line.position.y = 0.06;
        group.add(line);

        const curbGeo = new THREE.BoxGeometry(2, 0.15, 0.2);
        const curb1 = new THREE.Mesh(curbGeo, this.materials.curbMat);
        curb1.position.set(0, 0.075, 0.9);
        group.add(curb1);
        const curb2 = new THREE.Mesh(curbGeo, this.materials.curbMat);
        curb2.position.set(0, 0.075, -0.9);
        group.add(curb2);
    }

    _buildHouse(group) {
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 1.2), this.materials.resMat);
        body.position.y = 0.5;
        group.add(body);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(1, 0.8, 4), this.materials.roofMat);
        roof.position.y = 1.4;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.1), new THREE.MeshStandardMaterial({color: this.colors.door}));
        door.position.set(0, 0.25, 0.6);
        group.add(door);
    }

    _buildOffice(group) {
        const height = 2 + Math.random();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, height, 1.4), this.materials.glassMat);
        body.position.y = height / 2;
        group.add(body);
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1.5), new THREE.MeshStandardMaterial({color: this.colors.comFrame}));
        frame.position.y = 0.1;
        group.add(frame);
    }

    _buildFactory(group) {
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.2), this.materials.indMat);
        body.position.y = 0.4;
        group.add(body);
        const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), new THREE.MeshStandardMaterial({color: this.colors.indDark}));
        s1.position.set(0.4, 0.75, 0);
        group.add(s1);
    }
}

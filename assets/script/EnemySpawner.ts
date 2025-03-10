import { _decorator, Component, Node, Prefab, instantiate, Vec3, math, ParticleSystem } from 'cc';
import { Enemy } from './Enemy'; 
const { ccclass, property } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
    @property(Prefab)
    enemyPrefab: Prefab = null;

    @property(Node)
    player: Node = null;

    @property
    spawnRadius: number = 0.5;

    @property
    spawnInterval: number = 0.0001; 

    start() {
       
    }

    startSpawing() {
        this.schedule(this.spawnEnemy, this.spawnInterval);
    }

    spawnEnemy() {
        if (!this.enemyPrefab || !this.player) return;

        const angle = math.random() * 2 * Math.PI;
        const spawnX = this.player.position.x + Math.cos(angle) * this.spawnRadius;
        const spawnZ = this.player.position.z + Math.sin(angle) * this.spawnRadius;
        const spawnPos = new Vec3(spawnX, 0, spawnZ);

        const enemy = instantiate(this.enemyPrefab);
        enemy.setPosition(spawnPos);
        this.node.addChild(enemy);

        const enemyScript = enemy.getComponent(Enemy);
        if (enemyScript) {
            enemyScript.setTarget(this.player);
        } else {
           //bla bla bla
        }
    }
}
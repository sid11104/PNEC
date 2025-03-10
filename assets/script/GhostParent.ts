import { _decorator, Component, Node, Vec3, Quat, tween, BoxCollider, ITriggerEvent, Label } from 'cc';
import { Constant } from './utilities/constant';
import { PlayerController } from './PlayerController';
import { Enemy } from './Enemy';
import { PREVIEW } from 'cc/env';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('GhostParent')
export class GhostParent extends Component {

    @property({ type: Node })
    player: Node | null = null; 

    @property({ type: [Node] })
    ghosts: Node[] = []; 

    @property
    rotationSpeed: number = 1; 

    @property(Label)
    counter : Label;

    @property(Node)
    gameManager : Node;
  
    @property
    radius: number = 1; 

    reverseKill : number = 30;

    private angle: number = 0; 

    start() {
        this.activateGhost(0);

        this.startOrbitalMotion();

        this.ghosts.forEach((ghost, index) => {
            const collider = ghost.getComponent(BoxCollider);
            if (collider) {
                collider.on('onTriggerEnter', this.onTriggerEnter, this);
            } else {
                console.log("ghost ERORR HAHA HAHA");
            }
        });
    }

    onTriggerEnter(event: ITriggerEvent) {
        const enemy = event.otherCollider.node;
        if(enemy.name == "EnemyAnim") {
            enemy.getComponent(Enemy).playdeadPfx();
            this.reverseKill--;
            this.counter.string = this.reverseKill + "";
            Constant.killCount++; 
            enemy.destroy(); 
            this.updateProgress(); 
        }
    }

    update(deltaTime: number) {
        if (!this.player) {
            return;
        }

        const offsetX = Math.cos(this.angle * Math.PI / 180) * this.radius;
        const offsetZ = Math.sin(this.angle * Math.PI / 180) * this.radius;

        const playerWorldPos = this.player.worldPosition;

        this.node.setWorldPosition(new Vec3(
            playerWorldPos.x + offsetX,
            playerWorldPos.y,
            playerWorldPos.z + offsetZ
        ));

        const ghostRotation = Quat.fromEuler(new Quat(), 0, -this.angle, 0);
        this.node.setRotation(ghostRotation);
    }

    startOrbitalMotion() {
        tween(this)
            .repeatForever(
                tween()
                    .to(2, { angle: 360 }, { easing: 'linear' }) 
                    .call(() => {
                        this.angle = 0;
                    })
            )
            .start();
    }

    updateProgress() {
        console.log(Constant.killCount)
        if (Constant.killCount === 10) {
            this.player.getComponent(PlayerController).playLevelUpAnimation();
            this.activateGhost(1); 
        } else if (Constant.killCount === 20) {
            this.player.getComponent(PlayerController).playLevelUpAnimation2();
            this.activateGhost(2); 
        } else if (Constant.killCount === 30) {
            this.gameManager.getComponent(GameManager).gameEnded();
        }
    }

    activateGhost(index: number) {
        if (index < this.ghosts.length) {
            this.ghosts[index].active = true;
        } else {
            console.log(`Invalid ghost index: ${index}`);
        }
    }
}



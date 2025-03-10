import { _decorator, Component, Node, Label,instantiate ,tween,Vec3} from 'cc';
import { EnemySpawner } from './EnemySpawner';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: Label })
    questCounter: Label | null = null; 

    @property({ type: Node })
    secondGhost: Node | null = null; 

    @property({ type: Node })
    ThirdGhost: Node | null = null; 

    @property({ type: Node })
    playNowButton: Node | null = null; 

    @property(Node)
    enemy : Node;

    @property(Node)
    endcard : Node;

    @property(Node)
    ftue : Node;

    @property(Node)
    joystick : Node;

    @property(Node)
    cta : Node;

    @property(Node)
    counter : Node;

    @property(Node)
    questText : Node;

    @property(Node)
    bar :Node;


    @property(Node)
    mainCamera : Node;

    @property(Node)
    cinematiccamera  :Node;

    private enemiesDestroyed: number = 0;
    private totalEnemies: number = 30;

    start() {
    }

    enemyDestroyed() {
        this.enemiesDestroyed++;
        this.updateQuestCounter();
        if (this.enemiesDestroyed === 20 || this.enemiesDestroyed === 10) {
            this.spawnGhost();
        }
        if (this.enemiesDestroyed >= this.totalEnemies) {
            this.playNowButton.active = true;
        }
    }

    startGame() {
        this.cinematiccamera.active =false;
        this.mainCamera.active = true;
        this.joystick.active = true
        this.ftue.active = false;
        this.enemy.getComponent(EnemySpawner).startSpawing();
    }

    gameEnded() {
        this.joystick.active = false
        this.cta.active = false;
        this.questText.active = false;
        this.counter.active = false;
        this.bar.active =false;
        this.endcard.active = true;
        this.endcard.setScale(0,0,0)
        this.endcard.active = true;
        tween(this.endcard).to(1, {scale: new Vec3(1,1,1)},{ easing: 'linear' }).start();
    }


    updateQuestCounter() {
        if (this.questCounter) {
            this.questCounter.string = `Kill ${this.totalEnemies - this.enemiesDestroyed} enemies`;
        }
    }

    spawnGhost() {
        // const ghost = instantiate(this.ghostPrefab);
        // this.node.parent.addChild(ghost);
    }
}



import { _decorator, Component, Node, Vec3,CylinderCollider,BoxCollider, ProgressBar,SkeletalAnimationComponent, ITriggerEvent,Enum, AnimationState, Prefab, instantiate, find, tween, ICollisionEvent, ParticleSystem } from 'cc';
import { clientEvent } from "./utilities/clientEvent";
import { Constant } from './utilities/constant';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {


    @property(Node)
    upgradePfx : Node;

    @property(Node)
    upgradePfx2 : Node;


    @property(ProgressBar) 
    healthBar: ProgressBar = null; 

    private _speed: number = 0.1;
    private _isMoving: boolean = false;
    private _originPos: Vec3 = new Vec3();

    private _health: number = 1; 

    levelUpPfx : ParticleSystem;
    levelUpPfx2 : ParticleSystem;


    onLoad() {
        this.upgradePfx.active = false;
        this.levelUpPfx = this.upgradePfx.getComponent(ParticleSystem);
        this.levelUpPfx2 = this.upgradePfx2.getComponent(ParticleSystem)
        clientEvent.on(Constant.EVENT_TYPE.StartMoving, this._startMoving, this);
        clientEvent.on(Constant.EVENT_TYPE.MoveEnd, this._moveEnd, this);
        clientEvent.dispatchEvent(Constant.EVENT_TYPE.CarmeraRole, this.node);
        this._originPos = this.node.getPosition();

           if (this.node) {
            const collider = this.node.getComponent(CylinderCollider);
            if (collider) {
                collider.on('onTriggerEnter', this.onTriggerEnter, this);

            } else {
               
            }
        }
    }

    takeDamage(amount: number) {
        this._health -= amount;
        this._health = Math.max(0, this._health); 

        console.log("this._health",this._health)
        if (this.healthBar) {
            this.healthBar.progress = this._health; 
        }

        if (this._health <= 0) {
        }
    }

    playLevelUpAnimation() {
        this.upgradePfx.active = true;
        this.levelUpPfx.play();
    }

    playLevelUpAnimation2() {
        this.upgradePfx2.active = true;
        this.levelUpPfx2.play();
    }


    _onCollisionEnter(event : ITriggerEvent) {
        const enemy = event.otherCollider.node;
        enemy.destroy();
    }

    _onCollisionStay(event : ICollisionEvent) {

    }

    _onCollisionExit(event : ICollisionEvent){

    }

    onTriggerEnter(event: ITriggerEvent) {
        console.log("calculate player d")
        const enemy = event.otherCollider.node;
        enemy.destroy();
        this.screenShake(); 
        this.takeDamage(0.01)
    }

    screenShake(){
            const camera = this.node.scene.getChildByName("Main Camera");
            if (!camera) return;
    
            let shakeAmount = 1;
            let duration = 0.2;
    
            tween(camera)
                .by(duration / 4, { position: new Vec3(shakeAmount, 0, 0) })
                .by(duration / 4, { position: new Vec3(-shakeAmount * 2, 0, 0) })
                .by(duration / 4, { position: new Vec3(shakeAmount * 2, 0, 0) })
                .by(duration / 4, { position: new Vec3(-shakeAmount, 0, 0) })
                .start();
    }

    onDestroy() {
        clientEvent.off(Constant.EVENT_TYPE.StartMoving, this._startMoving, this);
        clientEvent.off(Constant.EVENT_TYPE.MoveEnd, this._moveEnd, this);
    }

  
    private _startMoving(angle: number, radius: number) {
        if (!this._isMoving) {
            this._isMoving = true;
        }
        let eularangle = this.node.eulerAngles;
        eularangle.set(eularangle.x, angle, eularangle.z);
        this.node.eulerAngles = eularangle;

        let zz = Math.cos(radius) * this._speed;
        let xx = Math.sin(radius) * this._speed;
        this._originPos.add(new Vec3(xx, 0, zz));
        this.node.setPosition(this._originPos);
    }

    public getMoveState() {
        return this._isMoving;
    }

    private _moveEnd() {
        this._isMoving = false;
    }

}



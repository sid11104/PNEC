import { _decorator, Component, Node, Vec3, CameraComponent } from 'cc';
import { clientEvent } from "./utilities/clientEvent";
import { Constant } from './utilities/constant';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    public static mainCamera: CameraComponent | null = null;

    @property({ type: Node })
    private player: Node = null as unknown as Node; 

    @property
    private followDistance: number = -5; 

    @property
    private followHeight: number = 5; 

    private _oriCameraWorPos: Vec3 = new Vec3();
    private _oriCameraEuler: Vec3 = new Vec3();
    private _tempPos: Vec3 = new Vec3();
    private _isRotating: boolean = false;
    private _speed: number = 2; 

    onLoad() {
        clientEvent.on(Constant.EVENT_TYPE.MoveEnd, this._moveEnd, this);
        clientEvent.on(Constant.EVENT_TYPE.StartMoving, this._startMoving, this);

        this._oriCameraWorPos = this.node.getPosition().clone();
        this._oriCameraEuler = this.node.eulerAngles.clone();

        CameraController.mainCamera = this.node.getComponent(CameraComponent);

        if (!this.player) {
            console.log("not found");
        }
    }

    onDestroy() {
        clientEvent.off(Constant.EVENT_TYPE.MoveEnd, this._moveEnd, this);
        clientEvent.off(Constant.EVENT_TYPE.StartMoving, this._startMoving, this);
    }

    update(deltaTime: number) {
        if (!this.player) return;

        this.followPlayer(deltaTime);
    }

    private followPlayer(deltaTime: number) {
        const playerPos = this.player.getPosition();

        const desiredPosition = new Vec3(
            playerPos.x, 
            playerPos.y + this.followHeight, 
            playerPos.z - this.followDistance 
        );

        Vec3.lerp(this._tempPos, this.node.getPosition(), desiredPosition, this._speed * deltaTime);
        this.node.setPosition(this._tempPos);
    }

    private _startMoving(angle: number, radius: number) {
    }

    private _moveEnd() {
        this._isRotating = false;
    }
}
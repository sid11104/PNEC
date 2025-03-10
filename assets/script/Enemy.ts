import { _decorator, Component, Node, Vec3, Quat,BoxCollider,ICollisionEvent, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    @property
    speed: number;

    private target: Node = null;
    private direction: Vec3 = new Vec3();
    private tempQuat: Quat = new Quat();


    @property(Node)
    particleNode : Node;

    @property(Node)
    deadPFxnode : Node;

    deadPfx : ParticleSystem;


    protected onLoad(): void {
        this.deadPfx = this.deadPFxnode.getComponent(ParticleSystem);
        this.particleNode.getComponent(ParticleSystem).play();
    }

    setTarget(player: Node) {
        this.target = player;
    }

    playdeadPfx(){
        this.deadPFxnode.active = true;
        this.deadPfx.play();
    }

    update(dt: number) {
        if(this.node != null) {
        if (!this.target) return;

        Vec3.subtract(this.direction, this.target.worldPosition, this.node.worldPosition);
        this.direction.normalize();
        const moveVec = this.direction.clone().multiplyScalar(this.speed * dt);
        this.node.setWorldPosition(this.node.worldPosition.add(moveVec));

        Quat.fromViewUp(this.tempQuat, this.direction);
        this.node.setRotation(this.tempQuat);
        }
    }
}

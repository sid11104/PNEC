export class Constant {
    public static EVENT_TYPE = {
        StartMoving: "START_MOVING",
        MoveEnd: "MOVE_END",
        CarmeraRotate: "CAMERA_ROTATE",
        CarmeraRole: "CAMERA_ROLE",
        AngleOffset: "ANGLE_OFFSET",
        TouchStarted: "TOUCH_STARTED",
        TouchEnded: "TOUCH_ENDED",
    }


    public static killCount = 0;

    public static ismoving = false;
    public static isColliding = false;
}
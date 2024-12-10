const { ccclass, property } = cc._decorator;
import { StickState, HeroState } from "./enums";

@ccclass
export default class NewClass extends cc.Component {
    @property
    StickCurrentState: StickState = StickState.Wait;

    isStickScaling: boolean = false;
    contactName: any = null; // Название объекта которого коснулась палка
    isScalingCompleted: boolean = false;
    previousStickAngle = 0; // Угол палки в прошлом кадре. Нужен для того чтобы определить пересекла ли палка границу угла
    isStickStoped = false;
    once = false;

    onLoad() {
        const stick = this.node;
        const gameArea = stick.parent.parent;
        this.previousStickAngle = stick.angle;
        // По нажатию кнопки палка начинает увеличиваться
        // Работает только один раз для одной палки
        gameArea.once(cc.Node.EventType.MOUSE_DOWN, (event: cc.Event.EventMouse) => {
            if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
                this.isStickScaling = true;
            }
        }, this);
        // По отжатию кнопки палка прекращает рост
        // Работает только один раз для одной палки
        gameArea.once(cc.Node.EventType.MOUSE_UP, (event: cc.Event.EventMouse) => {
            if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
                this.isStickScaling = false;
                this.isScalingCompleted = true;
                this.getComponent(cc.RevoluteJoint).enableMotor = true; // включение мотора,который заставит палку падать
            }
        }, this);

        //   -//- только для касаний
        gameArea.once(cc.Node.EventType.TOUCH_START, () => {
            this.isStickScaling = true;
            
        }, this);
        gameArea.once(cc.Node.EventType.TOUCH_END, () => {

            this.isStickScaling = false;
            this.isScalingCompleted = true;
            this.getComponent(cc.RevoluteJoint).enableMotor = true;
           
        }, this);
    }

    onDestroy(){

        const stick = this.node;
        const gameArea = stick.parent.parent;

        gameArea.off(cc.Node.EventType.MOUSE_DOWN, (event: cc.Event.EventMouse) => {
            if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
                this.isStickScaling = true;
            }
        }, this);
       
        gameArea.off(cc.Node.EventType.MOUSE_UP, (event: cc.Event.EventMouse) => {
            if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
                this.isStickScaling = false;
                this.isScalingCompleted = true;
                this.getComponent(cc.RevoluteJoint).enableMotor = true;
            }
        }, this);

        gameArea.off(cc.Node.EventType.TOUCH_START, () => {
            this.isStickScaling = true;
            console.log('First time down');
        }, this);
        gameArea.off(cc.Node.EventType.TOUCH_END, () => {

            this.isStickScaling = false;
            this.isScalingCompleted = true;
            this.getComponent(cc.RevoluteJoint).enableMotor = true;
            console.log('First time up');
        }, this);

    }
    
    // Функция вызывается, как только палка касается с чем-нибудь
    onBeginContact(contact, selfCollider, otherCollider) {
        this.contactName = otherCollider.name;
    }

    // Функция для проверки, коснулась ли палка центра платформы
    isStickTouchingCenterOfPlatform(stick: cc.Node, platform: cc.Node,platform0: cc.Node): boolean {
        // Вычисляем координаты конца палки 
        const stickLength = stick.height; 
        const stickEndX = platform0.x + stickLength;
        const stickEndY = platform0.y;

        // Рассчитываем расстояние между концом палки и центром платформы
        const distance = cc.Vec2.distance(new cc.Vec2(stickEndX, stickEndY), (new cc.Vec2(platform.x - platform.getContentSize().width/2, platform.y)));
        // Если расстояние меньше заданного порога, значит палка коснулась центра платформы
        return distance < 20;
    }

    start() {}

    update(dt) {

        const stick = this.node;
        const firstPlatform = stick.parent;
        const secondPlatform = stick.parent.parent.children[2];
        const hero = stick.parent.parent.parent.children[5];
        
        // Если нажата кнопка - увеличение палки 
        if (this.isStickScaling === true  && this.isScalingCompleted == false) {
            stick.angle = 0;

            this.getComponent(cc.RevoluteJoint).enableMotor = false;//отключение мотора, чтобы при увеличениие палка не двигалась

            stick.setContentSize(stick.getContentSize().width, stick.getContentSize().height + 10); // Увеличиваем высоту палки на 10 

            //Изменение размеров коллайдера и его смещение для корректной отработки
            stick.getComponent(cc.PhysicsBoxCollider).size.height += 10;
            stick.getComponent(cc.PhysicsBoxCollider).offset.y += 5;
            stick.getComponent(cc.PhysicsBoxCollider).apply();
            
        } 
        // По окончанию роста ( отжатию кнопки) палка становится динамичной
        else if (stick.angle === 0  && this.isScalingCompleted == true && this.isStickScaling === false) {
            stick.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        }
        // Проверка палки на различные состояния после окончания роста
        if (this.isScalingCompleted == true ) {

            // Если палка пересекает границу в 75 градусов, то зафиксировать ее под  углом в 90 градусов( ожидает проверки на касание/недолет/перелет)
            if ((this.previousStickAngle > -75 && stick.angle <= -75 && this.isStickStoped === false)) {
                this.getComponent(cc.RevoluteJoint).enableMotor = false;
                stick.angle = -90;
                this.getComponent(cc.RigidBody).fixedRotation = true;
                this.isStickStoped = true;
                this.StickCurrentState = StickState.Wait;
                return;
            }
            this.previousStickAngle = stick.angle;


            //Если палка коснулась второй платформы и не выходит за ее рамки
            if (stick.angle == -90 && this.contactName === secondPlatform.getComponent(cc.PhysicsBoxCollider).name &&
                stick.getContentSize().height < secondPlatform.x - firstPlatform.x - 10 && this.once===false) {
                this.StickCurrentState = StickState.Bridge;
                this.getComponent(cc.RevoluteJoint).enableMotor = false;
                this.getComponent(cc.RigidBody).fixedRotation = true;
                stick.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;

                if (this.isStickTouchingCenterOfPlatform(stick, secondPlatform, firstPlatform) ) {
                    this.StickCurrentState = StickState.BridgePerfect;
                    secondPlatform.children[0].active=true;//lable Perfect
                }
                this.once=true;
            }
            //Если она в зафиксированном положении не касается платформы
            else if (stick.angle == -90 && this.contactName !== secondPlatform.getComponent(cc.PhysicsBoxCollider).name) {

                this.StickCurrentState = StickState.Fall; //Палка готова к падению
                // Если герой добежал до конца палки - палка падает
                if (hero.getComponent('hero').HeroCurrentState === HeroState.FailedMoveFinish ) {

                    this.getComponent(cc.RigidBody).fixedRotation = false;
                    this.getComponent(cc.RevoluteJoint).enableMotor = true;
                    this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                }
                
            }
            //Если она в зафиксированном положении касается платформы, но выходит за ее пределы
            else if (stick.angle == -90 && stick.getContentSize().height >= secondPlatform.x - firstPlatform.x - 10
                && this.contactName ===secondPlatform.getComponent(cc.PhysicsBoxCollider).name) {

                this.StickCurrentState = StickState.Fall; //Палка готова к падению
                // Если герой добежал до конца палки - палка падает
                if (hero.getComponent('hero').HeroCurrentState === HeroState.FailedMoveFinish) {

                    this.getComponent(cc.RigidBody).fixedRotation = false;
                    secondPlatform.getComponent(cc.PhysicsBoxCollider).enabled = false;
                    this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;

                    //stick.parent.zIndex = 5;//Платформа с палкой переходит на передний план
                   // secondPlatform.zIndex = 1;// Платформа ,которую палка коснулась переходит на задний план
                    this.getComponent(cc.RevoluteJoint).enableMotor = true;

                }
                
            }
        }
        // Если палка падает и ее угол становится больше чем 170, то она 'приклеивается'
        if (stick.angle <= -170 && this.StickCurrentState === StickState.Fall) {
            this.getComponent(cc.RevoluteJoint).enableMotor = false;
            this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            stick.angle = -180;
        }


    }
}

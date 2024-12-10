import { StickState, HeroState } from "./enums";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Character extends cc.Component {

    heroMoving: boolean = false;

    @property
    HeroCurrentState: HeroState = HeroState.DummyState;
    @property(cc.Node)
    gameArea: cc.Node = null;
    @property(cc.Node)
    canvas: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //Управление мышью
        this.canvas.on(cc.Node.EventType.MOUSE_UP, (event: cc.Event.EventMouse) => {
            if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
                this.heroMoving = true;
            }
        }, this);
        //Управление касанием
        this.canvas.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.heroMoving = true;
        }, this);


    }

    start() { }

    onDestroy(){
        this.canvas.off(cc.Node.EventType.MOUSE_UP, (event: cc.Event.EventMouse) => {
            if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
                this.heroMoving = true;
            }
        }, this);
        this.canvas.off(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.heroMoving = true;
        }, this);
    }

    update(dt) {

        const firstPlatform = this.gameArea.children[1];
        const secondPlatform = this.gameArea.children[2];
        const stick = firstPlatform.children[0];
        const hero = this.node;
        
        //если палка упала на блок и по ней можно пройти( condittion === 1)
        if (this.heroMoving === true && (stick.getComponent("stick").StickCurrentState === StickState.Bridge 
        || stick.getComponent("stick").StickCurrentState === StickState.BridgePerfect) ) {
           
            this.heroMoving = false;

            const actionWithCallback = cc.sequence(
                cc.moveBy(0.5, secondPlatform.x - firstPlatform.x, 0),  //передвижение персонажа от края настоящей платформы до края следующей
                cc.callFunc(() => {   //выполнится  только после того как герой перейдет к следующему блоку
                    this.HeroCurrentState = HeroState.SuccessfulMoveFinish;//Состояние, когда персонаж перебежал и ожидает нового перехода
                })
            );


            hero.runAction(actionWithCallback);  
            this.HeroCurrentState = HeroState.Move;         //Состояние персонажа во время перехода( в движении)

        }
        //если палка не долетает до платформы или перелетает ее
        else if (this.heroMoving === true && stick.getComponent("stick").StickCurrentState === StickState.Fall) {

            this.heroMoving = false;

            const actionWithCallback = cc.sequence(
                cc.moveBy(0.5, stick.getContentSize().height + (firstPlatform.x - hero.x + hero.getContentSize().width / 2), 0),//передвижение персонажа от края  платформы до конца палки  
                cc.callFunc(() => {
                    this.HeroCurrentState = HeroState.FailedMoveFinish;//Состояние, когда персонаж добежал до конца палки и начинает падать
                    this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                    setTimeout(()=>{
                        hero.destroy();
                        cc.systemEvent.emit('game_over');
                        console.log('Game over 0')
                    },1000)
                })
            );
            hero.runAction(actionWithCallback);
            this.HeroCurrentState = HeroState.Move;         //Состояние персонажа во время перехода( в движении)
        }
    }


}

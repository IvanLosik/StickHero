const { ccclass, property } = cc._decorator;
import { StickState, HeroState } from "./enums";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    stickPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    backgroundPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    platformPrefab: cc.Prefab = null;

    @property(cc.Node)
    gameArea: cc.Node = null;

    @property(cc.Node)
    hero: cc.Node = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    passedPlatformsCounter: number = 0;

    onLoad() {
        // Включаем физику
        cc.director.getPhysicsManager().enabled = true;
    }

    // Обновление счетчика очков
    updateScoreDisplay() {
        const stick = this.gameArea.children[1].children[0];

        this.passedPlatformsCounter++;  // Увеличиваем счетчик

        if(stick.getComponent("stick").StickCurrentState === StickState.BridgePerfect){
            this.passedPlatformsCounter++; // Доп. балл за идеальное попадание
        }

        this.scoreLabel.string = `${this.passedPlatformsCounter}` ; // Обновляем отображение
    }

    // Обновление фона (паралакса)
    parallaxUpdate(){
        // После того как старый фон проедет - скрытый фон занимает его место и создается новый скрытый фон
        this.node.parent.children[2].destroy();
        this.node.parent.children[3].setSiblingIndex(2);

        const newBackground = cc.instantiate(this.backgroundPrefab);
        newBackground.setPosition(this.node.parent.children[2].x + this.node.parent.children[2].getContentSize().width, 0);
        this.node.parent.addChild(newBackground);
        newBackground.setSiblingIndex(3);
    }

    // Движение фона (паралакса)
    parallaxMove() {
        this.node.parent.children[2].runAction(cc.moveBy(0.5, -100, 0)); // Передвижение видимого фона
        this.node.parent.children[3].runAction(cc.moveBy(0.5, -100, 0)); // Передвижение картинки с фоном ,которая следует за нынешним
    }

    // Передвижение платформ
    slidePlatform() {

        const hiddenPlatform = this.gameArea.children[0]; // Платформа, которая уже за кадром
        const oldPlatform = this.gameArea.children[1]; // Платформа на которой создавалась палка
        const mainPlatfom = this.gameArea.children[2]; // Платформа на которой сейчас будет создаваться палка
        const newPlatform = this.gameArea.children[3]; // Платформа на которую палка будет падать

        let FirstPlatformPosition = oldPlatform.getPosition(); // Позиция платформы на которой создвалась палка
        let SecondPlatformPosition = mainPlatfom.getPosition(); // Позиция платформы на которую палка упала

        // Максимальная и минимальная дистанция, на которую может подъехать очередная платформа (та, на которую будет падать палка)
        let maxShiftDistance = newPlatform.x - oldPlatform.x - newPlatform.getContentSize().width - 100;
        let minShiftDistance = newPlatform.x - this.gameArea.width / 2 + 50;

        let distanceBetweenPlatforms = SecondPlatformPosition.x - FirstPlatformPosition.x; // Прошлое расстояние между первой и второй (видимыми) платформами
       
        let ShiftDistance = Math.random() * (maxShiftDistance - minShiftDistance) + minShiftDistance;

        // Callback для нулевой платформы (слева за кадром) - уезжает и после этого удаляется
        const moveDeleteHiddenPlatform = cc.sequence(
            cc.moveBy(0.5, -distanceBetweenPlatforms, 0),  // Передвижение после которого платформа удалится
            cc.callFunc(() => {
                hiddenPlatform.destroy();
            })
        );

        if (hiddenPlatform.children[0]) { // Если на удаляемой платформе есть палка
            hiddenPlatform.children[0].runAction(cc.moveBy(0.5, -distanceBetweenPlatforms, 0)); // Передвижение палки нулевой платформы
        }
        hiddenPlatform.runAction(moveDeleteHiddenPlatform); // Запуск движения нулевой платформы с последующим удалением

        const hideOldPlatform = cc.sequence(
            cc.moveBy(0.5, -distanceBetweenPlatforms, 0),  //Передвижение старой платформы (с которой по палке перешли на новую)
            cc.callFunc(() => {
                this.createPlatform(); // Создание за кадром новой платформы
            })
        );
        oldPlatform.children[0].runAction(cc.moveBy(0.5, -distanceBetweenPlatforms, 0));
        oldPlatform.runAction(hideOldPlatform);

        const moveNewMainPlatform = cc.sequence(
            cc.moveBy(0.5, -distanceBetweenPlatforms, 0),  // Передвижение платформы на которую мы перешли(на ней создается новая палка)
            cc.callFunc(() => {
                this.createStick();
            })
        );
        mainPlatfom.runAction(moveNewMainPlatform);

        this.hero.runAction(cc.moveBy(0.5, -distanceBetweenPlatforms, 0)); // Передвижение героя
        newPlatform.runAction(cc.moveBy(0.5, -ShiftDistance, 0)); // Передвижение платформы на рандомное расстояние к платформе на которой стоим
    }

    // Создание новой платформы
    createPlatform(){
        const newPlatform = cc.instantiate(this.platformPrefab);

        newPlatform.setPosition(1500, -480);   // Устанавливаем новую позицию
        newPlatform.setContentSize((Math.random() * (300 - 50) + 100), 1000);
        newPlatform.getComponent(cc.PhysicsBoxCollider).size.width = newPlatform.getContentSize().width;
        newPlatform.getComponent(cc.PhysicsBoxCollider).offset.x = - newPlatform.getContentSize().width / 2;
        newPlatform.getComponent(cc.PhysicsBoxCollider).apply();

        this.gameArea.addChild(newPlatform);
    }
    
    // Создание новой палки
    createStick() {
        const newStick = cc.instantiate(this.stickPrefab);
       
        newStick.setPosition(0, 0);

        newStick.getComponent(cc.RevoluteJoint).connectedBody = this.gameArea.children[2].getComponent(cc.RigidBody);
        newStick.getComponent(cc.RevoluteJoint).connectedAnchor = new cc.Vec2(0, 0);
        newStick.getComponent(cc.RevoluteJoint).enableMotor = false;

        newStick.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;

        this.gameArea.children[2].addChild(newStick);
        this.gameArea.children[2].children[1].setSiblingIndex(0);
    } 


    update(dt) {
        if (this.hero.getComponent("hero").HeroCurrentState === HeroState.SuccessfulMoveFinish) {
            this.updateScoreDisplay();
            this.slidePlatform();
            this.hero.getComponent("hero").HeroCurrentState = HeroState.Wait;
            return;
        }
        if (this.hero.getComponent("hero").HeroCurrentState === HeroState.Move) {
            this.parallaxMove();
            this.hero.getComponent("hero").HeroCurrentState = HeroState.DummyState;
        }
        //создание 
        if (this.node.parent.children[2].x < -this.node.parent.children[2].getContentSize().width && this.hero.getComponent("hero").HeroCurrentState === HeroState.Wait) {
            this.parallaxUpdate();
            this.hero.getComponent("hero").HeroCurrentState = HeroState.DummyState;
        }
    }
}

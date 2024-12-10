const {ccclass, property} = cc._decorator;

@ccclass
export default class Class extends cc.Component {
    @property(cc.Node)
    firstPlatform: cc.Node = null;
    @property(cc.Node)
    secondPlatform: cc.Node = null;
    @property(cc.Node)
    hero: cc.Node = null;

    startGame() {
    const moveActionFirst = cc.moveBy(0.5,-this.firstPlatform.x - 192 , -480 - this.firstPlatform.y );
        const actionWithCallbackFirst = cc.sequence(
            moveActionFirst,  
            cc.callFunc(() => {
                
                cc.director.loadScene("Level");
            })
        );
        this.node.active = false;
        this.firstPlatform.runAction(actionWithCallbackFirst);
        this.hero.runAction(cc.moveBy(0.5,-this.hero.x - 230 , -490 - this.hero.y ));
        this.secondPlatform.runAction(cc.moveBy(0.5,-470 , 0));       
    }
}



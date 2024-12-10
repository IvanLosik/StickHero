window.__require=function t(e,o,n){function c(r,a){if(!o[r]){if(!e[r]){var s=r.split("/");if(s=s[s.length-1],!e[s]){var p="function"==typeof __require&&__require;if(!a&&p)return p(s,!0);if(i)return i(s,!0);throw new Error("Cannot find module '"+r+"'")}r=s}var l=o[r]={exports:{}};e[r][0].call(l.exports,function(t){return c(e[r][1][t]||t)},l,l.exports,t,e,o,n)}return o[r].exports}for(var i="function"==typeof __require&&__require,r=0;r<n.length;r++)c(n[r]);return c}({enums:[function(t,e,o){"use strict";cc._RF.push(e,"6b11f9grn5MjJI3Ia3NZFB6","enums"),Object.defineProperty(o,"__esModule",{value:!0}),o.HeroState=o.StickState=void 0,function(t){t[t.Bridge=0]="Bridge",t[t.Fall=1]="Fall",t[t.Wait=2]="Wait",t[t.BridgePerfect=3]="BridgePerfect"}(o.StickState||(o.StickState={})),function(t){t[t.SuccessfulMoveFinish=0]="SuccessfulMoveFinish",t[t.FailedMoveFinish=1]="FailedMoveFinish",t[t.Wait=2]="Wait",t[t.Move=3]="Move",t[t.DummyState=4]="DummyState"}(o.HeroState||(o.HeroState={})),cc._RF.pop()},{}],gameManager:[function(t,e,o){"use strict";cc._RF.push(e,"a1c85TWtEhMfJZ8LpkRob5m","gameManager");var n,c=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])})(t,e)},function(t,e){function o(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}),i=this&&this.__decorate||function(t,e,o,n){var c,i=arguments.length,r=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,o,n);else for(var a=t.length-1;a>=0;a--)(c=t[a])&&(r=(i<3?c(r):i>3?c(e,o,r):c(e,o))||r);return i>3&&r&&Object.defineProperty(e,o,r),r};Object.defineProperty(o,"__esModule",{value:!0});var r=cc._decorator,a=r.ccclass,s=r.property,p=t("./enums"),l=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.stickPrefab=null,e.backgroundPrefab=null,e.platformPrefab=null,e.gameArea=null,e.hero=null,e.scoreLabel=null,e.passedPlatformsCounter=0,e}return c(e,t),e.prototype.onLoad=function(){cc.director.getPhysicsManager().enabled=!0},e.prototype.updateScoreDisplay=function(){var t=this.gameArea.children[1].children[0];this.passedPlatformsCounter++,t.getComponent("stick").StickCurrentState===p.StickState.BridgePerfect&&this.passedPlatformsCounter++,this.scoreLabel.string=""+this.passedPlatformsCounter},e.prototype.parallaxUpdate=function(){this.node.parent.children[2].destroy(),this.node.parent.children[3].setSiblingIndex(2);var t=cc.instantiate(this.backgroundPrefab);t.setPosition(this.node.parent.children[2].x+this.node.parent.children[2].getContentSize().width,0),this.node.parent.addChild(t),t.setSiblingIndex(3)},e.prototype.parallaxMove=function(){this.node.parent.children[2].runAction(cc.moveBy(.5,-100,0)),this.node.parent.children[3].runAction(cc.moveBy(.5,-100,0))},e.prototype.slidePlatform=function(){var t=this,e=this.gameArea.children[0],o=this.gameArea.children[1],n=this.gameArea.children[2],c=this.gameArea.children[3],i=o.getPosition(),r=n.getPosition(),a=c.x-o.x-c.getContentSize().width-100,s=c.x-this.gameArea.width/2+50,p=r.x-i.x,l=Math.random()*(a-s)+s,u=cc.sequence(cc.moveBy(.5,-p,0),cc.callFunc(function(){e.destroy()}));e.children[0]&&e.children[0].runAction(cc.moveBy(.5,-p,0)),e.runAction(u);var h=cc.sequence(cc.moveBy(.5,-p,0),cc.callFunc(function(){t.createPlatform()}));o.children[0].runAction(cc.moveBy(.5,-p,0)),o.runAction(h);var d=cc.sequence(cc.moveBy(.5,-p,0),cc.callFunc(function(){t.createStick()}));n.runAction(d),this.hero.runAction(cc.moveBy(.5,-p,0)),c.runAction(cc.moveBy(.5,-l,0))},e.prototype.createPlatform=function(){var t=cc.instantiate(this.platformPrefab);t.setPosition(1500,-480),t.setContentSize(250*Math.random()+100,1e3),t.getComponent(cc.PhysicsBoxCollider).size.width=t.getContentSize().width,t.getComponent(cc.PhysicsBoxCollider).offset.x=-t.getContentSize().width/2,t.getComponent(cc.PhysicsBoxCollider).apply(),this.gameArea.addChild(t)},e.prototype.createStick=function(){var t=cc.instantiate(this.stickPrefab);t.setPosition(0,0),t.getComponent(cc.RevoluteJoint).connectedBody=this.gameArea.children[2].getComponent(cc.RigidBody),t.getComponent(cc.RevoluteJoint).connectedAnchor=new cc.Vec2(0,0),t.getComponent(cc.RevoluteJoint).enableMotor=!1,t.getComponent(cc.RigidBody).type=cc.RigidBodyType.Static,this.gameArea.children[2].addChild(t),this.gameArea.children[2].children[1].setSiblingIndex(0)},e.prototype.update=function(){if(this.hero.getComponent("hero").HeroCurrentState===p.HeroState.SuccessfulMoveFinish)return this.updateScoreDisplay(),this.slidePlatform(),void(this.hero.getComponent("hero").HeroCurrentState=p.HeroState.Wait);this.hero.getComponent("hero").HeroCurrentState===p.HeroState.Move&&(this.parallaxMove(),this.hero.getComponent("hero").HeroCurrentState=p.HeroState.DummyState),this.node.parent.children[2].x<-this.node.parent.children[2].getContentSize().width&&this.hero.getComponent("hero").HeroCurrentState===p.HeroState.Wait&&(this.parallaxUpdate(),this.hero.getComponent("hero").HeroCurrentState=p.HeroState.DummyState)},i([s(cc.Prefab)],e.prototype,"stickPrefab",void 0),i([s(cc.Prefab)],e.prototype,"backgroundPrefab",void 0),i([s(cc.Prefab)],e.prototype,"platformPrefab",void 0),i([s(cc.Node)],e.prototype,"gameArea",void 0),i([s(cc.Node)],e.prototype,"hero",void 0),i([s(cc.Label)],e.prototype,"scoreLabel",void 0),i([a],e)}(cc.Component);o.default=l,cc._RF.pop()},{"./enums":"enums"}],gameOverScript:[function(t,e,o){"use strict";cc._RF.push(e,"aa783XuAddCx6Arct4ESUff","gameOverScript");var n,c=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])})(t,e)},function(t,e){function o(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}),i=this&&this.__decorate||function(t,e,o,n){var c,i=arguments.length,r=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,o,n);else for(var a=t.length-1;a>=0;a--)(c=t[a])&&(r=(i<3?c(r):i>3?c(e,o,r):c(e,o))||r);return i>3&&r&&Object.defineProperty(e,o,r),r};Object.defineProperty(o,"__esModule",{value:!0});var r=cc._decorator,a=r.ccclass,s=r.property,p=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.gameOverPanel=null,e.restartButton=null,e.mainMenuButton=null,e.gameOverLable=null,e.scoreLabel=null,e}return c(e,t),e.prototype.onLoad=function(){this.gameOverPanel.active=!1,this.restartButton.on("click",this.onRestart,this),this.mainMenuButton.on("click",this.onMainMenu,this),cc.systemEvent.on("game_over",this.showGameOver,this)},e.prototype.showGameOver=function(){console.log("Game Over"),this.gameOverLable.string="Score: "+this.scoreLabel.string,this.gameOverPanel.active=!0,cc.director.pause()},e.prototype.onDestroy=function(){cc.systemEvent.off("game_over",this.showGameOver,this),this.restartButton.off("click",this.onRestart,this),this.mainMenuButton.off("click",this.onMainMenu,this)},e.prototype.onRestart=function(){cc.director.resume(),cc.director.loadScene("Level")},e.prototype.onMainMenu=function(){cc.director.resume(),cc.director.loadScene("StartScene")},i([s(cc.Node)],e.prototype,"gameOverPanel",void 0),i([s(cc.Node)],e.prototype,"restartButton",void 0),i([s(cc.Node)],e.prototype,"mainMenuButton",void 0),i([s(cc.Label)],e.prototype,"gameOverLable",void 0),i([s(cc.Label)],e.prototype,"scoreLabel",void 0),i([a],e)}(cc.Component);o.default=p,cc._RF.pop()},{}],hero:[function(t,e,o){"use strict";cc._RF.push(e,"431cbp/YYRI9IPox2Zod4Fy","hero");var n,c=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])})(t,e)},function(t,e){function o(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}),i=this&&this.__decorate||function(t,e,o,n){var c,i=arguments.length,r=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,o,n);else for(var a=t.length-1;a>=0;a--)(c=t[a])&&(r=(i<3?c(r):i>3?c(e,o,r):c(e,o))||r);return i>3&&r&&Object.defineProperty(e,o,r),r};Object.defineProperty(o,"__esModule",{value:!0});var r=t("./enums"),a=cc._decorator,s=a.ccclass,p=a.property,l=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.heroMoving=!1,e.HeroCurrentState=r.HeroState.DummyState,e.gameArea=null,e.canvas=null,e}return c(e,t),e.prototype.onLoad=function(){var t=this;this.canvas.on(cc.Node.EventType.MOUSE_UP,function(e){e.getButton()===cc.Event.EventMouse.BUTTON_RIGHT&&(t.heroMoving=!0)},this),this.canvas.on(cc.Node.EventType.TOUCH_END,function(){t.heroMoving=!0},this)},e.prototype.start=function(){},e.prototype.onDestroy=function(){var t=this;this.canvas.off(cc.Node.EventType.MOUSE_UP,function(e){e.getButton()===cc.Event.EventMouse.BUTTON_RIGHT&&(t.heroMoving=!0)},this),this.canvas.off(cc.Node.EventType.TOUCH_END,function(){t.heroMoving=!0},this)},e.prototype.update=function(){var t=this,e=this.gameArea.children[1],o=this.gameArea.children[2],n=e.children[0],c=this.node;if(!0!==this.heroMoving||n.getComponent("stick").StickCurrentState!==r.StickState.Bridge&&n.getComponent("stick").StickCurrentState!==r.StickState.BridgePerfect)!0===this.heroMoving&&n.getComponent("stick").StickCurrentState===r.StickState.Fall&&(this.heroMoving=!1,i=cc.sequence(cc.moveBy(.5,n.getContentSize().height+(e.x-c.x+c.getContentSize().width/2),0),cc.callFunc(function(){t.HeroCurrentState=r.HeroState.FailedMoveFinish,t.getComponent(cc.RigidBody).type=cc.RigidBodyType.Dynamic,setTimeout(function(){c.destroy(),cc.systemEvent.emit("game_over"),console.log("Game over 0")},1e3)})),c.runAction(i),this.HeroCurrentState=r.HeroState.Move);else{this.heroMoving=!1;var i=cc.sequence(cc.moveBy(.5,o.x-e.x,0),cc.callFunc(function(){t.HeroCurrentState=r.HeroState.SuccessfulMoveFinish}));c.runAction(i),this.HeroCurrentState=r.HeroState.Move}},i([p],e.prototype,"HeroCurrentState",void 0),i([p(cc.Node)],e.prototype,"gameArea",void 0),i([p(cc.Node)],e.prototype,"canvas",void 0),i([s],e)}(cc.Component);o.default=l,cc._RF.pop()},{"./enums":"enums"}],startScript:[function(t,e,o){"use strict";cc._RF.push(e,"9c4f19g7FVFzZFs5LO8WBPq","startScript");var n,c=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])})(t,e)},function(t,e){function o(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}),i=this&&this.__decorate||function(t,e,o,n){var c,i=arguments.length,r=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,o,n);else for(var a=t.length-1;a>=0;a--)(c=t[a])&&(r=(i<3?c(r):i>3?c(e,o,r):c(e,o))||r);return i>3&&r&&Object.defineProperty(e,o,r),r};Object.defineProperty(o,"__esModule",{value:!0});var r=cc._decorator,a=r.ccclass,s=r.property,p=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.firstPlatform=null,e.secondPlatform=null,e.hero=null,e}return c(e,t),e.prototype.startGame=function(){var t=cc.moveBy(.5,-this.firstPlatform.x-192,-480-this.firstPlatform.y),e=cc.sequence(t,cc.callFunc(function(){cc.director.loadScene("Level")}));this.node.active=!1,this.firstPlatform.runAction(e),this.hero.runAction(cc.moveBy(.5,-this.hero.x-230,-490-this.hero.y)),this.secondPlatform.runAction(cc.moveBy(.5,-470,0))},i([s(cc.Node)],e.prototype,"firstPlatform",void 0),i([s(cc.Node)],e.prototype,"secondPlatform",void 0),i([s(cc.Node)],e.prototype,"hero",void 0),i([a],e)}(cc.Component);o.default=p,cc._RF.pop()},{}],stick:[function(t,e,o){"use strict";cc._RF.push(e,"d0716X+lBhEprLblcwp0Y9z","stick");var n,c=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])})(t,e)},function(t,e){function o(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}),i=this&&this.__decorate||function(t,e,o,n){var c,i=arguments.length,r=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,o,n);else for(var a=t.length-1;a>=0;a--)(c=t[a])&&(r=(i<3?c(r):i>3?c(e,o,r):c(e,o))||r);return i>3&&r&&Object.defineProperty(e,o,r),r};Object.defineProperty(o,"__esModule",{value:!0});var r=cc._decorator,a=r.ccclass,s=r.property,p=t("./enums"),l=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.StickCurrentState=p.StickState.Wait,e.isStickScaling=!1,e.contactName=null,e.isScalingCompleted=!1,e.previousStickAngle=0,e.isStickStoped=!1,e.once=!1,e}return c(e,t),e.prototype.onLoad=function(){var t=this,e=this.node,o=e.parent.parent;this.previousStickAngle=e.angle,o.once(cc.Node.EventType.MOUSE_DOWN,function(e){e.getButton()===cc.Event.EventMouse.BUTTON_RIGHT&&(t.isStickScaling=!0)},this),o.once(cc.Node.EventType.MOUSE_UP,function(e){e.getButton()===cc.Event.EventMouse.BUTTON_RIGHT&&(t.isStickScaling=!1,t.isScalingCompleted=!0,t.getComponent(cc.RevoluteJoint).enableMotor=!0)},this),o.once(cc.Node.EventType.TOUCH_START,function(){t.isStickScaling=!0},this),o.once(cc.Node.EventType.TOUCH_END,function(){t.isStickScaling=!1,t.isScalingCompleted=!0,t.getComponent(cc.RevoluteJoint).enableMotor=!0},this)},e.prototype.onDestroy=function(){var t=this,e=this.node.parent.parent;e.off(cc.Node.EventType.MOUSE_DOWN,function(e){e.getButton()===cc.Event.EventMouse.BUTTON_RIGHT&&(t.isStickScaling=!0)},this),e.off(cc.Node.EventType.MOUSE_UP,function(e){e.getButton()===cc.Event.EventMouse.BUTTON_RIGHT&&(t.isStickScaling=!1,t.isScalingCompleted=!0,t.getComponent(cc.RevoluteJoint).enableMotor=!0)},this),e.off(cc.Node.EventType.TOUCH_START,function(){t.isStickScaling=!0,console.log("First time down")},this),e.off(cc.Node.EventType.TOUCH_END,function(){t.isStickScaling=!1,t.isScalingCompleted=!0,t.getComponent(cc.RevoluteJoint).enableMotor=!0,console.log("First time up")},this)},e.prototype.onBeginContact=function(t,e,o){this.contactName=o.name},e.prototype.isStickTouchingCenterOfPlatform=function(t,e,o){var n=t.height,c=o.x+n,i=o.y;return cc.Vec2.distance(new cc.Vec2(c,i),new cc.Vec2(e.x-e.getContentSize().width/2,e.y))<20},e.prototype.start=function(){},e.prototype.update=function(){var t=this.node,e=t.parent,o=t.parent.parent.children[2],n=t.parent.parent.parent.children[5];if(!0===this.isStickScaling&&0==this.isScalingCompleted?(t.angle=0,this.getComponent(cc.RevoluteJoint).enableMotor=!1,t.setContentSize(t.getContentSize().width,t.getContentSize().height+10),t.getComponent(cc.PhysicsBoxCollider).size.height+=10,t.getComponent(cc.PhysicsBoxCollider).offset.y+=5,t.getComponent(cc.PhysicsBoxCollider).apply()):0===t.angle&&1==this.isScalingCompleted&&!1===this.isStickScaling&&(t.getComponent(cc.RigidBody).type=cc.RigidBodyType.Dynamic),1==this.isScalingCompleted){if(this.previousStickAngle>-75&&t.angle<=-75&&!1===this.isStickStoped)return this.getComponent(cc.RevoluteJoint).enableMotor=!1,t.angle=-90,this.getComponent(cc.RigidBody).fixedRotation=!0,this.isStickStoped=!0,void(this.StickCurrentState=p.StickState.Wait);this.previousStickAngle=t.angle,-90==t.angle&&this.contactName===o.getComponent(cc.PhysicsBoxCollider).name&&t.getContentSize().height<o.x-e.x-10&&!1===this.once?(this.StickCurrentState=p.StickState.Bridge,this.getComponent(cc.RevoluteJoint).enableMotor=!1,this.getComponent(cc.RigidBody).fixedRotation=!0,t.getComponent(cc.RigidBody).type=cc.RigidBodyType.Static,this.isStickTouchingCenterOfPlatform(t,o,e)&&(this.StickCurrentState=p.StickState.BridgePerfect,o.children[0].active=!0),this.once=!0):-90==t.angle&&this.contactName!==o.getComponent(cc.PhysicsBoxCollider).name?(this.StickCurrentState=p.StickState.Fall,n.getComponent("hero").HeroCurrentState===p.HeroState.FailedMoveFinish&&(this.getComponent(cc.RigidBody).fixedRotation=!1,this.getComponent(cc.RevoluteJoint).enableMotor=!0,this.getComponent(cc.RigidBody).type=cc.RigidBodyType.Dynamic)):-90==t.angle&&t.getContentSize().height>=o.x-e.x-10&&this.contactName===o.getComponent(cc.PhysicsBoxCollider).name&&(this.StickCurrentState=p.StickState.Fall,n.getComponent("hero").HeroCurrentState===p.HeroState.FailedMoveFinish&&(this.getComponent(cc.RigidBody).fixedRotation=!1,o.getComponent(cc.PhysicsBoxCollider).enabled=!1,this.getComponent(cc.RigidBody).type=cc.RigidBodyType.Dynamic,this.getComponent(cc.RevoluteJoint).enableMotor=!0))}t.angle<=-170&&this.StickCurrentState===p.StickState.Fall&&(this.getComponent(cc.RevoluteJoint).enableMotor=!1,this.getComponent(cc.RigidBody).type=cc.RigidBodyType.Static,t.angle=-180)},i([s],e.prototype,"StickCurrentState",void 0),i([a],e)}(cc.Component);o.default=l,cc._RF.pop()},{"./enums":"enums"}]},{},["enums","gameManager","gameOverScript","hero","startScript","stick"]);
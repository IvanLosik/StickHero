const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    
        @property(cc.Node)
        gameOverPanel: cc.Node = null;
        @property(cc.Node)
        restartButton: cc.Node = null;
        @property(cc.Node)
        mainMenuButton: cc.Node = null;
        @property(cc.Label)
        gameOverLable: cc.Label = null;
        @property(cc.Label)
        scoreLabel: cc.Label = null;
    
        onLoad() {
        
                 // Панель с кнопками скрыта по умолчанию
                this.gameOverPanel.active = false;
                // Добавляем обработчики событий для кнопок
                this.restartButton.on('click', this.onRestart, this);
                this.mainMenuButton.on('click', this.onMainMenu, this);
            
                cc.systemEvent.on('game_over', this.showGameOver, this);
               
        }
    
        showGameOver() {
            console.log('Game Over');
            this.gameOverLable.string =`Score: ${this.scoreLabel.string}`;
            this.gameOverPanel.active = true;
            cc.director.pause();
        }
    
        onDestroy() {
            // Не забывайте отписываться от события при уничтожении объекта
             cc.systemEvent.off('game_over', this.showGameOver, this);
             this.restartButton.off('click', this.onRestart, this);
             this.mainMenuButton.off('click', this.onMainMenu, this);
        }

         // Функция для переигровки
    onRestart() {
        cc.director.resume(); // Возобновляем игру    
        cc.director.loadScene('Level'); // Переход на текущую сцену (или ее перезагрузка)
    }

    // Функция для перехода в главное меню
    onMainMenu() {
        cc.director.resume(); // Возобновляем игру
        cc.director.loadScene('StartScene'); // Переход в главное меню
    }
    
}
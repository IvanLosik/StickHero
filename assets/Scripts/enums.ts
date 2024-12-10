export enum StickState {
    Bridge,
    Fall,
    Wait,
    BridgePerfect
  }

export enum HeroState{
    SuccessfulMoveFinish, // Персонаж успешно перебежал на след.платформу
    FailedMoveFinish,     // Персонаж добежал до конца палки и начинает падать
    Wait,                 // Персонаж ожидает перебежки на следующую платформу 
    Move,                 // Персонаж перебегает на другую платформу (движется)
    DummyState            // Промежуточное состояние-заглушка
}
let config = {   
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default:'arcade',
    arcade: {
      gravity: {y: 200}
    }
  },
  scene: [ Level1, Level2 ]
}

let game = new Phaser.Game(config)
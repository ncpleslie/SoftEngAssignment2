let config = {   
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default:'arcade',
      arcade: {
        gravity: {y: 200},
        debug: false
      }
    },
    scene: [ Example1 ]
  }
  
  let game = new Phaser.Game(config)
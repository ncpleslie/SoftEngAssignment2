class Example1 extends Phaser.Scene {
    constructor() {
        super({
            key: 'Example1'
        })
        this.platforms
        this.player
        this.cursors
    }

    preload() {

        this.load.spritesheet('Player', 'https://i.imgur.com/k4SlN9a.png', { frameWidth: 24, frameHeight: 30 })
        this.load.image('Asset', 'https://i.imgur.com/jdqWEYB.png')
        this.load.image('Sky', 'https://i.imgur.com/fhFpcKN.png')
        this.load.image('Grass', 'https://i.imgur.com/rGPlCE8.png')
    }

    create() {
        // Create Sky
        this.add.image(0, 0, 'Sky').setOrigin(0, 0)

        // Add Platforms
        this.platforms = this.physics.add.staticGroup()
        this.platforms.enableBody = true

        let ground = this.platforms.create(0, 590, 'Grass').setOrigin(0, 0)
        ground.setScale(4).refreshBody()
        ground.body.immovable = true

        let ledge = this.platforms.create(400, 450, 'Grass')
        ledge.setScale(2.5, 0.2).refreshBody()
        ledge.body.immovable = true

        ledge = this.platforms.create(75, 350, 'Grass')
        ledge.setScale(2.5, 0.2).refreshBody()
        ledge.body.immovable = true
        
        // Player
        this.player = this.physics.add.sprite(100, 450, 'Player')
        this.player.setBounce(0.2)
        this.player.setGravityY(0)
        this.player.setCollideWorldBounds(true)
        
        // Player Animations
      this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('Player', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
      })

      this.anims.create({
      key: 'turn',
      frames: [ { key: 'Player', frame: 8 } ],
      frameRate: 20
      })

      this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('Player', { start: 4, end: 6 }),
      frameRate: 10,
      repeat: -1
      })
      
      this.anims.create({
      key: 'up',
      frames: [ { key: 'Player', frame: 9 } ],
      frameRate: 1,
      repeat: 10
      })
      
      this.anims.create({
      key: 'rightJump',
      frames: [ { key: 'Player', frame: 3 } ],
      frameRate: 1,
      repeat: 10
      })
      

        // Text
        this.text = this.add.text(0, 0, 'Hello!')

    }

    update() {
        
        this.physics.add.collider(this.player, this.platforms)

      // Controls
      this.cursors = this.input.keyboard.createCursorKeys()
      let leftRightVelocity = 160
      let jumpStrength = -330
      
      //Left
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-leftRightVelocity)
            this.player.anims.play('left', true)
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(leftRightVelocity)
            this.player.anims.play('right', true)
        } else {
            this.player.setVelocityX(0)
            this.player.anims.play('turn')
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(jumpStrength)
            this.player.anims.play('up')
          if (this.cursors.right.isDown) {
            this.player.anims.play('rightJump')
          }
        }
    }
}
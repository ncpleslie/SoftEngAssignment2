class Level1 extends Phaser.Scene {
    constructor() {
        super({
            key: 'Level1'
        })
        this.platforms
        this.player
        this.cursors
        this.layer
    }

    preload() {

        this.load.spritesheet('Player', 'https://i.imgur.com/k4SlN9a.png', {
            frameWidth: 24,
            frameHeight: 30
        })
        this.load.image('Asset', 'https://i.imgur.com/jdqWEYB.png')
        this.load.image('Sky', 'https://i.imgur.com/fhFpcKN.png')
        this.load.image('Grass', 'https://i.imgur.com/rGPlCE8.png')
        this.load.image("tiles", "https://i.imgur.com/JZKNeJO.png")
        this.load.tilemapTiledJSON("map", "scenes/level1.json")



    }

    create() {

        const map = this.make.tilemap({
            key: "map"
        })
        const tileset = map.addTilesetImage("marioTiles", "tiles")
        const worldLayer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0)
        worldLayer.setCollisionByProperty({
            collision: true
        })

        // Used for debugging. Will show colliding objects in new colour
      /*  const debugGraphics = this.add.graphics().setAlpha(0.75);
        worldLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        }) */


        // Player
        this.player = this.physics.add
            .sprite(100, 450, 'Player')
            .setBounce(0.2)
            .setGravityY(1000)
            //.setCollideWorldBounds(true)
        this.physics.add.collider(this.player, worldLayer)
      
        // Camera
        this.cameras.main.setBounds(0, 0, 800 * 2, 200 * 2)
        this.cameras.main.startFollow(this.player, false, 0.05, 0.05)
        this.cameras.main.setRoundPixels(false)

        // Player Animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('Player', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'turn',
            frames: [{
                key: 'Player',
                frame: 8
            }],
            frameRate: 20
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('Player', {
                start: 4,
                end: 6
            }),
            frameRate: 10,
            repeat: -1,
        })

        this.anims.create({
            key: 'up',
            frames: [{
                key: 'Player',
                frame: 9
            }],
            frameRate: 1,
            repeat: 10
        })

        this.anims.create({
            key: 'rightJump',
            frames: [{
                key: 'Player',
                frame: 3
            }],
            frameRate: 1,
            repeat: 10
        })


        // Text
        this.text = this.add.text(0, 0, 'Hello!')

    }

    update() {

        this.physics.add.collider(this.player, this.layer)

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys()
        let leftRightVelocity = 160
        let jumpStrength = -550

        //Left
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-leftRightVelocity)
            this.player.setScale(-1, 1)
            this.player.anims.play('left', true)
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(leftRightVelocity)
            this.player.setScale(1)
            this.player.anims.play('right', true)
        } else {
            this.player.setVelocityX(0)
            this.player.anims.play('turn')
        }

        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(jumpStrength)
            this.player.anims.play('up')
            if (this.cursors.right.isDown) {
                this.player.anims.play('rightJump')
            }
        }
    }
 
}
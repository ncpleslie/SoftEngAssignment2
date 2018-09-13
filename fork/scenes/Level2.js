class Level2 extends Phaser.Scene {
    constructor() {
        super({
            key: 'Level2'
        })
        this.platforms
        this.player
        this.cursors
        this.layer
        this.coinLayer
        this.score = 0
        this.text
        this.badguy
        this.enemyMaxY = 530
        this.enemyMinY = 500
        // The bottem layer = 568
        this.isPlayerAlive
        this.lives = 3
        

    }

    preload() {
        // Load images
        this.load.spritesheet('Player', 'https://i.imgur.com/k4SlN9a.png', {
            frameWidth: 24,
            frameHeight: 30
        })
        this.load.image('Asset', 'https://i.imgur.com/jdqWEYB.png')
        this.load.image('Sky', 'https://i.imgur.com/fhFpcKN.png')
        this.load.image('Grass', 'https://i.imgur.com/rGPlCE8.png')
        this.load.image("tiles", 'https://i.imgur.com/JZKNeJO.png')
        this.load.spritesheet('badguy', 'https://i.imgur.com/HKgScVP.png', {
            frameWidth: 42,
            frameHeight: 32
        })
        // Load tile map locations
        this.load.tilemapTiledJSON("map", "scenes/level1.json")
    }

    create() {
        
        // Create the world (Level 1)
        const map = this.make.tilemap({
            key: "map",
            tileWidth: 16,
            tileHeight: 16
        })

        const tileset = map.addTilesetImage("marioTiles", "tiles", 16, 16)

        const aboveLayer = map.createStaticLayer("Background", tileset, 0, 0)
        const worldLayer = map.createStaticLayer("Platforms", tileset, 0, 0)
        this.coinLayer = map.createDynamicLayer("Coins", tileset, 0, 0)

        this.physics.world.bounds.width = aboveLayer.width;
        this.physics.world.bounds.height = aboveLayer.height

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
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.main.startFollow(this.player)
        //This code is disabled. It allows for smooth camera slow-down
        //  this.cameras.main.startFollow(this.player, false, 0.05, 0.05)
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


        // Onscreen text. This is showing the score, for now
        this.text = this.add.text(300, 10, '0', {
            fontSize: '20px',
            fill: '#ffffff'
        })
        this.text.setScrollFactor(0)
        this.text.setText(`Level 2  Score: ${this.score}`)

        
        // Coins. These are collectable. It calls 'this.collectCoin' and clears the screen of that coin
        this.coinLayer.setTileIndexCallback(11, this.collectCoin, this)
        this.physics.add.overlap(this.player, this.coinLayer)
        
        // Kill if you fall in hole
        worldLayer.setTileIndexCallback(39, this.gameOver, this)
        

        // Bad Guys. Repeat will add more. 1 in at the moment
        this.badguy = this.add.group({
            key: 'badguy',
            repeat: 0,
            setXY: {
                x: 1253,
                y: 568,
                stepX: 80,
                stepY: 20
            }
        })
        //Sets monster speed
        Phaser.Actions.Call(this.badguy.getChildren(), function(enemy) {
            enemy.speed = Math.random() * 2 + 1;
        }, this)
        // Scale the monster
        Phaser.Actions.ScaleXY(this.badguy.getChildren(), -0.5, -0.5)
        
        
        //Ending Variables
        
        // Player is alive
        this.isPlayerAlive = true
        
        // reset camera effects
        this.cameras.main.resetFX()

    }


    update() {
        
        //Check if player is alive. If not, why bother even updating
        if (!this.isPlayerAlive) {
            return
        }

        // Bad guys
        let enemies = this.badguy.getChildren()
        let numEnemies = enemies.length
        for (let i = 0; i < numEnemies; i++) {
            // move enemies
            enemies[i].y += enemies[i].speed
            if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
                enemies[i].speed *= -1;
            } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
                enemies[i].speed *= -1;
            }
            // If you hit the enemy, you die
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
                this.gameOver()
                break
            }
        }


        // Controls
        this.cursors = this.input.keyboard.createCursorKeys()
        let leftRightVelocity = 160
        let jumpStrength = -550

        // Left
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-leftRightVelocity)
            this.player.setScale(-1, 1)
            this.player.anims.play('left', true)
            // Right  
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(leftRightVelocity)
            this.player.setScale(1)
            this.player.anims.play('right', true)
            // Stop  
        } else {
            this.player.setVelocityX(0)
            this.player.anims.play('turn')
        }
        // Jump
        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(jumpStrength)
            this.player.anims.play('up')
            if (this.cursors.right.isDown) {
                this.player.anims.play('rightJump')
            }
        }
    }

    // Coin collection function
    collectCoin(sprite, tile) {
        this.coinLayer.removeTileAt(tile.x, tile.y)
        this.score++
        this.text.setText(`Level 2  Score: ${this.score}`)
        
        // Load next level
        if (this.score == 8) {
            this.gameOver()
        }
        
        return false
    }
    
    // Game over. Has some camera functions I'm testing out and seeing what they do
    gameOver() {
        
        this.score = 0
        this.isPlayerAlive = false
                
        console.log(this.lives)
                
        // shake the camera
        this.cameras.main.shake(500)

        // fade camera
        this.time.delayedCall(250, function() {
            this.cameras.main.fade(250)
        }, [], this)

        // restart game
             this.time.delayedCall(500, function() {
            this.scene.start('Level1')
        }, [], this)
    }
}
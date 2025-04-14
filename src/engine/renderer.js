/**
 * Rendering system for the game
 */
class Renderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.images = {};
    }
    
    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    
    /**
     * Load an image for later use
     */
    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                resolve(img);
            };
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    }
    
    /**
     * Draw an image on the canvas
     */
    drawImage(key, x, y, width, height) {
        if (this.images[key]) {
            this.ctx.drawImage(this.images[key], x, y, width, height);
        } else {
            console.warn(`Image not found: ${key}`);
        }
    }
    
    /**
     * Draw a sprite from a spritesheet
     */
    drawSprite(key, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        if (this.images[key]) {
            this.ctx.drawImage(
                this.images[key],
                sx, sy, sWidth, sHeight,
                dx, dy, dWidth, dHeight
            );
        } else {
            console.warn(`Sprite not found: ${key}`);
        }
    }
    
    /**
     * Draw a tile from a tileset
     */
    drawTile(tilesetKey, tileIndex, tileSize, x, y, width, height) {
        if (!this.images[tilesetKey]) {
            console.warn(`Tileset not found: ${tilesetKey}`);
            return;
        }
        
        const tilesPerRow = Math.floor(this.images[tilesetKey].width / tileSize);
        const tileX = (tileIndex % tilesPerRow) * tileSize;
        const tileY = Math.floor(tileIndex / tilesPerRow) * tileSize;
        
        this.ctx.drawImage(
            this.images[tilesetKey],
            tileX, tileY, tileSize, tileSize,
            x, y, width, height
        );
    }
    
    /**
     * Draw a filled rectangle
     */
    fillRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }
    
    /**
     * Draw a stroked rectangle
     */
    strokeRect(x, y, width, height, color, lineWidth = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(x, y, width, height);
    }
      /**
     * Draw text on the canvas
     */
    drawText(text, x, y, options = {}) {
        const {
            color = 'white',
            font = '16px Arial',
            align = 'left',
            baseline = 'top'
        } = options;
        
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        this.ctx.fillText(text, x, y);
    }
    
    /**
     * Draw a filled circle
     */
    fillCircle(x, y, radius, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    }
    
    /**
     * Draw dialog box
     */
    drawDialogBox(text, x, y, width, height, options = {}) {
        const {
            backgroundColor = 'rgba(0, 0, 0, 0.7)',
            borderColor = 'white',
            textColor = 'white',
            font = '16px Arial',
            padding = 10
        } = options;
        
        // Draw background
        this.fillRect(x, y, width, height, backgroundColor);
        
        // Draw border
        this.strokeRect(x, y, width, height, borderColor, 2);
        
        // Draw text
        this.ctx.fillStyle = textColor;
        this.ctx.font = font;
        
        const words = text.split(' ');
        const lineHeight = parseInt(font) + 2;
        let line = '';
        let lineY = y + padding;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > width - padding * 2 && i > 0) {
                this.ctx.fillText(line, x + padding, lineY);
                line = words[i] + ' ';
                lineY += lineHeight;
            } else {
                line = testLine;
            }
        }
        
        this.ctx.fillText(line, x + padding, lineY);
    }
}

/**
 * Audio management system for the game
 */
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
    }
    
    /**
     * Load a sound effect
     */
    loadSound(key, src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                this.sounds[key] = audio;
                resolve(audio);
            };
            audio.onerror = () => reject(new Error(`Failed to load sound: ${src}`));
            audio.src = src;
            audio.load();
        });
    }
    
    /**
     * Load background music
     */
    loadMusic(key, src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                this.music[key] = audio;
                audio.loop = true; // Music loops by default
                resolve(audio);
            };
            audio.onerror = () => reject(new Error(`Failed to load music: ${src}`));
            audio.src = src;
            audio.load();
        });
    }
    
    /**
     * Play a sound effect
     */
    playSound(key, volume = 1.0) {
        if (this.sounds[key]) {
            const sound = this.sounds[key].cloneNode();
            sound.volume = volume;
            sound.play();
            return sound;
        } else {
            console.warn(`Sound not found: ${key}`);
            return null;
        }
    }
    
    /**
     * Play background music
     */
    playMusic(key, volume = 0.5, fadeIn = false) {
        if (this.music[key]) {
            // Stop currently playing music if any
            if (this.currentMusic) {
                this.stopMusic(true);
            }
            
            const music = this.music[key];
            music.volume = fadeIn ? 0 : volume;
            music.play();
            this.currentMusic = music;
            
            // Fade in the music if requested
            if (fadeIn) {
                this.fadeInMusic(volume);
            }
            
            return music;
        } else {
            console.warn(`Music not found: ${key}`);
            return null;
        }
    }
    
    /**
     * Stop background music
     */
    stopMusic(fadeOut = false) {
        if (this.currentMusic) {
            if (fadeOut) {
                this.fadeOutMusic();
            } else {
                this.currentMusic.pause();
                this.currentMusic.currentTime = 0;
                this.currentMusic = null;
            }
        }
    }
    
    /**
     * Fade in music
     */
    fadeInMusic(targetVolume = 0.5, duration = 1000) {
        if (!this.currentMusic) return;
        
        let startTime = Date.now();
        const music = this.currentMusic;
        music.volume = 0;
        
        const fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                music.volume = targetVolume;
                clearInterval(fadeInterval);
            } else {
                music.volume = progress * targetVolume;
            }
        }, 50);
    }
    
    /**
     * Fade out music
     */
    fadeOutMusic(duration = 1000) {
        if (!this.currentMusic) return;
        
        let startTime = Date.now();
        const music = this.currentMusic;
        const startVolume = music.volume;
        
        const fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                music.pause();
                music.currentTime = 0;
                music.volume = startVolume; // Reset volume for future use
                this.currentMusic = null;
                clearInterval(fadeInterval);
            } else {
                music.volume = startVolume * (1 - progress);
            }
        }, 50);
    }
}

import { Game } from './core/Game.js';

/**
 * TITAN ENGINE BOOTLOADER
 * Giriş noktası. Sayfa yüklendiğinde çalışır.
 */

window.addEventListener('DOMContentLoaded', () => {
    console.log("%c TITAN ENGINE BAŞLATILIYOR ", "background: #00d2d3; color: #000; font-weight: bold; padding: 5px;");

    try {
        // Oyun örneğini oluştur (Singleton pattern)
        const game = new Game();
        
        // Oyunu başlat
        game.start();

        // Global erişim (Debug için)
        window.TitanEngine = game;

    } catch (error) {
        console.error("Motor başlatılamadı:", error);
        document.querySelector('.loading-text').innerText = "BAŞLATMA HATASI!";
        document.querySelector('.loading-text').style.color = "#ff6b6b";
    }
});

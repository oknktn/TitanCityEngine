export class UIManager {
    constructor(game) {
        this.game = game;
        this.buttons = document.querySelectorAll('.tool-btn');
        
        this.initEvents();
    }

    initEvents() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                this.setTool(tool);
            });
        });
    }

    setTool(toolId) {
        // 1. Oyunun aktif aletini değiştir
        this.game.activeTool = toolId;
        
        // 2. Görsel olarak butonları güncelle (Active class ekle/çıkar)
        this.buttons.forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.tool === toolId) {
                btn.classList.add('active');
            }
        });

        console.log(`Seçili Alet: ${toolId}`);
    }
}

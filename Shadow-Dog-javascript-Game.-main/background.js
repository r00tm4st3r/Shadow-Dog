// Klasse die één enkele achtergrondlaag voorstelt
class Layer {
    // De constructor maakt een nieuwe Layer aan met opgegeven eigenschappen
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = 0;
    }

    // Methode die de positie van de laag bijwerkt (aangeroepen per frame)
    update() {
        // Als de hele laag buiten beeld is (links van het scherm)
        if (this.x < -this.width) {
            this.x = 0;                    // Start opnieuw aan de rechterkant (oneindige loop)
        } else {
            // Anders beweegt de laag naar links
            // De snelheid hangt af van de spelsnelheid en de speedModifier
            this.x -= this.game.speed * this.speedModifier;
        }
    }

    // Methode om de laag op het canvas te tekenen
    draw(context) {
        // Tekent de afbeelding op de huidige positie
        context.drawImage(this.image, this.x, this.y, this.width, this.height);

        // Tekent dezelfde afbeelding direct ernaast (rechts)
        // Dit zorgt voor een naadloos doorlopende achtergrond
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

// Exporteerbare klasse voor de hele achtergrond (bestaat uit meerdere lagen)
export class Background {
    constructor(game) {
        this.game = game;
        this.width = 1667;
        this.height = 500;

        // Identificeer de verschillende afbeeldingslagen (vooraf geïmporteerd)
        this.layer1image = layer1;
        this.layer2image = layer2;
        this.layer3image = layer3;
        this.layer4image = layer4;
        this.layer5image = layer5;

        // Maak 5 Layer-objecten met elk hun eigen snelheid (voor parallax-effect)
        this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer1image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.4, this.layer3image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4image);
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5image);

        // Alle lagen in een array bewaren, zodat ze makkelijk samen kunnen worden geüpdatet en getekend
        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
    }

    // Update alle lagen (wordt aangeroepen in de game-loop)
    update() {
        this.backgroundLayers.forEach(layer => {
            layer.update(); // Roep de update-methode aan van elke laag
        });
    }

    // Teken alle lagen (in volgorde) op het canvas
    draw(context) {
        this.backgroundLayers.forEach(layer => {
            layer.draw(context); // Teken elke laag
        });
    }
}

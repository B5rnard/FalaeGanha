// ============================================================================
// SENTENCE DATA - Centralized sentence database
// ============================================================================
// Each sentence is an object with structured metadata for easy filtering,
// categorization, and scaling to 50+ sentences.
// ============================================================================

const SENTENCE_DATA = [
    {
        id: "boy-eating-pizza",
        text: "O menino está comendo pizza",
        imageUrl: "images/boy-eating-pizza.png",
        category: "food-actions",
        difficulty: "easy",
        wordCount: 5,
        enabled: true
    },
    {
        id: "girl-drinking-juice",
        text: "A menina está bebendo suco",
        imageUrl: "images/girl-drinking-juice.jpeg",
        category: "food-actions",
        difficulty: "easy",
        wordCount: 5,
        enabled: true
    },
    {
        id: "dog-running-park",
        text: "O cachorro está correndo no parque",
        imageUrl: "images/dog-running-park.jpeg",
        category: "activities",
        difficulty: "easy",
        wordCount: 6,
        enabled: true
    },
    {
        id: "book-on-table",
        text: "O livro está em cima da mesa",
        imageUrl: "images/book-on-table.jpeg",
        category: "object-locations",
        difficulty: "medium",
        wordCount: 7,
        enabled: true
    },
    {
        id: "cat-on-sofa",
        text: "O gato está no sofá",
        imageUrl: "images/cat-on-sofa.jpeg",
        category: "object-locations",
        difficulty: "easy",
        wordCount: 5,
        enabled: true
    },
    {
        id: "backpack-on-chair",
        text: "A mochila está na cadeira",
        imageUrl: "images/backpack-on-chair.jpeg",
        category: "object-locations",
        difficulty: "medium",
        wordCount: 5,
        enabled: true
    },
    {
        id: "boy-drinking-milk",
        text: "O menino está bebendo leite",
        imageUrl: "images/boy-drinking-milk.jpeg",
        category: "food-actions",
        difficulty: "easy",
        wordCount: 5,
        enabled: true
    },
    {
        id: "boy-eating-burger",
        text: "O menino está comendo hambúrguer",
        imageUrl: "images/boy-eating-burger.jpeg",
        category: "food-actions",
        difficulty: "easy",
        wordCount: 5,
        enabled: true
    },
    {
        id: "boy-reading-book",
        text: "O menino está lendo um livro",
        imageUrl: "images/boy-reading-book.jpeg",
        category: "activities",
        difficulty: "easy",
        wordCount: 6,
        enabled: true
    },
    {
        id: "girl-drawing-picture",
        text: "A menina está desenhando",
        imageUrl: "images/girl-drawing-picture.jpeg",
        category: "activities",
        difficulty: "easy",
        wordCount: 4,
        enabled: true
    },
    {
        id: "girl-eating-apple",
        text: "A menina está comendo maçã",
        imageUrl: "images/girl-eating-apple.jpeg",
        category: "food-actions",
        difficulty: "easy",
        wordCount: 5,
        enabled: true
    },
    {
        id: "girl-playing-volley",
        text: "A menina está jogando vôlei",
        imageUrl: "images/girl-playing-volley.jpeg",
        category: "activities",
        difficulty: "medium",
        wordCount: 5,
        enabled: true
    },
    {
        id: "phone-is-recharging",
        text: "O celular está carregando",
        imageUrl: "images/phone-is-recharging.jpeg",
        category: "object-locations",
        difficulty: "medium",
        wordCount: 4,
        enabled: true
    }
];

// Description field is auto-generated based on category
const CATEGORY_DESCRIPTIONS = {
    "food-actions": "O que está acontecendo?",
    "object-locations": "Onde está o objeto?",
    "activities": "O que está acontecendo?",
    "daily-routines": "O que está acontecendo?"
};

// Add description to each sentence based on its category
SENTENCE_DATA.forEach(sentence => {
    sentence.description = CATEGORY_DESCRIPTIONS[sentence.category] || "O que está acontecendo?";
});

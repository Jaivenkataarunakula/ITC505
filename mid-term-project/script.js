const storyParts = {
    start: {
        text: "You find yourself at the edge of an enchanted forest. Do you go north, south, east, or west?",
        choices: [
            { text: "Go north", consequence: "north" },
            { text: "Go south", consequence: "south" },
            { text: "Go east", consequence: "east" },
            { text: "Go west", consequence: "west" }
        ],
        image: "forest_start.jpg",
        backgroundSize: "contain"
    },
    north: {
        text: "You encounter a majestic unicorn. What do you do?",
        choices: [
            { text: "Follow the unicorn", consequence: "unicorn" },
            { text: "Ignore the unicorn", consequence: "ignoreUnicorn" }
        ],
        image: "unicorn.jpg",
        backgroundSize: "contain"
    },
    east: {
        text: "You see a big cave. What do you do?",
        choices: [
            { text: "Enter the cave", consequence: "newEnding1" },
            { text: "Ignore the cave", consequence: "ignoreCave" }
        ],
        image: "cave.jpg",
        backgroundSize: "contain"
    },
    west: {
        text: "You discover a hidden grove with ancient ruins. What do you do?",
        choices: [
            { text: "Explore the ruins", consequence: "exploreRuins" },
            { text: "Rest in the grove", consequence: "restInGrove" }
        ],
        image: "grove.jpg",
        backgroundSize: "contain"
    },
    south: {
        text: "You find an ancient tree. What do you do?",
        choices: [
            { text: "Climb the tree", consequence: "tree" },
            { text: "Walk around", consequence: "walkAround" }
        ],
        image: "tree.jpg",
        backgroundSize: "contain"
    },
    unicorn: {
        text: "The unicorn leads you to a magical waterfall. You have found a hidden paradise. The end.",
        choices: [],
        image: "waterfalls.jpg",
        backgroundSize: "contain"
    },
    ignoreUnicorn: {
        text: "You encounter a mischievous fairy who leads you astray. You are lost in the forest. The end.",
        choices: [],
        image: "fairy.jpg",
        backgroundSize: "contain"
    },
    ignoreCave: {
        text: "You walk into the civilized world and thrive in life. The end.",
        choices: [],
        image: "civilized.jpg",
        backgroundSize: "contain"
    },
    tree: {
        text: "You climb the tree and discover a hidden nest with a golden egg. You have found a treasure. The end.",
        choices: [],
        image: "goldenegg.jpg",
        backgroundSize: "contain"
    },
    walkAround: {
        text: "You meet a wise old owl who gives you valuable advice. You feel enlightened. The end.",
        choices: [],
        image: "owl1.jpg",
        backgroundSize: "contain"
    },
    exploreRuins: {
        text: "Inside the ruins, you find a magical artifact that grants you eternal wisdom. The end.",
        choices: [],
        image: "artifact.jpg",
        backgroundSize: "contain"
    },
    restInGrove: {
        text: "While resting, you are visited by friendly woodland creatures who share their secrets with you. The end.",
        choices: [],
        image: "woodland.jpg",
        backgroundSize: "contain"
    },
    newEnding1: {
        text: "You got lost in the cave and died. The end.",
        choices: [],
        image: "cave.jpg",
        backgroundSize: ""
    },
};

let currentPart = 'start';

function startGame() {
    updatePage(currentPart);

    // Hide header after 1 second
    setTimeout(function() {
        document.querySelector('header').style.display = 'none';
    }, 1000);
}

function updatePage(part) {
    const storyPart = storyParts[part];
    document.getElementById('story').textContent = storyPart.text;
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    storyPart.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.addEventListener('click', () => {
            currentPart = choice.consequence;
            // Hide addendum on choice click
            document.getElementById('addendum').style.display = 'none';
            updatePage(currentPart);
        });
        choicesDiv.appendChild(button);
    });
    const imageDiv = document.getElementById('image');
    imageDiv.style.backgroundImage = `url('${storyPart.image}')`;

    // Show or hide restart button based on whether choices are empty
    const restartButton = document.getElementById('restartButton');
    if (storyPart.choices.length === 0) {
        restartButton.style.display = 'block';
    } else {
        restartButton.style.display = 'none';
    }
}

function restartGame() {
    currentPart = 'start';
    document.getElementById('addendum').style.display = 'block'; // Ensure addendum is visible on restart
    updatePage(currentPart);
}

document.addEventListener('DOMContentLoaded', startGame);

let answers_no = { english: [] };
let answers_yes = { english: "Yes 💖" };
let confirmationMessages = [];
let loveEmojis = [];
let sadEmojis = [];
let happyEmojis = [];
let bannerImages = {
    no: "public/images/no.gif",
    yes: "public/images/yes.gif"
};

let language = "english"; // Default language is English
const no_button = document.getElementById('no-button');
const yes_button = document.getElementById('yes-button');
let i = 1;
let size = 50;
let clicks = 0;
let confirmationIndex = 0;

const emojiContainer = document.getElementById('emoji-container');
let emojiInterval;

/* 🔧 Replace {name} everywhere */
function applyName(value, name) {
    if (typeof value === "string") {
        return value.replace(/{name}/g, name);
    }
    if (Array.isArray(value)) {
        return value.map(v => applyName(v, name));
    }
    if (typeof value === "object" && value !== null) {
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, applyName(v, name)])
        );
    }
    return value;
}

// Fetch strings from JSON file
fetch('./public/text/strings.json')
    .then(response => response.json())
    .then(rawData => {

        // 👑 Single source of truth
        const NAME = rawData.name || "";

        // Apply {name} replacements
        const data = applyName(rawData, NAME);

        document.title = data.title;
        document.getElementById('question-heading').innerText = data.question_heading;
        no_button.innerText = data.no_button;
        yes_button.innerText = data.yes_button;
        document.getElementById('success-message').innerText = data.success_message;

        const creator = document.querySelector('.creator');
        creator.innerText = data.creator_text;
        creator.href = data.creator_link;

        answers_no.english = data.answers_no;
        answers_yes.english = data.yes_button;
        confirmationMessages = data.confirmation_messages;

        loveEmojis = data.emojis.love;
        sadEmojis = data.emojis.sad;
        happyEmojis = data.emojis.happy;

        if (data.images) {
            if (data.images.banner_no?.length) {
                bannerImages.no =
                    data.images.banner_no[Math.floor(Math.random() * data.images.banner_no.length)];
            }
            if (data.images.banner_yes?.length) {
                bannerImages.yes =
                    data.images.banner_yes[Math.floor(Math.random() * data.images.banner_yes.length)];
            }
            if (data.images.banner_mid?.length) {
                document.getElementById('banner').src =
                    data.images.banner_mid[Math.floor(Math.random() * data.images.banner_mid.length)];
            }
        }

        // Preload images
        [bannerImages.no, bannerImages.yes].forEach(src => {
            const img = new Image();
            img.src = src;
        });

        startFloatingEmojis(loveEmojis);
    })
    .catch(error => console.error('Error loading strings:', error));

function startFloatingEmojis(emojis) {
    clearInterval(emojiInterval);
    emojiContainer.innerHTML = '';

    emojiInterval = setInterval(() => {
        const emoji = document.createElement('div');
        emoji.classList.add('floating-emoji');
        emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];

        emoji.style.left = Math.random() * 100 + 'vw';
        emoji.style.animationDuration = Math.random() * 3 + 2 + 's';
        emoji.style.fontSize = Math.random() * 20 + 20 + 'px';

        emojiContainer.appendChild(emoji);

        setTimeout(() => emoji.remove(), 5000);
    }, 100);
}

no_button.addEventListener('click', () => {
    const banner = document.getElementById('banner');

    if (clicks === 0) {
        banner.src = bannerImages.no;
        refreshBanner();
        startFloatingEmojis(sadEmojis);
    }
    clicks++;

    const sizes = [40, 50, 30, 35, 45];
    size += sizes[Math.floor(Math.random() * sizes.length)];

    yes_button.style.height = `${size}px`;
    yes_button.style.width = `${size}px`;
    yes_button.style.fontSize = `${size * 0.3}px`;
    yes_button.innerHTML = answers_yes[language];

    confirmationIndex = 0;

    const total = answers_no[language].length;

    if (i < total - 1) {
        no_button.innerHTML = answers_no[language][i++];
    } else {
        alert(answers_no[language][i]);
        i = 1;
        no_button.innerHTML = answers_no[language][0];

        yes_button.innerHTML = answers_yes[language];
        yes_button.style.height = "50px";
        yes_button.style.width = "50px";
        yes_button.style.fontSize = "1.2rem";

        size = 50;
        confirmationIndex = 0;
    }
});

yes_button.addEventListener('click', () => {
    if (confirmationIndex < confirmationMessages.length) {
        yes_button.innerHTML = confirmationMessages[confirmationIndex++];
        yes_button.style.width = 'auto';
        yes_button.style.minWidth = `${size}px`;
        yes_button.style.fontSize = `${Math.max(20, size * 0.12)}px`;
    } else {
        const banner = document.getElementById('banner');
        banner.src = bannerImages.yes;
        refreshBanner();
        startFloatingEmojis(happyEmojis);

        document.querySelector('.buttons').style.display = "none";
        document.querySelector('.message').style.display = "block";
    }
});

function refreshBanner() {
    const banner = document.getElementById('banner');
    const src = banner.src;
    banner.src = '';
    banner.src = src;
}

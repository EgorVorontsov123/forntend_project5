const page = document.querySelector('.page');

// Функции открытия и закрытия попапов
function openModal(popup) {
    popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}

// Функция для показа ошибки
const showInputError = (form, input) => {
    const errorElement = form.querySelector(`#${input.id}-error`);
    input.classList.add('popup__input_type_error');
    errorElement.textContent = input.validationMessage;
    errorElement.classList.add('popup__input-error_active');
};

// Функция для скрытия ошибки
const hideInputError = (form, input) => {
    const errorElement = form.querySelector(`#${input.id}-error`);
    input.classList.remove('popup__input_type_error');
    errorElement.textContent = '';
    errorElement.classList.remove('popup__input-error_active');
};

// Проверка конкретного поля
const checkInputValidity = (form, input) => {
    if (!input.validity.valid) {
        showInputError(form, input);
    } else {
        hideInputError(form, input);
    }
};

// Проверка всех полей формы
const validateForm = (form) => {
    const inputs = Array.from(form.querySelectorAll('.popup__input'));
    let isValid = true;

    inputs.forEach((input) => {
        if (!input.validity.valid) {
            isValid = false;
            showInputError(form, input);
        } else {
            hideInputError(form, input);
        }
    });

    return isValid;
};

// Включение слушателей на все поля формы
const setEventListeners = (form) => {
    const inputs = Array.from(form.querySelectorAll('.popup__input'));

    inputs.forEach((input) => {
        input.addEventListener('input', () => {
            checkInputValidity(form, input);
        });
    });
};

// Инициализация валидации для форм
const enableValidation = () => {
    const forms = Array.from(document.querySelectorAll('.popup__form'));
    forms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (validateForm(form)) {
                console.log('Форма успешно отправлена');
            }
        });
        setEventListeners(form);
    });
};

// Запуск валидации
enableValidation();

// Popap edit
const editPopup = page.querySelector('.popup_type_edit');
const editButton = page.querySelector('.profile__edit-button');
const editForm = document.forms['edit-profile'];
const profileName = page.querySelector('.profile__title');
const profileDescription = page.querySelector('.profile__description');
const closeEditButton = editPopup.querySelector('.popup__close');

// Загружаем данные из Local Storage при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadProfileFromLocalStorage();
    loadCardsFromLocalStorage();
});

function loadProfileFromLocalStorage() {
    const savedName = localStorage.getItem('profileName');
    const savedDescription = localStorage.getItem('profileDescription');

    if (savedName) {
        profileName.textContent = savedName;
    }
    if (savedDescription) {
        profileDescription.textContent = savedDescription;
    }
}

// Обработчики открытия и закрытия карточки edit
editButton.addEventListener('click', () => {
    editForm.elements['name'].value = profileName.textContent;
    editForm.elements['description'].value = profileDescription.textContent;
    openModal(editPopup);
});

closeEditButton.addEventListener('click', () => {
    closeModal(editPopup);
});

// Обработчик отправки формы редактирования
editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (validateForm(editForm)) {
        const nameInput = editForm.elements['name'].value;
        const descriptionInput = editForm.elements['description'].value;

        profileName.textContent = nameInput;
        profileDescription.textContent = descriptionInput;

        // Сохранение данных в Local Storage
        localStorage.setItem('profileName', nameInput);
        localStorage.setItem('profileDescription', descriptionInput);

        closeModal(editPopup);
    }
});

// Toggle состояния кнопки
const toggleButtonState = (form, button) => {
    if (form.checkValidity()) {
        button.classList.remove('popup__button_disabled');
        button.disabled = false;
    } else {
        button.classList.add('popup__button_disabled');
        button.disabled = true;
    }
};

// Popap new-card
const newCardPopup = page.querySelector('.popup_type_new-card');
const newCardButton = page.querySelector('.profile__add-button');
const closeNewCardButton = newCardPopup.querySelector('.popup__close');
const newCardForm = newCardPopup.querySelector('.popup__form');

// Обработчики открытия и закрытия карточки new-card
newCardButton.addEventListener('click', () => {
    openModal(newCardPopup);
});

closeNewCardButton.addEventListener('click', () => {
    closeModal(newCardPopup);
});

// Popap card
const imagePopup = page.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const closeImageButton = imagePopup.querySelector('.popup__close');
const newCardFormSubmitButton = newCardForm.querySelector('.popup__button');

// Функция открытия попапа с изображением
function openImagePopup(imageSrc, imageAlt) {
    popupImage.src = imageSrc;
    popupImage.alt = imageAlt;
    popupCaption.textContent = imageAlt;
    openModal(imagePopup);
}

// Закрытие попапа с изображением
closeImageButton.addEventListener('click', () => closeModal(imagePopup));
imagePopup.addEventListener('click', (event) => {
    if (event.target === imagePopup) {
        closeModal(imagePopup);
    }
});

// Шаблон карточки и список
const placesList = page.querySelector('.places__list');
const cardTemplate = page.querySelector('#card-template').content;

// Функция для создания новой карточки
function createCard(name, link) {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    // Заполняем данные карточки
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    cardImage.src = link;
    cardImage.alt = name;
    cardTitle.textContent = name;

    // Обработчики на элементы карточки
    cardElement.querySelector('.card__delete-button').addEventListener('click', () => {
        cardElement.remove(); // Удаление карточки
        removeCardFromLocalStorage(name, link); // Удаляем карточку из Local Storage
    });

    cardElement.querySelector('.card__like-button').addEventListener('click', (event) => {
        event.target.classList.toggle('card__like-button_is-active'); // Лайк
    });

    cardImage.addEventListener('click', () => openImagePopup(link, name)); // Открытие попапа с изображением

    return cardElement;
}

// Функция добавления карточки в список
function addCard(name, link) {
    const newCard = createCard(name, link);
    placesList.prepend(newCard);
    saveCardToLocalStorage(name, link); // Сохраняем карточку в Local Storage
}

// Функция сохранения карточки в Local Storage
function saveCardToLocalStorage(name, link) {
    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.push({ name, link });
    localStorage.setItem('cards', JSON.stringify(cards));
}

// Функция загрузки карточек из Local Storage
function loadCardsFromLocalStorage() {
    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.forEach(card => {
        addCard(card.name, card.link);
    });
}

// Удаление карточки из Local Storage
function removeCardFromLocalStorage(name, link) {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards = cards.filter(card => !(card.name === name && card.link === link));
    localStorage.setItem('cards', JSON.stringify(cards));
}

// Обработчик отправки новой карточки
newCardForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (validateForm(newCardForm)) {
        const placeName = newCardForm.elements['place-name'].value;
        const placeLink = newCardForm.elements['link'].value;
        addCard(placeName, placeLink);
        closeModal(newCardPopup);
        newCardForm.reset();
    }
});

// Для newCardForm
newCardForm.addEventListener('input', () => {
    toggleButtonState(newCardForm, newCardFormSubmitButton);
});

newCardButton.addEventListener('click', () => {
    newCardForm.reset(); // Очистите поля, если нужно
    toggleButtonState(newCardForm, newCardFormSubmitButton);
});

// Добавление слушателя на клавишу Esc
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { // Проверка, что нажата клавиша Escape
        if (editPopup) {
            closeModal(editPopup);
        }
        if (newCardPopup) {
            closeModal(newCardPopup);
        }
        if (imagePopup) {
            closeModal(imagePopup);
        }
    }
});

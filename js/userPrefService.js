'use strict';

function onInit() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    document.querySelector('.prefs').addEventListener(
        'submit',
        function (event) {
            event.preventDefault();
            event.stopPropagation();
            saveForm();
        },
        false
    );
}

function onChangeRng(rng) {
    document.querySelector('.rng').innerText = rng;
}

function saveForm() {
    var userPrefs = {
        name: document.querySelector('#name').value,
        theme: document.querySelector('#theme').value,
        dob: document.querySelector('#dob').value,
        email: document.querySelector('#email').value,
        range: document.querySelector('#range').value,
    };
    saveToStorage('userPrefs', userPrefs);
    document.querySelector('.hidden').classList.toggle('hidden');
    document.querySelector('.hidden').classList.toggle('shown');
}

// User

class User {
    #data = {};

    constructor(obj) {
        //if (!obj.name && !obj.phone) return;
        this.#data = obj;
    }

    edit(obj) {
        if (Array.isArray(obj) || typeof obj != 'object') return 'Введены неверные данные';

        this.#data = { ...this.#data, ...obj };
    }

    get() {
        return this.#data;

    }
}


// Contacts
class Contacts {
    #data = [];
    #lastId = 0;

    saveStorage() {
        window.localStorage.setItem('this.#data', JSON.stringify(this.#data));
    }

    loadStorage() {
        let localContactsData = localStorage.getItem('this.#data');
        if (!localContactsData || localContactsData == []) {
            this.getData();
        }
        this.#data = JSON.parse(localContactsData);

        // if (document.cookie.length > 0) {
        //     let localContactsData = localStorage.getItem('this.#data');
        //     if (localContactsData !== null) {
        //         this.#data = JSON.parse(localContactsData);

        //     }
        // } else {
        //     window.localStorage.clear();

        // }

    }

    saveCookies() {
        document.cookie = 'storageExpiration=update; max-age=864000';
        
    }

    add(contactUser) {
        this.#lastId++;

        contactUser = { ...contactUser, ...{ id: this.#lastId } }

        const newContactuser = new User(contactUser)

        if (!newContactuser.get()) return;

        this.#data.push(newContactuser.get());

        this.saveStorage();

    }

    async getData() {

        let url = 'https://jsonplaceholder.typicode.com/users';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(elem => {
                    let contactDataAPI = {};
                    contactDataAPI.name = elem.name;
                    contactDataAPI.email = elem.email;
                    contactDataAPI.address = elem.address;
                    contactDataAPI.phone = elem.phone;
                    this.add(contactDataAPI)
                });
            })
    }

    edit(id = 0, obj = {}) {
        let contact = this.get();

        console.log(contact)

        if (!contact) return;

        contact.edit(obj);
    }

    get(showData = false) {
        if (showData) {
            let dataTmp = this.#data.map(elem => {
                return elem;
            });

            if (dataTmp && dataTmp.length > 0) {
                return dataTmp;
            }
        }

        return this.#data;
    }

    remove(id = 0) {
        if (!id) return;

        let dataTmp = this.#data.filter(elem => {
            return elem.id != id;
        });

        this.#data = dataTmp;

        this.saveStorage();
        this.saveCookies();

    }

}

class ContactsApp extends Contacts {
    constructor() {
        super();
        this.loadStorage();
    }

    #app;

    update() {

        const data = this.get(true);

        this.appUl.innerHTML = '';

        data.forEach((item) => {
            const liDataElem = document.createElement('li');
            liDataElem.classList.add('contacts__data');

            const liElem = document.createElement('div');
            liElem.classList.add('contacts__item');

            const btnElem = document.createElement('div');
            btnElem.classList.add('contacts__btns');

            const nameElem = document.createElement('h2');
            nameElem.classList.add('list__name');

            const emailElem = document.createElement('div');
            emailElem.classList.add('list__email');


            const addressElem = document.createElement('div');
            addressElem.classList.add('list__address');

            const phoneElem = document.createElement('div');
            phoneElem.classList.add('list__phone');

            // const btnEditElem = document.createElement('button');
            // btnEditElem.classList.add('list__btn-edit');
            // btnEditElem.innerHTML = 'Edit';

            const btnDelElem = document.createElement('button');
            btnDelElem.classList.add('list__btn-del');
            btnDelElem.innerHTML = 'Delete';

            if (item.name && item.name.length > 0) {
                nameElem.innerHTML = 'Name: ' + item.name;
                liElem.append(nameElem);
            }

            if (item.email && item.email.length > 0) {
                emailElem.innerHTML = 'Email: ' + item.email;
                liElem.append(emailElem);
            }

            if (item.address && item.address.length > 0) {
                addressElem.innerHTML = 'Address: ' + item.address;
                liElem.append(addressElem);
            }

            if (item.phone && item.phone.length > 0) {
                phoneElem.innerHTML = 'Phone: ' + item.phone;
                liElem.append(phoneElem);
            }

            if (liElem) {
                liDataElem.append(liElem);
            }

            btnElem.append(btnDelElem);
            liDataElem.append(btnElem);

            this.appUl.append(liDataElem);

            // btnEditElem.addEventListener('click', () => {
            //     this.onEdit(item.id);
            // })
            btnDelElem.addEventListener('click', () => {
                this.onDel(item.id);
            })

        })

    }

    onDel(id) {
        this.remove(id);
        this.update();
    }

    create(idElem) {

        if (!idElem) return;

        const appElem = document.querySelector(`#${idElem}`);

        if (!appElem) return;

        this.#app = document.createElement('div')
        this.#app.classList.add('contacts');

        this.appForm = document.createElement('form');
        this.appForm.classList.add('contacts__form');

        this.inputName = document.createElement('input');
        this.inputName.classList.add('contacts__name');
        this.inputName.placeholder = 'Name';

        this.inputEmail = document.createElement('input');
        this.inputEmail.setAttribute('type', 'email');
        this.inputEmail.classList.add('contacts__email');
        this.inputEmail.placeholder = 'Email';

        this.inputAddress = document.createElement('input');
        this.inputAddress.classList.add('contacts__address');
        this.inputAddress.placeholder = 'Address';

        this.inputPhone = document.createElement('input');
        this.inputPhone.setAttribute('type', 'tel');
        this.inputPhone.classList.add('contacts__phone');
        this.inputPhone.placeholder = 'Phone';

        this.formButton = document.createElement('button');
        this.formButton.classList.add('contacts__button');
        this.formButton.innerHTML = 'Add contact'

        this.appUl = document.createElement('ul');
        this.appUl.classList.add('contacts__list', 'list');

        this.#app.append(this.appForm, this.formButton, this.appUl);
        this.appForm.append(this.inputName, this.inputEmail, this.inputAddress, this.inputPhone);
        appElem.append(this.#app);

        this.formButton.addEventListener('click', this.onAdd = () => {

            let contactData = {};

            if (this.inputName.value.length == 0) {
                return alert('Введите имя');
            } else {
                contactData.name = this.inputName.value;
            }

            if (this.inputEmail.value.length > 0) {
                contactData.email = this.inputEmail.value;
            }

            if (this.inputAddress.value.length > 0) {
                contactData.address = this.inputAddress.value;
            }
            if (this.inputPhone.value.length > 0) {
                contactData.phone = this.inputPhone.value;
            }

            this.inputName.value = '';
            this.inputEmail.value = '';
            this.inputAddress.value = '';
            this.inputPhone.value = '';

            this.add(contactData);

            this.update();

        })

    };

}


let gg = new ContactsApp();
gg.create('app');
gg.update();




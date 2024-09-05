import { msgError } from './util.js';
import { Loader } from './class.js';
class Form {
    constructor(form, formCompletedCallback=false, tabChangeCallback=false) {
        this.form = form;
        this.tabChangeCallback = tabChangeCallback;
        this.formCompleteCallback = formCompletedCallback;
        this.action = form.action;
        this.status = form.querySelector(".status");
        this.tabList = [];
        this.values = {}
        this.currentTab = 0;
        this.previousTab;
        this.controller = form.querySelector('.controller');
        this.next = form.querySelector('button[name="next"]');
        this.previous = form.querySelector('button[name="prev"]');
        this.loader = new Loader(this.next, 3);
        this.stepContainer = form.querySelector('.steps');

        this.init();
    }
    init() {
        let tabListNode = this.form.querySelectorAll(".tab");
        let dot = '<span class="dot" >.</span>';
        this.next.setAttribute('data-text', this.next.innerHTML);
        tabListNode.forEach( (tab, i) => {
            let step = false;
            let name = tab.getAttribute('data-name');
            tab.id = `id-${name.toLowerCase().replace(' ', '-')}`;

            if (this.stepContainer) {
                let width = `style="flex: 0 1 ${100 / tabListNode.length}%;"`;
                let step = tabListNode.length > 1 ? `<span class="number">${(i + 1)}</span>${dot}` : '';
                this.stepContainer.insertAdjacentHTML("beforeend", `
          <div ${width} class="step step-${i} flex-col disabled" data-step="${i}">
            ${step}
            <span class="title">${name.toUpperCase()}</span>
          </div>
        `);
                step = this.stepContainer.querySelector(`.step-${i}`);
            }

            this.tabList.push({
                valid: true,
                index: i,
                name: name,
                tab: tab,
                step: step,
                values: {}
            });
        });


        for (let i of this.controller.children) {
            i.style.width = `${100 / this.controller.children.length}%`;
        }

        this.form.querySelectorAll('.step').forEach((step, i) => {
            this.tabList[i].step = step;
            step.addEventListener('click', (event) => this.changeTab(event));
        });

        this.next.addEventListener('click', (event) => this.changeTab(event));
        if (this.previous) {
            this.previous.addEventListener('click', (event) => this.changeTab(event));
        }
        this.showNewTab(this.currentTab);
    }

    formAction() {
        const params = new URLSearchParams(this.values)
        location.href = new URL(`${this.action}?${params.toString()}`);
    }

    validateData() {
        let fieldList = this.tabList[this.currentTab].tab.querySelectorAll('.form-input, .form-control, .form-select');
        this.tabList[this.currentTab].valid = true;
        this.status.innerHTML = '';
        let msg = '';
        let issues = 0;
        fieldList.forEach(field => {
            if (field.type !== 'hidden') {
                if (field.validity.valid) {
                    field.classList.add('success');
                } else {
                    issues++;
                    field.classList.add('warning');
                    msg += `<div>${field.getAttribute('placeholder')}: ${field.validationMessage}</div>`;
                }
            }
        });

        if (issues > 0) {
            this.tabList[this.currentTab].valid = false;
            if (this.tabList[this.currentTab].step) {
                this.tabList[this.currentTab].step.classList.add('error');
            }
            this.status.innerHTML = msgError(msg);
            return false;
        } else this.tabList[this.currentTab].step.classList.remove('error');

        fieldList.forEach(field => {
            this.values[field.name] = field.value;
            this.tabList[this.currentTab].values[field.name] = field.value;
        });
    }

    showNewTab() {
        this.tabList[this.currentTab].tab.style.display = "flex";
        this.next.setAttribute("data-step", this.currentTab + 1);

        if (this.previous) {
            this.previous.disabled = (this.currentTab === 0);
            this.previous.setAttribute("data-step", this.currentTab - 1);
        }

        if (this.tabList[this.currentTab].step) {
            this.tabList[this.currentTab].step.classList.remove('disabled');
            this.tabList[this.currentTab].step.classList.add('active');
        }
    }

    clearPreviousTab() {
        if (this.tabList[this.previousTab]) {
            if (this.tabList[this.previousTab].step) {
                this.tabList[this.previousTab].step.classList.remove('error');
                this.tabList[this.previousTab].step.classList.remove('active');
                this.tabList[this.previousTab].step.classList.add('completed');
            }
            this.tabList[this.previousTab].tab.style.display = 'none';
        }
    }

    async changeTab(event) {
        this.loader.on()
        let nextStep = parseInt(event.target.getAttribute('data-step'));
        if (this.currentTab < nextStep) this.validateData();

        if (!this.tabList[this.currentTab].valid) {
            this.loader.off();
            return false;
        }

        if (nextStep >= this.tabList.length) {

            if (this.formCompleteCallback) {
                await this.formCompleteCallback(this, this.values);
            } else {
                this.formAction();
            }

            this.loader.off();
            return false;
        }

        if (this.tabChangeCallback) {
            await this.tabChangeCallback(this, this.tabList[this.currentTab].values);
        }

        this.previousTab = this.currentTab;
        this.currentTab = nextStep;
        this.clearPreviousTab();
        this.showNewTab();
        this.loader.off();
        if (this.tabList.length > 1) {
            let last = this.tabList.length - 1;
            let next = this.next;
            next.innerHTML = this.currentTab === last ? 'Копировать' : next.getAttribute('data-text');
        }
    }
}

export { Form }

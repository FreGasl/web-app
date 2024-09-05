const rules = {
    "CRM": ["Оператор", "Менеджер", "Контролёр"],
    "МУК": ["Оператор", "Менеджер", "Контролёр"],
    "MED": ["Оператор ГЛ", "Оператор Поликлиники", "Менеджер ГЛ", "Регистратор", "Доктор", "Администратор"],
    "VM": ["Оператор", "Менеджер", "Контролёр"],
    "LHU": ["Суперадмин", "Администратор", "Оператор"]
};

window.addEventListener('DOMContentLoaded', () => {

    let ctrlDown = false;

    // Добавление "Шаги воспроизведения №2"
    document.querySelector('.add_stepstiket').addEventListener("click", function () {
        document.querySelector('label[hidden]').removeAttribute("hidden");
        document.querySelector('textarea[hidden]').removeAttribute("hidden");
        this.remove();
    });

    // Настройка textarea
    document.querySelectorAll('textarea').forEach(el => {
        el.addEventListener("input", () => {
            el.style.height = "5px";
            el.style.height = (el.scrollHeight)+"px";
        });
    });

    autoList();

    document.addEventListener('keydown', function (e) {
        if (e.key === "Control") ctrlDown = true;
    });
    document.addEventListener('keyup', function (e) {
        if (e.key === "Control") ctrlDown = false;
    });

    document.querySelectorAll('.dependent').forEach((el) => {
        if (!rules["CRM"].includes(el.value)) {
            el.classList.add('hidden');
        }
    });

    document.querySelectorAll('textarea').forEach(el =>
        el.addEventListener('keyup', async function (e) {
            if (ctrlDown && (e.key === 'n' || e.key === 'N' || e.key === 'Т' || e.key === 'т')) {
                this.value += '``````';
                const end = this.value.length;
                this.setSelectionRange(end - 3, end - 3);
            }
            if (ctrlDown && (e.key === 'b' || e.key === 'B' || e.key === 'и' || e.key === 'И')) {
                this.value += '****';
                const end = this.value.length;
                this.setSelectionRange(end - 2, end - 2);
            }
            if (ctrlDown && (e.key === 'i' || e.key === 'I' || e.key === 'ш' || e.key === 'Ш')) {
                this.value += '**';
                const end = this.value.length;
                this.setSelectionRange(end - 1, end - 1);
            }
        })
    );

    const mutationStep = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (![...mutation.target['classList']].includes('active')) {
                document.querySelector('[name="save"]').classList.add('hidden');
                document.querySelector('[name="run-tests"]').style.width = '100%';
            } else {
                document.querySelector('[name="save"]').classList.remove('hidden');
                document.querySelector('[name="run-tests"]').style.width = '50%'
            }
        });
    });
    mutationStep.observe(document.querySelector('.step-0'), {
        attributes: true,
        attributeOldValue: true,
    });

    document.querySelectorAll('[name="app"]').forEach(el => {
        el.onchange = function() {
            let changes = false;

            document.querySelectorAll('.dependent').forEach((el) => {
                const isVisible = ![...el.classList].includes('hidden');
                const isDepending = rules[this.value].includes(el.value);
                if (isDepending && !isVisible) {
                    changes = true;
                    el.classList.remove('hidden');
                } else if (!isDepending && isVisible) {
                    el.classList.add('hidden');
                }
            })

            if (changes) document.querySelectorAll('[name="role"]').forEach(el => el.value = 'Любая');
        }
    })

    window.onresize = function() {
        if (window.innerWidth > 600) {
            document.getElementById('fastOpen').classList.remove('hidden');
        } else {
            document.getElementById('fastOpen').classList.add('hidden');
        }
    };

    if (window.innerWidth < 600) {
        document.getElementById('fastOpen').classList.add('hidden');
    }

    document.querySelectorAll('.select-form').forEach((el, idx) => {
        el.addEventListener('click', () => {
            const elementClass = el.getAttribute('class');
            if (elementClass.includes('non-select')) {
                const forms = document.querySelectorAll('.step-form');
                el.classList.remove('non-select');
                if (idx === 1) {
                    document.querySelectorAll('.select-form')[0].classList.add('non-select');
                    document.querySelectorAll('.step-form')[0].classList.add('hidden');
                    forms[0].classList.add('hidden');
                    forms[1].classList.remove('hidden');
                } else {
                    document.querySelectorAll('.select-form')[1].classList.add('non-select');
                    document.querySelectorAll('.step-form')[1].classList.add('hidden');
                    forms[1].classList.add('hidden');
                    forms[0].classList.remove('hidden');
                }
            }
        });
    });

    function autoList() {
        document.querySelectorAll('[placeholder="Шаги воспроизведения"], [placeholder="Шаги воспроизведения №2"]').forEach(el => {
            el.addEventListener("keydown", function (e) {
                if (e.keyCode === 8) {
                    if (this.value.match(/\n$/)) this.value = this.value.replace(/\n$/, ' ');
                } else if (e.keyCode === 13) {
                    if (ctrlDown)
                        this.value += `\n`;
                    else {
                        const steps = this.value.match(/^\d+\..*$/gm)?.length;
                        e.preventDefault();
                        this.value = this.value + `\n${(steps) ? steps + 1 : 1}. `;
                    }
                    this.style.height = "5px";
                    this.style.height = (this.scrollHeight) + "px";
                    return false;
                } else {
                    return true;
                }
            })
        })
    }

})
